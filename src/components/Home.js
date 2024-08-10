
import React, { useState } from 'react';
import { Button, Card, CardContent, Container, Box, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from "axios";


const Home = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [videoSize, setVideoSize] = useState(null);
    const [videoDuration, setVideoDuration] = useState(null);
    const [source, setSource] = useState();

    const handleFileChange = (event) => {
        console.log(event.target.files[0]);
        setSelectedFile(event.target.files[0]);

        const file = event.target.files[0];
        if (file) {
        const url = URL.createObjectURL(file);
        setSource(url);
          // Get the file size
          const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
          setVideoSize(sizeInMB);
    
          // Create a video element to get the duration
          const video = document.createElement('video');
          video.preload = 'metadata';
    
          video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src);
            const durationInSeconds = video.duration.toFixed(2);
            setVideoDuration(durationInSeconds);
          };
    
          video.src = URL.createObjectURL(file);
        }
    };

    const handleUpload = async () => {
        // Handle file upload logic here
        let formData = new FormData();

        // Adding files to the formdata
        formData.append("file", selectedFile);
        formData.append("name", "Robert");
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:8080/upload',
            headers: {
                'Content-Type': 'multipart/form-data',
                "Access-Control-Allow-Origin": "*"
            },
            data : formData
          };
        await axios(config)
            // Handle the response from backend here
            .then((res) => {
                console.log(JSON.stringify(res.data))
            })

            // Catch errors if any
            .catch((err) => {
                console.log(err)
            });
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
    padding: theme.spacing(1),
    textAlign: 'center',
    color: '#000',
    backgroundColor: '#ccc'
    }));

    return (
        <Container>
            <Box sx={{ bgcolor: '#fefefe', height: '100vh'  }}>
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"              
                >
                    <Grid item xs={6}>
                        <Item>
                            <form action="/upload" type="file" encType="multipart/form-data">
                                <Button
                                    component="label"
                                    role={undefined}
                                    variant="contained"
                                    tabIndex={-1}
                                    startIcon={<CloudUploadIcon />}
                                    >
                                    Select file
                                    <VisuallyHiddenInput type="file" accept=".mov,.mp4" onChange={handleFileChange} />
                                </Button>
                                <Button
                            component="label"
                            type='submit'
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            onClick={handleUpload}
                            startIcon={<CloudUploadIcon />}
                            >
                            Upload
                        </Button>
                            </form>
                        </Item>
                    </Grid>
                    <Grid item xs={6}>
                    <Item>

                        </Item>
                    </Grid>
                    <Grid height={300} item xs={12}>
                        {source && (
                        <Item>
                            <Card sx={{ width: 300 }}>
                                <video
                                    autoPlay
                                    width="100%"
                                    height={300}
                                    src={source}
                                    controls
                                />
                                <CardContent>
                                    <div>
                                        {selectedFile && <h6>You have selected {selectedFile.name}</h6>}
                                        {videoSize && <h6>Video Size: {videoSize} MB</h6>}
                                        {videoDuration && <h6>Video Duration: {videoDuration} seconds</h6>}
                                    </div>
                                </CardContent>
                            </Card>
                        </Item>
                        )}
                    </Grid>
                </Grid>
            </Box>
        </Container>

    );
};

export default Home;
