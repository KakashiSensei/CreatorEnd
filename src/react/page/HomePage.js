import React, { Component } from "react";
import config from '../../config';
import { Row, Col, Button, Table, tr, th, thead, tbody } from 'react-materialize';
import QuestionRow from "../components/creatorComponent/QuestionRow";
import { Link } from 'react-router-dom';
import { history } from '../../Routes';
import * as _ from "lodash";
import moment from "moment";

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataReceived: null
        };
        this.editClicked = this.editClicked.bind(this);
        this.deleteClicked = this.deleteClicked.bind(this);
    }

    componentDidMount() {
        //make get request for questions
        this.requestAllQuestions();
    }

    requestAllQuestions() {
        let url = config.restAPI + "/api/game";
        fetch(url, { method: 'GET' })
            .then(res => res.json())
            .then((data) => {
                let sortedData = _.sortBy(data, (o)=>{
                    return moment(o.updatedAt).unix();
                }).reverse();
                this.setState({
                    dataReceived: sortedData
                })
            })
    }

    editClicked(e) {
        let id = e._id;
        let location = "/edit/" + id;
        history.push(location);
    }

    deleteClicked(e) {
        let url = config.restAPI + "/api/game/" + e._id;
        fetch(url, { method: 'DELETE' })
            .then(res => res.json())
            .then((data) => {
                console.log(data);
                this.requestAllQuestions();
            })
    }

    render() {
        return (
            <div>
                <div>
                    <Link to="/new">
                        <Button floating large className='backgroundColor iconStyle' waves='light' icon='add' />
                    </Link>
                </div>
                <div>
                    <Row>
                        <Col s={10}>
                            <Table>
                                <thead>
                                    <tr>
                                        <th data-field="title">Question</th>
                                        <th data-field="updatedON">Updated On</th>
                                        <th data-field="displayDom"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.dataReceived && this.state.dataReceived.map((element, index) => {
                                        return (
                                            <QuestionRow editCallback={this.editClicked} deleteCallback={this.deleteClicked} element={element} key={element.updatedAt} />
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}