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
import { getAllUsers } from "../../Graphs/User/listUser" 
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { UserOutlined, EditOutlined, DeleteOutlined, EyeOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { deleteUser } from "../../Graphs/User/deleteUser";
import { changeStatus } from "../../Graphs/User/changeStatus";
import { editUser } from "../../Graphs/User/editUser";
import { changePassword } from "../../Graphs/User/changePassword";
import { searchUser } from "../../Graphs/User/searchUser";
import { EditModal } from "./EditModal";
import UserLogsModal from "./UserLogsModal";
import { ChangeModal } from "./ChangeModal";
import { withTranslation } from 'react-i18next';

var moment = require("moment");
  
const BASE_IMAGE_URL =
    "https://s3.us-east-2.amazonaws.com/cerebrus-consulting/bloodman_user_media/";

class UserRecordsTable extends React.Component {
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
        userPassData: null,
        userLogsData: null,
      };
      this.handleTableChange = this.handleTableChange.bind(this);
      this.getLimitedUsers = this.getLimitedUsers.bind(this);
    }
  
    async componentDidMount() {
      this.setState({
        data: this.props.data,
        isLoading: false,
        userSelectedData: null
      });
    }

    modalRef;
    changePassRef;
    userLogsRef;

    async getLimitedUsers(pagination) {
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
            this.listSearchUserData(start, end);
          } else {
            //call normal user Data
            this.listUserData(start, end);
          }
        }
      );
    }

    listSearchUserData = async (start, end) => {
      try{
        const { authToken, history, setLoginFlag, setUserData, setUserToken, setListUserData, setListUserDataTotal, searchText } = this.props;
        this.setState({
            isLoading : true
        });

        let userData = await searchUser(authToken, searchText, start, end);


        if(userData.status == 200){
            //set user Data
            await setListUserData(userData.data);
            await setListUserDataTotal(userData.total);

            this.setState({
                isLoading : false,
                data : userData.data
            });
            
        }else if (userData.status == 401) {
            await setLoginFlag(false);
            await setUserData(null);
            await setUserToken(null);
            history.push(`${process.env.PUBLIC_URL}/login`);
        }
      }catch(e) {
        console.log("!!!!!!!list search user Data printed here", e);
      } finally {
        this.setState({
            isLoading : false
        });
      }
    }

    listUserData = async (start, end) => {
        try{
            const { authToken, history, setLoginFlag, setUserData, setUserToken, setListUserData, setListUserDataTotal } = this.props;
            this.setState({
                isLoading : true
            });

            let userData = await getAllUsers(authToken, start, end);

            if(userData.status == 200){
                //set user Data
                await setListUserData(userData.data);
                await setListUserDataTotal(userData.total);

                this.setState({
                    isLoading : false,
                    data : userData.data
                });
                
            }else if (userData.status == 401) {
                await setLoginFlag(false);
                await setUserData(null);
                await setUserToken(null);
                history.push(`${process.env.PUBLIC_URL}/login`);
            }
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
          userSelectedData: item
          // isOpen: true
        },
        () => {
          this.modalRef.show();
        }
      );
    }

    showPasswordModal(item) {
      this.setState(
        {
          userPassData: item
          // isOpen: true
        },
        () => {
          this.changePassRef.show();
        }
      );
    }
  
    handleDetailsModalclose() {
      this.setState({
        userSelectedData: null
      });
    }

    showUserLogsModal = (item) => {
      this.setState(
        {
          userLogsData: item
          // isOpen: true
        },
        () => {
          this.userLogsRef.show();
        }
      );
    }

    handleDetailsUserLogsModalclose() {
      this.setState({
        userLogsData: null
      });
    }

    handleDetailsChangePassModalclose() {
      this.setState({
        userPassData: null
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
                {/* <Avatar icon="user" /> */}
                <div style={{float : "left"}}>
                    <Avatar icon={<UserOutlined />} />
                </div>
                <div flexDirection="column" style={{ marginLeft: "45px", marginTop : "5px" }}>
                  <strong>
                    {" "}
                    <Tooltip placement="bottom" title={`${this.props.t('name_header')}`}>
                      <div>
                        {item.last_name ? item.first_name ? item.first_name + " " + item.last_name : item.username : item.first_name ? item.first_name : item.username}
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
        title: `${this.props.t('email_header')}`,
        key: "email",
        dataIndex: "email",
        render: (text, item, index) => {
          return (
            <div>
              {item.email ? (
                <Tooltip placement="bottom" title={`${this.props.t('email_header')}`}>
                  {item.email}
                </Tooltip>
              ) : (
                "-"
              )}
            </div>
          );
        }
      },
      {
        title: `${this.props.t('firstname_header')}`,
        key: "first_name",
        render: (text, item, index) => {
          return (
            <div>
              {item.first_name ? (
                <Tooltip placement="bottom" title={`${this.props.t('firstname_header')}`}>
                  {item.first_name}
                </Tooltip>
              ) : (
                "-"
              )}
            </div>
          );
        }
      },
      {
        title: `${this.props.t('lastname_header')}`,
        key: "last_name",
        render: (text, item, index) => {
          return (
            <div>
              {item.last_name ? (
                <Tooltip placement="bottom" title={`${this.props.t('lastname_header')}`}>
                  {item.last_name}
                </Tooltip>
              ) : (
                "-"
              )}
            </div>
          );
        }
      },
      // {
      //   title: "Mobile",
      //   key: "mobile",
      //   render: (text, item, index) => {
      //     return (
      //       <div>
      //         {item.phone ? (
      //           <Tooltip placement="bottom" title="User mobile">
      //             {item.phone}
      //           </Tooltip>
      //         ) : (
      //           "-"
      //         )}
      //       </div>
      //     );
      //   }
      // },
      {
        title: `${this.props.t('role_header')}`,
        key: "role",
        render: (text, item, index) => {
          return (
            <div>
              {item.role ? (
                <Tooltip placement="bottom" title={`${this.props.t('role_header')}`}>
                  {item.role}
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
              <div mr="5px" className="table-icon" style={{float : "left", marginLeft : "5px"}}>
                <Tooltip placement="bottom" title={`${this.props.t('changepassword_action')}`}>
                  <Button
                    shape="circle"
                    icon={<EyeOutlined />}
                    onClick={() => {
                      console.log("isOpen value --- ", this.state.isOpen);
                      this.showPasswordModal(item);
                    }}
                  />
                </Tooltip>
              </div>
              <div ml="15px" className="table-icon"  mr="5px" style={{float : "left", marginLeft : "5px"}}>
                <Tooltip placement="bottom" title={`${this.props.t('delete_action')}`}>
                  <Popconfirm
                    onConfirm={this.deleteUser.bind(this, item)}
                    title={this.props.t('delete_confirmation')}
                  >
                    <Button shape="circle" icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Tooltip>
              </div>
              <div mr="5px" className="table-icon" style={{float : "left", marginLeft : "5px"}}>
                <Tooltip placement="bottom" title={`${this.props.t('logs_action')}`}>
                  <Button
                    shape="circle"
                    icon={<InfoCircleOutlined />}
                    onClick={() => {
                      console.log("isOpen value --- ", this.state.isOpen);
                      this.showUserLogsModal(item);
                    }}
                  />
                </Tooltip>
              </div>
            </div>
          );
        }
      }
    ];

    async deleteUser(item) {
        try{
            const { authToken, history, setLoginFlag, setUserData, setUserToken, searchText, setListUserData, setListUserDataTotal } = this.props;
            const { startIndex, limitNumber } = this.state;

            this.setState({
                isLoading : true
            });
            let deleteData = await deleteUser(authToken, item.id, startIndex, limitNumber, searchText);

            if(deleteData.status == 200){
                notification["success"]({
                    message: 'Delete User',
                    description:
                      'Successfully deleted',
                });
                await setListUserData(deleteData.data);
                await setListUserDataTotal(deleteData.total);
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
            console.log("!!!!!!delete user ", e);
            notification["error"]({
                message: 'Delete User',
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
                message: 'Change User Status',
                description:
                  'Successfully changed status',
            });
            if(searchText != null && searchText != ""){
              this.listSearchUserData(startIndex, limitNumber);
              return;
            }
            this.listUserData(startIndex, limitNumber);
        }else if (statusData.status == 401) {
            await setLoginFlag(false);
            await setUserData(null);
            await setUserToken(null);
            history.push(`${process.env.PUBLIC_URL}/login`);
        }
      }catch(err){
         console.log("!!!!!!!!!!!!!error printed here", err);
         notification["error"]({
            message: 'Change User Status',
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
        let statusData = await editUser(authToken, userObject, userId);
        if(statusData.status == 200){
            notification["success"]({
                message: 'Edit User Status',
                description:
                  'Successfully edited',
            });
            if(searchText != null && searchText != ""){
              this.listSearchUserData(startIndex, limitNumber);
              return;
            }
            this.listUserData(startIndex, limitNumber);
        }else if (statusData.status == 401) {
            await setLoginFlag(false);
            await setUserData(null);
            await setUserToken(null);
            history.push(`${process.env.PUBLIC_URL}/login`);
        }
      }catch(e){
        console.log("!!!!!!!!!error in editSubmit function", e);
        notification["error"]({
            message: 'Edit User',
            description: e,
        });
      }
    } 

    changePasswordSubmit = async (userObject, userId) => {
      try{
        const { authToken, history, setLoginFlag, setUserData, setUserToken, searchText } = this.props;
        const { startIndex, limitNumber } = this.state;

        this.setState({
            isLoading: true
        })
        let statusData = await changePassword(authToken, userObject, userId);
        if(statusData.status == 200){
            notification["success"]({
                message: 'Change Password',
                description:
                  'Successfully changed',
            });
            if(searchText != null && searchText != ""){
              this.listSearchUserData(startIndex, limitNumber);
              return;
            }
            this.listUserData(startIndex, limitNumber);
        }else if (statusData.status == 401) {
            await setLoginFlag(false);
            await setUserData(null);
            await setUserToken(null);
            history.push(`${process.env.PUBLIC_URL}/login`);
        }
      }catch(e){
        console.log("!!!!!!!!!error in editSubmit function", e);
        notification["error"]({
            message: 'Change Password',
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
        () => this.getLimitedUsers(pagination)
      );
    }
  
    render() {
      const { isLoading, data } = this.state;
      const { userTotal, listUserData, listUserDataTotal, searchLoader, authToken } = this.props;

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
            dataSource={listUserData}
            pagination={{
              total: listUserDataTotal,
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
          {this.state.userSelectedData ? (
            <EditModal
              admin={false}
              refx={(e) => (this.modalRef = e)}
              onClose={this.handleDetailsModalclose.bind(this)}
              userSelectedData={this.state.userSelectedData}
              title={`${this.props.t('edit_user_title')}`}
              onSubmit={this.editSubmit}
            />
          ) : null}
           {this.state.userPassData ? (
            <ChangeModal
              admin={false}
              refx={(e) => (this.changePassRef = e)}
              onClose={this.handleDetailsChangePassModalclose.bind(this)}
              userPassData={this.state.userPassData}
              title={`${this.props.t('changepassword_action')}`}
              onSubmit={this.changePasswordSubmit}
            />
          ) : null}
          {
            this.state.userLogsData ? (
              <UserLogsModal
                admin={false}
                refx={(e) => (this.userLogsRef = e)}
                onClose={this.handleDetailsUserLogsModalclose.bind(this)}
                userLogsData={this.state.userLogsData}
                title={`${this.props.t('logs_action')}`}
                authToken={authToken}
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
    listUserData: state.user.listUserData,
    listUserDataTotal: state.user.listUserDataTotal,
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
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withTranslation()(UserRecordsTable)));