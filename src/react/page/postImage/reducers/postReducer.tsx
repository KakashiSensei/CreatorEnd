import { handleActions, Action, combineActions } from "redux-actions";
import {
    ADD_CONTAINER,
    ADD_TEXT,
    ADD_BACKGROUND,
    EDIT_TEXT,
    EDIT_BACKGROUND,
    DELETE_ELEMENT,
    ELEMENT_SELECTED,
    UPDATE_INITIALSTATE,
    RESET_INITIAL_STATE,
    Element,
    State
} from "../postImageConstants";
import { addText, editText, addBackground, editBackground } from "../actions"

const initialState: State = new State();

export default handleActions<State, Element>({
    [combineActions(editText, editBackground)](state: State, action: Action<Element>) {
        let newState = { ...state };
        newState.components = [];
        newState.components = state.components.map((value, key) => {
            if (action.payload.id === value.id) {
                return action.payload;
            }
            return value;
        })
        return newState;
    },
    [combineActions(addText, addBackground)]: (state: State, action: Action<Element>): State => {
        let newState = { ...state };
        newState.components = [...state.components, action.payload.element];
        return newState;
    },

    [ADD_CONTAINER]: (state: State, action: Action<Element>): State => {
        let newState = { ...state };
        newState.container = action.payload.element;
        return newState;
    },

    [ELEMENT_SELECTED]: (state: State, action: Action<Element>): State => {
        let newState = { ...state };
        newState.selectedElement = action.payload.string;
        return newState;
    },
    [UPDATE_INITIALSTATE]: (state: State, action: Action<State>): State => {
        let newState = action.payload.string;
        return newState;
    },
    [RESET_INITIAL_STATE]: (state: State, action: Action<State>): State => {
        let newState = new State();
        return newState;
    }

}, initialState);