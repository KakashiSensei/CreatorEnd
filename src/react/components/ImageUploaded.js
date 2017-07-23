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
                {this.props.gameLink && this.props.gameLink.map((image, index) => {
                    return <div key={index} className="collection-item">
                        <Row className="reset">
                            <Col s={3}><img className="uploadedImageSize alignCenter" src={image} /></Col>
                            <Col s={9}>{image}</Col>
                        </Row>
                    </div>
                })}
            </div>
        )
    }
}