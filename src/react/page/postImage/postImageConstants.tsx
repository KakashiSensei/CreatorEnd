import * as _ from "lodash";

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

export class ContainerElement extends Element {
    constructor() {
        super();
        this.props = _.assign(this.props, {
            backgroundColor: '#CCCCCC',
            width: '698px',
            height: '367px',
            margin: '0px',
            padding: '0px',
            overflow: 'hidden'
        })
    }
}

export class TextElement extends Element {
    constructor(text: string) {
        super();
        this.data = _.assign(this.data, { text: text });
        this.type = "TextField";
        this.props = _.assign(this.props, {
            position: 'absolute',
            color: '#FAEBD7',
            left: '200px',
            top: '200px',
            width: '500px',
            fontSize: '25px',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            KhtmlUserSelect: 'none',
            MozUserSelect: 'none',
            MsUserSelect: 'none',
            userSelect: 'none'
        })
    }
}

export class BackgroundElement extends Element {
    constructor(){
        super();
        this.type = "Background";
        this.props = _.assign(this.props, {
            position: 'absolute',
            backgroundColor: "#FFFF00",
            background: 'url("https://static.pexels.com/photos/34950/pexels-photo.jpg")50% 50% no-repeat',
            backgroundSize: 'cover',
            imageRendering: '-webkit-optimize-contrast',
            width: '100%',
            height: '100%'
        })
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