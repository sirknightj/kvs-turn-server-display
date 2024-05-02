import React, {ChangeEvent} from 'react';
import {Autocomplete, FormControl, InputLabel, TextField} from "@mui/material";

interface SignalingChannelInputProps {
    signalingChannels: string[];
    signalingChannel: string;
    signalingChannelChanged: (updatedSignalingChannelName: string) => void;
    disabled: boolean;
}

class SignalingChannelInput extends React.Component<SignalingChannelInputProps, {}> {

    onSignalingChannelChanged = (_event: ChangeEvent<{}>, value: string | null) => {
        this.props.signalingChannelChanged(value || '');
    }

    render() {
        return (
            <FormControl fullWidth sx={{minWidth: 240}}>
                <InputLabel id="region-input-label"></InputLabel>
                <Autocomplete
                    disabled={this.props.disabled}
                    options={this.props.signalingChannels}
                    value={this.props.signalingChannel}
                    onChange={this.onSignalingChannelChanged}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Signaling Channel Name*"
                        />
                    )}
                />


            </FormControl>
        )
    }
}

export default SignalingChannelInput;
