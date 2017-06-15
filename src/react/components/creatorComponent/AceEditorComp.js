import React, { Component } from "react";
import PropTypes from "prop-types";
import AceEditor from 'react-ace';

import 'brace/mode/html';
import 'brace/theme/github';

export default class AceEditorComp extends Component {
    static propType = {
        value: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        height: PropTypes.string.isRequired
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AceEditor className="aceBorder"
                value={this.props.value}
                enableBasicAutocompletion={true}
                enableLiveAutocompletion={true}
                mode="html"
                theme="github"
                onChange={this.props.onChange}
                name="UNIQUE_ID_OF_DIV"
                editorProps={{ $blockScrolling: true }}
                height={this.props.height}
                width="100%"
                wrapEnabled={true}
                showPrintMargin={false}
            />
        )
    }
}