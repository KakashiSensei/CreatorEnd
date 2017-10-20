import * as React from "react";
import { HashRouter as Router, Route } from 'react-router-dom';
import CreatorPage from './react/page/CreatorPage';
import HomePage from './react/page/HomePage';
import VideoCreatorPage from './react/page/VideoCreatorPage';
import createHashHistory from 'history/createHashHistory';
import QuizPage from "./react/page/QuizPage";
import VideoPage from "./react/page/VideoPage";
import ImagePage from "./react/page/ImagePage";
import LoginPage from "./react/page/LoginPage";
import NavBar from "./react/components/NavBar";
import PrivateRoute from "./PrivateRoute";
import Helper from "./Helper";
import Auth from "./Auth";
import Requests from "./Requests";
import { IUserDetail, IPageDetail } from "./Definition";
import * as _ from "lodash";
import PageList from "./react/components/pageList";

export let history = createHashHistory();

interface IProps {
}

interface IState {
    isLoggedIn: boolean,
    pageSelected: boolean,
    pageList: Array<IPageDetail>
}

export default class Routes extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            isLoggedIn: false,
            pageSelected: false,
            pageList: []
        }

        this.onPageSelect = this.onPageSelect.bind(this);
    }

    onPageSelect() {
        this.setState({
            pageSelected: true
        })
    }

    componentDidMount() {
        // init facebook SDK only once
        Helper.initFacebookSDK();

        // get the facebook login status
        Helper.getLoginStatus()
            .then((response) => {
                let accessToken = (response as any)["authResponse"]["accessToken"];
                Requests.pageList(accessToken).then((response) => {
                    let allowedRoles: Array<String> = ["ADMINISTER", "EDIT_PROFILE", "CREATE_CONTENT", "MODERATE_CONTENT"];
                    let allowedPermission: Array<IPageDetail> = response.data;
                    let filterOutData: Array<IPageDetail> = _.filter(allowedPermission, (value: IPageDetail) => {
                        let flag: boolean = false;
                        let permissionArray: Array<String> = value.perms;
                        for (let i = 0; i < permissionArray.length; i++) {
                            let permission: String = permissionArray[0];
                            if (allowedRoles.indexOf(permission) > -1) {
                                flag = true;
                                break;
                            }
                        }
                        return flag;
                    })
                    this.setState({
                        pageList: filterOutData
                    })
                })

                Requests.getAccountDetails(accessToken).then((res) => {
                    let accountInfo = {
                        name: res.name,
                        email: res.email,
                        facebookID: res.id
                    }

                    Requests.addLoginInformation(accountInfo as IUserDetail).then((res) => {
                        let accountData: IUserDetail = {
                            name: res.name,
                            email: res.email,
                            facebookID: res.id,
                            type: res.type
                        };
                        Auth.setAccessToken(accessToken);
                        Auth.setAuthentication(true);
                        Auth.setUserDetail(accountData);
                        this.setState({
                            isLoggedIn: true
                        });
                    })
                })
            })
            .catch((message) => {
                this.setState({ isLoggedIn: true })
                console.log(message);
            })
    }

    render() {
        let routes = <Router>
            <div>
                <PrivateRoute exact path="/" component={HomePage} />
                <PrivateRoute exact path="/quizedit/:id" component={CreatorPage} />
                <PrivateRoute exact path="/videoedit/:id" component={VideoCreatorPage} />
                <PrivateRoute exact path="/newquiz" component={CreatorPage} />
                <PrivateRoute exact path="/newvideo" component={VideoCreatorPage} />
                <PrivateRoute exact path="/quiz" component={QuizPage} />
                <PrivateRoute exact path="/video" component={VideoPage} />
                <PrivateRoute exact path="/newimage" component={ImagePage} />
                <Route exact path="/login" component={LoginPage} />
            </div>
        </Router>
        if (this.state.isLoggedIn === false) {
            routes = <div></div>
        } else if (!this.state.pageSelected) {
            routes = <PageList pageList={this.state.pageList} onPageSelect={this.onPageSelect}></PageList>
        }

        return (
            <div>
                {routes}
            </div>
        )
    }
}