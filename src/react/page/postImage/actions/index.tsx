import { createAction } from 'redux-actions';
import * as _ from 'lodash';
import {
    ADD_CONTAINER,
    ADD_TEXT,
    ADD_BACKGROUND,
    EDIT_TEXT,
    EDIT_BACKGROUND,
    DELETE_ELEMENT,
    ELEMENT_SELECTED,
    Element
} from "../postImageConstants";

const addContainer = createAction<Element, Element>(
    ADD_CONTAINER,
    (element: Element) => ({ element: element })
)

const addText = createAction<Element, Element>(
    ADD_TEXT,
    (element: Element) => ({ element: element })
)

const addBackground = createAction<Element, Element>(
    ADD_BACKGROUND,
    (element: Element) => ({ element: element })
)

const editText = createAction<Element, Element, Object>(
    EDIT_TEXT,
    (element: Element, props: Object, data: Object) => {
        _.assign(element.props, props);
        // assign only if data is provided
        if (data !== null) {
            _.assign(element.data, data);
        }
        return element;
    }
)

const editBackground = createAction<Element, Element, Object>(
    EDIT_BACKGROUND,
    (element: Element, props: Object) => {
        return _.assign(element.props, props);
    }
)

const deleteElement = createAction<Element, Element>(
    DELETE_ELEMENT,
    (element: Element) => ({ element: element })
)

const elementSelected = createAction<string, string>(
    ELEMENT_SELECTED,
    (string: string) => ({string: string})
)

export {
    addContainer,
    addText,
    editText,
    addBackground,
    editBackground,
    deleteElement,
    elementSelected
}