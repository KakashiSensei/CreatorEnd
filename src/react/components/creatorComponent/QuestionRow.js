import React, { Component } from "react";
import PropTypes from "prop-types";
import { Icon, Button } from 'react-materialize';
import moment from "moment";
import { history } from "../../../Routes";
import Requests from "../../../Requests";

export default class QuestionRow extends Component {
    static propType = {
        element: PropTypes.shape({
            _id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            introImage: PropTypes.string.isRequired,
            dom: PropTypes.string.isRequired,
        }).isRequired,
        editCallback: PropTypes.func,
        deleteCallback: PropTypes.func
    }

    constructor(props) {
        super(props);
        this.editClicked = this.editClicked.bind(this);
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

    render() {
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
                </td>
            </tr>
        )
    }
}