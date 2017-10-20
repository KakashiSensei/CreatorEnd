import * as React from "react";
import { Row, Col } from 'react-materialize';

interface IProps {
    gameLink: string[];
}

interface IState {
}

export default class ImageUploaded extends React.Component<IProps, IState> {
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