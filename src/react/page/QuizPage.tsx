import * as React from "react";
import Request from "../../Requests";
import { Row, Col, Button, Table, tr, th, thead, tbody, Dropdown, NavItem } from 'react-materialize';
import QuizDisplayTable from "../components/QuizDisplayTable";
import Helper from "../../Helper";
import { Link } from 'react-router-dom';
import { IQuizData } from '../../Definition';

interface IProps {

}

interface IState {
    quizDataReceived: IQuizData[];
}

export default class HomePage extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            quizDataReceived: null
        }

        this.deleteQuizClicked = this.deleteQuizClicked.bind(this);
    }

    componentDidMount() {
        Request.getAllQuizQuestion()
            .then((data) => {
                let sortedData: IQuizData[] = Helper.sortContent(data) as IQuizData[];
                this.setState({
                    quizDataReceived: sortedData
                })
            })
    }

    deleteQuizClicked(e) {
        Request.deleteVideo(e._id)
            .then((data) => {
                this.componentDidMount();
            })
    }

    render() {
        return (
            <div>
                <div className="fixedPosition">
                    <Link to='/newquiz'>
                        <Button floating large className='backgroundColor iconStyle' waves='light' icon='add' />
                    </Link>
                </div>
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
            </div>
        )
    }
}