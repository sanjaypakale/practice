package com.example.gitapi.service;

import org.springframework.stereotype.Service;

import java.io.*;
import java.util.List;

@Service
public class GitService {

    public String initializeGitRepository(String downloadUrl, String repoUrl, String branchName, String commitMessage) {
        // Define the location of the shell script
        String scriptLocation = "/path/to/your/script.sh";  // Adjust path accordingly

        // Build the command to invoke the shell script with parameters
        List<String> command = List.of(
            "bash", scriptLocation,
            downloadUrl,  // URL to download zip file
            repoUrl,      // Git repository URL
            branchName,   // Git branch name
            commitMessage // Git commit message
        );

        try {
            // Create a process to run the shell script
            ProcessBuilder processBuilder = new ProcessBuilder(command);
            processBuilder.redirectErrorStream(true);

            // Start the process
            Process process = processBuilder.start();

            // Capture the output of the script execution
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            StringBuilder output = new StringBuilder();
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            // Wait for the process to finish and get the exit code
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                return "Git repository initialized and changes pushed successfully!\n" + output.toString();
            } else {
                return "Failed to initialize repository. Exit code: " + exitCode + "\n" + output.toString();
            }

        } catch (IOException | InterruptedException e) {
            return "Error occurred while executing the shell script: " + e.getMessage();
        }
    }
}
