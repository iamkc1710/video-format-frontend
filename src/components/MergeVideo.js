import React, { useState } from 'react';
import { Button, Container, Box, Grid, Snackbar, Stack, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from "axios";

const MergeVideo = () => {
    const [firstSelectedFile, setFirstSelectedFile] = useState(null);
    const [secondSelectedFile, setSecondSelectedFile] = useState(null);
    const [showSnackBar, setShowSnackBar] = useState(false);
    const [messageInfo, setMessageInfo] = useState('');
    const handleFirstFileChange = (event) => {

        const file = event.target.files[0];
        if (file) {
            setFirstSelectedFile(file);
          // Get the file size
        }
    };
    const handleSecondFileChange = (event) => {

        const file = event.target.files[0];
        if (file) {
            setSecondSelectedFile(file);
          // Get the file size
        }
    };
    const handleMerge = async () => {

        // Handle file upload logic here
        let formData = new FormData();

        // Adding files to the formdata
        formData.append("file", firstSelectedFile);
        formData.append("file", secondSelectedFile);
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:8080/merge',
            headers: {
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImlhbWtjMTcxMCIsInBhc3N3b3JkIjoiVmlkZW9BcHBAITIzIiwiaWF0IjoxNzIzMjY0ODg2fQ.NxYDao5daLR3YGX1cXFrBYSvGv0bki9VppyxEAKWV_I",
                'Content-Type': 'multipart/form-data',
                "Access-Control-Allow-Origin": "*"
            },
            data : formData
          };
        await axios(config)
            // Handle the response from backend here
            .then(async (res) => {
                setMessageInfo(await res.data);
                setShowSnackBar(true);
            })

            // Catch errors if any
            .catch((err) => {
                console.log(err);
                if (err.response.status === 401) {
                    setMessageInfo('User Not Authenticated');
                    setShowSnackBar(true);
                    return;
                }
                setMessageInfo('Error uploading file');
                setShowSnackBar(true);
            });
    };

    const handleCloseSnackbar = () => {
        setShowSnackBar(false);
        setMessageInfo('');
    }

    const Item = styled(Paper)(({ theme }) => ({
        padding: theme.spacing(12),
        margin: theme.spacing(3),
        textAlign: 'center'
        }));

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
    return (
        <Container>
            <Box sx={{ bgcolor: '#fff', height: '100vh'  }}>
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"              
                >
                    <Grid item xs={12}>
                        <Item>
                            <h1>Merge Videos</h1>
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
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<CloudUploadIcon />}
                                    >
                                        Select first file
                                        <VisuallyHiddenInput type="file" accept=".mov,.mp4" onChange={handleFirstFileChange} />
                                    </Button>
                                    <Button
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<CloudUploadIcon />}
                                    >
                                        Select second file
                                        <VisuallyHiddenInput type="file" accept=".mov,.mp4" onChange={handleSecondFileChange} />
                                    </Button>
                                    <Button
                                        component="label"
                                        type='submit'
                                        variant="contained"
                                        tabIndex={-1}
                                        disabled={firstSelectedFile === null || secondSelectedFile === null}
                                        onClick={handleMerge}
                                        startIcon={<CloudUploadIcon />}
                                    >
                                        Merge
                                    </Button>
                                </Stack>
                            </form>
                            {firstSelectedFile && (
                                <div>
                                    <p>Your first selected file is {firstSelectedFile.name}.</p>
                                </div>
                            )}
                            {secondSelectedFile && (
                                <div>
                                    <p>Your second selected file is {secondSelectedFile.name}.</p>
                                </div>
                            )}
                        </Item>
                    </Grid>

                    <Snackbar
                        open={showSnackBar}
                        onClose={handleCloseSnackbar}
                        message={messageInfo}
                        autoHideDuration={6000}
                        key="topcenter"
                    />
                </Grid>
            </Box>
        </Container>
    );
};

export default MergeVideo;