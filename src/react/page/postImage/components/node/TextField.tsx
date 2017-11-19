import * as React from "react";
import BaseElement from "./baseNode/BaseElement";
import { Element, Point } from '../../postImageConstants';
import { Dispatch } from 'redux';
import { editText } from "../../actions/index";

interface IProps {
    element: Element;
    dispatch: Dispatch<{}>;
}

interface IState {
    top: string;
    left: string;
}

export default class TextField extends BaseElement {
    constructor(props: IProps) {
        super(props);
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    onBlur(event) {
        this.setState({
            contentEditable: false
        })
        this.props.dispatch(editText(this.props.element, {}, { text: event.target.innerText }));
    }

    onDoubleClick(event) {
        let { element } = this.props;
        this.setState({
            contentEditable: true
        }, () => {
            let textBox = (this.refs[element.id] as any);
            textBox.focus();
            let sel = window.getSelection();
            sel.collapse(textBox.firstChild, textBox.innerText.length);
        })
    }

    render() {
        let { element } = this.props;
        // override the style property
        let styleCSS = { ...this.props.element.props };
        styleCSS["top"] = this.state.top;
        styleCSS["left"] = this.state.left;

        return (
            <div ref={element.id} contentEditable={this.state.contentEditable} style={styleCSS} onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} onDragStart={this.onDragStart} onDoubleClick={this.onDoubleClick} onBlur={this.onBlur}>{(this.props.element.data as any).text}</div>
        )
    }
}