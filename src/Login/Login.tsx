import React from 'react';
import CredentialsProvider from "./CredentialsProvider";
import 'bootstrap/dist/css/bootstrap.min.css';
import LocalStorageHelper from "../Utils/LocalStorageHelper";
import {Box, Button, Container, Paper} from "@mui/material";
import {Link} from "react-router-dom";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import './Login.modules.css';

interface LoginState {
    animationState: number;
}

class Login extends React.Component<{}, LoginState> {
    private animationTimer: NodeJS.Timer | null;

    constructor(props: {}) {
        super(props);

        this.state = {
            animationState: 0,
        }

        this.animationTimer = setTimeout(() => {
            this.setState({animationState: this.state.animationState + 1});
        }, 1500);
    }

    animationFinished = () => {
        // Advance to the next animation
        this.setState({animationState: this.state.animationState + 1});
    }

    componentWillUnmount() {
        if (this.animationTimer) {
            clearInterval(this.animationTimer);
            this.animationTimer = null;
        }
    }

    onUpdatedCredentials = (akid: string,
                            skid: string,
                            stid: string) => {
        LocalStorageHelper.saveCredentialsToLocalStorage(akid, skid, stid);
        this.forceUpdate();
    }

    render() {
        const creds = LocalStorageHelper.loadCredentialsFromLocalStorage();
        const disableLoginButton = !Boolean(creds.credentials.accessKeyId) || !Boolean(creds.credentials.secretAccessKey);

        return (
            <Container
                maxWidth={false}
                style={{
                    height: '100vh',
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'radial-gradient(circle, #FFD166, #6930C3)'
                }}>

                <Paper elevation={3} style={{
                    padding: '40px',
                    display: 'flex',
                    background: 'linear-gradient(to top right, #4d23ab, #a266fe)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '20px',
                }}>

                    <div className={this.state.animationState >= 2 ? 'shine' : ''} />

                    <Box display="flex"
                         flexDirection="column"
                         alignItems="center">
                        <h2
                            style={{
                                color: 'white',
                                transform: this.state.animationState >= 1 ? 'translateY(0)' : 'translateY(15px)',
                                transition: 'transform 0.5s ease-in-out',
                            }}
                            onTransitionEnd={this.animationFinished}
                        >
                            <b>KVS WebRTC TURN Server Fetcher</b>
                        </h2>
                        <p
                            style={{
                                color: 'white',
                                opacity: this.state.animationState >= 1 ? 1 : 0,
                                transition: 'opacity 0.5s ease-in-out',
                                transform: this.state.animationState ? 'translateY(0)' : 'translateY(15px)',
                                transitionDelay: this.state.animationState >= 1 ? '0.5s' : '0s',
                            }}
                        >
                            A handy tool to generate temporary TURN server
                            sessions!
                        </p>

                        <CredentialsProvider
                            credentialsChanged={this.onUpdatedCredentials}/>

                        <Button component={Link}
                                to="/turn"
                                variant="contained"
                                color="primary"
                                className="mt-2 buttonWithHover"
                                disabled={disableLoginButton}
                                endIcon={<ArrowForwardIcon/>}>
                            Authenticate
                        </Button>
                    </Box>
                </Paper>
            </Container>
        );
    }
}

export default Login;
