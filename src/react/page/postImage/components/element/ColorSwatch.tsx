import * as React from "react";
import onClickOutside from "react-onclickoutside";
import { SketchPicker } from 'react-color';
import { Row } from 'react-materialize';
import { Colors } from '../../postImageConstants';

interface IProps {
    color: string,
    callback: Function
    onChangeComplete: Function
}

interface IState {
}

class ColorSwatch extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }

    handleClickOutside = evt => {
        this.props.callback();
    };

    render() {
        let colors = Colors;
        return (
            <Row>
                <SketchPicker color={this.props.color} colors={colors} onChangeComplete={this.props.onChangeComplete} />
            </Row>
        )
    }
}

export default onClickOutside(ColorSwatch);