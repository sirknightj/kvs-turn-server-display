import React from 'react';
import {IceServer} from "@aws-sdk/client-kinesis-video-signaling";
import {Box, Paper} from "@mui/material";
import TextWithCopyButton from "./TextWithCopyButton";

interface TurnServerDisplayProps {
    turnServer: IceServer;
    fetchedAt: Date;
}

interface TurnServerDisplayState {
    msRemaining: number;
}

class TurnServerDisplay extends React.Component<TurnServerDisplayProps, TurnServerDisplayState> {

    private expiringTimer: NodeJS.Timer | null;

    constructor(props: TurnServerDisplayProps) {
        super(props);

        this.expiringTimer = null;

        this.state = {
            msRemaining: this.calcMsRemaining(),
        }
    }

    calcMsRemaining = () => {
        const expiresAt = this.props.fetchedAt.getTime() + (this.props.turnServer.Ttl ?? 0) * 1000
        return expiresAt - new Date().getTime()
    }

    componentDidMount() {
        this.expiringTimer = setInterval(() => {
            const msRemaining = this.calcMsRemaining();
            if (msRemaining > 0) {
                this.setState({msRemaining: msRemaining});
            } else {
                this.setState({msRemaining: 0});
                if (this.expiringTimer) {
                    clearInterval(this.expiringTimer);
                    this.expiringTimer = null;
                }
            }
        }, 1000);
    }

    componentWillUnmount() {
        if (this.expiringTimer) {
            clearInterval(this.expiringTimer);
            this.expiringTimer = null;
        }
    }

    render() {
        const expiresAt = this.props.fetchedAt.getTime() + (this.props.turnServer.Ttl ?? 0) * 1000
        const msRemaining = expiresAt - new Date().getTime()

        return (
            <Box className="mb-3" sx={{overflowX: 'auto'}}>
                <Paper sx={{padding: 2}} elevation={4}>

                    <div style={{textAlign: 'center', marginBottom: '1rem'}}>
                        {this.state.msRemaining ?
                            <p>Session expires
                                at {this.props.fetchedAt.toLocaleString()} (in {Math.floor(msRemaining / 1000)}s)</p>
                            :
                            <p style={{color: 'red'}}>Expired!</p>
                        }
                    </div>

                    <h2 className="mb-2">TURN Server URIs</h2>
                    {this.props.turnServer.Uris?.map((line, index) => (
                        <TextWithCopyButton key={index} textToDisplay={line}/>
                    ))}

                    <h2 className="mb-2">Username</h2>
                    <TextWithCopyButton
                        textToDisplay={this.props.turnServer.Username ?? ''}/>

                    <h2 className="mb-2">Password</h2>
                    <TextWithCopyButton
                        textToDisplay={this.props.turnServer.Password ?? ''}/>
                </Paper>
            </Box>
        )
    }
}

export default TurnServerDisplay;
