import React, { Component } from "react";
import brace from 'brace';
import AceEditor, { AceOptions } from 'react-ace';

import 'brace/mode/html';
import 'brace/snippets/html';
import 'brace/theme/monokai';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';
import 'brace/mode/jsx';

interface IProps {
    value: string;
    onChange: Function;
    height: string;
}

interface IState {
}

export default class AceEditorComp extends Component<IProps, IState> {
    constructor(props) {
        super(props);
    }

    render() {
        let aceOptions: AceOptions = {
            showLineNumbers: true,
            enableSnippets: true,
            spellcheck: true
        }
        return (
            <AceEditor className="aceBorder"
                mode="html"
                theme="monokai"
                name="blah2"
                onChange={() => {
                    this.props.onChange
                }}
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
                setOptions={aceOptions}
                tabSize={2}
            />
        )
    }
}