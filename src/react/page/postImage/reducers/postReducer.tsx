import { handleActions, Action, combineActions } from "redux-actions";
import {
    ADD_CONTAINER,
    ADD_TEXT,
    ADD_BACKGROUND,
    EDIT_TEXT,
    EDIT_BACKGROUND,
    DELETE_ELEMENT,
    Element,
    State
} from "../postImageConstants";
import { addText, editText, addBackground, editBackground } from "../actions"

const initialState: State = new State();

export default handleActions<State, Element>({
    [combineActions(editText, editBackground)](state: State, action: Action<Element>) {
        let newState: State = new State();
        newState.container = { ...state.container };
        newState.components = [...state.components];
        newState.components.map((value, key) => {
            if (action.payload.id === value.id) {
                return action.payload;
            }
            return value;
        })
        return newState;
    },
    [ADD_TEXT]: (state: State, action: Action<Element>): State => {
        let newState: State = new State();
        newState.container = { ...state.container };
        newState.components = [...state.components, action.payload.element];
        return newState;
    },

    [ADD_CONTAINER]: (state: State, action: Action<Element>): State => {
        let newState = { ...state };
        newState.container = action.payload.element;
        return newState;
    }
}, initialState);