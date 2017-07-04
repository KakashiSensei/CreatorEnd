import React, { Component } from "react";
import config from '../../config';
import { Row, Col, Button, Table, tr, th, thead, tbody, Dropdown, NavItem } from 'react-materialize';
import { Link } from 'react-router-dom';
import { history } from '../../Routes';
import * as _ from "lodash";
import Request from "../../Requests";
import QuizDisplayTable from "../components/QuizDisplayTable";
import VideoDisplayTable from "../components/VideoDisplayTable";
import Helper from "../../Helper";

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quizDataReceived: null,
            videoDataReceived: null
        };

        this.deleteQuizClicked = this.deleteQuizClicked.bind(this);
        this.deleteVideoClicked = this.deleteVideoClicked.bind(this);
    }

    componentDidMount() {
        //make get request for questions
        Request.getAllQuizQuestion()
            .then((data) => {
                let sortedData = Helper.getSelectedContent(data, 3);
                this.setState({
                    quizDataReceived: sortedData
                })
            })

        Request.getAllVideo()
            .then((data) => {
                let sortedData = Helper.getSelectedContent(data, 3);
                this.setState({
                    videoDataReceived: sortedData
                })
            })
    }

    deleteQuizClicked(e) {
        let url = config.restAPI + "/api/game/" + e._id;
        fetch(url, { method: 'DELETE' })
            .then(res => res.json())
            .then((data) => {
                this.componentDidMount();
            })
    }

    deleteVideoClicked(e) {
        let url = config.restAPI + "/api/video/" + e._id;
        fetch(url, { method: 'DELETE' })
            .then(res => res.json())
            .then((data) => {
                this.componentDidMount();
            })
    }

    render() {
        return (
            <div>
                <div className="fixedPosition">

                    <Dropdown trigger={
                        <Button floating large className='backgroundColor iconStyle' waves='light' icon='add' />
                    }>
                        <li>
                            <Link to='/newquiz'>Quiz</Link>
                        </li>
                        <li>
                            <Link to='/newvideo'>Video</Link>
                        </li>
                    </Dropdown>

                </div>
                <div>
                    <Row>
                        <Col s={5}>
                            <h5>Quizes</h5>
                        </Col>
                    </Row>
                    <Row>
                        <Col s={10}>
                            <QuizDisplayTable data={this.state.quizDataReceived} deleteCallback={this.deleteQuizClicked} />
                        </Col>
                    </Row>
                    <Row>
                        <Col s={9} className="alignRight">
                            <Link to="/quiz">more...</Link>
                        </Col>
                    </Row>


                    <Row>
                        <Col s={5}>
                            <h5>Videos</h5>
                        </Col>
                    </Row>
                    <Row>
                        <Col s={10}>
                            <VideoDisplayTable data={this.state.videoDataReceived} deleteCallback={this.deleteVideoClicked} />
                        </Col>
                    </Row>
                    <Row>
                        <Col s={9} className="alignRight">
                            <Link to="/video">more...</Link>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}