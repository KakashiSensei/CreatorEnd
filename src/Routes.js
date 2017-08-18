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
        const PrivateComp = PrivateRoute(<Route exact path="/" component={HomePage} />);
        const homePage = <PrivateComp />;

        const QuizEditHOC = PrivateRoute(<Route exact path="/quizedit/:id" component={CreatorPage} />);
        const quizEdit = <QuizEditHOC/>;

        const VideoCreatorHOC = PrivateRoute(<Route exact path="/videoedit/:id" component={VideoCreatorPage} />);
        const videoEdit = <VideoCreatorHOC />;

        const NewQuizHOC = PrivateRoute(<Route exact path="/newquiz" component={CreatorPage} />);
        const newQuiz = <NewQuizHOC />;

        const NewVideoHOC = PrivateRoute(<Route exact path="/newvideo" component={VideoCreatorPage} />);
        const newVideo = <NewVideoHOC />;

        const QuizPageHOC = PrivateRoute(<Route exact path="/quiz" component={QuizPage} />);
        const quizPage = <QuizPageHOC/>;

        const VideoPageHOC = PrivateRoute(<Route exact path="/video" component={VideoPage} />);
        const videoPage = <VideoPageHOC />;

        return (
            <Router history={history}>
                <div>
                    <Route exact path="/login" component={LoginPage} />
                    {homePage}
                    {quizEdit}
                    {videoEdit}
                    {newQuiz}
                    {newVideo}
                    {videoPage}
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