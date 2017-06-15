import React, { Component } from "react";
import brace from 'brace';
import AceEditor from 'react-ace';
import { Input, Row, Col, Button, Navbar, NavItem, Preloader } from 'react-materialize';
import config from '../../config';
import ImageUploaded from '../components/ImageUploaded';
import InnerHtml from '../components/InnerHtml';
import { Encoder } from 'node-html-encoder';
// import htmlBeautify from 'html-beautify';
import htmlBeautify from 'beautify';
import { history } from '../../Routes';
import ParseData from "wl-parser";
import moment from "moment";

import 'brace/mode/html';
import 'brace/theme/github';

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
        this.onFileUploaded = this.onFileUploaded.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.onLoginClicked = this.onLoginClicked.bind(this);
        this.submitClicked = this.submitClicked.bind(this);
    }

    componentDidMount() {
        let template = require("../../templates/quiz").template;
        this.setState({
            htmlWritten: template
        })
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

        if (this.id) {
            let url = config.restAPI + "/api/game/" + this.id;
            fetch(url, { method: 'GET' })
                .then(res => res.json())
                .then((data) => {
                    let beautifiedText = htmlBeautify(data.dom, { format: 'css' });
                    beautifiedText = htmlBeautify(beautifiedText, { format: 'html' });
                    this.setState({
                        questionTitle: data.title,
                        introImage: data.introImage,
                        outputText: data.outputText,
                        htmlWritten: beautifiedText,
                        questionRetrived: true
                    });
                })
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

    onFileUploaded(e) {
        let target = e.currentTarget.files[0];
        let fileName = e.currentTarget.files[0].name;
        let url = config.restAPI + "/api/aws?file-name=" + fileName + "&file-type=" + target.type;
        fetch(url, { method: 'GET' })
            .then(res => res.json())
            .then((data) => {
                this.uploadFile(target, data.signedRequest, data.url)
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
                    this.setState({
                        dataRetrieved: true
                    })
                })
        });
    }

    uploadFile(file, signedURL, url) {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', signedURL, true);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    let newArray = JSON.parse(JSON.stringify(this.state.imageUploaded));
                    newArray.push(url);
                    this.setState({
                        imageUploaded: newArray
                    })

                }
                else {
                    alert('Could not upload file.');
                }
            }
        };
        xhr.send(file);
    }

    submitClicked(e) {
        this.addQuestionInDataBase();
        let location = "/";
        history.push(location)
    }

    addQuestionInDataBase() {
        //make post request for adding question
        let questionTitle = this.state.questionTitle;
        let introImage = this.state.introImage;
        let outputText = this.state.outputText;
        let questionHTML = this.state.htmlWritten;

        let data = {};
        data["title"] = questionTitle;
        data["introImage"] = introImage;
        data["outputText"] = outputText;
        data["dom"] = questionHTML;

        let method = 'POST';
        let url = config.restAPI + "/api/game";
        if (this.id) {
            method = 'PUT';
            url += "/" + this.id;
        }
        fetch(url, {
            method: method,
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(res => res.json())
            .then((data) => {
                console.log(data);
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

        let imgUploadComp = <div></div>
        if (this.state.imageUploaded.length > 0) {
            imgUploadComp = <ImageUploaded gameLink={this.state.imageUploaded} />;
        }

        // sending data to iframe
        let iframeData = JSON.stringify(this.facebookData);


        // sending encoded html
        let encoder = new Encoder('entity');
        let parsedData = this.state.htmlWritten;
        if (this.state.dataRetrieved) {
            parsedData = this.facebookData.analizeDomElement(parsedData);
        }
        let encodedHTML = encoder.htmlEncode(parsedData);
        encodedHTML = "data:text/html;charset=utf-8," + encodedHTML;

        let iframeHTML = "<iframe name='" + iframeData + "' src='" + encodedHTML + "' style='width:100%; height:367px'/>";
        let loginTag = <NavItem onClick={this.onLoginClicked}>login</NavItem>;
        if (this.state.loggedIn) {
            loginTag = <NavItem>
                <img className="imageSize circle" src={this.profilePicture} />
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
                            <Input defaultValue={this.state.introImage} name="introImage" label="Intro Image" s={12} onChange={this.onTextChange} />
                        </Row>
                        <Row>
                            <Input defaultValue={this.state.outputText} name="outputText" label="Output Text" s={12} onChange={this.onTextChange} />
                        </Row>
                    </Col>
                    <Col s={5} offset="s1">
                        <div className="file-field input-field">
                            <div className="btn">
                                <span>FILE</span>
                                <input type="file" onChange={this.onFileUploaded} />
                            </div>
                            <div className="file-path-wrapper">
                                <input className="file-path validate" type="text" placeholder="Upload file" />
                            </div>
                        </div>
                        {imgUploadComp}
                    </Col>
                </Row>
                <Row className="relativePosition">
                    <Row>
                        <Col s={8}>
                            <AceEditor className="aceBorder"
                                value={this.state.htmlWritten}
                                enableBasicAutocompletion={true}
                                enableLiveAutocompletion={true}
                                mode="html"
                                theme="github"
                                onChange={this.onEditorChange}
                                name="UNIQUE_ID_OF_DIV"
                                editorProps={{ $blockScrolling: true }}
                                height="500px"
                                width="100%"
                                wrapEnabled={true}
                                showPrintMargin={false}
                            />
                        </Col>
                        <Col s={4}>
                            <div className="iframeSize scaleDown" dangerouslySetInnerHTML={{ __html: iframeHTML }}></div>
                            <Button waves='light' onClick={this.submitClicked}>submit</Button>
                        </Col>
                    </Row>

                </Row>
            </div>
        )
    }
}