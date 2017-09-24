import * as React from "react";
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import { Button } from 'react-materialize';
import Helper from '../../Helper';
import { history } from '../../Routes';
import Auth from '../../Auth';
import Requests from "../../Requests";
import { IUserDetail } from "../../Definition";

interface IProps {

}

interface IState {
    loggedIn: boolean;
}

export default class LoginPage extends React.Component<IProps, IState> {
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
                let accessToken = (response as any).authResponse.accessToken;
                Requests.getAccountDetails(accessToken).then((res) => {
                    let accountData: IUserDetail = {
                        name: res.name,
                        email: res.email,
                        facebookID: res.id
                    };

                    Requests.addLoginInformation(accountData).then((res) => {
                        accountData.type = res.type;
                        Auth.setAccessToken(accessToken);
                        Auth.setAuthentication(true);
                        Auth.setUserDetail(accountData);
                        this.setState({ loggedIn: true });
                    })
                })
            })
            .catch(() => {
                console.log("Problem in logging in");
            })
    }

    render() {
        let domElement = <Button waves='light' onClick={this.onLoginClicked}>Login With Facebook</Button>;
        let locationToRedirect = ((this.props as any).location.state && (this.props as any).location.state.from.pathname) || "/";
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