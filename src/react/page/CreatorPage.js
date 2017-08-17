import React, { Component } from "react";
import brace from 'brace';
import { Input, Row, Col, Button, Navbar, NavItem, Preloader } from 'react-materialize';
import config from '../../config';
import ImageUploaded from '../components/ImageUploaded';
import { Encoder } from 'node-html-encoder';
import { history, lastRoute } from '../../Routes';
import ParseData from "wl-parser";
import moment from "moment";
import AceEditorComp from "../components/creatorComponent/AceEditorComp";
import Request from "../../Requests";
import Helper from "../../Helper";


export default class HomePage extends Component {
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
            imageUploaded: [],
            htmlWritten: "",
            questionTitle: "",
            description: "",
            introImage: "",
            outputText: "",

            questionRetrived: true,
            loggedIn: false,
            dataRetrieved: false
        }

        // update data with existing data
        let pathname = this.props.location.pathname;
        this.id = pathname.split('/')[2];

        if (this.id) {
            this.state.questionRetrived = false;
        }

        this.onEditorChange = this.onEditorChange.bind(this);
        this.onOutputEditorChange = this.onOutputEditorChange.bind(this);
        this.onFileUploaded = this.onFileUploaded.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.onLoginClicked = this.onLoginClicked.bind(this);
        this.submitClicked = this.submitClicked.bind(this);
        this.onIntroImageAdded = this.onIntroImageAdded.bind(this);
        this.onIntroImageUploaded = this.onIntroImageUploaded.bind(this);
        this.onUploadFromURL = this.onUploadFromURL.bind(this);
        this.addImageToDisplay = this.addImageToDisplay.bind(this);
    }

    componentDidMount() {
        let template = require("../../templates/quiz").template;
        this.setState({
            htmlWritten: template
        })

        Helper.getLoginStatus()
            .then((response) => {
                return this.updateLoginDetails(response);
            })
            .catch((err) => {
                return new Error("Not logged in");
            })

        // retrieve the question
        if (this.id) {
            let url = config.restAPI + "/api/game/" + this.id;
            fetch(url, { method: 'GET' })
                .then(res => res.json())
                .then((data) => {
                    this.setState({
                        questionTitle: data.title,
                        description: data.description,
                        introImage: data.introImage,
                        outputText: data.outputText,
                        htmlWritten: data.dom,
                        questionRetrived: true
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

    onTextChange(e) {
        let value = e.currentTarget.value;
        let name = e.currentTarget.name;
        let tempObject = {};
        tempObject[name] = value;
        this.setState(tempObject);
    }

    onEditorChange(e) {
        this.setState({
            htmlWritten: e
        })

        clearTimeout(this.setTimeOutId);
        this.setTimeOutId = setTimeout(() => {
            this.addQuestionInDataBase();
            this.lastTime = moment();
            console.log("Question saved in DB");
        }, this.autoSaveTime * 1000);
    }

    onOutputEditorChange(e) {
        this.setState({
            outputText: e
        })

        clearTimeout(this.setTimeOutId);
        this.setTimeOutId = setTimeout(() => {
            this.addQuestionInDataBase();
            this.lastTime = moment();
            console.log("Question saved in DB");
        }, this.autoSaveTime * 1000);
    }

    onUploadFromURL(e) {
        let target = e.currentTarget.value;
        let postData = {};
        let maxWidth = "698px";
        let maxHeight = "367px";
        postData.url = target;
        postData.maxWidth = maxWidth;
        postData.maxHeight = maxHeight;
        postData.type = target.substr(target.lastIndexOf('.') + 1);



        Request.resizeImageRequest(postData)
            .then(this.addImageToDisplay);
    }

    onFileUploaded(e) {
        let target = e.currentTarget.files[0];
        let fileName = e.currentTarget.files[0].name;

        let reader = new FileReader();
        reader.onload = (event) => {
            let data = event.target.result.replace("data:" + target.type + ";base64,", '');
            let maxWidth = "698px";
            let maxHeight = "367px";

            let postData = {};
            postData.data = data;
            postData.maxWidth = maxWidth;
            postData.maxHeight = maxHeight;
            postData.type = fileName.substr(fileName.lastIndexOf('.') + 1);

            Request.resizeImageRequest(postData)
                .then(this.addImageToDisplay);
        }
        reader.readAsDataURL(target);
    }

    onIntroImageAdded(e) {
        let value = e.currentTarget.value;
        if (value.trim() === "" && value.match(/\.(jpeg|jpg|gif|png)$/) === null) {
            return;
        }

        let name = e.currentTarget.name;

        let url = config.restAPI + "/api/resizeImage";

        let bodydata = {};
        bodydata.url = value;
        bodydata.width = "800px";
        bodydata.height = "425px";
        Request.resizeImageRequest(bodydata)
            .then((data) => {
                this.setState({
                    introImage: data.location
                })
            });
    }

    onIntroImageUploaded(e) {
        let target = e.currentTarget.files[0];
        let fileName = e.currentTarget.files[0].name;

        let reader = new FileReader();
        reader.onload = (event) => {
            let data = event.target.result.replace("data:" + target.type + ";base64,", '');
            let postData = {};
            postData.data = data;
            postData.width = "800px";
            postData.height = "425px";

            Request.resizeImageRequest(postData)
                .then((data) => {
                    this.setState({
                        introImage: data.location
                    })
                });
        }
        reader.readAsDataURL(target);
    }

    addImageToDisplay(data) {
        let newArray = JSON.parse(JSON.stringify(this.state.imageUploaded));
        newArray.push(data.location);
        this.setState({
            imageUploaded: newArray
        })
    }

    onLoginClicked(e) {
        FB.login((response) => {
            if (response.status === 'connected') {
                this.updateLoginDetails(response);
            } else if (response.status === 'not_authorized') {
                // the user is logged in to Facebook, 
                // but has not authenticated your app
            } else {
                // the user isn't logged in to Facebook.
            }
        }, { scope: config.scope });
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

    submitClicked(e) {
        this.addQuestionInDataBase().then(() => {
            let location = "/";
            history.push(location);
        })
    }

    addQuestionInDataBase() {
        //make post request for adding question
        let questionTitle = this.state.questionTitle;
        let description = this.state.description;
        let introImage = this.state.introImage;
        let outputText = this.state.outputText;
        let questionHTML = this.state.htmlWritten;

        let data = {};
        data["title"] = questionTitle;
        data["description"] = description;
        data["introImage"] = introImage;
        data["outputText"] = outputText;
        data["dom"] = questionHTML;

        let method = 'POST';
        let url = config.restAPI + "/api/game";
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
        if (!this.state.questionRetrived) {
            return <Row>
                <Col s={12} className="circleCenter">
                    <Preloader size='big' />
                </Col>
            </Row>
        }

        let imageUploadComp = <div></div>
        if (this.state.imageUploaded.length > 0) {
            imageUploadComp = <ImageUploaded gameLink={this.state.imageUploaded} />
        }
        // sending encoded html
        let encoder = new Encoder('entity');
        let parsedData = this.state.htmlWritten;
        let parsedOutputData = this.state.outputText;
        if (this.state.dataRetrieved) {
            parsedData = this.facebookData.analizeDomElement(parsedData);
            parsedOutputData = this.facebookData.analizeDomElement(parsedOutputData);
        }
        let encodedHTML = encoder.htmlEncode(parsedData);
        encodedHTML = "data:text/html;charset=utf-8," + encodedHTML;

        let encodedOutputHTML = encoder.htmlEncode(parsedOutputData);
        encodedOutputHTML = "data:text/html;charset=utf-8," + encodedOutputHTML;

        let iframeHTML = "<iframe src='" + encodedHTML + "' style='width:698px; height:367px'/>";
        let iframeOutputHTML = "<iframe src='" + encodedOutputHTML + "' style='width:100%; height:100px'/>";
        let loginTag = <NavItem onClick={this.onLoginClicked}>login</NavItem>;
        if (this.state.loggedIn) {
            loginTag = <NavItem>
                <img className="iconImageSize circle" src={this.profilePicture} />
                <span className="basePadding">{this.firstName}</span>
            </NavItem>
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
                        <Row>
                            <Input defaultValue={this.state.questionTitle} name="questionTitle" label="Question Title" s={12} onChange={this.onTextChange} />
                        </Row>
                        <Row>
                            <Input defaultValue={this.state.description} name="description" label="Description" s={12} onChange={this.onTextChange} />
                        </Row>
                        <Row>
                            <Col s={3}>
                                <img src={this.state.introImage} className="introImage" />
                            </Col>
                            <Col s={9}>
                                <input type="file" id="introFileSelected" ref="introFileSelected" style={{ display: "none", alignSelf: "flex-end" }} onChange={this.onIntroImageUploaded} />
                                <Row className="flexDisplay">
                                    <Col s={4} className="flexCenter">
                                        <span><Button waves='light' onClick={() => { return this.refs.introFileSelected.click() }}>Browse</Button></span>
                                    </Col>
                                    <Col s={1} className="flexCenter">
                                        OR
                                    </Col>
                                    <Col s={7} className="flexCenter">
                                        <Input placeholder="Enter URL" s={12} onChange={this.onIntroImageAdded} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col s={12}>
                                        <div> {this.state.introImage} </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                    <Col s={5} offset="s1">
                        <input type="file" id="selectedFile" ref="selectedFile" style={{ display: "none", alignSelf: "flex-end" }} onChange={this.onFileUploaded} />
                        <Row className="flexDisplay">
                            <Col s={4} className="flexCenter">
                                <span><Button waves='light' onClick={() => { return this.refs.selectedFile.click() }}>Browse</Button></span>
                            </Col>
                            <Col s={1} className="flexCenter">
                                OR
                            </Col>
                            <Col s={7} className="flexCenter">
                                <Input placeholder="Enter URL" s={12} onChange={this.onUploadFromURL} />
                            </Col>
                        </Row>
                        {imageUploadComp}
                    </Col>
                </Row>
                <Row>
                    <Col s={12}>
                        <Row>
                            <Col s={3} className="outputText">
                                Output Text
                            </Col>
                        </Row>
                        <Row>
                            <Col s={6}>
                                <AceEditorComp value={this.state.outputText} onChange={this.onOutputEditorChange} height="100px" />
                            </Col>
                            <Col s={6}>
                                <div dangerouslySetInnerHTML={{ __html: iframeOutputHTML }}></div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className="relativePosition">
                    <Col s={12}>
                        <Row>
                            <Col s={3} className="outputText">
                                Dom Element
                            </Col>
                        </Row>
                        <Row>
                            <Col s={8}>
                                <AceEditorComp value={this.state.htmlWritten} onChange={this.onEditorChange} height="500px" />
                            </Col>
                            <Col s={4}>
                                <div className="iframeSize scaleDown" dangerouslySetInnerHTML={{ __html: iframeHTML }}></div>
                            </Col>
                        </Row>
                        <Row>
                            <Col s={4}>
                                <Button waves='light' onClick={this.submitClicked}>submit</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        )
    }
}