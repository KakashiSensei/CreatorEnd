import React, { Component } from "react";
import PropTypes from "prop-types";
import { Row, Col, Button, Table, tr, th, thead, tbody, Dropdown, NavItem } from 'react-materialize';
import QuestionRow from "../components/creatorComponent/QuestionRow";

export default class QuizDisplayTable extends Component {
    static propType = {
        data: PropTypes.shape(),
        deleteCallback: PropTypes.func
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Table>
                    <thead>
                        <tr>
                            <th data-field="title">Question</th>
                            <th data-field="updatedOn">Updated On</th>
                            <th data-field="buttons"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.data && this.props.data.map((element, index) => {
                            return (
                                <QuestionRow deleteCallback={this.props.deleteCallback} element={element} key={element.updatedAt} />
                            )
                        })}
                    </tbody>
                </Table>
            </div>
        )
    }
}