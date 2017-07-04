import React, { Component } from "react";
import { HashRouter as Router, Route } from 'react-router-dom';
import CreatorPage from './react/page/CreatorPage';
import HomePage from './react/page/HomePage';
import VideoCreatorPage from './react/page/VideoCreatorPage';
import createHashHistory from 'history/createHashHistory';
import QuizPage from "./react/page/QuizPage";
import VideoPage from "./react/page/VideoPage";

export let history = createHashHistory();
export let lastRoute;

export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <div>
                    <Route exact path="/" component={HomePage} />
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
}