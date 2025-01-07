import React, { useState, useEffect } from 'react';
import {
  FieldExtensionComponentProps
} from '@backstage/plugin-scaffolder-react';
import { Autocomplete, TextField, Box } from '@mui/material';

const BitbucketFieldExtension = (props: FieldExtensionComponentProps<any>) => {
  const { onChange, rawErrors, formData } = props;

  const [projects, setProjects] = useState<string[]>([]);
  const [repositories, setRepositories] = useState<string[]>([]);
  const [showSourceBranch, setShowSourceBranch] = useState(false);

  useEffect(() => {
    // Fetch Bitbucket projects on component mount
    const fetchProjects = async () => {
      try {
        const response = await fetch('/bitbucket-api/projects'); // Replace with actual API endpoint
        const data = await response.json();
        setProjects(data.map((project: any) => project.key));
      } catch (error) {
        console.error('Failed to fetch Bitbucket projects:', error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    // Restore repositories and showSourceBranch based on formData
    if (formData.projectKey) {
      const fetchRepositories = async () => {
        try {
          const response = await fetch(`/bitbucket-api/projects/${formData.projectKey}/repos`);
          const data = await response.json();
          setRepositories(data.map((repo: any) => repo.name));
        } catch (error) {
          console.error('Failed to fetch repositories:', error);
          setRepositories([]);
        }
      };

      fetchRepositories();
    }

    setShowSourceBranch(repositories.includes(formData.repoName || ""));
  }, [formData.projectKey, formData.repoName, repositories]);

  const handleProjectKeyChange = async (projectKey: string | null) => {
    if (projectKey) {
      onChange({ ...formData, projectKey, repoName: null, sourceBranch: null });

      // Fetch repositories for the selected projectKey
      try {
        const response = await fetch(`/bitbucket-api/projects/${projectKey}/repos`); // Replace with actual API endpoint
        const data = await response.json();
        setRepositories(data.map((repo: any) => repo.name));
        setShowSourceBranch(false);
      } catch (error) {
        console.error('Failed to fetch repositories:', error);
        setRepositories([]);
      }
    } else {
      onChange({ ...formData, projectKey: null, repoName: null, sourceBranch: null });
      setRepositories([]);
    }
  };

  const handleRepositoryChange = (repoName: string | null) => {
    if (repoName) {
      onChange({ ...formData, repoName });
      setShowSourceBranch(repositories.includes(repoName));
    } else {
      onChange({ ...formData, repoName: null, sourceBranch: null });
      setShowSourceBranch(false);
    }
  };

  const validateRepository = (value: string) => {
    return repositories.includes(value) || /^[a-zA-Z0-9_-]+$/.test(value);
  };

  const isProjectKeyValid = !!formData.projectKey;
  const isRepositoryValid = !!formData.repoName && validateRepository(formData.repoName);
  const isSourceBranchValid = showSourceBranch ? !!formData.sourceBranch : true;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Project Key Field */}
      <Autocomplete
        options={projects}
        value={formData.projectKey || ""}
        onChange={(event, value) => handleProjectKeyChange(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Bitbucket Project Key"
            required
            error={!isProjectKeyValid}
            helperText={!isProjectKeyValid ? "Project key is required" : rawErrors?.projectKey?.[0]}
          />
        )}
      />

      {/* Repository Field */}
      {repositories.length > 0 && (
        <Autocomplete
          options={repositories}
          value={formData.repoName || ""}
          onChange={(event, value) => handleRepositoryChange(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Bitbucket Repository"
              required
              error={!isRepositoryValid}
              helperText={
                !isRepositoryValid
                  ? formData.repoName
                    ? "Invalid repository name"
                    : "Repository is required"
                  : rawErrors?.repository?.[0]
              }
            />
          )}
        />
      )}

      {/* Source Branch Field */}
      {showSourceBranch && (
        <TextField
          label="Source Branch"
          value={formData.sourceBranch || ""}
          required
          error={!isSourceBranchValid}
          helperText={
            !isSourceBranchValid ? "Source branch is required" : rawErrors?.sourceBranch?.[0]
          }
          onChange={(event) => onChange({ ...formData, sourceBranch: event.target.value })}
        />
      )}
    </Box>
  );
};

export const bitbucketFieldExtension = {
  name: 'BitbucketFieldExtension',
  component: BitbucketFieldExtension,
};
