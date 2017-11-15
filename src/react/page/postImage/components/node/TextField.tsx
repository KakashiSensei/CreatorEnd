import * as React from "react";
import BaseElement from "./baseNode/BaseElement"
import { Element, Point } from '../../postImageConstants';
import { Dispatch } from 'redux';

interface IProps {
    element: Element;
    dispatch: Dispatch<{}>;
}

interface IState {
}

export default class TextField extends BaseElement {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        // override the style property
        let styleCSS = { ...this.props.element.props };
        styleCSS["top"] = this.state.top;
        styleCSS["left"] = this.state.left;

        return (
            <div ref={this.props.element.id} style={styleCSS} onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} onDragStart={this.onDragStart}>{(this.props.element.data as any).text}</div>
        )
    }
}