import * as React from "react";
import * as ReactDOM from "react-dom";
import Routes from "./Routes";

import "materialize-css/dist/css/materialize.css";
import "materialize-css/dist/js/materialize.js";
import "./react/css/main.css";
import "./react/css/creator.css";

window.onload = () => {
  ReactDOM.render(<Routes/>, document.getElementById('app'));
};