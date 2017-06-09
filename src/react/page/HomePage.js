import React, { Component } from "react";
import config from '../../config';
import { Row, Col, Button, Table, tr, th, thead, tbody } from 'react-materialize';
import QuestionRow from "../components/creatorComponent/QuestionRow";

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataReceived: null
        };
    }

    componentDidMount() {
        //make get request for questions
        let url = config.restAPI + "/api/game";
        fetch(url, { method: 'GET' })
            .then(res => res.json())
            .then((data) => {
                console.log(data);
                this.setState({
                    dataReceived: data
                })
            })
    }

    render() {
        return (
            <div>
                <div>
                    <Button floating large className='backgroundColor iconStyle' waves='light' icon='add' />
                </div>
                <div>
                    <Row>
                        <Col s={10}>
                            <Table>
                                <thead>
                                    <tr>
                                        <th data-field="title">Question</th>
                                        <th data-field="displayDom"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.dataReceived && this.state.dataReceived.map((element, index) => {
                                        return (
                                            <QuestionRow element={element} key={element._id} />
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