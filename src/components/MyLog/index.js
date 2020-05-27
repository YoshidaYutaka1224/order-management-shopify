/* eslint-disable */

import React, { Fragment, Component } from 'react';
import Title from './Title';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getAllUsers } from "../../Graphs/User/listUser";
import { createUser } from "../../Graphs/User/createUser";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { Spin, notification, Timeline } from "antd";
import { getAllOrderLogs } from "../../Graphs/Order/listOrderLogs";
import { getAllUserLogs } from "../../Graphs/User/listUserAllLogs";
import * as la from "lodash";
import { withTranslation } from 'react-i18next';

var moment = require("moment");

class MyLog extends Component {
    constructor(props){
        super(props);
        this.state = {
            userList : [],
            isLoading : false,
            primaryColor: "#4466f2",
            userLogsData: []
        }
    }

    async componentDidMount() {
        try{
            const { authToken, history, setLoginFlag, setUserData, setUserToken, setListUserData, setListUserDataTotal, setRouteName, setSearchText, loginUserData } = this.props;
            let editPrimaryColor = await localStorage.getItem('primary_color');
            console.log("!!!!!!!!editPrimaryColor", editPrimaryColor);

            await setRouteName("MYLOGS");
            await setSearchText("");

            this.setState({
                isLoading : true,
                primaryColor: editPrimaryColor
            });

            await this.listMyLogs();

        }catch(e){
            console.log("!!!!!!!!error in did mount", e);
        } finally {
            this.setState({
                isLoading : false
            });
        }
    }

    async listMyLogs() {
        try{
            const { authToken, history, setLoginFlag, setUserData, setUserToken, setListUserData, setListUserDataTotal, loginUserData } = this.props;

            this.setState({
                isLoading : true,
            });

            let userCustomLogsData = await getAllUserLogs(authToken, loginUserData.id);

            if(userCustomLogsData.status == 200){
                //set user data
                this.setState({
                    userLogsData : userCustomLogsData.data,
                    isLoading : false
                });
                
            }else if (userCustomLogsData.status == 401) {
                await setLoginFlag(false);
                await setUserData(null);
                await setUserToken(null);
                history.push(`${process.env.PUBLIC_URL}/login`);
            }

        }catch(e){
            console.log("!!!!!!!!error in did mount", e);
        } finally {
            this.setState({
                isLoading : false
            });
        }
    }

    dateFormat(date) {
        var oldDate = new Date(date),
        momentObj = moment(oldDate).utc(),
        newDate = momentObj.format("Do MMM YYYY HH:mm");
    
        return newDate;
    }

    render() {
        const  { isLoading, userLogsData } = this.state;

        return (
            <Fragment>
                <Title parent={this.props.t('MYLOGS')} title={this.props.t('MYLOGS')} />
   
                <div className="container-fluid">
                    {
                        isLoading
                        ?
                        <div style={{ marginLeft: "20px" }}>
                            <Spin
                            size="large"
                            style={{ marginLeft: "480px", marginTop: "130px" }}
                            />
                        </div> 
                        :
                        <div className="logs-wrap">
                            {
                                userLogsData.length > 0 ? (
                                    <Timeline>
                                        {
                                            la.map(userLogsData, (data, index) => {
                                                let oldTagArray = JSON.parse(data.old_tags);
                                                let newTagArray = JSON.parse(data.new_tags);

                                                let oldTagString = "";
                                                let newTagString = "";

                                                la.map(oldTagArray, (oldData, oldIndex) => {
                                                    if(oldIndex === (oldTagArray.length - 1)){
                                                        oldTagString = oldTagString + oldData;
                                                        return;
                                                    }

                                                    oldTagString = oldTagString + oldData + ", ";
                                                })

                                                la.map(newTagArray, (newData, newIndex) => {
                                                    if(newIndex === (newTagArray.length - 1)){
                                                        newTagString = newTagString + newData;
                                                        return;
                                                    }

                                                    newTagString = newTagString + newData + ", ";
                                                })

                                                return (
                                                    <Timeline.Item>
                                                        {oldTagString === "" ? `${data.order_name} - ${data.user_name} changed status to ${newTagString} on ${this.dateFormat(data.changed_at)}` :  `${data.order_name} - ${data.user_name} changed status from ${oldTagString} to ${newTagString} on ${this.dateFormat(data.changed_at)}`}
                                                    </Timeline.Item>
                                                )
                                            })
                                        }
                                    </Timeline>
                                ) : (
                                    <div>
                                        No Logs for this order
                                    </div>
                                )
                            }
                        </div>
                    }
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    authToken: state.auth.authToken,
    loginUserData : state.auth.loginUserData
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
        setListUserData: (listUserData) => {
            dispatch({
                type : "SET_LIST_USER_DATA",
                listUserData : listUserData
            })
        },
        setListUserDataTotal: (listUserDataTotal) => {
            dispatch({
                type : "SET_LIST_USER_DATA_TOTAL",
                listUserDataTotal : listUserDataTotal
            })
        },
        setRouteName: (routeName) => {
            dispatch({
                type : "SET_ROUTE_NAME",
                routeName : routeName
            })
        },
        setSearchText: (searchText) => {
            dispatch({
                type : "SET_SEARCH_TEXT",
                searchText : searchText
            })
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withTranslation()(MyLog)));