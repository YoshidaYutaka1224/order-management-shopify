import {
    Table,
    Button,
    Switch,
    Popconfirm,
    Tooltip,
    Avatar,
    Input,
    notification,
    Spin
  } from "antd";
import * as React from "react";
import { get } from "lodash";
import { getAllFilter } from "../../../Graphs/Setting/filter/listFilter";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { UserOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { deleteFilter } from "../../../Graphs/Setting/filter/deleteFilter";
import { addFilter } from "../../../Graphs/Setting/filter/addFilter";
import { editFilter } from "../../../Graphs/Setting/filter/editFilter";
import { FilterModal } from "./FilterModal";
import { EditModal } from "./EditModal";
import * as la from "lodash";
import { withTranslation } from 'react-i18next';

var moment = require("moment");

class FilterRecordsTable extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: [],
        isLoading: true,
        startIndex: 0,
        limitNumber: 10,
        pagination: {
          pageSize: 10,
          current: 1
        },
        filterSelectedData : false,
        editFilterSelectData : null,
        userPassData: null
      };
    }
  
    async componentDidMount() {
      this.setState({
        isLoading: false,
        tagSelectedData: null
      });
      await this.listFilterData(0, 10000000);
    }

    filterModalRef;
    editModalRef;

    listFilterData = async (start, end) => {
        try{
            const { setListtagDictinary, authToken, history, setLoginFlag, setUserData, setUserToken, setListFilterData, setListFilterDataTotal } = this.props;
            this.setState({
                isLoading : true
            });

            let filterData = await getAllFilter(authToken, 0, 1000000);

            if(filterData.status == 200){
                //set user Data
                await setListFilterData(filterData.data);
                await setListFilterDataTotal(filterData.total);

                this.setState({
                    isLoading : false,
                    data : filterData.data
                });
                
            }else if (filterData.status === 401) {
                await setLoginFlag(false);
                await setUserData(null);
                await setUserToken(null);
                history.push(`${process.env.PUBLIC_URL}/login`);
            }

            this.setState({
              isLoading : false
            });

        }catch(e) {
            console.log("!!!!!!!list user Data printed here", e);
        } finally {
            this.setState({
                isLoading : false
            });
        }
    }
  
    dateFormat(date) {
      var oldDate = new Date(),
      momentObj = moment(oldDate).utc(),
      newDate = momentObj.format("Do MMM YYYY");
  
      return newDate;
    }

    showFilterModal = () => {
      this.setState(
        {
          filterSelectedData: true
          // isOpen: true
        },
        () => {
          this.filterModalRef.show();
        }
      );
    }

    handleDetailsFilterModalclose() {
      this.setState({
        filterSelectedData: false
      });
    }

    showEditModal = (item) => {
      this.setState(
        {
          editFilterSelectData: item
          // isOpen: true
        },
        () => {
          this.editModalRef.show();
        }
      );
    }

    handleDetailsEditFilterModalclose() {
      this.setState({
        editFilterSelectData: null
      });
    }
  
    counter = 0;
    tempCounter = 0;
    columns = [
      {
        title: `${this.props.t('sr_header')}`,
        key: "serial_number",
        render: (text , item , index) => {
          return (
            <div>
              <span>{++index + this.tempCounter}</span>
            </div>
          );
        }
      },
      {
        title: "Name",
        width: 150,
        key: "name",
        render: (text, item, index) => {
          console.log("user record --> ", item);
          return (
            <div>
              <div style={{ alignItems: "center", display : "inline-block", width : "100%" }}>
                <div flexDirection="column">
                  <strong>
                    <Tooltip placement="bottom" title="Full Name">
                      <div>
                        {item.name ? item.name : ""}
                      </div>
                    </Tooltip>
                  </strong>
                </div>
              </div>
            </div>
          );
        }
      },
      {
        title: `${this.props.t('filter_type_header')}`,
        width: 150,
        key: "filter_type",
        render: (text, item, index) => {
          console.log("user record --> ", item);
          return (
            <div>
              <div style={{ alignItems: "center", display : "inline-block", width : "100%" }}>
                <div flexDirection="column">
                    <Tooltip placement="bottom" title={`${this.props.t('filter_type_header')}`}>
                      <div>
                        {item.filter_type === "shopify_filter_exclude_custom_status" ? "Shopify Filter Exclude Custom Status" : item.filter_type === "shopify_filter" ? "Shopify Filter" : "Custom Status"}
                      </div>
                    </Tooltip>
                </div>
              </div>
            </div>
          );
        }
      },
      {
        title: `${this.props.t('tags_label')}`,
        key: "tags",
        dataIndex: "tags",
        render: (text, item, index) => {
            let tagArray = JSON.parse(item.tag_array);
            let tagString = "";
            la.map(tagArray, (data, index) => {
                if(index === (tagArray.length - 1)){
                    tagString = tagString + data;
                    return;
                }
                tagString = tagString + data + ", ";
            })
            return (
                <div>
                {item.tag_array ? (
                    <Tooltip placement="bottom" title={`${this.props.t('tags_label')}`}>
                    {tagString === "" ? "-" : tagString}
                    </Tooltip>
                ) : (
                    "-"
                )}
                </div>
            );
        }
      },
      {
        title: `${this.props.t('action_header')}`,
        width : 130,
        key: "action",
        render: (text, item, index) => {
          return (
            <div style={{ display : "inline-block", width : "100%" }}>
              <div mr="5px" className="table-icon" style={{float : "left"}}>
                <Tooltip placement="bottom" title={`${this.props.t('edit_action')}`}>
                  <Button
                    shape="circle"
                    icon={<EditOutlined />}
                    onClick={() => {
                      console.log("isOpen value --- ", this.state.isOpen);
                      this.showEditModal(item);
                    }}
                  />
                </Tooltip>
              </div>
              <div ml="15px" mr="5px" className="table-icon" style={{float : "left", marginLeft : "5px"}}>
                <Tooltip placement="bottom" title={`${this.props.t('delete_action')}`}>
                  <Popconfirm
                    onConfirm={this.deleteFilter.bind(this, item)}
                    title={this.props.t('delete_confirmation')}
                  >
                    <Button shape="circle" icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Tooltip>
              </div>
            </div>
          );
        }
      }
    ];

    async deleteFilter(item) {
        try{
            const { authToken, history, setLoginFlag, setUserData, setUserToken, searchText, setListFilterData, setListFilterDataTotal } = this.props;
            const { startIndex, limitNumber } = this.state;

            this.setState({
                isLoading : true
            });
            let deleteData = await deleteFilter(authToken, item.id);

            if(deleteData.status == 200){
                notification["success"]({
                    message: 'Delete Filter',
                    description:
                      'Successfully deleted',
                });
                await setListFilterData(deleteData.data);
                await setListFilterDataTotal(deleteData.total);
                //set user Data
                this.setState({
                    isLoading : false,
                    data : deleteData.data
                })
            }else if (deleteData.status == 401) {
                await setLoginFlag(false);
                await setUserData(null);
                await setUserToken(null);
                history.push(`${process.env.PUBLIC_URL}/login`);
            }
        }catch(e){
            console.log("!!!!!!delete Tag ", e);
            notification["error"]({
                message: 'Delete Filter',
                description: e,
            });
        } finally {
            this.setState({
                isLoading : false
            });
        }
    }

    filterTagSubmit = async (values) => {
        try{
            const { authToken, history, setLoginFlag, setUserData, setUserToken, searchText, setListFilterData, setListFilterDataTotal } = this.props;
            const { startIndex, limitNumber } = this.state;

            console.log("!!!!!!!!!!!!values printed here", values);
    
            this.setState({
                isLoading: true
            })
            let statusData = await addFilter(authToken, values);
            if(statusData.status == 200){
                notification["success"]({
                    message: 'Add Filter',
                    description:
                      'Successfully added',
                });

                await setListFilterData(statusData.data);
                await setListFilterDataTotal(statusData.total);
                //set user Data
                this.setState({
                    isLoading : false,
                    data : statusData.data
                })
            }else if (statusData.status == 401) {
                await setLoginFlag(false);
                await setUserData(null);
                await setUserToken(null);
                history.push(`${process.env.PUBLIC_URL}/login`);
            }
        }catch(e){
            console.log("!!!!!!!!!error in addSubmit function", e);
            notification["error"]({
                message: 'Add Filter',
                description: e,
            });
        } finally {
            this.setState({
                isLoading : false
            })
        }
    }

    editfilterTagSubmit = async (values, filterId) => {
      console.log("!!!!!!!!!editfilterTagSubmit", values, filterId);
      try{
        const { authToken, history, setLoginFlag, setUserData, setUserToken, searchText, setListFilterData, setListFilterDataTotal } = this.props;
        const { startIndex, limitNumber } = this.state;

        console.log("!!!!!!!!!!!!values printed here", values);

        this.setState({
            isLoading: true
        })
        let statusData = await editFilter(authToken, values, filterId);
        if(statusData.status == 200){
            notification["success"]({
                message: 'Edit Filter',
                description:
                  'Successfully edited',
            });

            await setListFilterData(statusData.data);
            await setListFilterDataTotal(statusData.total);
            //set user Data
            this.setState({
                isLoading : false,
                data : statusData.data
            })
        }else if (statusData.status == 401) {
            await setLoginFlag(false);
            await setUserData(null);
            await setUserToken(null);
            history.push(`${process.env.PUBLIC_URL}/login`);
        }
      }catch(e){
        console.log("!!!!!!!!!error in addSubmit function", e);
        notification["error"]({
            message: 'Edit Filter',
            description: e,
        });
      } finally {
        this.setState({
            isLoading : false
        })
      }
    }
  
    render() {
      const { isLoading } = this.state;
      const { listFilterData, listFilterDataTotal, searchLoader, primaryColor, authToken } = this.props;

      return isLoading || searchLoader ? 
      (  
        <div style={{ marginLeft: "20px" }}>
           <Spin
            size="large"
            style={{ marginLeft: "480px", marginTop: "130px" }}
          />
        </div> 
      )
      : (
        <div>
            <div className="all-button-wrap" style={{ marginTop : "10px"}}>
                <div style={{ display : "inline-block", width : "100%" }}>
                    <div className="button-wrap" style={{ float : "left" }}>
                    <Button
                        // type="primary"
                        // disabled={(loginUserData.role === "ADMIN" || loginUserData.role === "admin" || loginUserData.role === "edit") ? false : true}
                        style={{ background: primaryColor, color: "#fff", cursor : "pointer"}}
                        onClick={() => this.showFilterModal()}
                    >
                        {this.props.t('filter_title_ext')}
                    </Button>
                    </div>
                </div>
            </div>
            <Table
                loading={this.state.isLoading}
                rowKey={record => record._id}
                columns={this.columns}
                size={"small"}
                // dataSource={this.state.data}
                dataSource={listFilterData}
                pagination={false}
                onChange={this.handleTableChange}
            />
            {
              this.state.filterSelectedData ? (
                  <FilterModal
                      refx={(e) => (this.filterModalRef = e)}
                      onClose={this.handleDetailsFilterModalclose.bind(this)}
                      filterSelectedData={this.state.filterSelectedData}
                      title={this.props.t('filter_title_ext')}
                      authToken={authToken}
                      onSubmit={this.filterTagSubmit}
                  />
              )
              :
              null
            }
            {
              this.state.editFilterSelectData ? (
                <EditModal
                    refx={(e) => (this.editModalRef = e)}
                    onClose={this.handleDetailsEditFilterModalclose.bind(this)}
                    editFilterSelectData={this.state.editFilterSelectData}
                    title={this.props.t('edit_filter_title_text')}
                    authToken={authToken}
                    onSubmit={this.editfilterTagSubmit}
                />
              )
              :
              null
            }
        </div>
      );
    }
}
  
const mapStateToProps = state => ({
    authToken: state.auth.authToken,
    listFilterData: state.filter.listFilterData,
    listFilterDataTotal: state.filter.listFilterDataTotal,
    searchLoader: state.auth.searchLoader,
    searchText: state.auth.searchText
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
        setListtagDictinary: (listTagDictionaryData) => {
          dispatch({
              type: 'SET_LIST_TAG_DICTIONARY',
              listTagDictionaryData: listTagDictionaryData
          });
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withTranslation()(FilterRecordsTable)));