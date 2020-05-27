/* eslint-disable */

import React, { Component, Fragment } from "react";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Default from '../components/dashboard/defaultCompo/default';
import Login from '../components/Login/Login';
import App from "../components/app";
import { connect } from "react-redux";
import { AuthRouteGaurd } from "./AuthRouteGuard";
import { UnAuthRouteGaurd } from './UnAuthRouteGuard';
import User from "../components/User";
import Order from "../components/Order";
import Tag from "../components/Tag";
import Setting from "../components/Setting";
import MyLog from "../components/MyLog";

class Router extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const { loginFlag } = this.props;
        console.log("!!!!!!!!!!!!!!!loginFlag in router printed here", loginFlag);

        return (
            <Switch>
                <UnAuthRouteGaurd  exact path={`${process.env.PUBLIC_URL}/login`} component={Login}/>
                <Fragment>
                    <App>
                        {/* dashboard menu */}
                        <AuthRouteGaurd  exact path={`${process.env.PUBLIC_URL}/`} component={Default} />
                        <AuthRouteGaurd  exact path={`${process.env.PUBLIC_URL}/dashboard`} component={Default} />
                        <AuthRouteGaurd  exact path={`${process.env.PUBLIC_URL}/user`} component={User} />
                        <AuthRouteGaurd  exact path={`${process.env.PUBLIC_URL}/order`} component={Order} />
                        <AuthRouteGaurd  exact path={`${process.env.PUBLIC_URL}/tag`} component={Tag} />
                        <AuthRouteGaurd  exact path={`${process.env.PUBLIC_URL}/setting`} component={Setting} />
                        <AuthRouteGaurd  exact path={`${process.env.PUBLIC_URL}/mylog`} component={MyLog} />
                    </App>
                </Fragment>
            </Switch>
        )
    }
}

const mapStateToProps = state => ({
    loginFlag: state.auth.loginFlag
});
  
const mapDispatchToProps = (dispatch) => {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Router);