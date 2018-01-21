import * as React from "react";
import { Dispatch } from 'redux';
import { addContainer, addText, addBackground, editBackground, updateInitialState, resetInitialState } from "../actions";
import { Element, TextElement, ContainerElement, BackgroundElement, State } from '../postImageConstants';
import * as _ from 'lodash';
import { Row, Col, Button, Input } from 'react-materialize';
import './PostCreator.css';
import Requests, { IResizeImageRequestData } from '../../../../Requests';
import * as keywordExtractor from "keyword-extractor";
import * as  domtoimage from 'dom-to-image';
import * as  retinadomtoimage from 'retina-dom-to-image';
import { IImagePostData, IUserDetail, status } from '../../../../Definition';
import { history } from '../../../../Routes';
import Auth from '../../../../Auth';
import * as fonts from "../../../../font.json";

interface CheckboxStatus {
    name: string;
    checked: boolean;
}

interface IProps {
    postReducer: State;
    dispatch: Dispatch<{}>;
}

interface IState {
    imageID: string;
}

export default class PostCreator extends React.Component<IProps, IState> {
    quoteObject: Object;

    constructor(props: IProps) {
        super(props);
        // get the new dom from here
        let pathname = ((this.props as any).location as any).pathname;
        let id = pathname.split('/')[2];

        this.savePost = this.savePost.bind(this);
        this.state = {
            imageID: id
        }

        this.getNewQuote = this.getNewQuote.bind(this);
        this.props.dispatch(resetInitialState());
    }

    componentDidMount() {
        // reset initial state
        if (this.state.imageID) {
            Requests.getImageWithID(this.state.imageID).then((data) => {
                this.quoteObject = {
                    quoteText: data.quote,
                    quoteAuthor: data.author
                }
                this.props.dispatch(updateInitialState(data.dom))
            })
        } else {
            this.getNewQuote();
        }
    }

    private getNewQuote() {
        this.props.dispatch(resetInitialState());

        // add the container here
        let containerElement: ContainerElement = new ContainerElement();
        this.props.dispatch(addContainer(containerElement));

        // random text element
        let randomIndex = Math.floor(fonts["font"].length * Math.random());
        let fontName = fonts["font"][randomIndex]["name"];

        // add the new text here
        Requests.getNewQuote().then((res) => {
            this.quoteObject = res;
            let quote = res['quoteText'];
            let textElement: TextElement = new TextElement(quote, {
                left: '50px',
                top: '100px',
                fontFamily: fontName,
                fontSize: '35px'
            });
            this.props.dispatch(addText(textElement));

            // add dummy background
            let backgroundElement: BackgroundElement = new BackgroundElement(undefined);
            this.props.dispatch(addBackground(backgroundElement));

            // add the author here
            let author: string = "- " + res['quoteAuthor'];
            let authorElement: TextElement = new TextElement(author, {
                right: '100px',
                bottom: '100px',
                width: '200px',
                fontFamily: fontName,
                fontSize: '22px'
            });
            this.props.dispatch(addText(authorElement));

            // add branding here
            let branding: string = "Whitelight .";
            let brandingElement: TextElement = new TextElement(branding, {
                fontFamily: 'Molleat',
                width: '100%',
                bottom: '0px',
                backgroundColor: '#00000033',
                color: '#FFFFFF'
            })
            this.props.dispatch(addText(brandingElement));
        })
    }

    private savePost() {
        let maxWidth = this.props.postReducer.container.props["width"];
        let maxHeight = this.props.postReducer.container.props["height"];
        let state = this.props.postReducer;
        state.selectedElement = null;
        let quoteText = this.quoteObject["quoteText"];
        let authorText = this.quoteObject["quoteAuthor"];
        let imageID = this.state.imageID;
        retinadomtoimage.toBlob(document.getElementById('containerDiv'), { quality: 1 }).then(function (blob) {
            let reader = new FileReader();

            reader.onload = (event) => {
                let userDetail: IUserDetail = Auth.getUserDetail();
                let data = (event.target as any).result.replace("data:" + blob.type + ";base64,", '');

                let resizeData: IResizeImageRequestData = {
                    data: data,
                    facebookPost: true,
                    type: "png"
                };

                Requests.resizeImageRequest(resizeData).then((data) => {
                    let postImageData: IImagePostData = {
                        imageUrl: data.location,
                        createdBy: userDetail.email,
                        quote: quoteText,
                        author: authorText,
                        dom: JSON.stringify(state)
                    }

                    let promise;
                    if (imageID) {
                        promise = Requests.updateNewImage(postImageData, imageID);
                    } else {
                        promise = Requests.addNewImage(postImageData);
                    }
                })

                let location = "/";
                history.push(location);
            }
            reader.readAsDataURL(blob);
        })
            .catch(function (error) {
                console.error('oops, something went wrong!', error);
            });
    }

    render() {
        const { postReducer, dispatch } = this.props;
        let containerStyle = postReducer.container.props;

        //add the editable functionality here
        let elementID = this.props.postReducer.selectedElement;
        let EditableElement = <div></div>
        if (elementID) {
            let elementString = _.find(this.props.postReducer.components, { id: elementID });
            let EditableClass = require(`./editOptions/${elementString.type}Edit`).default;
            EditableElement = <EditableClass dispatch={dispatch} state={postReducer} quoteObject={this.quoteObject} />
        }

        return (
            <Row className="marginTop">
                <Col s={7} className='containerDisplay'>
                    <Row id="saveDiv">
                        <div id="containerDiv" style={containerStyle}>
                            {postReducer.components.map((elem, id) => {
                                let Element = require(`./node/${elem.type}`).default;
                                return <Element key={id} element={elem} dispatch={dispatch} />
                            })}
                        </div>
                    </Row>
                    <Row>
                        <Col s={2}>
                            <Button waves='light' onClick={this.savePost}>save</Button>
                        </Col>
                        <Col s={1}>
                            <Button floating className='backgroundColor' waves='light' icon='refresh' onClick={this.getNewQuote} />
                        </Col>
                    </Row>
                </Col>
                <Col s={5}>
                    <Row>
                        {EditableElement}
                    </Row>
                </Col>

            </Row>
        )
    }
}