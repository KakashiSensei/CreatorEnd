import * as React from "react";
import brace from 'brace';
import { Input, Row, Col, Button, Navbar, NavItem, Preloader } from 'react-materialize';
import config from '../../config';
import ImageUploaded from '../components/ImageUploaded';
import { Encoder } from 'node-html-encoder';
import { history } from '../../Routes';
import ParseData, { IFacebookData } from "wl-parser";
import * as moment from "moment";
import AceEditorComp from "../components/creatorComponent/AceEditorComp";
import Requests, { IResizeImageRequestData, IFacebookRequestData } from "../../Requests";
import Helper from "../../Helper";
import Auth from '../../Auth';
import template from "../../templates/quiz";
import { IQuizData } from "../../Definition";

interface IProps {
    location: {};
}

interface IState {
    imageUploaded: string[];
    htmlWritten: string;
    questionTitle: string;
    description: string;
    introImage: string;
    outputText: string;

    questionRetrived: boolean;
    loggedIn: boolean;
    dataRetrieved: boolean;
}

export default class HomePage extends React.Component<IProps, IState> {
    firstName: string;
    profilePicture: string;
    facebookID: number;
    accessToken: string;
    facebookData: ParseData;
    id: string;

    constructor(props) {
        super(props);
        let pathname = (this.props.location as any).pathname;
        this.id = pathname.split('/')[2];
        let questionRetrivedValue = true;
        if (this.id) {
            questionRetrivedValue = false;
        }
        this.state = {
            imageUploaded: [],
            htmlWritten: "",
            questionTitle: "",
            description: "",
            introImage: "",
            outputText: "",

            questionRetrived: questionRetrivedValue,
            loggedIn: false,
            dataRetrieved: false
        }

        this.onEditorChange = this.onEditorChange.bind(this);
        this.onOutputEditorChange = this.onOutputEditorChange.bind(this);
        this.onFileUploaded = this.onFileUploaded.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.submitClicked = this.submitClicked.bind(this);
        this.onIntroImageAdded = this.onIntroImageAdded.bind(this);
        this.onIntroImageUploaded = this.onIntroImageUploaded.bind(this);
        this.onUploadFromURL = this.onUploadFromURL.bind(this);
        this.addImageToDisplay = this.addImageToDisplay.bind(this);
    }

    componentDidMount() {
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
            Requests.getQuestions(this.id)
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

        // clearTimeout(this.setTimeOutId);
        // this.setTimeOutId = setTimeout(() => {
        //     this.addQuestionInDataBase();
        //     this.lastTime = moment();
        // }, this.autoSaveTime * 1000);
    }

    onOutputEditorChange(e, event) {
        this.setState({
            outputText: e
        })

        // clearTimeout(this.setTimeOutId);
        // this.setTimeOutId = setTimeout(() => {
        //     this.addQuestionInDataBase();
        //     this.lastTime = moment();
        //     console.log("Question saved in DB");
        // }, this.autoSaveTime * 1000);
    }

    onUploadFromURL(e) {
        let target: string = e.currentTarget.value;
        let maxWidth = "698px";
        let maxHeight = "367px";
        let postData: IResizeImageRequestData = {
            url: target,
            maxWidth: maxWidth,
            maxHeight: maxHeight,
            type: target.substr(target.lastIndexOf('.') + 1)
        };

        Requests.resizeImageRequest(postData)
            .then(this.addImageToDisplay);
    }

    onFileUploaded(e) {
        let target = e.currentTarget.files[0];
        let fileName = e.currentTarget.files[0].name;

        let reader = new FileReader();
        reader.onload = (event) => {
            let data = (event.target as any).result.replace("data:" + target.type + ";base64,", '');
            let maxWidth = "698px";
            let maxHeight = "367px";

            let postData: IResizeImageRequestData = {
                data: data,
                maxWidth: maxWidth,
                maxHeight: maxHeight,
                type: fileName.substr(fileName.lastIndexOf('.') + 1)
            };

            Requests.resizeImageRequest(postData)
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

        let bodydata: IResizeImageRequestData = {
            url: value,
            width: "800px",
            height: "425px"
        };

        Requests.resizeImageRequest(bodydata)
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
            let data = (event.target as any).result.replace("data:" + target.type + ";base64,", '');
            let postData: IResizeImageRequestData = {
                data: data,
                width: "800px",
                height: "425px"
            };

            Requests.resizeImageRequest(postData)
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

            let postData: IFacebookRequestData = {
                id: uid,
                accessToken: accessToken
            };

            return Requests.getFacebookData(postData)
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

        let userDetail = Auth.getUserDetail();
        let data: IQuizData = {
            title: questionTitle,
            description: description,
            introImage: introImage,
            outputText: outputText,
            dom: questionHTML,
            createdBy: userDetail.email
        };
        data["title"] = questionTitle;

        if (this.id) {
            return Requests.updateNewQuestion(data, this.id)
                .then((data) => {
                    this.id = data._id;
                })
        } else {
            return Requests.addNewQuiz(data)
                .then((data) => {
                    this.id = data._id;
                })
        }
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

        return (
            <div>
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
                                        <span><Button waves='light' onClick={() => { return (this.refs.introFileSelected as any).click() }}>Browse</Button></span>
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
                                <span><Button waves='light' onClick={() => { return (this.refs.selectedFile as any).click() }}>Browse</Button></span>
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