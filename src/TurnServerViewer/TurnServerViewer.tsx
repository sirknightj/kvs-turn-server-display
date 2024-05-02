import React from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    Paper,
    Typography
} from "@mui/material";
import SignalingChannelInput from "./SignalingChannelInput";
import {
    DescribeSignalingChannelCommand,
    DescribeSignalingChannelOutput,
    GetSignalingChannelEndpointCommand,
    GetSignalingChannelEndpointOutput,
    KinesisVideoClient,
    KinesisVideoClientConfig,
    ListSignalingChannelsCommand,
    ResourceEndpointListItem
} from "@aws-sdk/client-kinesis-video";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalStorageHelper from "../Utils/LocalStorageHelper";
import {
    GetIceServerConfigCommand,
    GetIceServerConfigCommandOutput,
    IceServer,
    KinesisVideoSignalingClient,
    KinesisVideoSignalingClientConfig
} from "@aws-sdk/client-kinesis-video-signaling";
import CredentialsValidator from "../Utils/CredentialsValidator";
import RegionSelector from "./RegionSelector";
import TurnServerDisplay from "./TurnServerDisplay";
import ErrorScreen from "./ErrorScreen";

interface TurnServerViewerState {
    validated: boolean;
    signalingChannel: string;
    error: string;
    signalingChannels: string[];
    iceServers: IceServer[] | null;
    fetchedAt: Date | null;
}

