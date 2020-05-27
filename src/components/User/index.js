/* eslint-disable */

import React, { Fragment, Component } from 'react';
import Title from './Title';
import CountUp from 'react-countup';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Navigation, MessageSquare, Users, ShoppingBag, Layers, ShoppingCart, DollarSign, ArrowDown, ArrowUp, CloudDrizzle } from 'react-feather';
import { getAllUsers } from "../../Graphs/User/listUser";
import { createUser } from "../../Graphs/User/createUser";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import  SearchHeader from "../common/header-component/searchHeader";
import { Input, Select, Button, Spin, Icon, notification } from "antd";
import UserRecordsTable from "./UserRecordsTable";
import AddUserModal from "./AddUserModal";
import { withTranslation } from 'react-i18next';

class User extends Component {
    constructor(props){
        super(props);
        this.state = {
            userList : [],
            userTotal : 0,
            isLoading : false,
            primaryColor: "#4466f2"
        }
    }

    async componentDidMount() {
        try{
            const { authToken, history, setLoginFlag, setUserData, setUserToken, setListUserData, setListUserDataTotal, setRouteName, setSearchText, loginUserData } = this.props;
            let editPrimaryColor = await localStorage.getItem('primary_color');
            console.log("!!!!!!!!editPrimaryColor", editPrimaryColor);

            if(loginUserData && loginUserData.role !== "ADMIN") {
                history.push(`${process.env.PUBLIC_URL}/dashboard`);
                return;
            }

            await setRouteName("USER");
            await setSearchText("");

            this.setState({
                isLoading : true,
                primaryColor: editPrimaryColor
            });

            await this.listUserData();

        }catch(e){
            console.log("!!!!!!!!error in did mount", e);
        } finally {
            this.setState({
                isLoading : false
            });
        }
    }

    async listUserData() {
        try{
            const { authToken, history, setLoginFlag, setUserData, setUserToken, setListUserData, setListUserDataTotal } = this.props;

            this.setState({
                isLoading : true,
            });

            let userData = await getAllUsers(authToken, 0, 10);

            if(userData.status == 200){
                //set user data
                await setListUserData(userData.data);
                await setListUserDataTotal(userData.total);

                this.setState({
                    userList : userData.data,
                    userTotal : userData.total 
                });
                
            }else if (userData.status == 401) {
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
       
    addSubmit = async (values) => {
        try{
            const { authToken } = this.props;
            this.setState({
                isLoading : true
            });

            let addUserData = await createUser(authToken, values);
            notification["success"]({
                message: 'Add User',
                description: "Added successfully",
            });

            await this.listUserData();
        }catch(e) {
            console.log("!!!!!!error in addSubmit fucntion", e);
            notification["error"]({
                message: 'Add User',
                description: e,
            });
        } 
    }

    handleSearchKeyword = (searchValue) => {
        console.log("!!!!!!!!!!!searchvalue printed here", searchValue);
    }

    generateCsv = async () => {
        try {
            const { authToken } = this.props;
            this.setState(
                {
                    isLoading: true
                },
                () => {
                    getAllUsers(authToken, 0, 1000000)
                    .then((res) => {
                        let csvArray = [];
            
                        csvArray.push([
                            "Full Name",
                            "Email",
                            "Mobile Number",
                            "UserName",
                            "Role"
                        ]);
            
                        res.data.map((data) => {
                            csvArray.push([
                                data.first_name ? data.first_name : "NA",
                                data.email ? data.email : "NA",
                                data.phone ? data.phone : "NA",
                                data.username ? data.username : "NA",
                                data.role ? data.role : "NA",
                            ]);
                        });
            
            
                        const rows = csvArray;
                        let csvName = "AllUsers.csv";
                        let csvContent = "data:text/csv;charset=utf-8,";
            
                        rows.forEach(function(rowArray) {
                            let row = rowArray.join(",");
                            csvContent += row + "\r\n";
                        });
            
                        var encodedUri = encodeURI(csvContent);
                        // // // // window.open(encodedUri);
                        var link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", csvName);
                        document.body.appendChild(link); // Required for FF
            
                        link.click();
            
                        this.setState({
                            isLoading: false
                        });
                    })
                    .catch((err) => {
                        console.log("ERROR", err);
                        throw err;
                    });
                }
            );
        } catch (e) {
          console.log("error in generateCsv function", e);
        }
    }

    render() {
        const  { userCount, cityCount, primaryColor, userList, isLoading, userTotal } = this.state;

        return (
            <Fragment>
                <Title parent={this.props.t('USER')} title={this.props.t('USER')} />
                <div style={{ marginTop : "20px", display : "inline-block", width : "100%", marginBottom : "20px", paddingLeft : "14px", paddingRight: "55px"}}>
                    <div onClick={() => this.generateCsv()} style={{float : "left", cursor : "pointer"}}>
                        <div style={{width : "100px", backgroundColor : primaryColor, color : "white", padding : "7px 0px", textAlign : "center", borderRadius : "50px"}}>
                            {this.props.t('export_csv')}
                        </div>
                    </div>
                    <div style={{float : "right", cursor : "pointer"}}>
                        <AddUserModal addText={this.props.t('add_button_text')} addTitleText={this.props.t('add_user_title')} primaryColor={primaryColor} onSubmit={this.addSubmit} />
                    </div>
                </div>
                {/* <div flexDirection="column" mb="0px">
                    <div justifyContent="space-between" pb="0px" mt="10px" width="100%">
                        <div width="100%" flexDirection="column">
                            <div style={{height: "60px", padding:" 10px"}}>
                                <div className="form-group">
                                    <input
                                        className="form-control-plaintext searchIcon"
                                        type="text"
                                        placeholder="search"
                                        style={{width : "90%", height: "40px", borderRadius: "50px", border : `1px solid ${primaryColor}` , paddingLeft : 20}}
                                        onChange={(e) => this.handleSearchKeyword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
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
                        <div className="table-wrap">
                            <UserRecordsTable 
                                data={userList}
                                primaryColor={primaryColor}
                                userTotal={userTotal}
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withTranslation()(User)));