export const ADD_CONTAINER = "addContainer";
export const ADD_TEXT = "addText";
export const ADD_BACKGROUND = "addBackground";
export const EDIT_TEXT = "editText";
export const EDIT_BACKGROUND = "editBackground";
export const DELETE_ELEMENT = "deleteElement";

export class Point {
    x: number;
    y: number;
    constructor(_x: number, _y: number) {
        this.x = _x;
        this.y = _y;
    }
}

export class Element {
    id: string;
    type: string;
    data: Object;
    props: Object;
    constructor() {
        this.id = Date.now().toString();
        this.data = {};
        this.props = {
            position: 'relative',
            display: 'inline-block',
            margin: '0px',
            padding: '0px'
        }
    }
}

export class State {
    container: Element;
    components: Element[];
    constructor() {
        this.container = new Element();
        this.components = new Array<Element>();
    }
}