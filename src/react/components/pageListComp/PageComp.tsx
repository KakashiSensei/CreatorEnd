import * as React from "react";
import { Row, Col } from 'react-materialize';
import Auth from "../../../Auth";
import "./page.css";
import { IPageDetail } from '../../../Definition';

interface IProps {
    element: IPageDetail,
    onPageSelect: Function
}

interface IState {
}

export default class PageComp extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
    }

    pageSelected(event) {
        //store the page access key
        Auth.setPageAccessToken(this.props.element.access_token);
        this.props.onPageSelect();
    }

    render() {
        let imageUrl = `http://graph.facebook.com/${this.props.element.id}/picture?type=square`;
        return (
            <div>
                <Col s={4} offset="s4">
                    <Row className="background" onClick={this.pageSelected.bind(this)}>
                        <span>
                            <img className="imageSize" src={imageUrl}></img>
                        </span>
                        <span>
                            <Col s={8}>
                                <br />
                                <Col s={12}>
                                    {this.props.element.name}
                                </Col>
                                <Col>
                                    {this.props.element.category}
                                </Col>
                            </Col>
                        </span>
                    </Row>
                </Col>
            </div>
        )
    }
}