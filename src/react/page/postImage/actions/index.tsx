import { createAction } from 'redux-actions';
import {
    ADD_CONTAINER,
    ADD_TEXT,
    ADD_BACKGROUND,
    EDIT_TEXT,
    EDIT_BACKGROUND,
    DELETE_ELEMENT,
    Element
} from "../postImageConstants";

const addContainer = createAction<Element, Element>(
    ADD_CONTAINER,
    (element:Element) => ({element: element})
)

const addText = createAction<Element, Element>(
    ADD_TEXT,
    (element:Element) => ({element: element})
)

const editText = createAction<Element, Element, Object>(
    EDIT_TEXT,
    (element:Element) => ({element: element})
)

const addBackground = createAction<Element, Element>(
    ADD_BACKGROUND,
    (element:Element) => ({element: element})
)

const editBackground = createAction<Element, Element, Object>(
    EDIT_BACKGROUND,
    (element: Element, props: Object) => ({...element, props: props})
)

const deleteElement = createAction<Element, Element>(
    DELETE_ELEMENT,
    (element:Element) => ({element: element})
)

export {
    addContainer,
    addText,
    editText,
    addBackground,
    editBackground,
    deleteElement
}