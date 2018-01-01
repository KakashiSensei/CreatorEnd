import * as React from "react";
import { Element, Point } from '../../../postImageConstants';
import { Dispatch } from 'redux';
import { editText, elementSelected } from '../../../actions';
import * as _ from 'lodash';

interface IProps {
    element: Element;
    dispatch: Dispatch<{}>;
}

interface IState {
    top: string;
    left: string;
    editable: boolean;
}

export default class BaseElement extends React.Component<IProps, IState> {
    private shiftCoordinates: Point;
    private htmlElement: HTMLElement;
    private containerElement: HTMLElement;

    constructor(props: IProps) {
        super(props);

        this.state = {
            top: "0px",
            left: "0px",
            editable: false
        }

        this.onDragStart = this.onDragStart.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onSingleClick = this.onSingleClick.bind(this);
    }

    componentDidMount() {
        this.htmlElement = this.refs[this.props.element.id] as HTMLElement;
        this.containerElement = document.getElementById("containerDiv");
        let top = this.htmlElement.style.top;
        let left = this.htmlElement.style.left;
        this.setState({
            top: top,
            left: left
        })
    }

    onDragStart(event) {
        // to avoid the default behaviour
        return false;
    }

    moveElement(point: Point): Point {
        //======================== this is workaround for the bug coming on dragging
        if (!this.shiftCoordinates)
            return;

        let newTop: number = point.y - this.containerElement.offsetTop - this.shiftCoordinates.y;
        let newLeft: number = point.x - this.containerElement.offsetLeft - this.shiftCoordinates.x;
        this.setState({
            top: newTop + "px",
            left: newLeft + "px"
        })
        return new Point(newTop, newLeft);
    }

    onMouseDown(event) {
        this.htmlElement = this.refs[this.props.element.id] as HTMLElement;
        let shiftX: number = event.clientX - this.htmlElement.getBoundingClientRect().left;
        let shiftY: number = event.clientY - this.htmlElement.getBoundingClientRect().top;
        this.shiftCoordinates = new Point(shiftX, shiftY);
        this.moveElement(new Point(event.pageX, event.pageY));
        document.addEventListener('mousemove', this.onMouseMove);
    }

    onMouseMove(event) {
        this.moveElement(new Point(event.pageX, event.pageY));
    }

    onMouseUp(event) {
        document.removeEventListener('mousemove', this.onMouseMove);
        let point = this.moveElement(new Point(event.pageX, event.pageY));
        //===================== this is workaround for the bug coming on dragging
        if (!point) {
            return;
        }
        let elementPosition = { top: point.x + "px", left: point.y + "px" };
        this.props.dispatch(editText(this.props.element, elementPosition, null));
    }

    onSingleClick(event) {
        let id: string = this.props.element.id;
        this.props.dispatch(elementSelected(id));
    }
}