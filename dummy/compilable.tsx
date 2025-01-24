import React, { useState } from 'react'

import { Content, Header, Page } from "@backstage/core-components"
import { Button, TextField } from '@material-ui/core'
import { useApi, alertApiRef, AlertMessage } from '@backstage/core-plugin-api';
import { Box, Typography, Grid, Card, CardContent, CardActionArea } from '@mui/material';
import CodeIcon from '@material-ui/icons/Code';
import GitHubIcon from '@material-ui/icons/GitHub';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

export const BitbucketAutomationComponent = () => {
    const [projectName, setProjectName] = useState('');
    const [repoName, setRepoName] = useState('');
    const alertApi = useApi(alertApiRef);

    const [selected, setSelected] = useState('Harness');

    // Options data
    const options = [
        {
            key: 'Harness',
            icon: <CodeIcon style={{ fontSize: 40, color: '#4a90e2' }} />,
            title: 'Harness Code Repository',
            description: 'Store pipeline in Harness repository',
        },
        {
            key: 'ThirdParty',
            icon: <GitHubIcon style={{ fontSize: 40, color: '#555' }} />,
            title: 'Third-party Git provider',
            description: 'Store pipeline in a third party Git provider',
        },
    ];

    const handleSubmit = () => {
        const alertMessage: AlertMessage = { message: "Project key is required ", severity: 'warning' }
        alertApi.post(alertMessage);
    }

    return (

        <>
            <Page themeId='tool'>
                <Header title="Bitbucket Automation" />
                <Content>
                    <TextField
                        fullWidth
                        variant='outlined'
                        margin='normal'
                        label="Project Name"
                        value={projectName}
                        onChange={e => setProjectName(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        variant='outlined'
                        margin='normal'
                        label="Repository Name"
                        value={repoName}
                        onChange={e => setRepoName(e.target.value)}
                    />
                    <Button color='primary' variant='contained' onClick={handleSubmit}>Create Repository</Button>
                    <Grid container spacing={2} justifyContent="center">
                        {options.map((option) => (
                            <Grid item xs={8} sm={4} key={option.key}>
                                <Card
                                    sx={{
                                        position: 'relative', 
                                        border: selected === option.key ? '1px solid #4a90e2' : '1px solid #ddd',
                                        backgroundColor: selected === option.key ? '#f5faff' : '#fff',
                                        borderRadius: '8px',
                                        boxShadow: selected === option.key ? '0 4px 8px rgba(74, 144, 226, 0.3)' : 'none',
                                        transition: '0.3s',
                                    }}
                                >
                                    <CardActionArea onClick={() => setSelected(option.key)}>
                                        {/* Checkmark for selected card */}
                                        {selected === option.key && (
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    color: '#4a90e2',
                                                }}
                                            >
                                                <CheckCircleIcon style={{ fontSize: 24 }} />
                                            </Box>
                                        )}
                                        <CardContent>
                                            <Box display="flex" alignItems="center" gap={2}>
                                                {option.icon}
                                                <Box>
                                                    <Typography variant="h6" color={selected === option.key ? '#4a90e2' : '#000'}>
                                                        {option.title}
                                                    </Typography>
                                                    <Typography variant="body2" color="#666">
                                                        {option.description}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Content>
            </Page>

        </>
    )
}
