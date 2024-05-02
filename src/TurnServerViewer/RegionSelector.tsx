import React, {ChangeEvent, Component} from 'react';
import {Autocomplete, FormControl, InputLabel, TextField} from "@mui/material";

interface RegionSelectorProps {
    regionChanged: (updatedRegion: string) => void;
}

interface RegionSelectorState {
    regions: string[];
    selectedRegion: string;
}

class RegionSelector extends Component<RegionSelectorProps, RegionSelectorState> {
    constructor(props: RegionSelectorProps) {
        super(props);

        this.state = {
            regions: [],
            selectedRegion: localStorage.getItem('region') || '',
        };
    }

    componentDidMount() {
        this.fetchRegionData();
    }

    async fetchRegionData() {
        try {
            const res = await fetch('https://api.regional-table.region-services.aws.a2z.com/index.jsons');
            if (!res.ok) {
                throw new Error(`Error fetching regions! ${res.status}: ${res.statusText}`);
            }
            const regionData = await res.json();

            const filteredRegions = regionData?.prices
                ?.filter((serviceData: any) => serviceData?.attributes['aws:serviceName'] === 'Amazon Kinesis Video Streams')
                .map((kinesisVideoServiceData: any) => kinesisVideoServiceData?.attributes['aws:region'])
                .filter((region: any) => region)
                .sort((region1: string, region2: string) => {
                    // Group regions based on prefixes in the following order:
                    const prefixOrder: { [prefix: string]: number } = {
                        "us": 1,
                        "ap": 2,
                        "eu": 3
                    };
                    const prefix1: string = region1.substring(0, 2);
                    const prefix2: string = region2.substring(0, 2);

                    // Compare prefixes based on defined order
                    const order1 = prefixOrder[prefix1] || Number.MAX_SAFE_INTEGER; // If prefix is not found, set to maximum value
                    const order2 = prefixOrder[prefix2] || Number.MAX_SAFE_INTEGER; // If prefix is not found, set to maximum value

                    if (order1 !== order2) {
                        return order1 - order2; // Sort based on prefix order
                    } else {
                        return region1.localeCompare(region2); // If prefixes are the same, sort alphabetically
                    }
                }) || [];

            this.setState({regions: filteredRegions});
        } catch (error) {
            alert(error);
        }
    }

    handleRegionChange = (_event: ChangeEvent<{}>, value: string | null) => {
        const selectedRegion = value || '';
        this.setState({selectedRegion});
        this.props.regionChanged(selectedRegion);
    };

    render() {
        return (
            <FormControl fullWidth sx={{minWidth: 160}}>
                <InputLabel id="region-input-label"></InputLabel>
                <Autocomplete
                    options={this.state.regions}
                    value={this.state.selectedRegion}
                    onChange={this.handleRegionChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="AWS Region*"
                        />
                    )}
                />
            </FormControl>
        );
    }
}

export default RegionSelector;
