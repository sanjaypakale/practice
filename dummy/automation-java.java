package com.example.cataloggenerator;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.client.RestTemplate;
import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

@SpringBootApplication
public class CatalogGeneratorApplication implements CommandLineRunner {

    private static final String PROPERTIES_DIR = "/properties/";
    private static final String CATALOG_DIR = "./generated_catalogs/";
    private static final Set<String> processedRepos = new HashSet<>();
    private final RestTemplate restTemplate = new RestTemplate();

    public static void main(String[] args) {
        SpringApplication.run(CatalogGeneratorApplication.class, args);
    }

    @Override
    public void run(String... args) throws IOException {
        List<Path> propertiesFiles = Files.walk(Paths.get(PROPERTIES_DIR))
                .filter(path -> path.toString().endsWith(".properties"))
                .collect(Collectors.toList());

        for (Path propertiesFile : propertiesFiles) {
            Properties properties = new Properties();
            try (InputStream inputStream = Files.newInputStream(propertiesFile)) {
                properties.load(inputStream);
            }

            String repoUrl = properties.getProperty("BITBUCKET_REPO_URL");
            String repoName = properties.getProperty("BITBUCKET_REPO_NAME");
            String appCode = properties.getProperty("APP_CODE");

            if (repoUrl == null || processedRepos.contains(repoUrl)) {
                continue;
            }

            String jenkinsfileContent = fetchJenkinsfile(repoUrl);
            if (jenkinsfileContent == null) {
                continue;
            }

            String propertyFolderName = extractPropertyFolderName(jenkinsfileContent);
            String propertyFileName = extractPropertyFileName(jenkinsfileContent);

            generateCatalogInfoYaml(appCode, repoName, propertyFolderName, propertyFileName);
            processedRepos.add(repoUrl);
        }
    }

    private String fetchJenkinsfile(String repoUrl) {
        try {
            return restTemplate.getForObject(repoUrl + "/raw/Jenkinsfile", String.class);
        } catch (Exception e) {
            System.err.println("Failed to fetch Jenkinsfile from: " + repoUrl);
            return null;
        }
    }

    private String extractPropertyFolderName(String jenkinsfileContent) {
        return extractFromJenkinsfile(jenkinsfileContent, "PropertyFolderName");
    }

    private String extractPropertyFileName(String jenkinsfileContent) {
        return extractFromJenkinsfile(jenkinsfileContent, "PropertyFileName");
    }

    private String extractFromJenkinsfile(String content, String key) {
        String pattern = key + ": \"(.*?)\"";
        return content.matches(pattern) ? content.replaceAll(pattern, "$1") : "unknown";
    }

    private void generateCatalogInfoYaml(String appCode, String repoName, String propertyFolder, String propertyFile) throws IOException {
        String catalogContent = """
                apiVersion: backstage.io/v1alpha1
                kind: Component
                metadata:
                  name: """ + repoName + """
                  description: |
                    Backstage is an open-source developer portal that puts the developer experience first.
                  annotations:
                    backstage.io/source-location: url:https://bitbucketp.org/projects/""" + appCode + """/repos/""" + repoName + """
                    backstage.io/techdocs-ref: dir:.
                    lighthouse.com/website-url: https://backstage.io
                spec:
                  type: service
                  owner: user:guest
                  lifecycle: production
                """;
        
        Path catalogPath = Paths.get(CATALOG_DIR, appCode, repoName + "_catalog-info.yaml");
        Files.createDirectories(catalogPath.getParent());
        Files.write(catalogPath, catalogContent.getBytes());
    }
}
