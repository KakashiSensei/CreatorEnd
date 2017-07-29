import React, { Component } from "react";
import PropTypes from "prop-types";
import { Icon, Button } from 'react-materialize';
import moment from "moment";
import Requests from "../../../Requests";
import {history} from "../../../Routes";

export default class VideoRow extends Component {
    static propType = {
        element: PropTypes.shape({
            _id: PropTypes.number.isRequired,
            videoID: PropTypes.string.isRequired
        }).isRequired,
        deleteCallback: PropTypes.func
    }

    constructor(props) {
        super(props);
        this.state = {
            title: null,
            thumbnail: null
        }
        this.editClicked = this.editClicked.bind(this);
    }

    editClicked(e) {
        let id = e._id;
        let location = "/videoedit/" + id;
        history.push(location);
    }

    componentDidMount() {
        Requests.getVideoDetails(this.props.element.videoID)
        .then((data)=>{
            this.setState({
                title: data.items[0]["snippet"]["title"],
                thumbnail: data.items[0]["snippet"]["thumbnails"]["medium"]["url"]
            })
        })
    }

    render() {
        return (
            <tr key={this.props.element._id}>
                <td>
                    <div>
                        <img className="imageSize" src={this.state.thumbnail} />
                        <p className="textBox">
                            {this.state.title}
                        </p>
                    </div>
                </td>
                <td>
                    {moment(this.props.element.updatedAt).fromNow()}
                </td>
                <td>
                    <span className="paddingAround">
                        <Button floating onClick={() => { this.editClicked(this.props.element) }}>
                            <Icon small>mode_edit</Icon>
                        </Button>
                    </span>
                    <span className="paddingAround">
                        <Button floating onClick={() => { this.props.deleteCallback(this.props.element) }}>
                            <Icon small>delete</Icon>
                        </Button>
                    </span>
                </td>
            </tr>
        )
    }
}