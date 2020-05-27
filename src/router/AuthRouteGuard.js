/* eslint-disable */

import * as React from "react";
import { Route, Redirect } from "react-router-dom";
import { Component } from "react";
import { connect } from "react-redux";

class AuthRouteGaurdComponent extends Component {

    render() {
        return (
            <PrivateRoute
                component={this.props.component}
                isAuthenticated={this.props.loginFlag}
                {...this.props}
            />
        );
    }
}

function PrivateRoute({
  component: Component,
  isAuthenticated,
  ...rest
}) {

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated === true ? (
          <Component {...props} />
        ) : (
          <Redirect to={"/login"} />
        )
      }
    />
  );
}

const mapStateToProps = state => ({
    loginFlag: state.auth.loginFlag
});
  
const mapDispatchToProps = (dispatch) => {
    return {};
}

export const AuthRouteGaurd = connect(mapStateToProps, mapDispatchToProps)(AuthRouteGaurdComponent);

