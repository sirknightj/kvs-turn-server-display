import React from 'react';
import {Button, Container, Typography} from "@mui/material";
import {toast} from "react-toastify";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface TurnServerDisplayProps {
    textToDisplay: string;
}

class TurnServerDisplay extends React.Component<TurnServerDisplayProps, {}> {

    copyText = async () => {
        try {
            await navigator.clipboard.writeText(this.props.textToDisplay);
            toast.success('Copied to clipboard!', {autoClose: 750});
        } catch (error: any) {
            toast.error((error instanceof Error) ? (error as Error).message : 'An unknown error occurred');
        }
    }

    render() {
        return (
            <Container style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginBottom: 20,
            }}>
                <Typography style={{
                    flex: 1,
                    maxWidth: 'calc(100% - 140px)',
                    marginRight: '1rem',
                    overflowWrap: 'break-word',
                    wordWrap: 'break-word' // For browser compatibility
                }}>
                    {this.props.textToDisplay}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    style={{
                        boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)'
                    }}
                    endIcon={<ContentCopyIcon/>}
                    onClick={this.copyText}
                >
                    Copy
                </Button>
            </Container>
        )
    }
}

export default TurnServerDisplay;
