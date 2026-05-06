---
title: "Implementing the OpenAPI Delegate Pattern in Spring Boot 4"
subtitle: "The wiring, validation, and exception flow that take a contract-first service from generated interface to running endpoint on Spring Boot 4.0 GA"
excerpt: "After OpenAPI Generator 7.22 has produced your Spring controllers against Spring Boot 4.0.4, the gap between generated code and a running service is delegate wiring, validation, and exception mapping - the parts the generator deliberately leaves for you to write."
date: 2026-05-06
author: "Abu Dhahir"
series: "OpenAPI Generators for Spring Boot 4"
tags:
- Tutorial
- Java
- Spring
- OpenAPI
- CodeGen
draft: false
---

OpenAPI Generator produces about 80% of a Spring service. The remaining 20% - wiring delegates as Spring beans, mapping exceptions to the error envelope the spec promised, validating requests beyond `@Valid`, and consuming the same generated artefacts on the client side - is where teams spend most of their time and make most of their mistakes.

The symptoms are familiar to anyone who has shipped a contract-first service. A `NullPointerException` surfaces because the generated controller's autowired delegate was never registered as a bean. Validation errors reach the client as a Spring default 400 instead of the `Error` schema the OpenAPI document advertises. Generated method signatures carry `throws Exception` because `unhandledException = true` was set, and nothing in the codebase actually handles them. Integration tests pass against the generated stubs and then fall over in production when a downstream service returns a 502.

This post walks the **delegate implementation pattern** end-to-end, calibrated for **OpenAPI Generator 7.22** against **Spring Boot 4.0.4** (Java 17 baseline, Java 25 recommended, Jakarta EE 11, Jackson 3). It picks up where Parts 1 and 2 of this series left off - those covered *what the generator does* and *how to scale generation across multiple specs*. This part covers what you do with the output once it lands in `target/generated-sources/`.

---

## The Versions That Matter as of May 2026

Pin these in your `pom.xml` or `build.gradle.kts`. Drift on any of them changes generator behaviour materially.

| Component | Version | Notes |
| --- | --- | --- |
| Spring Boot | `4.0.4` | GA 2025-11-20; latest patch 2026-03-19 fixes CVE-2026-22731 and CVE-2026-22733 in Actuator |
| Spring Framework | `7.0.5` | JDK 17 baseline, JDK 25 recommended, Jakarta EE 11, Jackson 3, JUnit 6 |
| OpenAPI Generator | `7.22.0` | `useSpringBoot4` and `useJackson3` flags shipped in v7.20.0 (Feb 2026); v7.22.0 fixed the `openApiNullable` + `useJackson3` incompatibility |
| Java | `17` minimum, `21` or `25` recommended | Records and pattern matching available; Spring Boot 4 itself still ships with a JDK 17 baseline |

> **Why version pinning matters here:** v7.21.0 flipped the default from "no Spring Boot 3 specifics" to `useSpringBoot3=true` as a breaking change. Teams that upgraded the generator without pinning the flag explicitly saw their Jakarta package paths shift overnight. Pin `useSpringBoot4: true` (or `useSpringBoot3: false` if you are on an older Boot) rather than relying on whatever default ships next.

---

## What the Generator Leaves to You

Even with `delegatePattern: true`, `interfaceOnly: true`, `useBeanValidation: true`, and `unhandledException: true` set, the generator deliberately stops short of four things. Treat each as a slot you must fill before the service is shippable.

| Slot | Generator output | Your work |
| --- | --- | --- |
| **Delegate implementation** | `PetsApiDelegate` interface with no-op default methods returning `501 Not Implemented` | A `@Service` bean that implements every operation |
| **Exception mapping** | Operation signatures with `throws Exception` | A `@RestControllerAdvice` translating thrown exceptions to the spec's `Error` schema |
| **Validation customisation** | Bean Validation annotations (`@Valid`, `@NotNull`, `@Size`) | An advice handler that converts `MethodArgumentNotValidException` into the `Error` schema with field-level detail |
| **Cross-cutting concerns** | None | Authentication, authorisation, observability, rate limiting - the generator stays out of these by design |

