/* eslint-disable */

import React, { Fragment, Component } from 'react';
import Title from './Title';
import CountUp from 'react-countup';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Navigation, MessageSquare, Users, ShoppingBag, Layers, ShoppingCart, DollarSign, ArrowDown, ArrowUp, CloudDrizzle } from 'react-feather';
import { getAllFilter } from "../../Graphs/Setting/filter/listFilter";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import  SearchHeader from "../common/header-component/searchHeader";
import { Input, Select, Button, Spin, Icon, notification, Tabs } from "antd";
import FilterRecordsTable from "./Filter/FilterRecordsTable";
import ColumnPage  from "./Column/index";
import { withTranslation } from 'react-i18next';

const TabPane = Tabs.TabPane;

class Setting extends Component {
    constructor(props){
        super(props);
        this.state = {
            tagList : [],
            tagTotal : 0,
            isLoading : false,
            primaryColor: "#4466f2"
        }
    }

    async componentDidMount() {
        try{
            const { authToken, history, setLoginFlag, setUserData, setUserToken, setListFilterData, setListFilterDataTotal, setRouteName, setSearchText, loginUserData } = this.props;
            let editPrimaryColor = await localStorage.getItem('primary_color');
            console.log("!!!!!!!!editPrimaryColor", editPrimaryColor);

            await setRouteName("SETTING");
            await setSearchText("");

            this.setState({
                isLoading : true,
                primaryColor: editPrimaryColor
            });

        }catch(e){
            console.log("!!!!!!!!error in did mount", e);
        } finally {
            this.setState({
                isLoading : false
            });
        }
    }

    selectedTab = "columns";

    dataFetch(key) {
        switch (key) {
            case "1":
                this.selectedTab = "columns";
                break;
            case "2":
                this.selectedTab = "filters";
                break;
        }
    }

    render() {
        const  { userCount, cityCount, primaryColor, tagList, isLoading, tagTotal } = this.state;

        return (
            <Fragment>
                <Title parent={this.props.t('SETTING')} title={this.props.t('SETTING')} />
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
                        <Tabs defaultActiveKey={this.selectedTab == "columns" ? "1" : "2" } onChange={key => {this.dataFetch(key)}}>
                            <TabPane tab={this.props.t('columns_tab')} key="1">
                                <ColumnPage 
                                    primaryColor={primaryColor}
                                />
                            </TabPane>
                            <TabPane tab={this.props.t('filter_tab')} key="2">
                                <div className="table-wrap">
                                    <FilterRecordsTable 
                                        primaryColor={primaryColor}
                                    />
                                </div>
                            </TabPane>
                        </Tabs>
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
        setListFilterData: (listFilterData) => {
            dispatch({
                type : "SET_LIST_FILTER_DATA",
                listFilterData : listFilterData
            })
        },
        setListFilterDataTotal: (listFilterDataTotal) => {
            dispatch({
                type : "SET_LIST_FILTER_DATA_TOTAL",
                listFilterDataTotal : listFilterDataTotal
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
        },
        setListtagDictinary: (listTagDictionaryData) => {
            dispatch({
                type: 'SET_LIST_TAG_DICTIONARY',
                listTagDictionaryData: listTagDictionaryData
            });
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withTranslation()(Setting)));