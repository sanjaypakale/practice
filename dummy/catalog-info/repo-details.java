import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.Base64;

public class BitbucketRepoAnalyzer {
    private static final String BITBUCKET_API_URL = "https://api.bitbucket.org/2.0/repositories/";
    private static final String USERNAME = "your_username";
    private static final String APP_PASSWORD = "your_app_password";
    private static final String WORKSPACE = "your_workspace"; // Your Bitbucket workspace

    private static final Map<String, String> TECH_STACK_MAP = new HashMap<>();

    static {
        // Adding more configurations to map various technologies
        TECH_STACK_MAP.put("pom.xml", "Java (Maven)");
        TECH_STACK_MAP.put("build.gradle", "Java (Gradle)");
        TECH_STACK_MAP.put(".csproj", "C# (.NET)");
        TECH_STACK_MAP.put("angular.json", "Angular");
        TECH_STACK_MAP.put("package.json", "JavaScript/React/Node.js");
        TECH_STACK_MAP.put("requirements.txt", "Python");
        TECH_STACK_MAP.put("setup.py", "Python");
        TECH_STACK_MAP.put("index.html", "HTML/CSS/JavaScript");
        TECH_STACK_MAP.put("docker-compose.yml", "Docker");
        TECH_STACK_MAP.put("Dockerfile", "Docker");
        TECH_STACK_MAP.put("tsconfig.json", "TypeScript/Angular");
        TECH_STACK_MAP.put("composer.json", "PHP (Composer)");
        TECH_STACK_MAP.put("gradle.build", "Gradle (Java)");
        TECH_STACK_MAP.put("App.js", "React (JavaScript)");
        TECH_STACK_MAP.put("go.mod", "Go");
        TECH_STACK_MAP.put("main.go", "Go");
        
        // Adding detection for Shell Script, VB.NET, SQL, and other technologies
        TECH_STACK_MAP.put("shellscript.sh", "Shell Script (Bash)");
        TECH_STACK_MAP.put("bashrc", "Shell Script (Bash)");
        TECH_STACK_MAP.put("Dockerfile", "Docker");
        
        TECH_STACK_MAP.put("Web.config", "VB.NET");
        TECH_STACK_MAP.put("global.asax", "VB.NET");
        TECH_STACK_MAP.put("vbproj", "VB.NET");

        TECH_STACK_MAP.put("README.md", "General Documentation");
        
        // SQL file formats
        TECH_STACK_MAP.put(".sql", "SQL");

        // Adding .gitignore as a general identifier for Git repositories
        TECH_STACK_MAP.put(".gitignore", "General Git Repository");
    }

    public static void main(String[] args) {
        List<String> repositories = Arrays.asList("repo1", "repo2", "repo3"); // Replace with actual repo names
        System.out.println("Fetching repository details...\n");

        for (String repo : repositories) {
            String description = getRepositoryDescription(repo);
            String repoUrl = getRepositoryUrl(repo);
            String techStack = detectTechnologyStack(repo);

            System.out.println("Repository: " + repo);
            System.out.println("Description: " + description);
            System.out.println("Repo URL: " + repoUrl);
            System.out.println("Tech Stack: " + techStack);
            System.out.println("-----------------------------------");
        }
    }

    private static String getRepositoryDescription(String repoName) {
        try {
            String url = BITBUCKET_API_URL + WORKSPACE + "/" + repoName;
            String response = sendGetRequest(url);

            if (response == null) return "No description available.";

            JSONObject jsonResponse = new JSONObject(response);
            return jsonResponse.optString("description", "No description available.");
        } catch (Exception e) {
            e.printStackTrace();
            return "Error fetching description.";
        }
    }

    private static String getRepositoryUrl(String repoName) {
        try {
            String url = BITBUCKET_API_URL + WORKSPACE + "/" + repoName;
            String response = sendGetRequest(url);

            if (response == null) return "No URL available.";

            JSONObject jsonResponse = new JSONObject(response);
            JSONArray links = jsonResponse.getJSONObject("links").getJSONArray("clone");

            for (int i = 0; i < links.length(); i++) {
                JSONObject link = links.getJSONObject(i);
                if ("https".equalsIgnoreCase(link.getString("name"))) {
                    return link.getString("href");
                }
            }
            return "No HTTPS URL found.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error fetching repo URL.";
        }
    }

    private static String detectTechnologyStack(String repoName) {
        try {
            String url = BITBUCKET_API_URL + WORKSPACE + "/" + repoName + "/src/master/";
            String response = sendGetRequest(url);

            if (response == null) return "Unknown";

            JSONObject jsonResponse = new JSONObject(response);
            JSONArray values = jsonResponse.optJSONArray("values");

            if (values == null) return "Unknown";

            Set<String> detectedTechnologies = new HashSet<>();

            for (int i = 0; i < values.length(); i++) {
                JSONObject file = values.getJSONObject(i);
                String filePath = file.getString("path");

                TECH_STACK_MAP.forEach((key, value) -> {
                    if (filePath.contains(key)) detectedTechnologies.add(value);
                });
            }

            return detectedTechnologies.isEmpty() ? "Unknown" : String.join(", ", detectedTechnologies);
        } catch (Exception e) {
            e.printStackTrace();
            return "Error fetching data.";
        }
    }

    private static String sendGetRequest(String urlString) {
        try {
            URL url = new URL(urlString);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            String auth = USERNAME + ":" + APP_PASSWORD;
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());
            conn.setRequestProperty("Authorization", "Basic " + encodedAuth);

            int responseCode = conn.getResponseCode();
            if (responseCode != 200) {
                System.out.println("Failed to fetch data for URL: " + urlString);
                return null;
            }

            BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            reader.close();
            return response.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
