import React, { Component } from "react";
import { HashRouter as Router, Route } from 'react-router-dom';
import CreatorPage from './react/page/CreatorPage';
import HomePage from './react/page/HomePage';
import VideoCreatorPage from './react/page/VideoCreatorPage';
import createHashHistory from 'history/createHashHistory';
import QuizPage from "./react/page/QuizPage";
import VideoPage from "./react/page/VideoPage";
import LoginPage from "./react/page/LoginPage";
import PrivateRoute from "./PrivateRoute";

export let history = createHashHistory();
export let lastRoute;

export default class Routes extends Component {
    render() {
        let PrivateComp = PrivateRoute(<Route exact path="/" component={HomePage} />);
        let homePage = <PrivateComp />;
        return (
            <Router history={history}>
                <div>
                    {homePage}
                    <Route exact path="/login" component={LoginPage} />
                    <Route exact path="/quizedit/:id" component={CreatorPage} />
                    <Route exact path="/videoedit/:id" component={VideoCreatorPage} />
                    <Route exact path="/newquiz" component={CreatorPage} />
                    <Route exact path="/newvideo" component={VideoCreatorPage} />
                    <Route exact path="/quiz" component={QuizPage} />
                    <Route exact path="/video" component={VideoPage} />
                </div>
            </Router>
        )
    }

    logout(nextState, replace) {
        FB.logout(function (response) {
            debugger;
        });
    }
}