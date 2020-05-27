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
import { getAllTags } from "../../Graphs/Tag/listTag";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { UserOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { deleteTag } from "../../Graphs/Tag/deleteTag";
import { changeStatus } from "../../Graphs/Tag/changeStatus";
import { editTag } from "../../Graphs/Tag/editTag";
import { searchTag } from "../../Graphs/Tag/searchTag";
import { EditModal } from "./EditModal";
import { withTranslation } from 'react-i18next';

var moment = require("moment");

class TagRecordsTable extends React.Component {
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
        userPassData: null
      };
      this.handleTableChange = this.handleTableChange.bind(this);
      this.getLimitedTags = this.getLimitedTags.bind(this);
    }
  
    async componentDidMount() {
      this.setState({
        data: this.props.data,
        isLoading: false,
        tagSelectedData: null
      });
    }

    modalRef;

    async getLimitedTags(pagination) {
      const { searchText } = this.props;
      console.log("tempCounter && counter --> ", this.tempCounter, this.counter);
      const start =
        pagination.current * pagination.pageSize - pagination.pageSize;
      const end = pagination.pageSize;
  
      this.setState(
        {
          isLoading: true,
          startIndex: start,
          limitNumber: end
        },
        async () => {  
          if (searchText != null && searchText != "") {
            //get search text props from redux store
            this.listSearchTagData(start, end);
          } else {
            //call normal user Data
            this.listTagData(start, end);
          }
        }
      );
    }

    listSearchTagData = async (start, end) => {
      try{
        const { setListtagDictinary, authToken, history, setLoginFlag, setUserData, setUserToken, setListTagData, setListTagDataTotal, searchText } = this.props;
        this.setState({
            isLoading : true
        });

        let tagData = await searchTag(authToken, searchText, start, end);


        if(tagData.status == 200){
            //set user Data
            await setListTagData(tagData.data);
            await setListTagDataTotal(tagData.total);

            this.setState({
                isLoading : false,
                data : tagData.data
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

      }catch(e) {
        console.log("!!!!!!!list search user Data printed here", e);
      } finally {
        this.setState({
            isLoading : false
        });
      }
    }

    listTagData = async (start, end) => {
        try{
            const { setListtagDictinary, authToken, history, setLoginFlag, setUserData, setUserToken, setListTagData, setListTagDataTotal } = this.props;
            this.setState({
                isLoading : true
            });

            let tagData = await getAllTags(authToken, start, end);

            if(tagData.status == 200){
                //set user Data
                await setListTagData(tagData.data);
                await setListTagDataTotal(tagData.total);

                this.setState({
                    isLoading : false,
                    data : tagData.data
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

    showModal(item) {
      this.setState(
        {
          tagSelectedData: item
          // isOpen: true
        },
        () => {
          this.modalRef.show();
        }
      );
    }
  
    handleDetailsModalclose() {
      this.setState({
        tagSelectedData: null
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
        title: `${this.props.t('name_header')}`,
        width: 150,
        key: "name",
        render: (text, item, index) => {
          console.log("user record --> ", item);
          return (
            <div>
              <div style={{ alignItems: "center", display : "inline-block", width : "100%" }}>
                <div flexDirection="column">
                  <strong>
                    <Tooltip placement="bottom" title={`${this.props.t('name_header')}`}>
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
        title: `${this.props.t('description_header')}`,
        key: "description",
        dataIndex: "description",
        render: (text, item, index) => {
          return (
            <div>
              {item.description ? (
                <Tooltip placement="bottom" title={`${this.props.t('description_header')}`}>
                  {item.description}
                </Tooltip>
              ) : (
                "-"
              )}
            </div>
          );
        }
      },
      {
        title: `${this.props.t('active_header')}`,
        key: "isActive",
        render: (text, item, index) => {
          if(item.name === "Fulfilled"){
            return (
              <div>
                {item.is_active != null ? (
                  <Tooltip placement="bottom" title={`${this.props.t('active_header')}`}>
                    {<Switch disabled={true} checked={item.is_active} style={{backgroundColor : item.is_active ? this.props.primaryColor : "#bababa"}} onChange={this.onChange.bind(this, item)} /> }
                  </Tooltip>
                ) : (
                  "-"
                )}
              </div>
            );
          }
  
          return (
            <div>
              {item.is_active != null ? (
                <Tooltip placement="bottom" title={`${this.props.t('active_header')}`}>
                  {<Switch checked={item.is_active} style={{backgroundColor : item.is_active ? this.props.primaryColor : "#bababa"}} onChange={this.onChange.bind(this, item)} /> }
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
          if(item.name === "Fulfilled" || item.name === "Partially Fulfilled"){
            return null;
          }

          return (
            <div style={{ display : "inline-block", width : "100%" }}>
              <div mr="5px" className="table-icon" style={{float : "left"}}>
                <Tooltip placement="bottom" title={`${this.props.t('edit_action')}`}>
                  <Button
                    shape="circle"
                    icon={<EditOutlined />}
                    onClick={() => {
                      console.log("isOpen value --- ", this.state.isOpen);
                      this.showModal(item);
                    }}
                  />
                </Tooltip>
              </div>
              <div ml="15px" mr="5px" className="table-icon" style={{float : "left", marginLeft : "5px"}}>
                <Tooltip placement="bottom" title={`${this.props.t('delete_action')}`}>
                  <Popconfirm
                    onConfirm={this.deleteTag.bind(this, item)}
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

    async deleteTag(item) {
        try{
            const { authToken, history, setLoginFlag, setUserData, setUserToken, searchText, setListTagData, setListTagDataTotal } = this.props;
            const { startIndex, limitNumber } = this.state;

            this.setState({
                isLoading : true
            });
            let deleteData = await deleteTag(authToken, item.id, startIndex, limitNumber, searchText);

            if(deleteData.status == 200){
                notification["success"]({
                    message: 'Delete Tag',
                    description:
                      'Successfully deleted',
                });
                await setListTagData(deleteData.data);
                await setListTagDataTotal(deleteData.total);
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
                message: 'Delete Tag',
                description: e,
            });
        } finally {
            this.setState({
                isLoading : false
            });
        }
    }
  
    async onChange(item, checked) {
      try{
        console.log("!!!!!!!!", checked);

        const { authToken, history, setLoginFlag, setUserData, setUserToken, searchText } = this.props;
        const { startIndex, limitNumber } = this.state;

        this.setState({
            isLoading: true
        })
        let statusData = await changeStatus(authToken, item.id, checked);
        if(statusData.status == 200){
            notification["success"]({
                message: 'Change Tag Status',
                description:
                  'Successfully changed status',
            });
            if(searchText != null && searchText != ""){
              this.listSearchTagData(startIndex, limitNumber);
              return;
            }
            this.listTagData(startIndex, limitNumber);
        }else if (statusData.status == 401) {
            await setLoginFlag(false);
            await setUserData(null);
            await setUserToken(null);
            history.push(`${process.env.PUBLIC_URL}/login`);
        }
      }catch(err){
         console.log("!!!!!!!!!!!!!error printed here", err);
         notification["error"]({
            message: 'Change Tag Status',
            description: err,
        });
      } finally {
          this.setState({
              isLoading: false
          })
      }
    } 

    editSubmit = async (userObject, userId) => {
      try{
        const { authToken, history, setLoginFlag, setUserData, setUserToken, searchText } = this.props;
        const { startIndex, limitNumber } = this.state;

        this.setState({
            isLoading: true
        })
        let statusData = await editTag(authToken, userObject, userId);
        if(statusData.status == 200){
            notification["success"]({
                message: 'Edit Tag Status',
                description:
                  'Successfully edited',
            });
            if(searchText != null && searchText != ""){
              this.listSearchTagData(startIndex, limitNumber);
              return;
            }
            this.listTagData(startIndex, limitNumber);
        }else if (statusData.status == 401) {
            await setLoginFlag(false);
            await setUserData(null);
            await setUserToken(null);
            history.push(`${process.env.PUBLIC_URL}/login`);
        }
      }catch(e){
        console.log("!!!!!!!!!error in editSubmit function", e);
        notification["error"]({
            message: 'Edit Tag',
            description: e,
        });
      }
    } 

    handleTableChange(pagination, filters) {
      console.log("outer onchange iusers", pagination);
      this.setState(
        {
          pagination
        },
        () => this.getLimitedTags(pagination)
      );
    }
  
    render() {
      const { isLoading } = this.state;
      const { listTagData, listTagDataTotal, searchLoader } = this.props;

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
          <Table
            loading={this.state.isLoading}
            rowKey={record => record._id}
            columns={this.columns}
            size={"small"}
            // dataSource={this.state.data}
            dataSource={listTagData}
            pagination={{
              total: listTagDataTotal,
              showSizeChanger: true,
              pageSize: this.state.pagination.pageSize,
              current: this.state.pagination.current,
              pageSizeOptions: ["1", "10", "25", "50", "100"],
              onChange: (e) => {
                console.log("onChanges pagination");
                // e - 1
                //   ? (this.counter = this.tempCounter =
                //       (e - 1) * this.state.pagination.pageSize)
                //   : ((this.counter = 0), (this.tempCounter = 0));
                if(e-1){
                  this.counter=this.tempCounter = (e - 1) * this.state.pagination.pageSize;
                  return;
                }

                this.counter = 0;
                this.tempCounter = 0;
              }
            }}
            onChange={this.handleTableChange}
          />
          {this.state.tagSelectedData ? (
            <EditModal
              admin={false}
              refx={(e) => (this.modalRef = e)}
              onClose={this.handleDetailsModalclose.bind(this)}
              tagSelectedData={this.state.tagSelectedData}
              title={this.props.t('edit_tag_text')}
              onSubmit={this.editSubmit}
            />
          ) : null}
        </div>
      );
    }
}
  
const mapStateToProps = state => ({
    authToken: state.auth.authToken,
    listTagData: state.tag.listTagData,
    listTagDataTotal: state.tag.listTagDataTotal,
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
        setListtagDictinary: (listTagDictionaryData) => {
          dispatch({
              type: 'SET_LIST_TAG_DICTIONARY',
              listTagDictionaryData: listTagDictionaryData
          });
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withTranslation()(TagRecordsTable)));