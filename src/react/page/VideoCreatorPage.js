import React, { Component } from "react";
import { Input, Row, Col, Button, Navbar, NavItem, Preloader } from 'react-materialize';
import config from '../../config';
import ParseData from "wl-parser";
import YoutubeEmbedVideo from "youtube-embed-video";
import { history } from '../../Routes';

export default class VideoCreatorPage extends Component {
    firstName;
    profilePicture;
    facebookID;
    accessToken;
    facebookData;
    id;
    autoSaveTime = 10;
    setTimeOutId;

    constructor(props) {
        super(props);
        this.state = {
            videoID: "",
            videoRetrived: true
        }

        this.onTextChange = this.onTextChange.bind(this);
        this.submitClicked = this.submitClicked.bind(this);

        // update data with existing data
        let pathname = this.props.location.pathname;
        this.id = pathname.split('/')[2];

        if (this.id) {
            this.state.videoRetrived = false;
        }
    }

    componentDidMount() {
        FB.init({
            appId: config.appID,
            xfbml: true,
            version: 'v2.9',
            status: true
        });
        FB.getLoginStatus((response) => {
            if (response.status === 'connected') {
                this.updateLoginDetails(response);
            } else if (response.status === 'not_authorized') {
                console.log("User is not authorised");
            } else {
                console.log("Unknown status");
            }
        });

        // retrive the video data
        if (this.id) {
            let url = config.restAPI + "/api/video/" + this.id;
            fetch(url, { method: 'GET' })
                .then(res => res.json())
                .then((data) => {
                    this.setState({
                        videoID: data.videoID,
                        videoRetrived: true
                    });
                })
        }
    }

    componentWillReceiveProps(nextProps) {
        var routeChanged = nextProps.location === this.props.location
        if (routeChanged) {
            let location = "/";
            history.push(location);
        }
    }

    updateLoginDetails(response) {
        var uid = response.authResponse.userID;
        var accessToken = response.authResponse.accessToken;
        FB.api('me?fields=first_name,picture', (response) => {
            this.firstName = response.first_name;
            this.profilePicture = response.picture.data.url;
            this.facebookID = uid;
            this.accessToken = accessToken;
            this.setState({
                loggedIn: true
            })

            let postData = {};
            postData.id = uid;
            postData.accessToken = accessToken;
            let url = `${config.restAPI}/api/facebook`;
            fetch(url, {
                method: "POST",
                body: JSON.stringify(postData),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            })
                .then(res => res.json())
                .then((data) => {
                    this.facebookData = new ParseData(data, Date.now());
                    return this.facebookData.makeConnections().then(() => {
                        this.setState({
                            dataRetrieved: true
                        })
                    })
                })
        });
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
        let data = {};
        data["videoID"] = videoID;

        let method = 'POST';
        let url = config.restAPI + "/api/video";
        if (this.id) {
            method = 'PUT';
            url += "/" + this.id;
        }
        return fetch(url, {
            method: method,
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(res => res.json())
            .then((data) => {
                this.id = data._id;
            })
    }

    render() {
        if (!this.state.videoRetrived) {
            return <Row>
                <Col s={12} className="circleCenter">
                    <Preloader size='big' />
                </Col>
            </Row>
        }

        let loginTag = <NavItem onClick={this.onLoginClicked}>login</NavItem>;
        if (this.state.loggedIn) {
            loginTag = <NavItem>
                <img className="iconImageSize circle" src={this.profilePicture} />
                <span className="basePadding">{this.firstName}</span>
            </NavItem>
        }

        let videoPlayer = <div></div>;
        if (this.state.videoID.trim() !== "") {
            videoPlayer = <YoutubeEmbedVideo videoId={this.state.videoID} suggestions={false}></YoutubeEmbedVideo>
        }

        return (
            <div>
                <Row>
                    <Navbar className="backgroundColor" brand='logo' right>
                        {loginTag}
                    </Navbar>
                </Row>
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