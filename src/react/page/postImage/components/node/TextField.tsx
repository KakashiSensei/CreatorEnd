import * as React from "react";
import BaseElement from "./baseNode/BaseElement";
import { Element, Point } from '../../postImageConstants';
import { Dispatch } from 'redux';
import { editText } from "../../actions/index";
import * as fonts from "../../../../../../font.json";
import * as _ from "lodash";
import { FontStructure } from "../../../../page/postImage/postImageConstants";
import LoadFont from "../../../../../LoadFont";

interface IProps {
    element: Element;
    dispatch: Dispatch<{}>;
}

interface IState {
    top: string;
    left: string;
    editable: boolean;
}

export default class TextField extends BaseElement {
    private DIFFERENCE: number = 10;

    constructor(props: IProps) {
        super(props);

        this.state = {
            top: this.props.element.props["top"],
            left: this.props.element.props["left"],
            editable: false
        }

        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.onBlurOut = this.onBlurOut.bind(this);
        this.onTextChange = this.onTextChange.bind(this);

        let fontName = this.props.element.props["fontFamily"];
        let fontArray: Array<FontStructure> = fonts["font"]
        let fontInJSON = _.find(fontArray, (value: FontStructure, key) => {
            return value.name.indexOf(fontName) !== -1;
        })
        
        LoadFont.load(fontInJSON);
    }

    componentDidMount() {
        // call the super class here
        super.componentDidMount();

        let { dispatch, element } = this.props;
        let scrollHeight: number = this.refs[element.id]["scrollHeight"];
        let textAlign = {
            "textAlign": "center",
            "height": scrollHeight + "px"
        }
        // center align the quote
        dispatch(editText(element, textAlign, null));
    }

    onTextChange(event) {
        let { dispatch, element } = this.props;
        let textValue = (this.refs[element.id] as any).value;
        console.log(textValue);
        dispatch(editText(element, {}, { text: textValue }));
    }

    onMouseMove(event) {
        if (this.checkLocalCondition(event)) {
            return;
        }

        // call the super function here
        super.onMouseMove(event);
    }

    onMouseUp(event) {
        let { dispatch, element } = this.props;
        let scrollHeight: number = this.refs[element.id]["scrollHeight"];
        let width: string = (this.refs[element.id] as any).style.width;
        let textAlign = {
            "height": scrollHeight + "px",
            "width": width
        }
        // center align the quote
        dispatch(editText(element, textAlign, null));

        if (this.checkLocalCondition(event)) {
            return;
        }

        // call the super function here
        super.onMouseUp(event);
    }

    onMouseDown(event) {
        if (this.checkLocalCondition(event)) {
            return;
        }

        // call the super function here
        super.onMouseDown(event);
    }

    onDoubleClick(event) {
        this.setState({
            editable: true
        })
    }

    onBlurOut(event) {
        console.log("Textfield blur out");
        this.setState({
            editable: false
        })
    }

    private checkLocalCondition(event): boolean {
        let condition = false;
        let target = event.target;
        let targetWidth: number = +target.style.width.replace("px", "");
        let targetHeight: number = target.scrollHeight;

        let mouseX: number = event.pageX - +target.style.left.replace("px", "");
        let mouseY: number = event.pageY - +target.style.top.replace("px", "");

        if (Math.abs(targetWidth - mouseX) < this.DIFFERENCE) {
            event.stopPropagation();
            condition = true;
        }

        return condition;
    }

    render() {
        let { element } = this.props;
        // override the style property
        let styleCSS = { ...this.props.element.props };
        styleCSS["top"] = this.state.top;
        styleCSS["left"] = this.state.left;

        let domElement = <p id={element.id} ref={element.id} onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} onDoubleClick={this.onDoubleClick} onBlur={this.onBlurOut} onClick={this.onSingleClick} style={styleCSS}>{(this.props.element.data as any).text}</p>;
        if (this.state.editable) {
            domElement = <textarea id={element.id} ref={element.id} onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} onDoubleClick={this.onDoubleClick} onChange={this.onTextChange} onBlur={this.onBlurOut} onClick={this.onSingleClick} style={styleCSS}>{(this.props.element.data as any).text}</textarea>
        }

        return (
            <div>
                {domElement}
            </div>
        )
    }
}