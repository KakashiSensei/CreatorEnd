import { Route, Redirect, } from 'react-router-dom';
import Auth from "./Auth";
import * as React from "react";
import NavBar from "./react/components/NavBar";

let PrivateRoute = ({ component: Component, ...rest }) => (
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

export default PrivateRoute;