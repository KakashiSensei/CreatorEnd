import React, { Component } from "react";
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import { Button } from 'react-materialize';
import Helper from '../../Helper';
import { history } from '../../Routes';
import * as Auth from '../../Auth';

export default class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false
        }
        this.onLoginClicked = this.onLoginClicked.bind(this);
    }

    onLoginClicked(e) {
        Helper.loginFacebook()
            .then((response) => {
                Auth.setAuthentication(true);
                this.setState({ loggedIn: true });
            })
            .catch(() => {
                console.log("Problem in logging in");
            })
    }

    render() {
        let domElement = <Button waves='light' onClick={this.onLoginClicked}>Login With Facebook</Button>;
        let locationToRedirect = (this.props.location.state && this.props.location.state.from.pathname) || "/";
        if (this.state.loggedIn) {
            domElement = <Redirect to={{
                pathname: locationToRedirect
            }} />
        }
        return (
            <div>
                {domElement}
            </div>
        )
    }
}