import React, { Component } from "react";
import PropTypes from "prop-types";
import { Row, Col } from 'react-materialize';

export default class ImageUploaded extends Component {
    static propType = {
        gameLink: PropTypes.arrayOf(PropTypes.string).isRequired
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (

            <div className="collection">
                {this.props.gameLink && this.props.gameLink.map(() => {
                    return <div className="collection-item">
                        <Row className="reset">
                            <Col s={3}><img className="uploadedImageSize alignCenter" src={this.props.gameLink} /></Col>
                            <Col s={9}>{this.props.gameLink}</Col>
                        </Row>
                    </div>
                })}
            </div>
        )
    }
}