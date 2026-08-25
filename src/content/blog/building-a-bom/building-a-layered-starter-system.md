---
title: "Building a Layered Starter System"
date: "2026-08-25"
excerpt: "A Q&A learning guide for designing a layered Spring Initializr-style starter system with BOMs, custom libraries, and LGTM observability."
tags: ["Java", "Spring", "Maven", "BOM", "Observability"]
author: "Abu Dhahir"
featured: false
readTime: "12 min read"
series: "Building a BOM"
seriesOrder: 1
draft: false
---

## Building a Layered Starter System (Core Java → Spring → Custom Libs → LGTM)
### A Q&A Learning Guide

This guide walks through how to design an internal "Spring Initializr"-style system —
layered on top of core Java, adding Spring, your own custom libraries, and an
observability stack (Loki, Grafana, Tempo, Mimir - "LGTM") - while guaranteeing
**only one copy of any transitively-included library** ends up on the classpath.

It's written as progressive Q&A: each section assumes the previous one.
Examples use Maven, with Gradle notes where the behavior differs.

---

## Part 1 - How dependency resolution actually works

**Q: When two modules pull in different versions of the same library, how does the build tool pick a winner?**

It depends on the tool, and neither picks "whichever was declared last":

- **Maven - nearest wins.** Whichever version is *closest* in the dependency tree
  (fewest hops from your POM) is used. Equal distance → first-declared wins.
- **Gradle - highest wins.** By default, Gradle picks the *highest version number*
  requested anywhere in the graph.

**Q: Neither of those rules is something I control directly per project. If I want a guarantee like "everyone in this ecosystem uses exactly Jackson 2.17, no exceptions," what do I need?**

You need a **BOM (Bill of Materials)** - a mechanism that pins versions centrally,
so nearest-wins/highest-wins never has to guess.

---

## Part 2 - BOMs: centralizing version control
**Q: What is a BOM, mechanically?**

A BOM is a special POM (or a Gradle "platform") that contains **no code and no real
dependencies** - just a `<dependencyManagement>` block listing:
*"if anyone asks for artifact X, use version Y."*

Any project that **imports** the BOM inherits those pinned versions, but only for
dependencies it actually declares. The BOM doesn't pull anything in by itself.

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-dependencies</artifactId>
      <version>3.3.0</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
```

**Q: For a 4-layer system (core → Spring → custom libs → LGTM), should there be one giant BOM or one BOM per layer?**

**Layered BOMs, each importing the one below:**

```
core-bom
   ↑ imported by
