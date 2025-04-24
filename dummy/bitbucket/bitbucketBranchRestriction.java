import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Base64;

public class BitbucketBranchRestrictionManager {

    private static final String BITBUCKET_URL = "https://bitbucket.yourcompany.com";
    private static final String PROJECT_KEY = "PROJ";
    private static final String REPO_SLUG = "my-repo";
    private static final String USERNAME = "your-username";
    private static final String PASSWORD = "your-password-or-token";
    private static final String TARGET_BRANCH = "refs/heads/master";
    private static final String TARGET_USER = "ownpddp";

    private static final HttpClient httpClient = HttpClient.newHttpClient();
    private static final ObjectMapper mapper = new ObjectMapper();

    public static void main(String[] args) throws IOException, InterruptedException {
        JsonNode restrictions = fetchBranchRestrictions();
        if (restrictions == null) return;

        for (JsonNode restriction : restrictions) {
            String branchId = restriction.path("matcher").path("id").asText();
            String typeId = restriction.path("type").path("id").asText();

            if (TARGET_BRANCH.equals(branchId) && (typeId.equals("pull-request-only") || typeId.equals("read-only"))) {
                processRestriction(restriction);
            }
        }
    }

    private static JsonNode fetchBranchRestrictions() throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BITBUCKET_URL + "/rest/branch-permissions/2.0/projects/"
                        + PROJECT_KEY + "/repos/" + REPO_SLUG + "/restrictions"))
                .header("Authorization", getAuthHeader())
                .header("Accept", "application/json")
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() == 200) {
            return mapper.readTree(response.body());
        } else {
            System.err.println("Failed to fetch branch restrictions: " + response.statusCode());
            return null;
        }
    }

    private static void processRestriction(JsonNode restriction) throws IOException, InterruptedException {
        ArrayNode users = (ArrayNode) restriction.withArray("users");
        if (!userExists(users, TARGET_USER)) {
            addUserToRestriction(restriction, users);
            updateRestriction(restriction);
        } else {
            System.out.println("User '" + TARGET_USER + "' already exists in restriction ID " + restriction.get("id"));
        }
    }

    private static boolean userExists(ArrayNode users, String username) {
        for (JsonNode user : users) {
            if (username.equals(user.path("name").asText())) {
                return true;
            }
        }
        return false;
    }

    private static void addUserToRestriction(JsonNode restriction, ArrayNode users) {
        ObjectNode newUser = mapper.createObjectNode();
        newUser.put("name", TARGET_USER);
        users.add(newUser);
        ((ObjectNode) restriction).set("users", users);
        System.out.println("Added user '" + TARGET_USER + "' to restriction ID " + restriction.get("id"));
    }

    private static void updateRestriction(JsonNode restriction) throws IOException, InterruptedException {
        int restrictionId = restriction.get("id").asInt();
        String url = BITBUCKET_URL + "/rest/branch-permissions/2.0/projects/"
                + PROJECT_KEY + "/repos/" + REPO_SLUG + "/restrictions/" + restrictionId;

        HttpRequest putRequest = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Authorization", getAuthHeader())
                .header("Content-Type", "application/json")
                .PUT(HttpRequest.BodyPublishers.ofString(restriction.toString()))
                .build();

        HttpResponse<String> response = httpClient.send(putRequest, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() == 200) {
            System.out.println("Successfully updated restriction ID " + restrictionId);
        } else {
            System.err.println("Failed to update restriction ID " + restrictionId + ": " + response.statusCode());
        }
    }

    private static String getAuthHeader() {
        String credentials = USERNAME + ":" + PASSWORD;
        return "Basic " + Base64.getEncoder().encodeToString(credentials.getBytes());
    }
}
