import React, { Component } from "react";
import Request from "../../Requests";
import { Row, Col, Button, Table, tr, th, thead, tbody, Dropdown, NavItem } from 'react-materialize';
import VideoDisplayTable from "../components/VideoDisplayTable";
import Helper from "../../Helper";
import { Link } from 'react-router-dom';
import { IVideoData } from "../../Definition";

interface IProps {
}

interface IState {
    videoDataReceived: IVideoData[]
}

export default class VideoPage extends Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            videoDataReceived: null
        }
        this.deleteVideoClicked = this.deleteVideoClicked.bind(this);
    }

    componentDidMount() {
        Request.getAllVideo()
            .then((data) => {
                let sortedData: IVideoData[] = Helper.sortContent(data) as IVideoData[];
                this.setState({
                    videoDataReceived: sortedData
                })
            })
    }

    deleteVideoClicked(e) {
        Request.deleteVideo(e._id)
            .then((data) => {
                this.componentDidMount();
            })
    }

    render() {
        return (
            <div>
                <div className="fixedPosition">
                    <Link to='/newvideo'>
                        <Button floating large className='backgroundColor iconStyle' waves='light' icon='add' />
                    </Link>
                </div>
                <Row>
                    <Col s={5}>
                        <h5>Video</h5>
                    </Col>
                </Row>
                <Row>
                    <Col s={10}>
                        <VideoDisplayTable data={this.state.videoDataReceived} deleteCallback={this.deleteVideoClicked} />
                    </Col>
                </Row>
            </div>
        )
    }
}