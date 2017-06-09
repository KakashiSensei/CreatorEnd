import React, { Component } from "react";
import PropTypes from "prop-types";

export default class InnerHtml extends Component {
    static propType = {
        innerHtml: PropTypes.string.isRequired
    }

    constructor(props) {
        super(props);
    }

    createMarkup() {
        return { __html: this.props.innerHtml };
    }

    render() {
        let innerHTML = this.createMarkup();
        let innerDiv = <div></div>
        innerDiv = <div dangerouslySetInnerHTML={innerHTML}></div>
        return (
            <div>
                {innerDiv}
            </div>
        );
    }
}