import com.atlassian.bitbucket.rest.client.*;
import com.atlassian.bitbucket.rest.client.api.*;
import com.atlassian.bitbucket.rest.client.api.branch.*;
import com.atlassian.bitbucket.rest.client.api.repository.*;
import com.atlassian.bitbucket.rest.client.api.rest.*;
import com.atlassian.bitbucket.rest.client.api.rest.request.*;
import com.atlassian.bitbucket.rest.client.api.rest.response.*;
import com.atlassian.bitbucket.rest.client.internal.async.*;
import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@RestController
public class BitbucketRepoManagerController {

    private final String bitbucketUrl;
    private final String username;
    private final String password;

    public BitbucketRepoManagerController(@Value("${bitbucket.url}") String bitbucketUrl,
                                          @Value("${bitbucket.username}") String username,
                                          @Value("${bitbucket.password}") String password) {
        this.bitbucketUrl = bitbucketUrl;
        this.username = username;
        this.password = password;
    }

    @PostMapping("/release/create/{releasenumber}")
    @ResponseStatus(HttpStatus.OK)
    public void createReleaseBranch(@PathVariable("releasenumber") String releaseNumber) {
        try (BitbucketClient bitbucketClient = createBitbucketClient()) {
            List<Project> projects = getProjects(bitbucketClient);
            for (Project project : projects) {
                createBranch(bitbucketClient, project, releaseNumber);
                updateFiles(bitbucketClient, project, releaseNumber);
                commitChanges(bitbucketClient, project, releaseNumber);
                System.out.println("Branch created and files updated for project: " + project.getName());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @GetMapping("/release/list")
    public ResponseEntity<List<String>> listReleaseBranches() {
        try (BitbucketClient bitbucketClient = createBitbucketClient()) {
            List<String> releaseBranches = new ArrayList<>();
            List<Project> projects = getProjects(bitbucketClient);
            for (Project project : projects) {
                List<Branch> branches = getBranches(bitbucketClient, project);
                for (Branch branch : branches) {
                    if (branch.getDisplayId().startsWith("release/")) {
                        releaseBranches.add(branch.getDisplayId());
                    }
                }
            }
            return ResponseEntity.ok(releaseBranches);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private BitbucketClient createBitbucketClient() {
        String credentials = username + ":" + password;
        String base64Credentials = new String(Base64.encodeBase64(credentials.getBytes(StandardCharsets.UTF_8)), StandardCharsets.UTF_8);
        AsyncHttpClient httpClient = new AsynchronousHttpClientFactory().newClient(bitbucketUrl, base64Credentials);
        return new BitbucketClient(bitbucketUrl, httpClient);
    }

    private List<Project> getProjects(BitbucketClient bitbucketClient) {
        Page<Project> projectPage = bitbucketClient.getProjectClient().getProjects(new PageRequestImpl());
        return projectPage.getValues();
    }

    private void createBranch(BitbucketClient bitbucketClient, Project project, String releaseNumber) {
        try {
            CreateBranchRequest createBranchRequest = new CreateBranchRequest.Builder()
                    .name("release/" + releaseNumber)
                    .target("refs/heads/master")
                    .build();
            bitbucketClient.getBranchClient().createBranch(project.getKey(), createBranchRequest);
        } catch (BitbucketException e) {
            e.printStackTrace();
        }
    }

    private void updateFiles(BitbucketClient bitbucketClient, Project project, String releaseNumber) {
        try {
            String filePath = "jenkins";
            String content = "Release: " + releaseNumber;
            UpdateFileRequest updateFileRequest = new UpdateFileRequest.Builder(project.getKey(), filePath, content)
                    .branch("release/" + releaseNumber)
                    .message("Update " + filePath)
                    .build();
            bitbucketClient.getRestClient().call(Request.Method.PUT, "/projects/{projectKey}/repos/{repositorySlug}/browse/{path}")
                    .pathParam("projectKey", project.getKey())
                    .pathParam("repositorySlug", project.getSlug())
                    .pathParam("path", filePath)
                    .body(updateFileRequest)
                    .execute();
        } catch (BitbucketException e) {
            e.printStackTrace();
        }
        // Update "pom.xml" files recursively
        // Add your logic here to update the "pom.xml" files in Bitbucket
    }

    private void commitChanges(BitbucketClient bitbucketClient, Project project, String releaseNumber) {
        try {
            String branch = "release/" + releaseNumber;
            String message = "Commit changes for release " + releaseNumber;
            bitbucketClient.getRestClient().call(Request.Method.POST, "/projects/{projectKey}/repos/{repositorySlug}/commits")
                    .pathParam("projectKey", project.getKey())
                    .pathParam("repositorySlug", project.getSlug())
                    .body(new CommitRequest(branch, message))
                    .execute();
        } catch (BitbucketException e) {
            e.printStackTrace();
        }
    }

    private List<Branch> getBranches(BitbucketClient bitbucketClient, Project project) {
        try {
            Page<Branch> branchPage = bitbucketClient.getBranchClient()
                    .getBranches(project.getKey(), new PageRequestImpl());
            return branchPage.getValues();
        } catch (BitbucketException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
}
