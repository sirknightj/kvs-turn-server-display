import React from 'react';
import {Stack, TextField} from "@mui/material";
import LocalStorageHelper from "../Utils/LocalStorageHelper";

interface CredentialsProviderProps {
    credentialsChanged: (akid: string,
                         skid: string,
                         stid: string) => void;
}

interface CredentialsProviderState {
    accessKey: string;
    secretKey: string;
    sessionToken: string;
}

class RegionSelector extends React.Component<CredentialsProviderProps, CredentialsProviderState> {
    constructor(props: CredentialsProviderProps) {
        super(props);

        const creds = LocalStorageHelper.loadCredentialsFromLocalStorage().credentials;

        this.state = {
            accessKey: creds.accessKeyId,
            secretKey: creds.secretAccessKey,
            sessionToken: creds.sessionToken
        };
    }

    accessKeyChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({accessKey: event.target.value})
        this.props.credentialsChanged(event.target.value, this.state.secretKey, this.state.sessionToken);
    }

    secretKeyChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({secretKey: event.target.value})
        this.props.credentialsChanged(this.state.accessKey, event.target.value, this.state.sessionToken);
    }

    sessionTokenChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({sessionToken: event.target.value})
        this.props.credentialsChanged(this.state.accessKey, this.state.secretKey, event.target.value);
    }

    render() {
        return (
            <Stack style={{width: '100%'}}>

                <TextField type="text" label="Access Key*" className="mb-2"
                           onChange={this.accessKeyChanged}
                           value={this.state.accessKey}
                           InputLabelProps={{style: {color: '#aab'}}}
                           InputProps={{
                               style: {
                                   color: 'white',
                                   backgroundColor: '#232F3E'
                               }
                           }}
                />

                <TextField type="password" label="Secret Key*"
                           className="mb-2"
                           onChange={this.secretKeyChanged}
                           value={this.state.secretKey}
                           InputLabelProps={{style: {color: '#aab'}}}
                           InputProps={{
                               style: {
                                   color: 'white',
                                   backgroundColor: '#232F3E'
                               }
                           }}
                />

                <TextField type="password"
                           label="Session Token (optional)"
                           className="mb-2"
                           onChange={this.sessionTokenChanged}
                           value={this.state.sessionToken}
                           InputLabelProps={{style: {color: '#aab'}}}
                           InputProps={{
                               style: {
                                   color: 'white',
                                   backgroundColor: '#232F3E'
                               }
                           }}
                />
            </Stack>
        );
    }
}

export default RegionSelector;
