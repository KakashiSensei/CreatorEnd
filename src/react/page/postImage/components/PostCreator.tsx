import * as React from "react";
import { Dispatch } from 'redux';
import { addContainer, addText, addBackground, editBackground } from "../actions";
import { Element, TextElement, ContainerElement, BackgroundElement, State } from '../postImageConstants';
import * as _ from 'lodash';
import { Row, Col, Button, Input } from 'react-materialize';
import './PostCreator.css';
import Requests from '../../../../Requests';
import * as keywordExtractor from "keyword-extractor";

interface CheckboxStatus {
    name: string;
    checked: boolean;
}

interface IProps {
    postReducer: State;
    dispatch: Dispatch<{}>;
}

interface IState {
    tags: Array<CheckboxStatus>
}

export default class PostCreator extends React.Component<IProps, IState> {
    backgroundID: string;
    quoteID: string;
    authorID: string;

    constructor(props: IProps) {
        super(props);
        this.savePost = this.savePost.bind(this);
        this.state = {
            tags: []
        }
        this.removeSelectedTag = this.removeSelectedTag.bind(this);
        this.tagChanged = this.tagChanged.bind(this);
    }

    componentDidMount() {
        // add the container here
        let containerElement: ContainerElement = new ContainerElement();
        this.props.dispatch(addContainer(containerElement));

        // add the new text here
        Requests.getNewQuote().then((res) => {
            let quote = res['quoteText'];
            let textElement: TextElement = new TextElement(quote);
            this.props.dispatch(addText(textElement));
            let queryString: Array<string> = keywordExtractor.extract(quote, {
                language: "english",
                remove_digits: true,
                return_changed_case: true,
                remove_duplicates: true
            })
            let mapString: Array<CheckboxStatus> = queryString.map((value, key) => {
                return { name: value, checked: false }
            })
            mapString.unshift({ name: "nature", checked: true });
            this.setState({
                tags: mapString
            })

            this.getCorrespondingImages(this.state.tags).then((imageURL: string) => {
                let backgroundElement: BackgroundElement = new BackgroundElement(imageURL);
                this.props.dispatch(addBackground(backgroundElement));
            })

            // add the author here
            let author: string = "- " + res['quoteAuthor'];
            let authorElement: TextElement = new TextElement(author);
            this.props.dispatch(addText(authorElement));
        })
    }

    tagChanged(event) {
        let target = event.target;
        let index = +target.name;
        let checked: boolean = event.target.checked;

        this.state.tags[index].checked = checked;
        this.setState({
            tags: this.state.tags
        }, () => {
            this.getCorrespondingImages(this.state.tags).then((imageURL: string) => {
                let element: Element = _.find(this.props.postReducer.components, { type: "Background" })
                this.props.dispatch(editBackground(element, { backgroundImage: `url("${imageURL}"` }))
            })
        })
    }

    removeSelectedTag(event) {
        console.log("Inside remove selected tag");
    }

    getCorrespondingImages(qs: Array<CheckboxStatus>): Promise<{}> {
        let quesryString: Array<CheckboxStatus> = qs.filter((value, key) => {
            return value.checked;
        })
        let nameString: Array<string> = quesryString.map((value, key) => {
            return value.name;
        })
        return Requests.getCorrespondingImage(nameString).then((result) => {
            let imageURL: string;
            if (result && result["hits"] && result["hits"].length > 0) {
                let randomImage: number = Math.floor(Math.random() * result["hits"].length);
                imageURL = result["hits"][randomImage]["webformatURL"];
            }
            return imageURL;
        })
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

        let postData = {
            dom: modifiedDom
        }
        Requests.makeQuoteImage(postData).then((response) => {
            console.log((response as any).Location)
        });
    }

    render() {
        const { postReducer, dispatch } = this.props;
        let containerStyle = postReducer.container.props;

        //add the editable functionality here
        let elementID = this.props.postReducer.selectedElement;
        let EditableElement = <div></div>
        if (elementID) {
            let elementString = _.find(this.props.postReducer.components, {id: elementID});
            let EditableClass = require(`./editOptions/${elementString.type}Edit`).default;
            EditableElement = <EditableClass dispatch={dispatch} state={postReducer} />
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
                        {this.state.tags.map((value, key) => {
                            let defaultValue = value.checked ? "checked" : undefined;
                            return <Input key={key} name={key.toString()} type='checkbox' value={value.name} label={value.name} defaultChecked={defaultValue} onChange={this.tagChanged} />
                        })}
                    </Row>
                    <Row>
                        {EditableElement}
                    </Row>
                </Col>

            </Row>
        )
    }
}