spring-bom          (imports core-bom, adds Spring Boot's BOM + your pins)
   ↑ imported by
company-libs-bom     (imports spring-bom, adds your internal libraries)
   ↑ imported by
observability-bom     (imports company-libs-bom, adds LGTM client pins)
```

| Approach | Pros | Cons |
|---|---|---|
| **One monolithic BOM** | Single place to look, no ambiguity | Any tiny change forces a release of the whole thing; every consumer re-validates everything |
| **Layered BOMs** | Each layer releases independently (LGTM can bump without touching Spring); mirrors real dependency direction | Conflicts *between* layers become possible - you need a rule for who wins |

A consumer just imports the top layer they need (e.g. `observability-bom`) and
transitively gets every layer beneath it.

---

## Part 3 - Resolving conflicts between BOMs

**Q: If `company-libs-bom` pins Jackson 2.17, but the upstream `spring-boot-dependencies` BOM it imports wants 2.16 - which one wins?**

Maven's rule for `<dependencyManagement>` is **first-declared wins** - full stop.
This applies whether the entry is your own direct declaration or one spliced in via
a `<import>`. Importing a BOM effectively inserts its whole pin list *at the exact
line* the `<import>` sits on.

**Q: So where do I put my own version pins relative to the Spring BOM import, to make sure mine wins?**

**Before** the import - not after.

```xml
<dependencyManagement>
  <dependencies>
    <!-- your own pin - declared FIRST, so it wins -->
    <dependency>
      <groupId>com.fasterxml.jackson.core</groupId>
      <artifactId>jackson-databind</artifactId>
      <version>2.17.2</version>
    </dependency>

    <!-- spring-bom import - spliced in SECOND -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-dependencies</artifactId>
      <version>3.3.0</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
```

If the order were reversed, Spring's Jackson pin would already be "claimed" by the
time Maven reached your entry, and yours would be silently ignored.

**Q: Does a BOM pin guarantee only one version reaches the classpath, even through deep transitive paths?**

Yes - and this is the part people miss. `dependencyManagement` doesn't just apply
to dependencies you declare directly. It overrides the version used for **any**
transitive dependency too, no matter how many hops deep it's pulled in from.

---

## Part 4 - When BOMs aren't enough: exclusions

**Q: BOM pins solve version conflicts. What kind of problem do they *not* solve?**

Unwanted **duplicate implementations** - not "wrong version of the same artifact,"
but "an entirely different artifact doing the same job." Version pins have nothing
to negotiate here; you don't want *any* version of the unwanted artifact.

Classic example: a third-party library transitively pulls in `log4j`, but your
whole stack standardizes on `logback` via slf4j. Bumping log4j's version doesn't
help - it shouldn't be on the classpath at all.

**Q: Where does the fix for that live - in the BOM?**

No. A `<dependencyManagement>` entry is *just a version number* - there's no real
`<dependency>` element for an `<exclusion>` to attach to. Exclusions must attach to
an **actual `<dependency>` declaration** - meaning a real dependency-bearing module.

**Q: What's the real dependency-bearing module, if the BOM only holds versions?**

The **starter module**. This is the key distinction in the whole architecture:

| Module type | Contains | Example |
|---|---|---|
| **BOM** (`observability-bom`) | Pure version pins, no real dependencies | "If anyone needs `opentelemetry-api`, use 1.32.0" |
| **Starter** (`observability-starter`) | Real `<dependency>` tags consumers actually add to their POM | Tempo client, Loki client, Micrometer - plus exclusions |

Exclusions live in the **starter**, next to the dependency causing the conflict:

```xml
<dependency>
  <groupId>com.thirdparty</groupId>
  <artifactId>some-tempo-client</artifactId>
  <exclusions>
    <exclusion>
      <groupId>log4j</groupId>
      <artifactId>log4j</artifactId>
    </exclusion>
  </exclusions>
</dependency>
```

This mirrors exactly how Spring Boot itself is built: `spring-boot-dependencies`
(BOM) + `spring-boot-starter-*` (starters).

**Q: Where in a 4-layer stack are exclusions most likely to be needed?**

Spring and the LGTM/observability layer, for different reasons:

- **Spring**: multiple auto-configured alternatives exist for the same concern
  (e.g. Logback vs. Log4j2 both implementing slf4j).
- **LGTM/observability**: tracing/metrics ecosystems have overlapping standards
  (e.g. OpenTelemetry vs. Brave/Zipkin instrumentation) that can both show up
  transitively from different client libraries.

---

## Part 5 - Detecting violations: multiple versions in practice

**Q: Can a single resolved Maven build ever end up with two different versions of the exact same `groupId:artifactId` on one classpath?**

**No.** Maven's resolver always picks exactly one winner per coordinate - that's
the entire point of nearest-wins. `dependency:tree` can never show two live copies
of the *identical* artifact; the loser is dropped ("omitted for conflict" in
verbose mode), not present on the classpath.

**Q: Then where does "multiple copies of a library" actually come from?**

Two real, different sources:

1. **Coordinate changes / renames** - the same library published under a
   *different* `groupId:artifactId` over time.
   Example: `javax.servlet:servlet-api` vs. `jakarta.servlet:jakarta.servlet-api`
   - same lineage, different coordinates, so Maven treats them as unrelated and
   keeps both.
2. **Shading/relocation** - a third-party jar bundles a repackaged copy of a
   library's classes *inside itself* (e.g. `shaded.com.google.guava`). This is
   invisible to dependency resolution - it's just bytes inside another jar, not a
   declared dependency.

**Q: Which of these can `dependency:tree` actually catch?**

| Problem | Visible to `dependency:tree`? | Right tool |
|---|---|---|
| Renamed coordinates (`javax.servlet` vs `jakarta.servlet`) | **Yes** - both are real declared dependencies, both show up | `mvn dependency:tree -Dverbose`, but you must know the rename pairs to look for |
| Shaded/repackaged classes | **No** - no coordinate exists for the tree to print | Maven Enforcer Plugin's `banDuplicateClasses` rule (inspects actual `.class` files across jars) |

**Q: If a BOM pins `opentelemetry-api` to 1.32.0, and a consumer adds a raw dependency on a third-party lib that transitively wants 1.15.0 - does the classpath end up with two copies?**

No - the BOM pin still wins. `dependencyManagement` overrides *any* transitive
request, whether three hops deep or coming through a dependency the consumer just
added. Only an **explicit `<version>` on the consumer's own direct declaration**
can outrank a BOM pin.

**Q: So what is `dependency:tree -Dverbose` actually catching, if the BOM already prevents wrong versions from winning?**

It's not hunting for "wrong version wins" - the BOM already prevents that. It's
catching something narrower: **someone explicitly overriding your BOM's pin**,
visible as a mismatch between the resolved version and what the BOM says it
should be. This is typically wired into CI as a policy check.

---

## Part 6 - The full detection toolkit

| Mechanism | Placement | Catches |
|---|---|---|
| **BOMs** (layered, ordered before upstream imports) | `*-bom` modules | Wrong version winning - enforced automatically at resolution time |
| **Exclusions** | `*-starter` modules, next to the offending dependency | Duplicate *implementations* (e.g. competing logging frameworks) |
| **`mvn dependency:tree -Dverbose`** | CI check | Explicit version overrides that bypass the BOM |
| **Enforcer `banDuplicateClasses`** | CI check | Shaded/renamed-coordinate duplicate classes the tree can't see |

Both CI checks matter because they catch different classes of mistake - bypassing
the BOM is a *people* problem (someone forgot to use the starter); shaded/renamed
duplicates are an *ecosystem* problem (upstream projects didn't migrate cleanly).

---

## Part 7 - Repo structure and release strategy

**Q: Should the four layers live in one repo or four separate repos?**

Depends on team shape - it's a real tradeoff, not a rule:

| | Polyrepo (4 repos) | Monorepo (1 repo, 4 modules) |
|---|---|---|
| **Independent releases** | ✅ Natural - bump layer 4 without touching 1–3 | ⚠️ Needs extra tooling (see below) |
| **Cross-layer compatibility** | ❌ Manual - you must track which BOM versions work together (compatibility matrix or integration-test repo) | ✅ Enforced by construction - layer 4 always builds against whatever layer 3 currently is in the repo |
| **CI/ops overhead** | ❌ Four pipelines, four release processes | ✅ One pipeline, one place to look |
| **Best fit** | Genuinely separate teams, separate cadences | Small team owning all layers, wants standardization |

**For a small core team publishing standardized starters** (not several teams
needing independent velocity), the polyrepo cost - manually tracking cross-layer
compatibility - outweighs its benefit. **Monorepo is the better fit.**

**Q: Inside a monorepo, does one change to `observability-bom` force new releases of core/spring/company-libs too?**

Only if you choose **lockstep versioning** (every module shares one version
number always). The alternative is:

- **Lockstep versioning**: one change to any module → all modules get a new
  version number, even if their content didn't change.
- **Independent per-module versioning**: `observability-bom` goes to `2.4.0`;
  core/spring/company-libs stay exactly where they were - no new release, no new
  tag, nothing republished for them.

For a small team with no reason to pay lockstep's coordination cost,
**independent per-module versioning inside a monorepo** is the right target.

**Q: What does it actually take to make independent per-module versioning work?**

Maven's default reactor build wants one version for the whole tree unless told
otherwise. In practice you need:

- The `versions-maven-plugin` (or manually maintained per-module versions) to let
  each module carry its own version number.
- CI logic with **path-based triggers** - only run the release job for a module if
  files under its own directory changed (e.g. only build/release
  `observability-bom/` when something under that path changes).
- An integration-test layer (or documented compatibility matrix) that verifies,
  e.g., `observability-bom:2.4.0` still works against `company-libs-bom:3.0.0`
  even though they're versioned independently - since nothing else guarantees
  this once releases are decoupled.

---

## Summary: the full architecture

```
core-bom  →  spring-bom  →  company-libs-bom  →  observability-bom     (pure version pins)
                                                        ↓
                                          observability-starter          (real dependencies + exclusions)
```

- **BOMs**, layered and imported in order (your pins declared *before* each
  upstream `<import>`), guarantee a single version per artifact everywhere,
  including transitively.
- **Starters** are the real dependency-bearing modules consumers add; they carry
  **exclusions** for duplicate-implementation problems a version pin can't fix.
- **CI enforcement** combines `dependency:tree -Dverbose` (catches BOM-bypassing
  overrides) and Enforcer's `banDuplicateClasses` (catches shaded/renamed
  duplicates invisible to the tree).
- **Repo strategy**: for a small team standardizing on this system, a **monorepo
  with independent per-module versioning** gives compatibility-by-construction
  without forcing unrelated layers to release together.
