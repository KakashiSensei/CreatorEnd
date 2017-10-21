import * as React from "react";
import { Row, Col, Button, Table, tr, th, thead, tbody, Dropdown, NavItem } from 'react-materialize';
import { Link } from 'react-router-dom';
import { history } from '../../Routes';
import * as _ from "lodash";
import Request from "../../Requests";
import QuizDisplayTable from "../components/QuizDisplayTable";
import VideoDisplayTable from "../components/VideoDisplayTable";
import ImageDisplayTable from "../components/ImageDisplayTable";
import Helper from "../../Helper";
import { IQuizData, IVideoData, IImagePostData } from "../../Definition";

interface IProps {
    location: {};
}

interface IState {
    quizDataReceived: IQuizData[];
    videoDataReceived: IVideoData[];
    imagePostDataReceived: IImagePostData[];
}

export default class HomePage extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            quizDataReceived: [],
            videoDataReceived: [],
            imagePostDataReceived: []
        };

        this.deleteQuizClicked = this.deleteQuizClicked.bind(this);
        this.deleteVideoClicked = this.deleteVideoClicked.bind(this);
        this.deleteImagePostClicked = this.deleteImagePostClicked.bind(this);
    }

    componentDidMount() {
        //make get request for questions
        Request.getAllQuizQuestion()
            .then((data) => {
                let sortedData: IQuizData[] = Helper.sortContent(data, 3) as IQuizData[];
                this.setState({
                    quizDataReceived: sortedData
                })
            })

        Request.getAllVideo()
            .then((data) => {
                let sortedData: IVideoData[] = Helper.sortContent(data, 3) as IVideoData[];
                this.setState({
                    videoDataReceived: sortedData
                })
            })

        Request.getAllImagePost()
            .then((data) => {
                let sortedData: IImagePostData[] = Helper.sortContent(data, 3) as IImagePostData[];
                this.setState({
                    imagePostDataReceived: sortedData
                })
            })
    }

    deleteQuizClicked(e) {
        Request.deleteQuiz(e._id)
            .then((data) => {
                this.componentDidMount();
            })
    }

    deleteVideoClicked(e) {
        Request.deleteVideo(e._id)
            .then((data) => {
                this.componentDidMount();
            })
    }

    deleteImagePostClicked(e){
        Request.deleteImage(e._id)
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
                        <li>
                            <Link to='/newimage'>Image</Link>
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

                    <Row>
                        <Col s={5}>
                            <h5>Image Posts</h5>
                        </Col>
                    </Row>
                    <Row>
                        <Col s={10}>
                            <ImageDisplayTable data={this.state.imagePostDataReceived} deleteCallback={this.deleteImagePostClicked} />
                        </Col>
                    </Row>
                    <Row>
                        <Col s={9} className="alignRight">
                            <Link to="/image">more...</Link>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}