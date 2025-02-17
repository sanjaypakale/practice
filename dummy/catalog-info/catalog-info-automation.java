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
    // Output directory where catalog-info.yaml files will be generated.
    private static final String OUTPUT_BASE_DIRECTORY = "c/Projects/development-Hybrid/catalog-registry";

    public static void main(String[] args) {
        SpringApplication.run(CatalogInfoGeneratorApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        // To avoid duplicate catalog generation for the same BITBUCKET_REPO_URL
        Set<String> processedRepoUrls = new HashSet<>();

        File baseDir = new File(BASE_DIRECTORY);
        if (!baseDir.exists() || !baseDir.isDirectory()) {
            System.err.println("Base directory does not exist: " + baseDir.getAbsolutePath());
            return;
        }

        // Loop over each <appCode> directory under /propertis
        File[] appCodeDirs = baseDir.listFiles(File::isDirectory);
        if (appCodeDirs == null) {
            System.err.println("No appCode directories found under " + BASE_DIRECTORY);
            return;
        }

        for (File appCodeDir : appCodeDirs) {
            // The folder name itself is the appCode
            String appCode = appCodeDir.getName();
            // List all properties files starting with "ci_" and ending with ".properties"
            // and ignore files containing "_aldon_has.properties"
            File[] propFiles = appCodeDir.listFiles((dir, name) ->
                    name.startsWith("ci_") && name.endsWith(".properties") && !name.contains("_aldon_has.properties")
            );

            if (propFiles == null || propFiles.length == 0) {
                continue;
            }

            for (File propFile : propFiles) {
                Properties properties = new Properties();
                try (InputStream input = new FileInputStream(propFile)) {
                    properties.load(input);
                } catch (IOException e) {
                    System.err.println("Error reading file " + propFile.getAbsolutePath() + ": " + e.getMessage());
                    continue;
                }

                // Retrieve required properties
                String bitbucketRepoUrl = properties.getProperty("BITBUCKET_REPO_URL");
                String bitbucketRepoName = properties.getProperty("BITBUCKET_REPO_NAME");
                String fileAppCode = properties.getProperty("APP_CODE");

                if (bitbucketRepoUrl == null || bitbucketRepoName == null || fileAppCode == null) {
                    System.err.println("Missing required properties in " + propFile.getAbsolutePath());
                    continue;
                }

                // Avoid generating duplicate catalog-info.yaml if the same BITBUCKET_REPO_URL is encountered
                if (processedRepoUrls.contains(bitbucketRepoUrl)) {
                    System.out.println("Catalog already generated for repo: " + bitbucketRepoUrl);
                    continue;
                }

                // Fetch the Jenkinsfile via Bitbucket API call.
                String jenkinsFileContent = fetchJenkinsfile(bitbucketRepoUrl);
                if (jenkinsFileContent == null || 
                    !jenkinsFileContent.contains("@Library") ||
                    !jenkinsFileContent.contains("genericMerged(")) {
                    System.err.println("Invalid or missing Jenkinsfile for repo: " + bitbucketRepoUrl);
                    continue;
                }

                // Generate the catalog-info.yaml content using BITBUCKET_REPO_NAME
                String catalogYaml = generateCatalogYaml(bitbucketRepoName);

                // Create the output folder structure: OUTPUT_BASE_DIRECTORY/<APP_CODE>
                File outputDir = new File(OUTPUT_BASE_DIRECTORY + File.separator + fileAppCode);
                if (!outputDir.exists() && !outputDir.mkdirs()) {
                    System.err.println("Could not create output directory: " + outputDir.getAbsolutePath());
                    continue;
                }

                // The catalog file name: <BITBUCKET_REPO_NAME>_catalog-info.yaml
                File outputFile = new File(outputDir, bitbucketRepoName + "_catalog-info.yaml");
                try (FileWriter writer = new FileWriter(outputFile)) {
                    writer.write(catalogYaml);
                    System.out.println("Generated catalog-info.yaml for " + bitbucketRepoName +
                            " at " + outputFile.getAbsolutePath());
                } catch (IOException e) {
                    System.err.println("Error writing catalog-info.yaml for repo: " + bitbucketRepoName);
                }

                // Mark this repository URL as processed
                processedRepoUrls.add(bitbucketRepoUrl);
            }
        }
    }

    /**
     * Fetches the Jenkinsfile content using the Bitbucket API.
     * Adjust the API URL construction and error handling as needed.
     *
     * @param repoUrl The Bitbucket repository URL.
     * @return The content of the Jenkinsfile or null if not found.
     */
    private String fetchJenkinsfile(String repoUrl) {
        try {
            // For example, assume the Jenkinsfile is available at:
            // https://bitbucketp.org/rest/api/1.0/projects/{projectKey}/repos/{repoSlug}/raw/Jenkinsfile?at=refs/heads/main
            // This example assumes that appending "/raw/branch/main/Jenkinsfile" to the repo URL will return the Jenkinsfile.
            // Adjust this to match your Bitbucket configuration.
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
     * Generates the content of the catalog-info.yaml file using the Bitbucket repository name.
     *
     * @param bitbucketRepoName The name of the Bitbucket repository.
     * @return The catalog-info.yaml content as a String.
     */
    private String generateCatalogYaml(String bitbucketRepoName) {
        // Replace <projectname> with an appropriate value (could be a property or derived from the repo URL).
        String projectName = "PROJECT"; // Placeholder—update as needed.
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
