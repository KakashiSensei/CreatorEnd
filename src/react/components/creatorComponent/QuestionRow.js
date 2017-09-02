import React, { Component } from "react";
import PropTypes from "prop-types";
import { Icon, Button, Chip } from 'react-materialize';
import moment from "moment";
import { history } from "../../../Routes";
import Requests from "../../../Requests";
import { status } from "../../../Helper";
import { getUserDetail } from "../../../Auth";

export default class QuestionRow extends Component {
    static propType = {
        element: PropTypes.shape({
            _id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            introImage: PropTypes.string.isRequired,
            dom: PropTypes.string.isRequired,
            status: PropTypes.string,
            createdBy: PropTypes.string
        }).isRequired,
        editCallback: PropTypes.func,
        deleteCallback: PropTypes.func
    }

    userDetail;
    constructor(props) {
        super(props);
        this.state = {
            status: this.props.element.status
        }
        this.editClicked = this.editClicked.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
        this.userDetail = getUserDetail();
    }

    editClicked(e) {
        let id = e._id;
        let location = "/quizedit/" + id;
        history.push(location);
    }

    duplicateClicked(e) {
        let data = this.props.element
        Requests.addNewQuiz(data)
            .then((data) => {
                let location = "/quizedit/" + data._id;
                history.push(location);
            })
    }

    changeStatus(e) {
        let postData;
        switch (this.state.status) {
            case status.DEVELOPING:
                postData = { "status": status.IN_REVIEW }
                break;
            // case status.IN_REVIEW:
            //     postData = {"status": status.}
            // break;
        }
        Requests.changeStatus(postData);
    }

    render() {
        let statusElement;
        switch (this.state.status) {
            case status.DEVELOPING:
                statusElement =
                    <span className="paddingAround">
                        <Button waves='light' onClick={() => { this.changeStatus() }}>
                            SUBMIT
                        <Icon left tiny>arrow_forward</Icon>
                        </Button>
                    </span>
                break;
            case status.IN_REVIEW:
                statusElement =
                    <span className="paddingAround">
                        <Button className="yellowColor" waves='light' onClick={() => { this.changeStatus() }}>
                            In Review
                        <Icon left tiny>clear</Icon>
                        </Button>
                    </span>
                break;
            case status.APPROVED:
                statusElement =
                    <span>
                        <Chip>
                            Approved
		                </Chip>
                    </span>
                break;
            case status.POSTED:
                statusElement =
                    <span>
                        <Chip>
                            Posted
                        </Chip>
                    </span>
                break;
        }
        return (
            <tr key={this.props.element._id}>
                <td>
                    <div>
                        <img className="imageSize" src={this.props.element.introImage} />
                        <p className="textBox">
                            {this.props.element.title}
                        </p>
                    </div>
                </td>
                <td>
                    {moment(this.props.element.updatedAt).fromNow()}
                </td>
                <td>
                    <span className="paddingAround">
                        <Button floating onClick={() => { this.editClicked(this.props.element) }}>
                            <Icon tiny>mode_edit</Icon>
                        </Button>
                    </span>
                    <span className="paddingAround">
                        <Button floating onClick={() => { this.props.deleteCallback(this.props.element) }}>
                            <Icon tiny>delete</Icon>
                        </Button>
                    </span>
                    <span className="paddingAround">
                        <Button floating onClick={() => { this.duplicateClicked(this.props.element) }}>
                            <Icon tiny>content_copy</Icon>
                        </Button>
                    </span>
                    {statusElement}
                </td>
            </tr>
        )
    }
}