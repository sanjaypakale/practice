package com.example.cataloggenerator;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.io.*;
import java.util.HashSet;
import java.util.Properties;
import java.util.Set;

@SpringBootApplication
public class CatalogInfoGeneratorApplication implements CommandLineRunner {

    // Base directory where properties files reside.
    private static final String BASE_DIRECTORY = "/propertis";

    public static void main(String[] args) {
        SpringApplication.run(CatalogInfoGeneratorApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        // A set to track processed BITBUCKET_REPO_URLs so we don’t create duplicate catalog files.
        Set<String> processedRepoUrls = new HashSet<>();

        File baseDir = new File(BASE_DIRECTORY);
        if (!baseDir.exists() || !baseDir.isDirectory()) {
            System.err.println("Base directory does not exist: " + baseDir.getAbsolutePath());
            return;
        }

        // Loop over each <appCode> folder under /propertis
        File[] appCodeDirs = baseDir.listFiles(File::isDirectory);
        if (appCodeDirs == null) {
            System.err.println("No appCode directories found.");
            return;
        }

        for (File appCodeDir : appCodeDirs) {
            String appCode = appCodeDir.getName();
            // List all files starting with "ci_" and ending with ".properties", ignoring those with "_aldon_has.properties"
            File[] propFiles = appCodeDir.listFiles((dir, name) ->
                    name.startsWith("ci_") && name.endsWith(".properties") && !name.contains("_aldon_has.properties")
            );

            if (propFiles == null || propFiles.length == 0) {
                continue;
            }

            for (File propFile : propFiles) {
                // Load properties file
                Properties properties = new Properties();
                try (InputStream input = new FileInputStream(propFile)) {
                    properties.load(input);
                } catch (IOException e) {
                    System.err.println("Error reading file " + propFile.getAbsolutePath() + ": " + e.getMessage());
                    continue;
                }

                // Read required properties
                String bitbucketRepoUrl = properties.getProperty("BITBUCKET_REPO_URL");
                String bitbucketRepoName = properties.getProperty("BITBUCKET_REPO_NAME");
                String fileAppCode = properties.getProperty("APP_CODE");

                if (bitbucketRepoUrl == null || bitbucketRepoName == null || fileAppCode == null) {
                    System.err.println("Missing required properties in file: " + propFile.getAbsolutePath());
                    continue;
                }

                // Check if we already processed this repo URL
                if (processedRepoUrls.contains(bitbucketRepoUrl)) {
                    System.out.println("Catalog already generated for repo: " + bitbucketRepoUrl);
                    continue;
                }

                // Fetch the Jenkinsfile from Bitbucket via an API call.
                // (This example assumes that you can get the Jenkinsfile from a URL like this.
                // Adjust as necessary for your Bitbucket configuration.)
                String jenkinsFileContent = fetchJenkinsfile(bitbucketRepoUrl);
                if (jenkinsFileContent == null || !jenkinsFileContent.contains("@Library")) {
                    System.err.println("Invalid or missing Jenkinsfile for repo: " + bitbucketRepoUrl);
                    continue;
                }

                // Optionally, you could parse the Jenkinsfile to verify that it contains:
                //   @Library(['devops_automation', 'devops_utils'])
                //   genericMerged([PropertyFolderName: <appCode>, PropertyFileName: "ci_<modulename>"])
                // For this example we assume the check above is sufficient.

                // Generate the catalog-info.yaml content.
                String catalogYaml = generateCatalogYaml(bitbucketRepoName);

                // Prepare the output folder: <APP_CODE>
                File outputDir = new File(fileAppCode);
                if (!outputDir.exists()) {
                    outputDir.mkdirs();
                }
                // Write the file as: <APP_CODE>/<BITBUCKET_REPO_NAME>_catalog-info.yaml
                File outputFile = new File(outputDir, bitbucketRepoName + "_catalog-info.yaml");
                try (FileWriter writer = new FileWriter(outputFile)) {
                    writer.write(catalogYaml);
                    System.out.println("Generated catalog-info.yaml for " + bitbucketRepoName + " at " + outputFile.getAbsolutePath());
                } catch (IOException e) {
                    System.err.println("Error writing catalog-info.yaml for repo: " + bitbucketRepoName);
                }

                // Mark this repo URL as processed
                processedRepoUrls.add(bitbucketRepoUrl);
            }
        }
    }

    /**
     * Calls Bitbucket API to retrieve the Jenkinsfile from the repository.
     * Adjust the API endpoint as necessary.
     *
     * @param repoUrl The Bitbucket repository URL.
     * @return The content of the Jenkinsfile or null if not found.
     */
    private String fetchJenkinsfile(String repoUrl) {
        try {
            // For example, assume the Jenkinsfile is available at:
            // https://bitbucketp.org/rest/api/1.0/projects/{projectKey}/repos/{repoSlug}/raw/Jenkinsfile?at=refs/heads/main
            // Here we simply append a known path to the repository URL. In a real scenario, you might need to extract projectKey and repoSlug.
            String jenkinsApiUrl = repoUrl + "/raw/branch/main/Jenkinsfile";
            ResponseEntity<String> response = restTemplate().getForEntity(jenkinsApiUrl, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                return response.getBody();
            }
        } catch (Exception e) {
            System.err.println("Error fetching Jenkinsfile from " + repoUrl + ": " + e.getMessage());
        }
        return null;
    }

    /**
     * Generates the catalog-info.yaml content with the provided Bitbucket repository name.
     *
     * You might want to adjust or enhance this template, for example by dynamically extracting the project name.
     *
     * @param bitbucketRepoName The name of the Bitbucket repository.
     * @return The content of catalog-info.yaml as a String.
     */
    private String generateCatalogYaml(String bitbucketRepoName) {
        // Replace <projectname> with an appropriate value if available.
        String projectName = "PROJECT"; // Placeholder: update as necessary.
        return "apiVersion: backstage.io/v1alpha1\n" +
               "kind: Component\n" +
               "metadata:\n" +
               "  name: " + bitbucketRepoName + "\n" +
               "  description: |\n" +
               "    Backstage is an open-source developer portal that puts the developer experience first.\n" +
               "  annotations:\n" +
               "    backstage.io/source-location: url:https://bitbucketp.org/projects/" + projectName + "/repos/" + bitbucketRepoName + "\n" +
               "    backstage.io/techdocs-ref: dir:.\n" +
               "    lighthouse.com/website-url: https://backstage.io\n" +
               "spec:\n" +
               "  type: service\n" +
               "  owner: user:guest\n" +
               "  lifecycle: production\n";
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
