import React from "react";
import ReactDOM from "react-dom";
import Routes from "./Routes";

import "materialize-css/bin/materialize.css";
import "materialize-css/bin/materialize.js";
import "./react/css/main.css";
import "./react/css/creator.css";

window.onload = () => {
  ReactDOM.render(<Routes/>, document.getElementById('app'));
};