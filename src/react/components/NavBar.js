import React, { Component } from "react";
import { Navbar, NavItem, Dropdown, Link, Button } from 'react-materialize';
import Helper from "../../Helper";
import { history, lastRoute } from '../../Routes';

export default class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
        }
        this.onLoginClicked = this.onLoginClicked.bind(this);
        this.onLogoutClicked = this.onLogoutClicked.bind(this);
    }

    componentDidMount() {
        Helper.getLoginStatus()
            .then((response) => this.updateLoginDetails(response))
            .catch((response) => {
                console.log("Promise rejected");
            })
    }

    onLoginClicked(e) {
        Helper.loginFacebook().then((response) => {
            return this.updateLoginDetails(response);
        })
    }

    updateLoginDetails(response) {
        let uid = response.authResponse.userID;
        let accessToken = response.authResponse.accessToken;
        FB.api('me?fields=first_name,picture', (response) => {
            this.firstName = response.first_name;
            this.profilePicture = response.picture.data.url;
            this.facebookID = uid;
            this.accessToken = accessToken;
            this.setState({
                loggedIn: true
            })
        });
    }

    render() {
        let loginTag = <NavItem onClick={this.onLoginClicked}>login</NavItem>;
        if (this.state.loggedIn) {
            let options = { "belowOrigin": true, "hover": true };
            loginTag =
                <NavItem>
                    <Dropdown options={options} trigger={
                        <div>
                            <img className="iconImageSize circle" src={this.profilePicture} />
                            <span className="basePadding">{this.firstName}</span>
                        </div>
                    }>
                        <NavItem onClick={this.onLogoutClicked}>Logout</NavItem>
                    </Dropdown>
                </NavItem>
        }

        let logOut = <div></div>;
        return (
            <div>
                <Navbar className="backgroundColor" brand='logo' right>
                    {loginTag}
                </Navbar>
            </div>
        )
    }

    onLogoutClicked(e) {
        FB.logout((response) => {
            document.location.replace('/#/login');
        });
    }
}