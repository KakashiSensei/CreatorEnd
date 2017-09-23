import { Route, Redirect, } from 'react-router-dom';
import Auth from "./Auth";
import React, { Component } from "react";
import NavBar from "./react/components/NavBar";

// let PrivateRoute = ({ component: Component, ...rest }) => (
let PrivateRoute = ({...rest }) => (
    <Route {...rest} render={props => (
        Auth.isAuthenticated() ? (
            <div>
                <NavBar></NavBar>
                <Component {...props} />
            </div>
        ) : (
                <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                }} />
            )
    )} />
)

// interface IProps {
//     exact: boolean;
//     path: string;
//     component: React.Component;
// }

// interface IState {
// }

// export default class PrivateRoute extends Component<{}, {}>{
//     constructor(props: IProps) {
//         super(props);
//     }

//     render() {
//         let component: JSX.Element = Auth.isAuthenticated() ? (
//             <div>
//                 <NavBar></NavBar>
//                 <Component {...this.props} />
//             </div>
//         ) : (
//                 <Redirect to={{
//                     pathname: '/login',
//                     state: { from: this.props.location }
//                 }} />
//             )
//         return component;
//     }
// }

export default PrivateRoute;