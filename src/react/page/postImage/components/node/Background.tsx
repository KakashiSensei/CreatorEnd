import * as React from "react";
import BaseElement from "./baseNode/BaseElement";
import { Dispatch } from 'redux';
import { Element } from '../../postImageConstants';

interface IProps {
    element: Element;
    dispatch: Dispatch<{}>;
}

interface IState {
}

export default class Background extends BaseElement {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        let { element } = this.props;
        return (
            <div ref={element.id} style={this.props.element.props} onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} onDragStart={this.onDragStart}></div>
        )
    }
}