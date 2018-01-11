import * as React from "react";
import { Dispatch } from 'redux';
import { addContainer, addText, addBackground, editBackground } from "../actions";
import { Element, TextElement, ContainerElement, BackgroundElement, State } from '../postImageConstants';
import * as _ from 'lodash';
import { Row, Col, Button, Input } from 'react-materialize';
import './PostCreator.css';
import Requests from '../../../../Requests';
import * as keywordExtractor from "keyword-extractor";
import * as  domtoimage from 'dom-to-image';
import * as  retinadomtoimage from 'retina-dom-to-image';


interface CheckboxStatus {
    name: string;
    checked: boolean;
}

interface IProps {
    postReducer: State;
    dispatch: Dispatch<{}>;
}

interface IState {

}

export default class PostCreator extends React.Component<IProps, IState> {
    backgroundID: string;
    quoteID: string;
    authorID: string;
    quoteObject: Object;

    constructor(props: IProps) {
        super(props);
        this.savePost = this.savePost.bind(this);
        this.state = {
        }
        this.removeSelectedTag = this.removeSelectedTag.bind(this);
    }

    componentDidMount() {
        // add the container here
        let containerElement: ContainerElement = new ContainerElement();
        this.props.dispatch(addContainer(containerElement));

        // add the new text here
        Requests.getNewQuote().then((res) => {
            this.quoteObject = res;
            let quote = res['quoteText'];
            let textElement: TextElement = new TextElement(quote, {
                left: '50px',
                top: '100px',
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
                width: '200px'
            });
            this.props.dispatch(addText(authorElement));
        })
    }

    removeSelectedTag(event) {
        console.log("Inside remove selected tag");
    }

    savePost() {
        // document.getElementById('saveDiv').innerHTML
        let modifiedDom = `<html>
        <style>
            .bodyClass {
                background-color: #CCCCCC;
                margin: 0px;
                padding: 0px;
                overflow: hidden;
            }
            
            .divClass {
                position: absolute;
                width: 698px;
                height: 367px;
            }
        </style>
        <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
        
        <body class="bodyClass">
        ${document.getElementById('saveDiv').innerHTML}
        </body>
        </html>`

        modifiedDom = modifiedDom.replace("filter", "-webkit-filter");
        // console.log(modifiedDom);
        let postData = {
            dom: modifiedDom
        }
        // Requests.makeQuoteImage(postData).then((response) => {
        //     console.log((response as any).Location)
        // });
        
        retinadomtoimage.toPng(document.getElementById('saveDiv'), {quality: 1}).then(function (dataUrl) {
            var img = new Image();
            img.src = dataUrl;
            document.body.appendChild(img);
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
                <Col s={6} className='containerDisplay'>
                    <Row id="saveDiv">
                        <div id="containerDiv" style={containerStyle}>
                            {postReducer.components.map((elem, id) => {
                                let Element = require(`./node/${elem.type}`).default;
                                return <Element key={id} element={elem} dispatch={dispatch} />
                            })}
                        </div>
                    </Row>
                    <Row>
                        <Col>
                            <Button waves='light' onClick={this.savePost}>save</Button>
                        </Col>
                    </Row>
                </Col>
                <Col s={6}>
                    <Row>
                        {EditableElement}
                    </Row>
                </Col>

            </Row>
        )
    }
}