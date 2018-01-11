import * as React from "react";
import * as ReactDOM from "react-dom";
import Routes from "./Routes";

import { Provider } from 'react-redux'
import { Store, createStore } from 'redux'
import rootReducer from './reducers';
import "materialize-css/dist/js/materialize.js";
import "materialize-css/dist/css/materialize.css";
import "./react/css/main.css";
import "./react/css/creator.css";

const initialState = {};
let store: Store<any> = createStore(rootReducer, initialState)

window.onload = () => {
  ReactDOM.render(
    <Provider store={store}>
      <Routes />
    </Provider>, document.getElementById('app'));
};