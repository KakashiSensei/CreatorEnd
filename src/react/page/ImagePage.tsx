import * as React from "react";
import Request from "../../Requests";
import { Row, Col, Button, Table, tr, th, thead, tbody, Dropdown, NavItem } from 'react-materialize';
import ImageDisplayTable from "../components/ImageDisplayTable";
import Helper from "../../Helper";
import { Link } from 'react-router-dom';
import { IImagePostData } from '../../Definition';

interface IProps {

}

interface IState {
    imageDataReceived: IImagePostData[];
}

export default class ImagePage extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            imageDataReceived: null
        }

        this.deleteImageClicked = this.deleteImageClicked.bind(this);
    }

    componentDidMount() {
        Request.getAllImagePost()
        .then((data) => {
            let sortedData: IImagePostData[] = Helper.sortContent(data, 3) as IImagePostData[];
            this.setState({
                imageDataReceived: sortedData
            })
        })
    }

    deleteImageClicked(e) {
        Request.deleteImage(e._id)
            .then((data) => {
                this.componentDidMount();
            })
    }

    render() {
        return (
            <div>
                <div className="fixedPosition">
                    <Link to='/newimage'>
                        <Button floating large className='backgroundColor iconStyle' waves='light' icon='add' />
                    </Link>
                </div>
                <Row>
                    <Col s={5}>
                        <h5>Posts</h5>
                    </Col>
                </Row>
                <Row>
                    <Col s={10}>
                        <ImageDisplayTable data={this.state.imageDataReceived} deleteCallback={this.deleteImageClicked} />
                    </Col>
                </Row>
            </div>
        )
    }
}