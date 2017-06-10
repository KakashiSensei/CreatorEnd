import React, { Component } from "react";
import { HashRouter as Router, Route } from 'react-router-dom';
import CreatorPage from './react/page/CreatorPage';
import HomePage from './react/page/HomePage';
import createHashHistory from 'history/createHashHistory';

export let history = createHashHistory();

export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <div>
                    <Route exact path="/" component={HomePage} />
                    <Route exact path="/edit/:id" component={CreatorPage} />
                    <Route exact path="/new" component={CreatorPage} />
                </div>
            </Router>
        )
    }
}