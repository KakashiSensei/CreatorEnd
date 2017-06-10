import React, { Component } from "react";
import PropTypes from "prop-types";
import { Icon, Button } from 'react-materialize';
import moment from "moment"

export default class QuestionRow extends Component {
    static propType = {
        element: PropTypes.shape({
            _id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            introImage: PropTypes.string.isRequired,
            dom: PropTypes.string.isRequired,
        }).isRequired,
        editCallback: PropTypes.func,
        deleteCallback: PropTypes.func
    }

    constructor(props) {
        super(props);
        // this.editClicked = this.editClicked.bind(this);
        // this.deleteClicked = this.deleteClicked.bind(this);
    }

    // editClicked(e) {
    //     debugger;
    //     console.log("Edit Clicked", e);
    // }

    // deleteClicked(e) {
    //     debugger;
    //     console.log("Delete Clicked", e);
    // }

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
                    <div className="paddingAround">
                        <Button floating onClick={() => { this.props.editCallback(this.props.element) }}>
                            <Icon small>mode_edit</Icon>
                        </Button>
                    </div>
                    <div className="paddingAround">
                        <Button floating onClick={() => { this.props.deleteCallback(this.props.element) }}>
                            <Icon small>delete</Icon>
                        </Button>
                    </div>
                </td>
            </tr>
        )
    }
}