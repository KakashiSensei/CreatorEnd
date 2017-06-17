import React, { Component } from "react";
import PropTypes from "prop-types";
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/html';
import 'brace/snippets/html';
import 'brace/theme/monokai';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';
import 'brace/mode/jsx';

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
                mode="html"
                theme="monokai"
                name="blah2"
                onChange={this.props.onChange}
                fontSize={14}
                height={this.props.height}
                width="100%"
                showPrintMargin={false}
                showGutter={true}
                highlightActiveLine={false}
                value={this.props.value}
                wrapEnabled={true}
                editorProps={{ $blockScrolling: true }}
                enableBasicAutocompletion={true}
                enableLiveAutocompletion={true}
                showLineNumbers={true}
                enableSnippets={true}
                tabSize={2}
            />
        )
    }
}