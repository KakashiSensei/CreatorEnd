import * as _ from "lodash";

export const ADD_CONTAINER = "addContainer";
export const ADD_TEXT = "addText";
export const ADD_BACKGROUND = "addBackground";
export const EDIT_TEXT = "editText";
export const EDIT_BACKGROUND = "editBackground";
export const DELETE_ELEMENT = "deleteElement";
export const ELEMENT_SELECTED = "elementSelected";
export const UPDATE_INITIALSTATE = "updateInitialState";
export const RESET_INITIAL_STATE = "resetInitialState";

export let Colors = ["#000000", "#FFFFFF", "#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722", "#795548", "#9E9E9E", "#607D8B"];

export class Point {
    x: number;
    y: number;
    constructor(_x: number, _y: number) {
        this.x = _x;
        this.y = _y;
    }
}

export interface FontStructure {
    url: string;
    name: string;
    ttf: string;
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
    constructor(text: string, props?: Object) {
        super();
        this.data = _.assign(this.data, { text: text });
        this.type = "TextField";
        this.props = _.assign(this.props, {
            position: 'absolute',
            color: '#FAEBD7',
            width: '500px',
            fontSize: '25px',
            fontFamily: 'Pacifico',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            KhtmlUserSelect: 'none',
            MozUserSelect: 'none',
            MsUserSelect: 'none',
            userSelect: 'none',
            zIndex: 1,
            whiteSpace: 'pre-wrap'
        })
        // replace default props with passed props
        this.props = _.assign(this.props, props);
    }
}

export class BackgroundElement extends Element {
    constructor(props?: Object) {
        super();
        this.type = "Background";
        // make random color
        let random = Math.floor(Colors.length * Math.random());
        let color = Colors[random];
        this.props = _.assign(this.props, {
            position: 'absolute',
            backgroundColor: color,
            backgroundRepeat: `no-repeat`,
            backgroundPosition: `50% 50%`,
            backgroundSize: 'cover',
            imageRendering: '-webkit-optimize-contrast',
            width: '100%',
            height: '100%',
            zIndex: 0
        })

        // replace default props with passed props
        this.props = _.assign(this.props, props);
    }
}

export class State {
    selectedElement: string;
    container: Element;
    components: Element[];
    constructor() {
        this.container = new Element();
        this.components = new Array<Element>();
    }
}