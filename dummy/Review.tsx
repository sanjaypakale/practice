import React from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, List, ListItem, ListItemText, Grid } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const sitMapping = [
  { component: "Component A", agent: "Agent-01", prescript: "Pre-script A", manifest: "Manifest A", postscript: "Post-script A", autoDeploy: "Yes" },
  { component: "Component B", agent: "Agent-02", prescript: "Pre-script B", manifest: "Manifest B", postscript: "Post-script B", autoDeploy: "No" },
];

const aldonMapping = [
  { fileType: "Type A", sourcePath: "/src/pathA", targetPath: "/target/pathA" },
  { fileType: "Type B", sourcePath: "/src/pathB", targetPath: "/target/pathB" },
];

const DataAccordion = () => {
  return (
    <div>
      {/* Repo Details */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Repo Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem><ListItemText primary="Bitbucket Project" secondary="Project Name" /></ListItem>
            <ListItem><ListItemText primary="Bitbucket Repository Name" secondary="Repo Name" /></ListItem>
            <ListItem><ListItemText primary="Contact Email" secondary="contact@example.com" /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Build Details */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Build Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem><ListItemText primary="Agent Name" secondary="Agent-01" /></ListItem>
            <ListItem><ListItemText primary="Build Command" secondary="npm run build" /></ListItem>
            <ListItem><ListItemText primary="Prescript" secondary="echo Pre-build script" /></ListItem>
            <ListItem><ListItemText primary="Postscript" secondary="echo Post-build script" /></ListItem>
            <ListItem><ListItemText primary="Sonar Command" secondary="sonar-scanner" /></ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* SIT Pipeline */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>SIT Pipeline</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Component</TableCell>
                  <TableCell>Agent Name</TableCell>
                  <TableCell>Prescript</TableCell>
                  <TableCell>Manifest Location</TableCell>
                  <TableCell>Postscript</TableCell>
                  <TableCell>Auto Deploy</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sitMapping.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.component}</TableCell>
                    <TableCell>{row.agent}</TableCell>
                    <TableCell>{row.prescript}</TableCell>
                    <TableCell>{row.manifest}</TableCell>
                    <TableCell>{row.postscript}</TableCell>
                    <TableCell>{row.autoDeploy}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

      {/* Veracode Pipeline */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Veracode Pipeline</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={6}><ListItemText primary="Veracode App Code" secondary="AppCode-123" /></Grid>
            <Grid item xs={6}><ListItemText primary="Veracode Agent Name" secondary="Veracode-Agent-01" /></Grid>
            <Grid item xs={6}><ListItemText primary="Veracode Environment" secondary="Prod" /></Grid>
            <Grid item xs={6}><ListItemText primary="Veracode Credentials ID" secondary="Veracode-123" /></Grid>
            <Grid item xs={6}><ListItemText primary="Release Type" secondary="Major" /></Grid>
            <Grid item xs={6}><ListItemText primary="Artifactory Module Name" secondary="Module-XYZ" /></Grid>
            <Grid item xs={6}><ListItemText primary="Artifactory Folder Name" secondary="/artifacts/module" /></Grid>
            <Grid item xs={6}><ListItemText primary="Veracode Component" secondary="Veracode-Component-01" /></Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default DataAccordion;
