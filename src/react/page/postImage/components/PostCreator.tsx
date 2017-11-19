import * as React from "react";
import { Dispatch } from 'redux';
import { addContainer, addText, addBackground } from "../actions";
import { Element, TextElement, ContainerElement, BackgroundElement, State } from '../postImageConstants';
import * as _ from 'lodash';
import { Row, Col, Button } from 'react-materialize';
import './PostCreator.css';
import Requests from '../../../../Requests';

interface IProps {
    postReducer: State;
    dispatch: Dispatch<{}>;
}

interface IState {
}

export default class PostCreator extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.savePost = this.savePost.bind(this);
    }

    componentDidMount() {
        // add the container here
        let containerElement: ContainerElement = new ContainerElement();
        this.props.dispatch(addContainer(containerElement));

        let backgroundElement: BackgroundElement = new BackgroundElement();
        this.props.dispatch(addBackground(backgroundElement));

        // add the new text here
        Requests.getNewQuote().then((res) => {
            let quote = res['quoteText'];
            let textElement: TextElement = new TextElement(quote);
            this.props.dispatch(addText(textElement));
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
        <link href="https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.css" ref="stylesheet">
        
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
        console.log(postReducer.components);

        return (
            <Row>
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
            </Row>
        )
    }
}