class TurnServerViewer extends React.Component<{}, TurnServerViewerState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            validated: false,
            error: '',
            signalingChannel: localStorage.getItem('signalingChannel') || '',
            signalingChannels: [],
            iceServers: null,
            fetchedAt: null,
        }
    }

    async componentDidMount() {
        await this.credentialsCheck();
    }

    async credentialsCheck() {
        const credentialsValid = await CredentialsValidator.areCredentialsValid();
        if (credentialsValid) {
            this.setState({validated: true, error: ''});

            this.fetchSignalingChannels();

        } else {
            this.setState({error: `Credentials are invalid, have expired, or your account does not have access to region ${LocalStorageHelper.loadRegionFromLocalStorage().region}. Please log in again.`})
        }
    }

    async fetchSignalingChannels() {
        if (!LocalStorageHelper.loadRegionFromLocalStorage()) {
            return;
        }

        const kinesisVideoClient = new KinesisVideoClient(
            LocalStorageHelper.getClientConfigFromLocalStorage()
        );

        const listSignalingChannelsCommand = new ListSignalingChannelsCommand({
            MaxResults: 1000,
        });

        const listSignalingChannelsResult = await kinesisVideoClient.send(listSignalingChannelsCommand);

        if (listSignalingChannelsResult.ChannelInfoList) {
            const channels: string[] = listSignalingChannelsResult.ChannelInfoList
                .filter(channelInfo => channelInfo.ChannelName !== undefined)
                .map(channelInfo => channelInfo.ChannelName!);
            this.setState({signalingChannels: channels});
        }
    }

    onSignalingChannelChanged = (updatedSignalingChannelName: string) => {
        LocalStorageHelper.saveSignalingChannelToLocalStorage(updatedSignalingChannelName);
        this.setState({
            signalingChannel: updatedSignalingChannelName,
            iceServers: null
        });
    }

    onRegionChanged = (updatedRegion: string) => {
        LocalStorageHelper.saveRegionToLocalStorage(updatedRegion);
        this.credentialsCheck();
        this.onSignalingChannelChanged('');
    }

    fetchTurnServers = async (role: 'MASTER' | 'VIEWER') => {
        this.setState({iceServers: []});

        if (!this.state.signalingChannel) {
            return;
        }

        const clientConfig = LocalStorageHelper.getClientConfigFromLocalStorage();

        const kinesisVideoClient = new KinesisVideoClient({...clientConfig} as KinesisVideoClientConfig);

        const describeSignalingChannelResponse: DescribeSignalingChannelOutput = await kinesisVideoClient.send(
            new DescribeSignalingChannelCommand({ChannelName: this.state.signalingChannel}) as DescribeSignalingChannelCommand
        );

        const channelARN: string = describeSignalingChannelResponse!.ChannelInfo!.ChannelARN!;

        const getSignalingChannelEndpointResponse: GetSignalingChannelEndpointOutput = await kinesisVideoClient.send(
            new GetSignalingChannelEndpointCommand({
                ChannelARN: channelARN,
                SingleMasterChannelEndpointConfiguration: {
                    Protocols: ['HTTPS'],
                    Role: role,
                },
            })
        );

        const endpointsByProtocol = getSignalingChannelEndpointResponse!.ResourceEndpointList!.reduce<Record<string, string>>((endpoints, endpoint: ResourceEndpointListItem) => {
            endpoints[endpoint!.Protocol!] = endpoint!.ResourceEndpoint!;
            return endpoints;
        }, {});

        const kinesisVideoSignalingClient = new KinesisVideoSignalingClient({
            ...clientConfig,
            endpoint: endpointsByProtocol.HTTPS
        } as KinesisVideoSignalingClientConfig);

        const getIceServerConfigResponse: GetIceServerConfigCommandOutput = await kinesisVideoSignalingClient.send(
            new GetIceServerConfigCommand({
                ChannelARN: channelARN,
            })
        );
        this.setState({
            iceServers: getIceServerConfigResponse!.IceServerList ?? null,
            fetchedAt: new Date(),
        });
    }

    render() {
        if (this.state.error) {
            return (
                <ErrorScreen error={this.state.error}
                             regionChanged={this.onRegionChanged}/>
            )
        }
        if (!this.state.validated) {
            return (
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    style={{minHeight: '100vh'}}
                >
                    <Grid item>
                        <CircularProgress size={100}/>
                    </Grid>
                </Grid>
            );
        }
        return (
            <Container maxWidth={false}
                       sx={{
                           display: 'flex',
                           flexDirection: 'column',
                           alignItems: 'center',
                           background: 'linear-gradient(to top right, #4d23ab, #a266fe)',
                           height: '100vh',
                           overflow: 'auto'
                       }}>
                <Box mt={4} mb={4} sx={{width: '100%'}}>
                    <Paper elevation={3} sx={{p: 3}}>
                        <Grid container direction="row" spacing={2}
                              alignItems="center" wrap="wrap">
                            <Grid item xs={12} sm={6} md={3}>
                                <RegionSelector
                                    regionChanged={this.onRegionChanged}/>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <SignalingChannelInput
                                    disabled={!Boolean(LocalStorageHelper.loadRegionFromLocalStorage())}
                                    signalingChannel={this.state.signalingChannel}
                                    signalingChannelChanged={this.onSignalingChannelChanged}
                                    signalingChannels={this.state.signalingChannels}
                                />
                            </Grid>
                            <Grid xs={1} sm={1} md={1} item>
                            </Grid>
                            <Grid item>
                                <Typography variant="h6">Create a TURN server
                                    session</Typography>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    style={{boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)'}}
                                    disabled={!Boolean(this.state.signalingChannel)}
                                    endIcon={<ArrowForwardIcon/>}
                                    onClick={() => this.fetchTurnServers('MASTER')}
                                >
                                    Master
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    style={{
                                        marginLeft: 20,
                                        boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
                                    }}
                                    disabled={!Boolean(this.state.signalingChannel)}
                                    endIcon={<ArrowForwardIcon/>}
                                    onClick={() => this.fetchTurnServers('VIEWER')}
                                >
                                    Viewer
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>

                {
                    this.state.iceServers ?
                        this.state.iceServers.length ?
                            <Container>
                                {this.state.iceServers.map((iceServer, idx) =>
                                    <TurnServerDisplay key={idx}
                                                       turnServer={iceServer}
                                                       fetchedAt={this.state.fetchedAt ?? new Date()}/>)}
                            </Container>
                            :
                            <Container style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '50%'
                            }}>
                                <CircularProgress size="30vh"
                                                  sx={{color: 'white'}}/>
                            </Container>
                        :
                        null
                }
            </Container>
        )
    }
}

export default TurnServerViewer;
