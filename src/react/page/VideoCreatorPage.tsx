import * as React from "react";
import { Input, Row, Col, Button, Navbar, NavItem, Preloader } from 'react-materialize';
import ParseData from "wl-parser";
import YoutubeEmbedVideo from "youtube-embed-video";
import { history } from '../../Routes';
import Helper from '../../Helper';
import Requests from '../../Requests';
import {IVideoData} from "../../Definition";

interface IProps {
}

interface IState {
    videoID: string;
    videoRetrived: boolean;
}

export default class VideoCreatorPage extends React.Component<IProps, IState> {
    firstName: string;
    profilePicture: string;
    facebookID: number;
    accessToken: string;
    facebookData;
    id;
    autoSaveTime = 10;
    setTimeOutId;

    constructor(props) {
        super(props);

        // update data with existing data
        let pathname = (this.props as any).location.pathname;
        this.id = pathname.split('/')[2];
        let videoRetrivedFlag = true;
        if (this.id) {
            videoRetrivedFlag = false;
        }

        this.state = {
            videoID: "",
            videoRetrived: videoRetrivedFlag
        }

        this.onTextChange = this.onTextChange.bind(this);
        this.submitClicked = this.submitClicked.bind(this);
    }

    componentDidMount() {
        // retrive the video data
        if (this.id) {
            Requests.getVideo(this.id)
                .then((data) => {
                    this.setState({
                        videoID: data.videoID,
                        videoRetrived: true
                    });
                })
        }
    }

    componentWillReceiveProps(nextProps) {
        var routeChanged = nextProps.location === (this.props as any).location;
        if (routeChanged) {
            let location = "/";
            history.push(location);
        }
    }

    onTextChange(e) {
        this.setState({
            videoID: e.target.value
        })
    }

    submitClicked(e) {
        this.addQuestionInDataBase().then(() => {
            let location = "/";
            history.push(location);
        })
    }

    addQuestionInDataBase() {
        //make post request for adding question
        let videoID = this.state.videoID;
        let data: IVideoData = {
            videoID: videoID,

        };
        data["videoID"] = videoID;

        if (this.id) {
            return Requests.updateNewVideo(data, this.id)
                .then((data) => {
                    this.id = data._id;
                })
        } else {
            return Requests.addNewVideo(data)
                .then((data) => {
                    this.id = data._id;
                })
        }
    }

    render() {
        if (!this.state.videoRetrived) {
            return <Row>
                <Col s={12} className="circleCenter">
                    <Preloader size='big' />
                </Col>
            </Row>
        }

        let videoPlayer = <div></div>;
        if (this.state.videoID.trim() !== "") {
            videoPlayer = <YoutubeEmbedVideo videoId={this.state.videoID} suggestions={false}></YoutubeEmbedVideo>
        }

        return (
            <div>
                <Row>
                    <Col s={6}>
                        <Input defaultValue={this.state.videoID} name="videoID" label="Video ID" s={6} onChange={this.onTextChange} />
                    </Col>
                </Row>
                <Row>
                    <Col s={6}>
                        {videoPlayer}
                    </Col>
                </Row>
                <Row>
                    <Col s={4}>
                        <Button waves='light' onClick={this.submitClicked}>submit</Button>
                    </Col>
                </Row>
            </div>
        )
    }
}