The first three are mechanical. The fourth is where the team's standards live.

---

## Anatomy of the Generated Delegate Interface

To wire delegates correctly, look at what the generator emits. The `apiDelegate.mustache` template in `OpenAPITools/openapi-generator` produces this shape (extracted from the upstream template at [JavaSpring/apiDelegate.mustache](https://github.com/OpenAPITools/openapi-generator/blob/master/modules/openapi-generator/src/main/resources/JavaSpring/apiDelegate.mustache)):

```java
/**
 * A delegate to be called by the {@link PetsApiController}.
 * Implement this interface with a {@link org.springframework.stereotype.Service} annotated class.
 */
public interface PetsApiDelegate {

    default Optional<NativeWebRequest> getRequest() {
        return Optional.empty();   // HIGH SIGNAL: lets implementers reach the raw request
    }

    default ResponseEntity<Pet> getPetById(Long id) throws Exception {
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
    }

    default ResponseEntity<List<Pet>> listPets(Integer limit) throws Exception {
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
    }
}
```

Two structural choices matter. First, every method is a `default` returning `501 Not Implemented` - so an unimplemented endpoint fails *loudly* rather than silently. Second, `getRequest()` is exposed so the implementation can reach the `NativeWebRequest` without subclassing `HttpServlet` or accepting Spring-specific parameters in its method signatures.

The companion `apiController.mustache` autowires the delegate with `required = false` and falls back to an anonymous no-op:

```java
public PetsApiController(@Autowired(required = false) PetsApiDelegate delegate) {
    this.delegate = Optional.ofNullable(delegate).orElse(new PetsApiDelegate(){});
}
```

> **Why `required = false` matters:** the generated controller is registered by Spring whether or not you have written a delegate. Without the fallback, an unimplemented service would fail at startup with `NoSuchBeanDefinitionException`. With it, the controller boots, every endpoint returns `501`, and you discover the gap from the first request - which is the right failure mode for contract-first development.

---

## Wiring the Delegate as a Spring Bean

The Baeldung walkthrough on custom templates puts the design intent crisply:

> Since we're using a delegate pattern, we don't need to worry about MVC or OpenAPI-specific annotations, as those will be kept apart in the generated controller. - *Baeldung, [Spring Boot OpenAPI Generator with Custom Templates](https://www.baeldung.com/spring-boot-openapi-generator-custom-templates)*

The delegate is the place where your business logic meets the contract. It should not become the place where your business logic *lives*.

```java
// Bad - delegate doing too much
@Service
public class PetsApiDelegateImpl implements PetsApiDelegate {

    private final EntityManager em;
    private final Clock clock;
    private final MeterRegistry meterRegistry;

    @Override
    public ResponseEntity<Pet> getPetById(Long id) {
        var entity = em.createQuery(
            "select p from PetEntity p where p.id = :id and p.deletedAt is null",
            PetEntity.class).setParameter("id", id).getSingleResult();
        meterRegistry.counter("pets.fetch", "id", id.toString()).increment();
        var dto = new Pet(entity.getId(), entity.getName(), entity.getTag());
        return ResponseEntity.ok(dto);
    }
}
```

The delegate is reaching into JPA, querying with a string, and emitting a metric with an unbounded label cardinality. None of this belongs at the API boundary.

```java
// Good - delegate as a thin orchestrator
@Service
@RequiredArgsConstructor
public class PetsApiDelegateImpl implements PetsApiDelegate {

    private final PetService petService;
    private final PetMapper petMapper;   // MapStruct or hand-rolled - your choice

    @Override
    public ResponseEntity<Pet> getPetById(Long id) {
        return petService.findById(id)
            .map(petMapper::toApi)
            .map(ResponseEntity::ok)
            .orElseThrow(() -> new PetNotFoundException(id));   // mapped by advice
    }

    @Override
    public ResponseEntity<List<Pet>> listPets(Integer limit) {
        var page = petService.list(limit == null ? 20 : limit);
        return ResponseEntity.ok(petMapper.toApiList(page));
    }
}
```

The delegate's job is to translate between the API contract types (records like `Pet`, generated from the spec) and the domain types owned by `PetService`. Persistence, observability, and cross-cutting concerns live behind the service interface, not in the delegate.

---

## Validation: From `@Valid` to a Conformant Error Envelope

With `useBeanValidation: true`, the generated controller wires `@Valid` to every request body and `@NotNull`, `@Size`, `@Pattern` annotations to schema-derived constraints. Spring will reject malformed requests with `400 Bad Request` automatically - but it does so with Spring's default error format, which almost certainly does not match the `Error` schema in your OpenAPI document.

Suppose your spec defines:

```yaml
components:
  schemas:
    Error:
      type: object
      required: [code, message]
      properties:
        code:
          type: string
        message:
          type: string
        fieldErrors:
          type: array
          items:
            type: object
            properties:
              field: { type: string }
              issue: { type: string }
```

The `MethodArgumentNotValidException` thrown by `@Valid` needs to be translated into that envelope. A `@RestControllerAdvice` does exactly this:

```java
@RestControllerAdvice
@RequiredArgsConstructor
public class ApiExceptionAdvice {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<Error> onValidationFailure(MethodArgumentNotValidException ex) {
        var fieldErrors = ex.getBindingResult().getFieldErrors().stream()
            .map(fe -> new ErrorFieldErrorsInner(fe.getField(), fe.getDefaultMessage()))
            .toList();

        var body = new Error("VALIDATION_FAILED", "Request did not match the schema", fieldErrors);
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    ResponseEntity<Error> onPathViolation(ConstraintViolationException ex) {
        // Path / query parameter violations land here, not in MethodArgumentNotValidException
        var body = new Error("VALIDATION_FAILED", ex.getMessage(), List.of());
        return ResponseEntity.badRequest().body(body);
    }
}
```

> **Trade-off:** validation messages are user-facing surface. The default Bean Validation message ("must not be null") is not what you want returned on a public API. Either supply a `messages.properties` file with the messages your spec documents, or override them in the YAML with `x-message` extensions and a custom Mustache template.

---

## Exception Mapping with `unhandledException = true`

Without `unhandledException: true`, every checked exception in your delegate must either be caught inline or declared in the OpenAPI spec - which the generator will not let you do for arbitrary Java exceptions. The flag rewrites every generated method signature to `throws Exception`, which sounds blunt but is exactly what you want with a `@RestControllerAdvice`.

The relevant marker in `apiDelegate.mustache` is unconditional once the flag is set:

```mustache
{{#unhandledException}} throws Exception{{/unhandledException}}
```

With it active, the advice becomes the single point at which domain exceptions become HTTP responses:

```java
@ExceptionHandler(PetNotFoundException.class)
ResponseEntity<Error> onPetNotFound(PetNotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(new Error("PET_NOT_FOUND", ex.getMessage(), List.of()));
}

@ExceptionHandler(DownstreamUnavailableException.class)
ResponseEntity<Error> onDownstreamUnavailable(DownstreamUnavailableException ex) {
    return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
        .body(new Error("DOWNSTREAM_UNAVAILABLE", "Try again shortly", List.of()));
}

@ExceptionHandler(Exception.class)
ResponseEntity<Error> onUnexpected(Exception ex) {
    log.error("Unhandled exception in API path", ex);
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(new Error("INTERNAL_ERROR", "An unexpected error occurred", List.of()));
}
```

The catch-all `@ExceptionHandler(Exception.class)` is non-negotiable. With `unhandledException: true`, anything thrown from a delegate that the more specific handlers do not match will otherwise reach the servlet container and produce Spring's default error page - which violates the spec.

> **Caution:** issue [#20471 in OpenAPITools/openapi-generator](https://github.com/OpenAPITools/openapi-generator/issues/20471) reports cases where `delegatePattern: true` produces non-compilable output. If your build breaks immediately after enabling the flag, check that issue before assuming the bug is in your spec - the workaround is usually a Mustache template override or a generator version bump.

---

## The Client Side: `@HttpExchange` Reuse with `RestClient`

A second-order benefit of generating against Spring Boot 4 is that the same generated interface that powers the controller can also power a typed HTTP client. Spring Framework 7.0.5 documents this directly in `web/webmvc-client.adoc`:

> An `@Controller` class can implement the same interface to handle requests with `@HttpExchange` controller methods.

With `library: spring-http-interface` (set on the consuming project, not the producing one), the generator emits an `@HttpExchange`-annotated interface. The consumer wires it with `HttpServiceProxyFactory`:

```java
@Configuration
class PetsClientConfig {

    @Bean
    PetsApiClient petsApiClient(RestClient.Builder builder) {
        var restClient = builder
            .baseUrl("https://pets.internal/api")
            .defaultStatusHandler(new PetsErrorHandler())   // maps to the Error schema
            .build();
        var adapter = RestClientAdapter.create(restClient);
        return HttpServiceProxyFactory.builderFor(adapter).build()
            .createClient(PetsApiClient.class);
    }
}
```

| Adapter | When to use |
| --- | --- |
| `RestClientAdapter` | Synchronous service calls; the default for new code in Spring Framework 7 |
| `WebClientAdapter` | Reactive flows or any call participating in a `Mono`/`Flux` chain |
| `RestTemplateAdapter` | Migration from existing `RestTemplate` code; do not pick this for greenfield |

Pair this with the controller-side delegate and you have one generated interface serving both ends of a contract - the producer implements it as a delegate, the consumer proxies it through `HttpServiceProxyFactory`. The error envelope is shared because both sides reference the same `Error` schema.

---

## Sharp Edges in OpenAPI Generator 7.22 + Spring Boot 4

Four issues from the upstream tracker are worth knowing about before you adopt this combination at scale.

| Issue | Symptom | Workaround |
| --- | --- | --- |
| [#20471](https://github.com/OpenAPITools/openapi-generator/issues/20471) | `delegatePattern: true` generates non-compilable output for some specs | Often a Mustache override; verify with `7.22.0` first |
| [#21274](https://github.com/OpenAPITools/openapi-generator/issues/21274) | Invalid interface generation when `x-spring-paginated` removes parameters | Disable the extension or post-process; track for a fix |
| [#4329](https://github.com/OpenAPITools/openapi-generator/issues/4329) | `@Autowired` placement warning in generated controller (long-standing) | Cosmetic; modern Spring tolerates it. Suppress at the IDE level |
| [#23114](https://github.com/OpenAPITools/openapi-generator/issues/23114) | Spring Boot 4 + Jackson 3 support not yet present in the Kotlin generator's `jvm-spring-restclient` library | Stay on Java generator until merged, or hand-roll Kotlin clients |

The earlier `useJackson3` + `openApiNullable` incompatibility (PR [#22854](https://github.com/OpenAPITools/openapi-generator/pull/22854)) was relaxed in v7.22.0 (PR [#23331](https://github.com/OpenAPITools/openapi-generator/pull/23331)) - if you held off enabling Jackson 3 because of that, the blocker is gone.

---

## Deployment Checklist

Before merging a service that uses the delegate pattern against Spring Boot 4:

- [ ] OpenAPI Generator pinned to `7.22.0` or later in the build file.
- [ ] `useSpringBoot4: true`, `useJackson3: true`, `useJakartaEe: true`, `delegatePattern: true`, `interfaceOnly: true`, `useBeanValidation: true`, `unhandledException: true` set explicitly - not relying on defaults that may shift.
- [ ] One `@Service` bean implementing each generated `*ApiDelegate` interface, registered in a package Spring scans.
- [ ] One `@RestControllerAdvice` covering at minimum: `MethodArgumentNotValidException`, `ConstraintViolationException`, every domain exception thrown by the delegates, and a catch-all `Exception` handler.
- [ ] Validation messages overridden in `messages.properties` (or via `x-message` extensions) so the default Bean Validation strings do not leak to clients.
- [ ] Spring Boot 4.0.4 or later for the Actuator CVE fixes; older 4.0.x patches are not safe to expose externally.
- [ ] An integration test that submits a deliberately invalid request body and asserts the response matches the `Error` schema verbatim - including `code`, `message`, and `fieldErrors` shapes.

The series so far covered the spec-to-code path and the generation-at-scale path. With the delegate pattern wired this way, the code-to-running-service path is the part you stop having to think about.
