import React, { Component } from "react";
import { Route } from 'react-router-dom';
import Helper from "./Helper";
import LoginPage from "./react/page/LoginPage";

export default function PrivateRoute(wrappedComponent) {
    return class checkFunc extends Component {
        constructor(props) {
            super(props);
            this.state = {
                authenticated: null
            }
            Helper.getLoginStatus()
                .then((response) => {
                    if (response.status === "connected") {
                        this.setState({ authenticated: true })
                    } else {
                        this.setState({ authenticated: false })
                    }
                })
                .catch(() => {
                    this.setState({ authenticated: false })
                })
        }

        render() {
            let renderComp = <div></div>;
            if (this.state.authenticated === true) {
                renderComp = wrappedComponent
            } else if (this.state.authenticated === false) {
                renderComp = <LoginPage />
            }
            return (
                <div>
                    {renderComp}
                </div>
            )
        }
    }
}