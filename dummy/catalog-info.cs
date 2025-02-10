using System;
using System.Collections.Generic;
using System.IO;
using System.Text.RegularExpressions;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

class Program
{
    static void Main()
    {
        string propertiesFilePath = "./your_properties_directory/ci_orders_properties.properties"; // Change to actual file
        string outputDirectory = "./git_workspace"; // Change to your Git workspace directory

        if (!File.Exists(propertiesFilePath))
        {
            Console.WriteLine($"File not found: {propertiesFilePath}");
            return;
        }

        var properties = ReadPropertiesFile(propertiesFilePath);
        GenerateCatalogInfo(properties, outputDirectory);
    }

    static Dictionary<string, string> ReadPropertiesFile(string filePath)
    {
        var properties = new Dictionary<string, string>();
        foreach (var line in File.ReadAllLines(filePath))
        {
            if (!string.IsNullOrWhiteSpace(line) && line.Contains("=") && !line.StartsWith("#"))
            {
                var parts = line.Split('=', 2);
                properties[parts[0].Trim()] = parts[1].Trim();
            }
        }
        return properties;
    }

    static void GenerateCatalogInfo(Dictionary<string, string> properties, string outputDir)
    {
        if (!properties.ContainsKey("APP_CODE") || !properties.ContainsKey("MODULE_NAME") || 
            !properties.ContainsKey("REPO_NAME") || !properties.ContainsKey("ARTIFACTORY_PROJECT_KEY") ||
            !properties.ContainsKey("SONAR_PROJECT_KEY") || !properties.ContainsKey("BITBUCKET_REPO_URL") || 
            !properties.ContainsKey("DIVISION"))
        {
            Console.WriteLine("Skipping file due to missing required properties.");
            return;
        }

        string appCode = properties["APP_CODE"];
        string moduleName = properties["MODULE_NAME"];
        string repoName = properties["REPO_NAME"];
        string artifactoryProjectKey = properties["ARTIFACTORY_PROJECT_KEY"];
        string sonarProjectKey = properties["SONAR_PROJECT_KEY"];
        string repoUrl = properties["BITBUCKET_REPO_URL"];
        string division = properties["DIVISION"];

        // Convert Bitbucket repo URL format
        string modifiedRepoUrl = ModifyBitbucketRepoUrl(repoUrl);

        var catalogData = new Dictionary<string, object>
        {
            { "apiVersion", "backstage.io/v1alpha1" },
            { "kind", "Component" },
            { "metadata", new Dictionary<string, object>
                {
                    { "name", moduleName },
                    { "description", "Backstage is an open-source developer portal that puts the developer experience first." },
                    { "annotations", new Dictionary<string, string>
                        {
                            { "github.com/source-location", modifiedRepoUrl },
                            { "sonarqube.org/project-key", sonarProjectKey },
                            { "artifactory.org/artifactory-repo", artifactoryProjectKey },
                            { "jenkins.io/job-full-name", $"{division}:{moduleName}/{repoName}" }
                        }
                    }
                }
            },
            { "spec", new Dictionary<string, object>
                {
                    { "type", "service" },
                    { "owner", "" },
                    { "lifecycle", "production" }
                }
            }
        };

        string outputPath = Path.Combine(outputDir, appCode, $"{repoName}_catalog-info.yaml");
        Directory.CreateDirectory(Path.GetDirectoryName(outputPath));

        var serializer = new SerializerBuilder()
            .WithNamingConvention(CamelCaseNamingConvention.Instance)
            .Build();

        File.WriteAllText(outputPath, serializer.Serialize(catalogData));
        Console.WriteLine($"Generated: {outputPath}");
    }

    static string ModifyBitbucketRepoUrl(string originalUrl)
    {
        var match = Regex.Match(originalUrl, @"https://bitbucketp\.sg\.uobnet\.com/(?<projectkey>[^/]+)/(?<reponame>[^.]+)\.git");
        if (match.Success)
        {
            string projectKey = match.Groups["projectkey"].Value;
            string repoName = match.Groups["reponame"].Value;
            return $"https://bitbucketp.sg.uobnet.com/{projectKey}/repos/{repoName}";
        }
        return originalUrl; // Return original if format is unexpected
    }
}
