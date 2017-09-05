import React, { Component } from "react";
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import { Button } from 'react-materialize';
import Helper from '../../Helper';
import { history } from '../../Routes';
import * as Auth from '../../Auth';
import Requests from "../../Requests";

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
                // console.log("Login response", response);
                // Auth.setAuthentication(true);
                // Auth.setUserDetail(accountData);
                // Auth.setAccessToken(accessToken);
                // this.setState({ loggedIn: true });
                console.log("response", response);
                let accessToken = response.authResponse.accessToken;
                Requests.getAccountDetails(accessToken).then((res) => {
                    let accountData = {};
                    accountData.name = res.name;
                    accountData.email = res.email;
                    accountData.facebookID = res.id;
                    console.log("accountData", accountData);
                    Requests.addLoginInformation(accountData).then((res) => {
                        console.log("New Account added", res);
                        accountData.type = res.type;
                        Auth.setAccessToken(accessToken);
                        Auth.setAuthentication(true);
                        Auth.setUserDetail(accountData);
                        this.setState({
                            isLoggedIn: true,
                            checkOnce: true
                        });
                    })
                })
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