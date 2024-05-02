import React from "react";
import {Box, Button, Container, Paper, Typography} from "@mui/material";
import RegionSelector from "./RegionSelector";
import {Link} from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface ErrorScreenProps {
    error: string,
    regionChanged: (updatedRegion: string) => void
}

class ErrorScreen extends React.Component<ErrorScreenProps, {}> {
    render() {
        return <Container style={{
            minHeight: "100vh",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column"
        }}>
            <Paper elevation={3} style={{
                padding: "40px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                maxWidth: "50%"
            }}>
                <Box display="flex" flexDirection="column"
                     alignItems="center">
                    <Typography
                        className="mb-3"
                        variant="body1"
                        color="error">{this.props.error}</Typography>

                    <RegionSelector
                        regionChanged={this.props.regionChanged}/>

                    <Button
                        component={Link}
                        variant="contained"
                        color="primary"
                        to="/"
                        startIcon={<ArrowBackIcon/>}
                        sx={{mt: 2}}
                    >
                        Go back to Login
                    </Button>
                </Box>
            </Paper>
        </Container>;
    }
}

export default ErrorScreen;
