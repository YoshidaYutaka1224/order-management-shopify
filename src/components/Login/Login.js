/* eslint-disable */

import React, { Component } from 'react';
import { withRouter } from "react-router";
import { connect } from "react-redux";
import CustomLoader from '../../components/common/customLoader';
import { callLogin } from "../../Graphs/Login/Login";
import { getAllTags } from "../../Graphs/Tag/listTag";
import { notification } from "antd";
import gql from 'graphql-tag';
import { Query, withApollo } from 'react-apollo';
import Logo from "../../assets/images/logo.png";
import { withTranslation } from 'react-i18next';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fields : {
                email : "",
                password : ""
            },
            errors : {
                "email" : "",
                "password" : ""
            },
            isLoading : false
        };
    }

    //call Login method
    loginAuth = async () => {
       try{
            const { fields, errors } = this.state;
            const { history, setLoginFlag, setUserData, setUserToken, setListtagDictinary } = this.props;

            let subErrors = { ...errors };

            if(fields["email"] == ""){
                subErrors["email"] = "Please enter a valid email";
                subErrors["password"] = "";

                this.setState({
                    errors : subErrors
                });
                return;
            }

            if(fields["password"] == ""){
                subErrors["password"] = "Please enter a valid password";
                subErrors["email"] = "";

                this.setState({
                    errors : subErrors
                });
                return;
            }

            subErrors["password"] = "";
            subErrors["email"] = "";
            this.setState({
                errors : subErrors,
                isLoading : true
            });

            let loginData = await callLogin(fields["email"],fields["password"]);
            console.log("!!!!!!loginData", loginData.status);

            if(loginData.status == 500){
                throw loginData.message;
            }

            notification["success"]({
                message: 'Login',
                description:
                  'Login Successfully',
            });

            let tagData = await getAllTags(loginData.authToken, 0, 100000000);

            await setUserToken(loginData.authToken);
            await setUserData(loginData.data);
            await setLoginFlag(true);
            await setListtagDictinary(tagData.data);

            history.push(`${process.env.PUBLIC_URL}/dashboard`);
       }catch(err){
            console.log("Errror printed here", err);
            notification["error"]({
                message: 'Login',
                description: err,
            });
            
       } finally {
           this.setState({
               isLoading : false
           })
       }
    }

    //onchange of text input
    onChange = (text, name) => {
        const { fields } = this.state;
        let subFields = { ...fields };
        subFields[name] = text.target.value;
        this.setState({
            fields : subFields
        });
    }

    render() {
        const { errors, isLoading } = this.state
        return (
            <div>
                {
                    isLoading
                    ?
                    <CustomLoader />
                    :
                    null
                }
                <div className="page-wrapper">
                    <div className="container-fluid p-0">
                        {/* <!-- login page start--> */}
                        <div className="authentication-main">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="auth-innerright">
                                        <div className="authentication-box">
                                            <div className="text-center">
                                                <img className="blur-up lazyloaded header-logo header-login-logo" style={{ margin : "0 auto" }} src={Logo} alt="" />
                                            </div>
                                            <div className="card mt-4">
                                                <div className="card-body">
                                                    <div className="text-center">
                                                        <h4>{this.props.t('login')}</h4>
                                                        <h6>{this.props.t('enter_login_text')}} </h6>
                                                    </div>
                                                    <form className="theme-form" action={() => this.loginAuth()}>
                                                        <div className="form-group">
                                                            <label className="col-form-label pt-0">{this.props.t('email_label')}</label>
                                                            <input className="form-control" type="text" required onChange={(text) => this.onChange(text, "email")} />
                                                            <label className="col-form-label pt-0" style={{color : "red"}}>{errors["email"]}</label>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="col-form-label">{this.props.t('password_label')}</label>
                                                            <input className="form-control" type="password" required onChange={(text) => this.onChange(text, "password")} />
                                                            <label className="col-form-label pt-0" style={{color : "red"}}>{errors["password"]}</label>
                                                        </div>
                                                        <div className="form-group form-row mt-3 mb-0">
                                                            <button className="btn btn-primary btn-block" type="button" onClick={() => this.loginAuth()}>{this.props.t('login')}</button>
                                                        </div>
                                                        {/* <div className="login-divider"></div> */}
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <!-- login page end--> */}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    loginFlag: state.auth.loginFlag
});
  
const mapDispatchToProps = (dispatch) => {
    return {
        setLoginFlag: (flag) => {
            dispatch({
                type: 'SET_LOGIN_FLAG',
                flag: flag
            });
        },
        setUserData: (userData) => {
            dispatch({
                type: 'SET_USER_DATA',
                userData: userData
            });
        },
        setUserToken: (authToken) => {
            dispatch({
                type: 'SET_USER_AUTHTOKEN',
                authToken: authToken
            });
        },
        setListtagDictinary: (listTagDictionaryData) => {
            dispatch({
                type: 'SET_LIST_TAG_DICTIONARY',
                listTagDictionaryData: listTagDictionaryData
            });
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withApollo(withTranslation()(Login))));