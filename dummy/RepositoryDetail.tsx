import React, { useState } from "react";
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";

const RepositoryDetail = () => {
  const [project, setProject] = useState("");
  const [repository, setRepository] = useState("");
  const [contact, setContact] = useState("");

  // Sample data for dropdowns
  const bitbucketProjects = ["Project A", "Project B", "Project C"];
  const bitbucketRepositories = ["Repo 1", "Repo 2", "Repo 3"];

  const handleProjectChange = (event) => {
    setProject(event.target.value);
  };

  const handleRepositoryChange = (event) => {
    setRepository(event.target.value);
  };

  const handleContactChange = (event) => {
    setContact(event.target.value);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "300px" }}>
      {/* Bitbucket Projects */}
      <Box>
        <Typography variant="subtitle2" sx={{ marginBottom: 0.5 }}>
          Bitbucket Projects
        </Typography>
        <FormControl size="small" fullWidth>
          <Select
            id="bitbucket-projects"
            value={project}
            onChange={handleProjectChange}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select a project
            </MenuItem>
            {bitbucketProjects.map((proj, index) => (
              <MenuItem key={index} value={proj}>
                {proj}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Bitbucket Repositories */}
      <Box>
        <Typography variant="subtitle2" sx={{ marginBottom: 0.5 }}>
          Bitbucket Repositories
        </Typography>
        <FormControl size="small" fullWidth>
          <Select
            id="bitbucket-repositories"
            value={repository}
            onChange={handleRepositoryChange}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select a repository
            </MenuItem>
            {bitbucketRepositories.map((repo, index) => (
              <MenuItem key={index} value={repo}>
                {repo}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Contact Detail */}
      <Box>
        <Typography variant="subtitle2" sx={{ marginBottom: 0.5 }}>
          Contact Detail
        </Typography>
        <TextField
          id="contact-detail"
          variant="outlined"
          size="small"
          value={contact}
          onChange={handleContactChange}
          fullWidth
        />
      </Box>
    </Box>
  );
};

export default RepositoryDetail;
