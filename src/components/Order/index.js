/* eslint-disable */

import React, { Fragment, Component } from 'react';
import Title from './Title';
import CountUp from 'react-countup';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Navigation, MessageSquare, Users, ShoppingBag, Layers, ShoppingCart, DollarSign, ArrowDown, ArrowUp, CloudDrizzle } from 'react-feather';
import { getAllOrder } from "../../Graphs/Order/listOrder";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { Input, Select, Button, Spin, Icon, notification } from "antd";
import OrderRecordsTable from "./OrderRecordsTable";
import { withTranslation } from 'react-i18next';

class Order extends Component {
    constructor(props){
        super(props);
        this.state = {
            orderList : [],
            orderTotal : 0,
            isLoading : false,
            primaryColor: "#4466f2"
        }
    }

    async componentDidMount() {
        try{
            const { authToken, history, setListSearchFlag, setListSearchResetFlag, setLoginFlag, setUserData, setUserToken, setListOrderData, setListOrderDataTotal, setRouteName, setSearchText } = this.props;
            let editPrimaryColor = await localStorage.getItem('primary_color');
            console.log("!!!!!!!!editPrimaryColor", editPrimaryColor);

            await setRouteName("ORDER");
            await setSearchText("");
            await setListSearchFlag(false);
            await setListSearchResetFlag(false);


            this.setState({
                isLoading : true,
                primaryColor: editPrimaryColor
            });

            // await this.listOrderData();

        }catch(e){
            console.log("!!!!!!!!error in did mount", e);
        } finally {
            this.setState({
                isLoading : false
            });
        }
    }

    async listOrderData() {
        try{
            const { authToken, history, setLoginFlag, setUserData, setUserToken, setListOrderData, setListOrderDataTotal } = this.props;

            this.setState({
                isLoading : true,
            });

            let orderData = await getAllOrder(authToken, 10);

            if(orderData.status == 200){
                //set user data
                await setListOrderData(orderData.data.orders.edges);
                await setListOrderDataTotal(10);

                this.setState({
                    orderList : orderData.data.orders.edges,
                    orderTotal : 10
                });
                
            }else if (orderData.status == 401) {
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

    render() {
        const  { primaryColor, orderList, isLoading, orderTotal } = this.state;

        return (
            <Fragment>
                <Title parent={this.props.t('ORDER')} title={this.props.t('ORDER')} />

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
                        <div className="table-wrap" style={{ backgroundColor : "white", overflowX : "auto" }}>
                            <OrderRecordsTable 
                                data={orderList}
                                primaryColor={primaryColor}
                                orderTotal={orderTotal}
                            />
                        </div>
                    }
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    authToken: state.auth.authToken,
    filterColumn : state.filter.filterColumn
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
        setListOrderData: (listOrderData) => {
            dispatch({
                type : "SET_LIST_ORDER_DATA",
                listOrderData : listOrderData
            })
        },
        setListOrderDataTotal: (listOrderDataTotal) => {
            dispatch({
                type : "SET_LIST_ORDER_DATA_TOTAL",
                listOrderDataTotal : listOrderDataTotal
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
        setListSearchFlag: (listSearchFlag) => {
            dispatch({
                type : "SET_LIST_ORDER_DATA_FLAG",
                listSearchFlag : listSearchFlag
            })
        },
        setListSearchResetFlag: (listSearchRestFlag) => {
            dispatch({
                type : "SET_LIST_ORDER_DATA_REST_FLAG",
                listSearchRestFlag : listSearchRestFlag
            })
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withTranslation()(Order)));