/* eslint-disable */

import React, { Fragment, Component } from 'react';
import Title from './Title';
import CountUp from 'react-countup';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Navigation, MessageSquare, Users, ShoppingBag, Layers, ShoppingCart, DollarSign, ArrowDown, ArrowUp, CloudDrizzle } from 'react-feather';
import { getAllTags } from "../../Graphs/Tag/listTag";
import { createTag } from "../../Graphs/Tag/createTag";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import  SearchHeader from "../common/header-component/searchHeader";
import { Input, Select, Button, Spin, Icon, notification } from "antd";
import TagRecordsTable from "./TagRecordsTable";
import AddTagModal from "./AddTagModal";
import { withTranslation } from 'react-i18next';

class Tag extends Component {
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
            const { authToken, history, setLoginFlag, setUserData, setUserToken, setListTagData, setListTagDataTotal, setRouteName, setSearchText, loginUserData } = this.props;
            let editPrimaryColor = await localStorage.getItem('primary_color');
            console.log("!!!!!!!!editPrimaryColor", editPrimaryColor);

            if(loginUserData && (loginUserData.role !== "ADMIN" && loginUserData.role !== "admin")) {
                history.push(`${process.env.PUBLIC_URL}/dashboard`);
                return;
            }

            await setRouteName("TAG");
            await setSearchText("");

            this.setState({
                isLoading : true,
                primaryColor: editPrimaryColor
            });

            await this.listTagData();

        }catch(e){
            console.log("!!!!!!!!error in did mount", e);
        } finally {
            this.setState({
                isLoading : false
            });
        }
    }

    async listTagData() {
        try{
            const { setListtagDictinary, authToken, history, setLoginFlag, setUserData, setUserToken, setListTagData, setListTagDataTotal } = this.props;

            this.setState({
                isLoading : true,
            });

            let tagData = await getAllTags(authToken, 0, 10);

            if(tagData.status == 200){
                //set user data
                await setListTagData(tagData.data);
                await setListTagDataTotal(tagData.total);

                this.setState({
                    tagList : tagData.data,
                    tagTotal : tagData.total 
                });
                
            }else if (tagData.status == 401) {
                await setLoginFlag(false);
                await setUserData(null);
                await setUserToken(null);
                history.push(`${process.env.PUBLIC_URL}/login`);
            }

            this.setState({
                isLoading : false
            });

            let tagAllData = await getAllTags(authToken, 0, 100000000);
            await setListtagDictinary(tagAllData.data);

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

            let addTagData = await createTag(authToken, values);
            notification["success"]({
                message: 'Add Tag',
                description: "Added successfully",
            });

            await this.listTagData();
        }catch(e) {
            console.log("!!!!!!error in addSubmit fucntion", e);
            notification["error"]({
                message: 'Add Tag',
                description: e,
            });
        } 
    }

    generateCsv = async () => {
        try {
            const { authToken } = this.props;
            this.setState(
                {
                    isLoading: true
                },
                () => {
                    getAllTags(authToken, 0, 1000000)
                    .then((res) => {
                        let csvArray = [];
            
                        csvArray.push([
                            "Name",
                            "Description",
                        ]);
            
                        res.data.map((data) => {
                            csvArray.push([
                                data.name ? data.name : "NA",
                                data.description ? data.description : "NA",
                            ]);
                        });
            
            
                        const rows = csvArray;
                        let csvName = "AllTags.csv";
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
        const  { userCount, cityCount, primaryColor, tagList, isLoading, tagTotal } = this.state;

        return (
            <Fragment>
                <Title parent={this.props.t('TAG')} title={this.props.t('TAG')} />
                <div style={{ marginTop : "20px", display : "inline-block", width : "100%", marginBottom : "20px", paddingLeft : "14px", paddingRight: "55px"}}>
                    <div onClick={() => this.generateCsv()} style={{float : "left", cursor : "pointer"}}>
                        <div style={{width : "100px", backgroundColor : primaryColor, color : "white", padding : "7px 0px", textAlign : "center", borderRadius : "50px"}}>
                            {this.props.t('export_csv')}
                        </div>
                    </div>
                    <div style={{float : "right", cursor : "pointer"}}>
                        <AddTagModal addText={this.props.t('add_button_text')} primaryColor={primaryColor} onSubmit={this.addSubmit} />
                    </div>
                </div>
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
                            <TagRecordsTable 
                                data={tagList}
                                primaryColor={primaryColor}
                                tagTotal={tagTotal}
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
        setListTagData: (listTagData) => {
            dispatch({
                type : "SET_LIST_TAG_DATA",
                listTagData : listTagData
            })
        },
        setListTagDataTotal: (listTagDataTotal) => {
            dispatch({
                type : "SET_LIST_TAG_DATA_TOTAL",
                listTagDataTotal : listTagDataTotal
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withTranslation()(Tag)));