import React, { Component } from "react";
import PropTypes from "prop-types";
import { Icon, Button } from 'react-materialize';

export default class QuestionRow extends Component {
    static propType = {
        element: PropTypes.shape({
            _id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            introImage: PropTypes.string.isRequired,
            dom: PropTypes.string.isRequired,
        }).isRequired
    }

    constructor(props) {
        super(props);
        this.editClicked = this.editClicked.bind(this);
        this.deleteClicked = this.deleteClicked.bind(this);
    }

    editClicked(e) {
        console.log("Edit Clicked");
    }

    deleteClicked(e) {
        console.log("Delete Clicked");
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
                    </div></td>
                <td>
                    <div className="paddingAround">
                        <Button floating onClick={this.editClicked}>
                            <Icon small>mode_edit</Icon>
                        </Button>
                    </div>
                    <div className="paddingAround">
                        <Button floating onClick={this.deleteClicked}>
                            <Icon small>delete</Icon>
                        </Button>
                    </div>
                </td>
            </tr>
        )
    }
}