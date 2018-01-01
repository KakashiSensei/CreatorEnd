import * as React from "react";
import { Dispatch } from 'redux';
import { Element, State, FontStructure } from '../../postImageConstants';

interface IProps {
    state: State
    dispatch: Dispatch<{}>;
}

interface IState {
}

export default class BackgroundEdit extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (<div></div>)
    }
}