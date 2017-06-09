import React from "react";
import ReactDOM from "react-dom";
import HomePage from "./react/page/HomePage";

import "materialize-css/bin/materialize.css";
import "materialize-css/bin/materialize.js";
import "./react/css/main.css";
import "./react/css/creator.css";

window.onload = () => {
  ReactDOM.render(<HomePage/>, document.getElementById('app'));
};