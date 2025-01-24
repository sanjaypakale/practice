import React, { useState } from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const RepositoryDetail = ({ onComplete }) => {
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
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
      {/* Bitbucket Projects */}
      <FormControl size="small" fullWidth>
        <InputLabel id="bitbucket-projects-label">Bitbucket Projects</InputLabel>
        <Select
          labelId="bitbucket-projects-label"
          id="bitbucket-projects"
          value={project}
          onChange={handleProjectChange}
          label="Bitbucket Projects"
        >
          {bitbucketProjects.map((proj, index) => (
            <MenuItem key={index} value={proj}>
              {proj}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Bitbucket Repositories */}
      <FormControl size="small" fullWidth>
        <InputLabel id="bitbucket-repositories-label">
          Bitbucket Repositories
        </InputLabel>
        <Select
          labelId="bitbucket-repositories-label"
          id="bitbucket-repositories"
          value={repository}
          onChange={handleRepositoryChange}
          label="Bitbucket Repositories"
        >
          {bitbucketRepositories.map((repo, index) => (
            <MenuItem key={index} value={repo}>
              {repo}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Contact Detail */}
      <TextField
        id="contact-detail"
        label="Contact Detail"
        variant="outlined"
        size="small"
        value={contact}
        onChange={handleContactChange}
        fullWidth
      />
    </Box>
  );
};

export default RepositoryDetail;
