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
        let cssToShow = { ...element.props };

        return (
            <div ref={element.id} style={cssToShow} onClick={this.onSingleClick}></div>
        )
    }
}