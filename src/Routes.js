import React, { Component } from "react";
import { HashRouter as Router, Route } from 'react-router-dom';
import CreatorPage from './react/page/CreatorPage';
import HomePage from './react/page/HomePage';
import VideoCreatorPage from './react/page/VideoCreatorPage';
import createHashHistory from 'history/createHashHistory';

export let history = createHashHistory();

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
                </div>
            </Router>
        )
    }
}