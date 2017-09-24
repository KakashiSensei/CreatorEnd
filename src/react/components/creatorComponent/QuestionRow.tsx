import * as React from "react";
import PropTypes from "prop-types";
import { Icon, Button, Chip } from 'react-materialize';
import * as moment from "moment";
import { history } from "../../../Routes";
import Requests from "../../../Requests";
import Auth from "../../../Auth";
import { IQuizData, IUserDetail, status } from "../../../Definition";

interface IProps {
    element: IQuizData;
    deleteCallback: Function;
}

interface IState {
    status: status;
}

export default class QuestionRow extends React.Component<IProps, IState> {
    private userDetail: IUserDetail;
    constructor(props) {
        super(props);
        this.userDetail = Auth.getUserDetail();
        this.state = {
            status: this.props.element.status
        }
        this.editClicked = this.editClicked.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
        this.cancelStatus = this.cancelStatus.bind(this);
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

    cancelStatus() {
        let postData = {
            "status": status.DEVELOPING,
            "id": this.props.element._id
        };
        Requests.changeStatus(postData).then((res) => {
            this.setState({
                status: status.DEVELOPING
            })
        })
    }

    changeStatus() {
        let postData;
        if (this.userDetail.type === "admin") {
            switch (this.state.status) {
                case status.DEVELOPING:
                    postData = {
                        "status": status.IN_REVIEW,
                        "id": this.props.element._id
                    }
                    Requests.changeStatus(postData).then((res) => {
                        this.setState({
                            status: status.IN_REVIEW
                        })
                    })
                    break;
                case status.IN_REVIEW:
                    postData = {
                        "status": status.APPROVED,
                        "id": this.props.element._id
                    };
                    Requests.changeStatus(postData).then((res) => {
                        this.setState({
                            status: status.APPROVED
                        })
                    })
                    break;

            }
        } else if (this.userDetail.type === "developer") {
            switch (this.state.status) {
                case status.DEVELOPING:
                    postData = {
                        "status": status.IN_REVIEW,
                        "id": this.props.element._id
                    }
                    Requests.changeStatus(postData).then((res) => {
                        this.setState({
                            status: status.IN_REVIEW
                        })
                    })
                    break;
                case status.IN_REVIEW:
                    postData = {
                        "status": status.DEVELOPING,
                        "id": this.props.element._id
                    };
                    Requests.changeStatus(postData).then((res) => {
                        this.setState({
                            status: status.DEVELOPING
                        })
                    })
                    break;
            }
        }
    }

    render() {
        let statusElement;
        let deleteButton;
        let editButton;
        if (this.userDetail.type === "admin") {
            switch (this.state.status) {
                case status.DEVELOPING:
                    statusElement =
                        <span className="paddingAround">
                            <Button waves='light' onClick={() => { this.changeStatus() }}>
                                SUBMIT
                                <Icon left tiny>arrow_forward</Icon>
                            </Button>
                        </span>;

                    deleteButton =
                        <Button floating onClick={() => { this.props.deleteCallback(this.props.element) }}>
                            <Icon tiny>delete</Icon>
                        </Button>;

                    editButton =
                        <Button floating onClick={() => { this.editClicked(this.props.element) }}>
                            <Icon tiny>mode_edit</Icon>
                        </Button>
                    break;
                case status.IN_REVIEW:
                    statusElement =
                        <span className="paddingAround">
                            <Button className="yellowColor" waves='light' onClick={() => { this.changeStatus() }}>
                                In Review
                                <Icon left tiny onClick={() => { this.cancelStatus() }}>clear</Icon>
                            </Button>
                        </span>;

                    deleteButton =
                        <Button floating onClick={() => { this.props.deleteCallback(this.props.element) }}>
                            <Icon tiny>delete</Icon>
                        </Button>;

                    editButton =
                        <Button floating onClick={() => { this.editClicked(this.props.element) }}>
                            <Icon tiny>mode_edit</Icon>
                        </Button>
                    break;
                case status.APPROVED:
                    statusElement =
                        <Button waves='light' onClick={() => { this.changeStatus() }}>
                            Approved
                                <Icon left tiny>arrow_forward</Icon>
                        </Button>
                    deleteButton =
                        <Button floating onClick={() => { this.props.deleteCallback(this.props.element) }}>
                            <Icon tiny>delete</Icon>
                        </Button>;

                    editButton =
                        <Button floating onClick={() => { this.editClicked(this.props.element) }}>
                            <Icon tiny>mode_edit</Icon>
                        </Button>;
                    break;
                case status.POSTED:
                    statusElement =
                        <span>
                            <Chip>
                                Posted
                            </Chip>
                        </span>;
                    deleteButton = <span></span>;
                    editButton = <span></span>;
                    break;
            }
        } else if (this.userDetail.type === "developer") {
            switch (this.state.status) {
                case status.DEVELOPING:
                    statusElement =
                        <span className="paddingAround">
                            <Button waves='light' onClick={() => { this.changeStatus() }}>
                                SUBMIT
                                <Icon left tiny>arrow_forward</Icon>
                            </Button>
                        </span>;

                    deleteButton =
                        <Button floating onClick={() => { this.props.deleteCallback(this.props.element) }}>
                            <Icon tiny>delete</Icon>
                        </Button>;

                    editButton =
                        <Button floating onClick={() => { this.editClicked(this.props.element) }}>
                            <Icon tiny>mode_edit</Icon>
                        </Button>;
                    break;
                case status.IN_REVIEW:
                    statusElement =
                        <span className="paddingAround">
                            <Button className="yellowColor" waves='light' onClick={() => { this.changeStatus() }}>
                                In Review
                                <Icon left tiny>clear</Icon>
                            </Button>
                        </span>

                    deleteButton =
                        <Button floating onClick={() => { this.props.deleteCallback(this.props.element) }}>
                            <Icon tiny>delete</Icon>
                        </Button>;

                    editButton =
                        <span></span>;
                    break;
                case status.APPROVED:
                    statusElement =
                        <span>
                            <Chip>
                                Approved
		                    </Chip>
                        </span>
                    deleteButton = <span></span>;
                    editButton =
                        <span></span>;
                    break;
                case status.POSTED:
                    statusElement =
                        <span>
                            <Chip>
                                Posted
                            </Chip>
                        </span>
                    deleteButton = <span></span>;
                    editButton =
                        <span></span>;
                    break;
            }
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
                    <div>
                        <span className="paddingAround">
                            {editButton}
                        </span>
                        <span className="paddingAround">
                            {deleteButton}
                        </span>
                        <span className="paddingAround">
                            <Button floating onClick={() => { this.duplicateClicked(this.props.element) }}>
                                <Icon tiny>content_copy</Icon>
                            </Button>
                        </span>
                        {statusElement}
                    </div>
                </td>
            </tr>
        )
    }
}