import React, { useState, useEffect } from 'react';
import { Button, Container, Box, Grid, Paper, Snackbar, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachFileIcon  from '@mui/icons-material/AttachFile';
import axios from "axios";

const Home = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [videoSize, setVideoSize] = useState(null);
    const [videoDuration, setVideoDuration] = useState(null);
    const [source, setSource] = useState();
    const [showSnackBar, setShowSnackBar] = useState(false);
    const [messageInfo, setMessageInfo] = useState('');
    const [isFileValid, setIsFileValid] = useState(true);

    useEffect(() => {
        setupJWToken();
    }, []);

    const setupJWToken = async () => {
        try {
            const response = await axios.post('http://localhost:8080/', {
                username: 'iamkc1710',
                password: 'VideoApp@!23'
            });
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
            if (sizeInMB > 25) {
                setIsFileValid(false);
                setMessageInfo('File size should not exceed 25MB');
                setShowSnackBar(true);
                return;
            }

            const url = URL.createObjectURL(file);
            const video = document.createElement('video');
            video.preload = 'metadata';

            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                const durationInSeconds = video.duration.toFixed(2);
                if (durationInSeconds > 30) {
                    setIsFileValid(false);
                    setMessageInfo('Video duration should not exceed 30 seconds');
                    setShowSnackBar(true);
                    return;
                }
                setSelectedFile(file);
                setSource(url);
                setVideoSize(sizeInMB);
                setVideoDuration(durationInSeconds);
            };

            video.src = URL.createObjectURL(file);
        }
    };

    const handleCloseSnackbar = () => {
        setShowSnackBar(false);
        setMessageInfo('');
    }

    const handleUpload = async () => {
        if (!isFileValid) {
            setMessageInfo('Please select a valid file');
            setShowSnackBar(true);
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);

            const response = await axios.post('http://localhost:8080/upload', formData, {
                headers: {
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImlhbWtjMTcxMCIsInBhc3N3b3JkIjoiVmlkZW9BcHBAITIzIiwiaWF0IjoxNzIzMjY0ODg2fQ.NxYDao5daLR3YGX1cXFrBYSvGv0bki9VppyxEAKWV_I",
                    'Content-Type': 'multipart/form-data',
                    "Access-Control-Allow-Origin": "*"
                }
            });

            setMessageInfo(response.data);
            setShowSnackBar(true);
        } catch (error) {
            console.log(error);
            if (error.response && error.response.status === 401) {
                setMessageInfo('User Not Authenticated');
                setShowSnackBar(true);
                return;
            }
            setMessageInfo('Error uploading file');
            setShowSnackBar(true);
        }
    };

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const Item = styled(Paper)(({ theme }) => ({
        padding: theme.spacing(12),
        margin: theme.spacing(3),
        textAlign: 'center'
    }));

    return (
        <Container>
            <Box sx={{ bgcolor: '#fff', height: '100vh' }}>
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item xs={12}>
                        <Item>
                            <h1>Upload Video</h1>
                        </Item>
                    </Grid>
                    <Grid item xs={12}>
                        <Item>
                            <form action="/upload" type="file" encType="multipart/form-data">
                                <Stack
                                    direction="row"
                                    justifyContent="center"
                                    alignItems="center"
                                    spacing={12}
                                >
                                    <Button
                                        color={isFileValid ? 'primary' : 'error'}
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        margin="dense"
                                        startIcon={<AttachFileIcon />}
                                    >
                                        Select file
                                        <VisuallyHiddenInput type="file" accept=".mov,.mp4" onChange={handleFileChange} />
                                    </Button>
                                    <Button
                                        component="label"
                                        color='secondary'
                                        type='submit'
                                        variant="contained"
                                        tabIndex={-1}
                                        margin="dense"
                                        onClick={handleUpload}
                                        startIcon={<CloudUploadIcon />}
                                    >
                                        Upload
                                    </Button>
                                </Stack>
                            </form>
                            {source && (
                                <div>
                                    {isFileValid && <p>You have selected {selectedFile.name}. Video Size: {videoSize} MB. Video Duration: {videoDuration} seconds </p>}
                                </div>
                            )}
                        </Item>
                    </Grid>
                    <Snackbar
                        open={showSnackBar}
                        onClose={handleCloseSnackbar}
                        message={messageInfo}
                        autoHideDuration={10000}
                        key="topcenter"
                    />
                </Grid>
            </Box>
        </Container>
    );
};

export default Home;
