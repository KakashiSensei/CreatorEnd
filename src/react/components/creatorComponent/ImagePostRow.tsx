import * as React from "react";
import { IImagePostData, IUserDetail, status } from "../../../Definition";
import { Icon, Button, Chip, Input, Row, Col } from 'react-materialize';
import Auth from "../../../Auth";
import Requests from "../../../Requests";
import * as moment from "moment";

interface facebookPostData {
    id: String,
    post_id: String
}
interface IProps {
    element: IImagePostData;
    deleteCallback: Function;
}

interface IState {
    status: status;
    postsMsg
}

export default class ImagePostRow extends React.Component<IProps, IState>{
    private userDetail: IUserDetail;
    constructor(props) {
        super(props);
        this.userDetail = Auth.getUserDetail();
        this.state = {
            status: this.props.element.status,
            postsMsg: "Like us to get interesting posts!"
        }
        this.changeStatus = this.changeStatus.bind(this);
        this.cancelStatus = this.cancelStatus.bind(this);
        this.changePostMessgae = this.changePostMessgae.bind(this);
    }

    cancelStatus() {
        let postData = {
            "status": status.DEVELOPING,
            "id": this.props.element._id,
            "type": "postImage"
        };
        Requests.changeStatus(postData).then((res) => {
            this.setState({
                status: status.DEVELOPING
            })
        })
    }

    changePostMessgae(e) {
        let newText = e.currentTarget.value;
        this.setState({
            postsMsg: newText
        })
    }

    changeStatus() {
        let postData;
        if (this.userDetail.type === "admin") {
            switch (this.state.status) {
                case status.DEVELOPING:
                    postData = {
                        "status": status.IN_REVIEW,
                        "id": this.props.element._id,
                        "type": "postImage"
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
                        "id": this.props.element._id,
                        "type": "postImage"
                    };
                    Requests.changeStatus(postData).then((res) => {
                        this.setState({
                            status: status.APPROVED
                        })
                    })
                    break;

                case status.APPROVED:
                    Requests.getLatestPostTime()
                        .then((data: IImagePostData) => {
                            let postTime = 0;
                            if (data.postTime) {
                                let momentLastTime: moment.Moment = moment.unix(data.postTime);
                                momentLastTime.add(3, 'hours').toDate();
                                postTime = momentLastTime.unix();
                            }
                            let dateNow = moment();
                            dateNow.add(3, 'hours').toDate();
                            let maxTime: number = Math.max(postTime, dateNow.unix());
                            let imageObject = {
                                url: this.props.element.imageUrl,
                                caption: this.state.postsMsg,
                                published: false,
                                scheduled_publish_time: maxTime
                            };
                            Requests.postOnFacebook(imageObject, Auth.getPageAccessToken())
                                .then((facebookData: facebookPostData) => {
                                    postData = {
                                        "status": status.POSTED,
                                        "id": this.props.element._id,
                                        "type": "postImage",
                                        "photoID": facebookData.id,
                                        "postID": facebookData.post_id,
                                        "postTime": maxTime
                                    };
                                    Requests.changeStatus(postData).then((res) => {
                                        this.setState({
                                            status: status.POSTED
                                        })
                                    })
                                })
                        })
            }
        } else if (this.userDetail.type === "developer") {
            switch (this.state.status) {
                case status.DEVELOPING:
                    postData = {
                        "status": status.IN_REVIEW,
                        "id": this.props.element._id,
                        "type": "postImage"
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
                        "id": this.props.element._id,
                        "type": "postImage"
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
        let caption = <div></div>;
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
                    caption = <input style={{ width: '300px', marginLeft: '10px' }} type="text" value={this.state.postsMsg} onChange={this.changePostMessgae} />
                    break;
                case status.POSTED:
                    statusElement =
                        <span>
                            <Chip>
                                Posted
                            </Chip>
                        </span>;
                    deleteButton = <Button floating onClick={() => { this.props.deleteCallback(this.props.element) }}>
                        <Icon tiny>delete</Icon>
                    </Button>;
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
                    break;
                case status.APPROVED:
                    statusElement =
                        <span>
                            <Chip>
                                Approved
		                    </Chip>
                        </span>
                    deleteButton = <span></span>;
                    break;
                case status.POSTED:
                    statusElement =
                        <span>
                            <Chip>
                                Posted
                            </Chip>
                        </span>
                    deleteButton = <span></span>;
                    break;
            }
        }
        return (
            <tr key={this.props.element._id}>
                <td>
                    <div>
                        <img className="imageSize" src={this.props.element.imageUrl} />
                    </div>
                </td>
                <td>
                    {moment(this.props.element.updatedAt).fromNow()}
                </td>
                <td>
                    <div>
                        <span className="paddingAround">
                            {deleteButton}
                        </span>
                        <span>
                            {statusElement}
                        </span>
                        <span>
                            {caption}
                        </span>
                    </div>
                </td>
            </tr>
        )
    }
}