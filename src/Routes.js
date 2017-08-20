import React, { Component } from "react";
import { HashRouter as Router, Route } from 'react-router-dom';
import CreatorPage from './react/page/CreatorPage';
import HomePage from './react/page/HomePage';
import VideoCreatorPage from './react/page/VideoCreatorPage';
import createHashHistory from 'history/createHashHistory';
import QuizPage from "./react/page/QuizPage";
import VideoPage from "./react/page/VideoPage";
import LoginPage from "./react/page/LoginPage";
import NavBar from "./react/components/NavBar";
import PrivateRoute from "./PrivateRoute";
import Helper from "./Helper";
import * as Auth from "./Auth";

export let history = createHashHistory();
export let lastRoute;

export default class Routes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            checkOnce: false,
        }
    }

    componentDidMount() {
        // init facebook SDK only once
        Helper.initFacebookSDK();

        // get the facebook login status
        Helper.getLoginStatus()
            .then((response) => {
                Auth.setAuthentication(true);
                this.setState({
                    isLoggedIn: true,
                    checkOnce: true
                });
            })
            .catch((message) => {
                this.setState({ checkOnce: true })
                console.log(message);
            })
    }

    render() {
        let routes = <Router history={history}>
            <div>
                <PrivateRoute exact path="/" component={HomePage} />
                <PrivateRoute exact path="/quizedit/:id" component={CreatorPage} />
                <PrivateRoute exact path="/videoedit/:id" component={VideoCreatorPage} />
                <PrivateRoute exact path="/newquiz" component={CreatorPage} />
                <PrivateRoute exact path="/newvideo" component={VideoCreatorPage} />
                <PrivateRoute exact path="/quiz" component={QuizPage} />
                <PrivateRoute exact path="/video" component={VideoPage} />
                <Route exact path="/login" component={LoginPage} />
            </div>
        </Router>
        if (this.state.checkOnce === false) {
            routes = <div></div>
        }

        return (
            <div>
                {routes}
            </div>
        )
    }
}