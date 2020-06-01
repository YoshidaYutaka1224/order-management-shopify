/* eslint-disable */

import {
    Table,
    Button,
    Popconfirm,
    Tooltip,
    Avatar,
    Input,
    notification,
    Spin,
    Switch
  } from "antd";
import * as React from "react";
import * as la from "lodash";
import { get } from "lodash";
import { getAllOrder } from "../../Graphs/Order/listOrder";
import { getAllFilter } from "../../Graphs/Setting/filter/listFilter";
import { updateTag } from "../../Graphs/Order/updateTag";
import { getAllPaginateOrder } from "../../Graphs/Order/listPaginateOrder"; 
import { getAllFilterOrder } from "../../Graphs/Order/listFilterOrder"; 
import { getAllFilterDirectOrder } from "../../Graphs/Order/listFilterDirectOrder"; 
import { getAllFilterPaginateDirectOrder } from "../../Graphs/Order/listPaginateFilterDirectData"; 
import { getAllFilterPaginateOrder } from "../../Graphs/Order/listPaginateFilterData"; 
import { withRouter } from "react-router";
import { connect } from "react-redux";
import {
    LeftOutlined,
    RightOutlined,
    InfoCircleOutlined
  } from '@ant-design/icons';
import { EditModal } from "./EditModal"; 
import { FilterModal } from "./FilterModal";
import { BulkModal } from "./BulkModal";
import { color } from "../../constant/comman";
import { SHOPIFY_URL } from "../../constant/comman";
import { OrderLogsModal } from "./OrderLogsModal";
import { searchOrder } from "../../Graphs/Order/searchOrder";
import { withTranslation } from 'react-i18next';

var moment = require("moment");

class OrderRecordsTable extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: [],
        isLoading: true,
        startIndex: 0,
        pagination: {
          pageSize: 20,
          current: 1
        },
        currentCursor : null,
        currentFilterCursor : null,
        cursorDataArray : [],
        filterCursorDataArray : [],
        currentCursorData : [],
        currentFilterCursorData : [],
        hasPreviousPage : false,
        hasFilterPreviousPage : false,
        hasNextPage : false,
        hasFilterNextPage : false,
        pageNumber : 0,
        filterPageNumber : 0,
        limitNumber : 20,
        filterLimitNumber : 20,
        isFilterSelected : false,
        isDirectFilterSelected : false,
        filterQueryString : "",
        userPassData: null,
        selectedRowKeys: [],
        tagSelectedData: false,
        filterTagArray : [],
        filterSelectedData : false,
        selectedColumnArray: {
          name : true,
          CustomerInformationAll : true,
          Products : true,
          email : true,
          tags : true,
          shipping_address : true,
          shipping_method : true,
          amount : true,
          fulfillment : true,
          status : true
        },
        isFromTag : false,
        fromTagId : null,
        fromTagName : null,
        fromTagArray : null,
        userLogsData : null,
        fromTagData : null,
        bulkSelectedData : false
      };
    }
    
    modalRef;
    filterModalRef;
    userLogsRef;
    bulkModalRef;

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

    opentagModal = (item) => {
      console.log("!!!!!!!item in open Tag Modal", item);

      this.setState({
        isFromTag : true,
        fromTagData : item.node,
        fromTagId : item.node.id,
        fromTagName : item.node.name,
        fromTagArray : item.node.tags
      });
      this.setState(
        {
          tagSelectedData: true
          // isOpen: true
        },
        () => {
          this.modalRef.show();
        }
      );
    }

    showModal = () => {
      const { selectedRowKeys } = this.state;
      if(!(selectedRowKeys.length > 0)) {
        notification["error"]({
            message: 'Choose Order',
            description: "Please choose one order to update tag",
        });
        return;
      }

      this.setState(
        {
          tagSelectedData: true
          // isOpen: true
        },
        () => {
          this.modalRef.show();
        }
      );
    }

    handleDetailsModalclose() {
      this.setState({
        tagSelectedData: false
      });
    }

    showBulkModal = () => {
      const { selectedRowKeys } = this.state;
      if(!(selectedRowKeys.length > 0)) {
        notification["error"]({
            message: 'Choose Order',
            description: "Please choose one order to update tag",
        });
        return;
      }

      this.setState(
        {
          bulkSelectedData: true
          // isOpen: true
        },
        () => {
          this.bulkModalRef.show();
        }
      );
    }

    handleDetailsBulkModalclose() {
      this.setState({
        bulkSelectedData: false
      });
    }

    async componentDidMount() {
        //   this.setState({
        //     data: this.props.data,
        //     isLoading: false,
        //     userSelectedData: null
        //   });
        const { limitNumber } = this.state;
        const { listFilterData } = this.props;
        if(listFilterData === null){
          await this.callFilterData();
        }
        await this.callNextData(limitNumber, null);
    }

    callFilterData = async () => {
      try{
        const { setListtagDictinary, authToken, history, setLoginFlag, setUserData, setUserToken, setListFilterData, setListFilterDataTotal } = this.props;
          this.setState({
              isLoading : true
          });

          let filterData = await getAllFilter(authToken, 0, 1000000);

          if(filterData.status == 200){
              //set fllter Data
              await setListFilterData(filterData.data);
              await setListFilterDataTotal(filterData.total);

          }else if (filterData.status === 401) {
              await setLoginFlag(false);
              await setUserData(null);
              await setUserToken(null);
              history.push(`${process.env.PUBLIC_URL}/login`);
          }

      }catch(e) {
          console.log("!!!!!!!list user Data printed here", e);
      }
    }

    callNextData = async (limit, cursor) => {
        try{
          const { cursorDataArray, pageNumber } = this.state;
          const { authToken, history, setLoginFlag, setUserData, setUserToken, setListOrderDataTotal } = this.props;
          const { listSearchFlag, searchText, setListOrderData } = this.props;

          this.setState({
            isLoading : true
          });

          if(listSearchFlag) {
            let orderData = await searchOrder(authToken, searchText);
            console.log("!!!!!!!!!!orderData after search ", orderData);
            await setListOrderData(orderData.data);
            this.setState({
              isLoading : false
            });
            return;
          }

          let dummyPageNumber = pageNumber;
          console.log("!!!!!!!!for next page", limit, cursor);

          if(cursor === null){
            let duumyCursorDataArray = [];
    
            let orderData = await getAllOrder(authToken, limit);
        
            console.log("!!!!!!!!!!!!!!orderData printed here first", orderData.data.orders.edges);
            duumyCursorDataArray.push(orderData.data.orders.edges[orderData.data.orders.edges.length - 1].cursor);
    
            this.setState({
              currentCursorData : orderData.data.orders.edges,
              hasPreviousPage : orderData.data.orders.pageInfo.hasPreviousPage,
              hasNextPage : orderData.data.orders.pageInfo.hasNextPage,
              currentCursor : orderData.data.orders.edges[orderData.data.orders.edges.length - 1].cursor,
              cursorDataArray : duumyCursorDataArray,
              pageNumber : dummyPageNumber + 1
            })
      
            return;
          }
          
          let duumyCursorDataArray = cursorDataArray;
          let orderData = await getAllPaginateOrder(authToken, limit, cursor);
    
    
          let filterData = duumyCursorDataArray.filter((data, index) => {
            data === orderData.data.orders.edges[orderData.data.orders.edges.length - 1].cursor
          });
          console.log("!!!!!!!!!!!!!!orderData printed here first", orderData.data.orders.edges, !(filterData.length > 0));
    
          if(!(filterData.length > 0)){
            duumyCursorDataArray.push(orderData.data.orders.edges[orderData.data.orders.edges.length - 1].cursor);
          }
    
          this.setState({
            currentCursorData : orderData.data.orders.edges,
            hasPreviousPage : orderData.data.orders.pageInfo.hasPreviousPage,
            hasNextPage : orderData.data.orders.pageInfo.hasNextPage,
            currentCursor : orderData.data.orders.edges[orderData.data.orders.edges.length - 1].cursor,
            cursorDataArray : duumyCursorDataArray,
            pageNumber : duumyCursorDataArray.length
          })
        }catch(error) {
          console.log("!!!!!!!!error in next Data", error);
        } finally {
          this.setState({
            isLoading : false
          })
        }
    }
    
    callPreviousData = async (limit, cursor) => {
        try{
          const { pageNumber, cursorDataArray } = this.state;
          const { authToken } = this.props;
          let dummyPageNumber = pageNumber;
          console.log("!!!!!!!!for privios page", limit, cursor);
          const { listSearchFlag, searchText, setListOrderData } = this.props;

          this.setState({
            isLoading : true
          });

          if(listSearchFlag) {
            let orderData = await searchOrder(authToken, searchText);
            console.log("!!!!!!!!!!orderData after search ", orderData);
            await setListOrderData(orderData.data);
            this.setState({
              isLoading : false
            });
            return;
          }
    
          if(cursor === null){
            return;
          }
      
          let orderData = await getAllPaginateOrder(authToken, limit, cursor);
    
          let duumyCursorDataArray = cursorDataArray.filter((data, index) => {
            return index !== pageNumber - 1
          });
          console.log("!!!!!!!!!!!!!!orderData printed here first previous pageNumber", orderData.data.orders.edges, duumyCursorDataArray.length);
    
          this.setState({
            currentCursorData : orderData.data.orders.edges,
            hasPreviousPage : orderData.data.orders.pageInfo.hasPreviousPage,
            hasNextPage : orderData.data.orders.pageInfo.hasNextPage,
            currentCursor : orderData.data.orders.edges[orderData.data.orders.edges.length - 1].cursor,
            pageNumber : duumyCursorDataArray.length,
            cursorDataArray : duumyCursorDataArray
          })
        }catch(error) {
          console.log("!!!!!!!!error in next Data", error);
        } finally {
          this.setState({
            isLoading : false
          })
        }
    }

    callPreviousFirstData = async (limit) => {
      try{
        const { pageNumber, cursorDataArray } = this.state;
        const { authToken } = this.props;
        let dummyPageNumber = pageNumber;
        console.log("!!!!!!!!for privios page", limit);
        const { listSearchFlag, searchText, setListOrderData } = this.props;

        this.setState({
          isLoading : true
        });

        if(listSearchFlag) {
          let orderData = await searchOrder(authToken, searchText);
          console.log("!!!!!!!!!!orderData after search ", orderData);
          await setListOrderData(orderData.data);
          this.setState({
            isLoading : false
          });
          return;
        }
  
        let orderData = await getAllOrder(authToken, limit);

        let duumyCursorDataArray = cursorDataArray.filter((data, index) => {
          return index !== pageNumber - 1
        });
        console.log("!!!!!!!!!!!!!!orderData printed here first previous pageNumber first", orderData.data.orders.edges, duumyCursorDataArray.length);
  
        this.setState({
          currentCursorData : orderData.data.orders.edges,
          hasPreviousPage : orderData.data.orders.pageInfo.hasPreviousPage,
          hasNextPage : orderData.data.orders.pageInfo.hasNextPage,
          currentCursor : orderData.data.orders.edges[orderData.data.orders.edges.length - 1].cursor,
          pageNumber : duumyCursorDataArray.length,
          cursorDataArray : duumyCursorDataArray
        })
      }catch(error) {
        console.log("!!!!!!!!error in next Data", error);
      } finally {
        this.setState({
          isLoading : false
        })
      }
    }
  
    dateFormat(date) {
      var oldDate = new Date(date),
      momentObj = moment(oldDate).utc(),
      newDate = momentObj.format("Do MMM YYYY HH:mm");
  
      return newDate;
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

    counter = 0;
    tempCounter = 0;
    columns = [
      {
        title: "Sr. No.",
        key: "sr",
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
        fixed : window.innerWidth < 992 ? false : true,
        key: "orderNumber",
        render: (text, item, index) => {
          const orderIdString = item.node.id.replace("gid://shopify/Order/", "");

          return (
            <div>
              <div style={{ alignItems: "center", display : "inline-block", width : "100%" }}>
                <div flexDirection="column">
                  <strong>
                    <Tooltip placement="bottom" title={`${this.props.t('name_header')}`}>
                      <div style={{ cursor : "pointer", color : "#3949ab" }} onClick={() => this.showUserLogsModal(item)}>
                        {`${this.props.t('activity_header')}`}  
                      </div>
                    </Tooltip>
                    <Tooltip placement="bottom" title="Name">
                      <a style={{ cursor : "pointer" }} target="_blank" href={`${SHOPIFY_URL}admin/orders/${orderIdString}`}>
                        {item.node.name}  
                      </a>
                    </Tooltip>
                  </strong>
                  <br />
                  <span style={{ color : "grey", fontSize : "14px" }}>
                  {item.node.createdAt ? this.dateFormat(item.node.createdAt) : this.dateFormat(item.node.created_at)}
                  </span>
                </div>
              </div>
            </div>
          );
        }
      },
      {
        title: `${this.props.t('customer_header')}`,
        fixed : window.innerWidth < 992 ? false : true,
        width : 200,
        key: "CustomerInformationAll",
        // ellipsis: true,
        render: (text, item, index) => {
          const { filterColumn } = this.props;
          let data = filterColumn["CustomerInformation"];
          if(item.node.customer === null) {
            return (
              <div>
                <div style={{ alignItems: "center", display : "inline-block", width : "100%" }}>
                  <div flexDirection="column">
                      <Tooltip placement="bottom" title={`${this.props.t('customer_header')}`}>
                        -
                      </Tooltip>
              
                  </div>
                </div>
              </div>
            );
          }
          const customerString =  typeof item.node.customer.id === "string" ? item.node.customer.id.replace("gid://shopify/Customer/", "") : `${item.node.customer.id}`;

          let displayString = !item.node.customer.displayName ? item.node.customer.first_name + "," + "\n" : item.node.customer.displayName + "," + "\n";

          if(data["Email"]) {
            if(item.node.customer.email){
              displayString = displayString + item.node.customer.email+  "\n"
            }
          }

          if(data["Phone"]) {
            if(item.node.customer.phone) {
              displayString = displayString + item.node.customer.phone + "\n" 
            }
          }

          if(data["OrderCount"]) {
            if(item.node.customer.ordersCount) {
              displayString = displayString + item.node.customer.ordersCount + "\n" 
            } else if (item.node.customer.orders_count) {
              displayString = displayString + item.node.customer.orders_count + "\n" 
            }
          }

          if(data["CustomerNote"]) {
            if(item.node.customer.note && item.node.customer.note !== "") {
              displayString = displayString + item.node.customer.note && note + "\n" 
            }
          }

          return (
            <div>
              <div style={{ alignItems: "center", display : "inline-block", width : "100%" }}>
                <div flexDirection="column">
                    <Tooltip placement="bottom" title={`${this.props.t('customer_header')}`}>
                      <a style={{ cursor : "pointer" }} target="_blank" href={`${SHOPIFY_URL}admin/customers/${customerString}`}>
                        {!item.node.customer ? "-" : (
                          <div>
                            {displayString.split('\n').map( (it, i) => <div key={'x'+i}>{it}</div> )}
                          </div>
                        )}
                      </a>
                    </Tooltip>
            
                </div>
              </div>
            </div>
          );
        }
      },
      {
        title: `${this.props.t('product_header')}`,
        width : 250,
        key: "Products",
        // ellipsis: true,
        render: (text, item, index) => {
          let displayString = "";
          let items = item.node.lineItems.edges;
  
          return (
            <div>
              <div style={{ alignItems: "center", display : "inline-block", width : "100%" }}>
                <div flexDirection="column">
                    <Tooltip placement="bottom" title={`${this.props.t('product_header')}`}>
                      {
                        items !== null && items.length > 0 ?
                        (
                          <div>
                            {
                              la.map(items, (data, index) => {
                                if(index === (items.length - 1)){
                                  return (
                                    <div>
                                      {`${data.node.name} x ${data.node.quantity}`} 
                                      <br/>
                                      {`${data.node.vendor}`}
                                      <br/>
                                      {data.node.sku && data.node.sku !== "" ? `(SKU : ${data.node.sku} )` : null}
                                    </div>
                                  )
                                }
                                return (
                                  <div style={{ paddingBottom : "10px", borderBottom : "1px solid #80808059" }}>
                                    {`${data.node.name} x ${data.node.quantity}`} 
                                    <br/>
                                    {`${data.node.vendor}`}
                                    <br/>
                                    {data.node.sku && data.node.sku !== "" ? `(SKU : ${data.node.sku} )` : null}
                                  </div>
                                )
                              })
                            }
                          </div>
                        )
                        :
                        "-"
                      }
                    </Tooltip>
                </div>
              </div>
            </div>
          );
        }
      },
      {
        title: `${this.props.t('status_header')}`,
        key: "tags",
        // ellipsis: true,
        render: (text, item, index) => {
          const { listTagDictionaryData } = this.props;
          let filterTagData = listTagDictionaryData.filter((data, index) => {
            if(item.node.tags.length > 0){
              var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

              return data.name.replace(regex, '').trim() === item.node.tags[0].replace(regex, '').trim()
            }
            return false;
          });

          console.log("!!!!!!!!!!filterTagData", filterTagData);

          if(!(filterTagData.length > 0)) {
            return (
              <div>
                <div style={{ alignItems: "center", display : "inline-block", width : "100%" }}>
                  <div flexDirection="column">
                      <Tooltip placement="bottom" title={`${this.props.t('status_header')}`}>
                        <div onClick={() => this.opentagModal(item)} style={{ cursor : "pointer", backgroundColor : "transparent", display: "inline-flex", alignItems : "center", minHeight : "1.8rem", padding : "0 0.8rem", borderRadius : "3px", color : "grey" }}>
                            {"Select Status"}
                        </div>
                      </Tooltip>
                  </div>
                </div>
              </div>
            )
          }
          return (
            <div>
              <div style={{ alignItems: "center", display : "inline-block", width : "100%" }}>
                <div flexDirection="column">
                    <Tooltip placement="bottom" title={`${this.props.t('status_header')}`}>
                        <div onClick={() => this.opentagModal(item)} style={{ cursor : "pointer", backgroundColor : filterTagData[0].background_color, display: "inline-flex", alignItems : "center", minHeight : "1.8rem", padding : "0 0.8rem", borderRadius : "3px", color : filterTagData[0].text_color }}>
                            {(filterTagData.length > 0) ? item.node.tags[0] :  "-"}
                        </div>
                    </Tooltip>
                </div>
              </div>
            </div>
          );
        }
      },
      {
        title: `${this.props.t('shipping_add_header')}`,
        key: "ShippingAddressAll",
        // ellipsis: true,
        render: (text, item, index) => {
          const { filterColumn } = this.props;
          let displayString = "";
          let data = filterColumn["ShippingAddress"];

          if(item.node.shippingAddress !== null) {
            if(data["FirstName"]) {
              if(item.node.shippingAddress.firstName){
                displayString = displayString + item.node.shippingAddress.firstName + " "
              } else if (item.node.shippingAddress.first_name) {
                displayString = displayString + item.node.shippingAddress.first_name + " "
              }
            }
  
            if(data["LastName"]) {
              if(item.node.shippingAddress.lastName){
                displayString = displayString + item.node.shippingAddress.lastName +  "\n"
              } else if (item.node.shippingAddress.last_name) {
                displayString = displayString + item.node.shippingAddress.last_name + " "
              }
            }
  
            if(data["Company"]) {
              if(item.node.shippingAddress.company){
                displayString = displayString + item.node.shippingAddress.company +  "\n"
              }
            }
  
            if(data["Telephone"]) {
              if(item.node.shippingAddress.phone){
                displayString = displayString + item.node.shippingAddress.phone +  "\n"
              }
            }
  
            if(data["AddressLine1"]) {
              if(item.node.shippingAddress.address1){
                displayString = displayString + item.node.shippingAddress.address1 + ","
              }
            }
  
            if(data["AddressLine2"]) {
              if(item.node.shippingAddress.address2){
                displayString = displayString + item.node.shippingAddress.address2 + "," +  "\n"
              }
            }
  
            if(data["City"]) {
              if(item.node.shippingAddress.city){
                displayString = displayString + item.node.shippingAddress.city + ", "
              }
            }
  
            if(data["Province"]) {
              if(item.node.shippingAddress.provinceCode){
                displayString = displayString + item.node.shippingAddress.provinceCode + "," +  "\n"
              } else if (item.node.shippingAddress.province_code) {
                displayString = displayString + item.node.shippingAddress.province_code + "," +  "\n"
              }
            }
  
            if(data["Zip"]) {
              if(item.node.shippingAddress.zip){
                displayString = displayString + item.node.shippingAddress.zip + "," +  "\n"
              }
            }
  
            if(data["Country"]) {
              if(item.node.shippingAddress.country){
                displayString = displayString + item.node.shippingAddress.country + "," +  "\n"
              }
            }
          }
          
          return (
            <div>
              <div style={{ alignItems: "center", display : "inline-block", width : "100%" }}>
                <div flexDirection="column">
                    <Tooltip placement="bottom" title={`${this.props.t('shipping_add_header')}`}>
                        {displayString === "" ? "-" : (
                          <div>
                            {displayString.split('\n').map( (it, i) => <div key={'x'+i}>{it}</div> )}
                          </div>
                        )}
                    </Tooltip>
                </div>
              </div>
            </div>
          );
        }
      },
      {
        title: `${this.props.t('billing_add_header')}`,
        key: "BillingAddressAll",
        // ellipsis: true,
        render: (text, item, index) => {
          const { filterColumn } = this.props;
          let displayString = "";
          let data = filterColumn["BillingAddress"];

          if(item.node.billingAddress !== null) {
            if(data["FirstName"]) {
              if(item.node.billingAddress.firstName){
                displayString = displayString + item.node.billingAddress.firstName + " "
              } else if(item.node.billingAddress.first_name){
                displayString = displayString + item.node.billingAddress.first_name + " "
              }
            }
  
            if(data["LastName"]) {
              if(item.node.billingAddress.lastName){
                displayString = displayString + item.node.billingAddress.lastName +  "\n"
              } else if(item.node.billingAddress.last_name){
                displayString = displayString + item.node.billingAddress.last_name +  "\n"
              }
            }
  
            if(data["Company"]) {
              if(item.node.billingAddress.company){
                displayString = displayString + item.node.billingAddress.company +  "\n"
              }
            }
  
            if(data["Telephone"]) {
              if(item.node.billingAddress.phone){
                displayString = displayString + item.node.billingAddress.phone +  "\n"
              }
            }
  
            if(data["AddressLine1"]) {
              if(item.node.billingAddress.address1){
                displayString = displayString + item.node.billingAddress.address1 + ","
              }
            }
  
            if(data["AddressLine2"]) {
              if(item.node.billingAddress.address2){
                displayString = displayString + item.node.billingAddress.address2 + "," +  "\n"
              }
            }
  
            if(data["City"]) {
              if(item.node.billingAddress.city){
                displayString = displayString + item.node.billingAddress.city + ", "
              }
            }
  
            if(data["Province"]) {
              if(item.node.billingAddress.provinceCode){
                displayString = displayString + item.node.billingAddress.provinceCode + "," +  "\n"
              } else if(item.node.billingAddress.province_code){
                displayString = displayString + item.node.billingAddress.province_code + "," +  "\n"
              }
            }
  
            if(data["Zip"]) {
              if(item.node.billingAddress.zip){
                displayString = displayString + item.node.billingAddress.zip + "," +  "\n"
              }
            }
  
            if(data["Country"]) {
              if(item.node.billingAddress.country){
                displayString = displayString + item.node.billingAddress.country + "," +  "\n"
              }
            }
          }
          
          return (
            <div>
              <div style={{ alignItems: "center", display : "inline-block", width : "100%" }}>
                <div flexDirection="column">
                    <Tooltip placement="bottom" title={`${this.props.t('billing_add_header')}`}>
                        {displayString === "" ? "-" : (
                          <div>
                            {displayString.split('\n').map( (it, i) => <div key={'x'+i}>{it}</div> )}
                          </div>
                        )}
                    </Tooltip>
                </div>
              </div>
            </div>
          );
        }
      },
      {
        title: `${this.props.t('shipping_methpd_address')}`,
        key: "ShippingMethod",
        // ellipsis: true,
        render: (text, item, index) => {
          return (
            <div>
              <div style={{ alignItems: "center", display : "inline-block", width : "100%" }}>
                <div flexDirection="column">
                    <Tooltip placement="bottom" title={`${this.props.t('shipping_methpd_address')}`}>
                        {item.node.shippingLine ? item.node.shippingLine.code : "-"}
                    </Tooltip>
                </div>
              </div>
            </div>
          );
        }
      },
      {
        title: `${this.props.t('amount_header')}`,
        key: "OrderTotal",
        render: (text, item, index) => {
          return (
            <div>
              <div style={{ alignItems: "center", display : "inline-block", width : "100%" }}>
                <div flexDirection="column">
                    <Tooltip placement="bottom" title={`${this.props.t('amount_header')}`}>
                        {`${item.node.totalPriceSet.presentmentMoney.currencyCode ? item.node.totalPriceSet.presentmentMoney.currencyCode : item.node.totalPriceSet.presentmentMoney.currency_code} ${item.node.totalPriceSet.presentmentMoney.amount}`}
                    </Tooltip>
                </div>
              </div>
            </div>
          );
        }
      },
      {
        title: `${this.props.t('fulfillment_header')}`,
        key: "fulfillment",
        render: (text, item, index) => {
          const { listSearchFlag } = this.props;
          console.log("!!!!!!status", item.node.displayFulfillmentStatus, item.node.fulfillment_status)
          return (
            <div>
              <div style={{ alignItems: "center", display : "inline-block", width : "100%" }}>
                <div flexDirection="column">
                    <Tooltip placement="bottom" title={`${this.props.t('fulfillment_header')}`}>
                        <div style={{ backgroundColor : listSearchFlag && item.node.fulfillment_status ? item.node.fulfillment_status !== "fulfilled" ? "orange" : "green" : item.node.displayFulfillmentStatus !== "FULFILLED" ? "orange" : "green", display: "inline-flex", alignItems : "center", minHeight : "1.8rem", padding : "0 0.8rem", borderRadius : "3px", color : "white" }}>
                            {item.node.fulfillment_status ? item.node.fulfillment_status : item.node.displayFulfillmentStatus ? item.node.displayFulfillmentStatus : "UnFulFilled"}
                        </div>
                    </Tooltip>
                </div>
              </div>
            </div>
          );
        }
      },
      {
        title: `${this.props.t('payment_method_header')}`,
        key: "PaymentMethod",
        render: (text, item, index) => {
          return (
            <div>
              <div style={{ alignItems: "center", display : "inline-block", width : "100%" }}>
                <div flexDirection="column">
                    <Tooltip placement="bottom" title={`${this.props.t('payment_method_header')}`}>
                        <div style={{ backgroundColor : item.node.financial_status === "paid" ? "green" :  item.node.fullyPaid ? "green" : "orange", display: "inline-flex", alignItems : "center", minHeight : "1.8rem", padding : "0 0.8rem", borderRadius : "3px", color : "white" }}>
                            {item.node.financial_status ? item.node.financial_status : !item.node.fullyPaid ? "Pending" : "Paid"}
                        </div>
                    </Tooltip>
                </div>
              </div>
            </div>
          );
        }
      },
      {
        title: `${this.props.t('order_note_header')}`,
        key: "Notes",
        render: (text, item, index) => {
          return (
            <div>
              <div style={{ alignItems: "center", display : "inline-block", width : "100%" }}>
                <div flexDirection="column">
                    <Tooltip placement="bottom" title={`${this.props.t('order_note_header')}`}>
                      {item.node.note && item.node.note !== "" ? item.node.note : "-"}
                    </Tooltip>
                </div>
              </div>
            </div>
          );
        }
      },
      {
        title: "Actions",
        width : 130,
        fixed : window.innerWidth < 992 ? false : true,
        key: "action",
        render: (text, item, index) => {
          return (
            <div style={{ display : "inline-block", width : "100%" }}>
              <div mr="5px" className="table-icon" style={{float : "left", marginLeft : "5px"}}>
                <Tooltip placement="bottom" title="User Logs">
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

    filterTagSubmit = async (values) => {
      console.log("!!!!!!!!!!!!values printed here", values);
      let tagArray = values.tag;
      this.setState({
        currentCursor : null,
        currentFilterCursor : null,
        cursorDataArray : [],
        filterCursorDataArray : [],
        currentCursorData : [],
        currentFilterCursorData : [],
        hasPreviousPage : false,
        hasFilterPreviousPage : false,
        hasNextPage : false,
        hasFilterNextPage : false,
        pageNumber : 0,
        filterPageNumber : 0,
        limitNumber : 20,
        filterLimitNumber : 20,
        isFilterSelected : false,
        isDirectFilterSelected : false,
        filterQueryString : "",
        selectedRowKeys: [],
        tagSelectedData: false,
        filterSelectedData : false,
      });

      this.setState({
        isFilterSelected : true,
        filterTagArray : tagArray
      });

      const { filterLimitNumber } = this.state;
      await this.callFilterNextData(filterLimitNumber, null, tagArray);
    }

    callDirectFilter = async (queryString) => {
      try{
        const { filterLimitNumber } = this.state;

        this.setState({
          currentCursor : null,
          currentFilterCursor : null,
          cursorDataArray : [],
          filterCursorDataArray : [],
          currentCursorData : [],
          currentFilterCursorData : [],
          hasPreviousPage : false,
          hasFilterPreviousPage : false,
          hasNextPage : false,
          hasFilterNextPage : false,
          pageNumber : 0,
          filterPageNumber : 0,
          limitNumber : 20,
          filterLimitNumber : 20,
          isFilterSelected : false,
          isDirectFilterSelected : false,
          filterQueryString : "",
          selectedRowKeys: [],
          tagSelectedData: false,
          filterSelectedData : false,
        });

        this.setState({
          isDirectFilterSelected : true,
          filterQueryString : queryString
        });
  
        await this.callFilterDirectNextData(filterLimitNumber, null, queryString);
      }catch(e){
        console.log("!!!!!!!error callDirectFilter", e);
      } 
    }

    callFilterNextData = async (limit, cursor, tagArray) => {
      try{
        const { filterCursorDataArray, filterPageNumber } = this.state;
        const { authToken, history, setLoginFlag, setUserData, setUserToken, setListOrderDataTotal } = this.props;

        let dummyPageNumber = filterPageNumber;
        console.log("!!!!!!!!for next page", limit, cursor);

        const { listSearchFlag, searchText, setListOrderData } = this.props;

        this.setState({
          isLoading : true
        });

        if(listSearchFlag) {
          let orderData = await searchOrder(authToken, searchText);
          console.log("!!!!!!!!!!orderData after search ", orderData);
          await setListOrderData(orderData.data);
          this.setState({
            isLoading : false
          });
          return;
        }

  
        if(cursor === null){
          let duumyCursorDataArray = [];
  
          let orderData = await getAllFilterOrder(authToken, limit, tagArray);
      
          console.log("!!!!!!!!!!!!!!orderData printed here first", orderData.data.orders.edges);
          duumyCursorDataArray.push(orderData.data.orders.edges[orderData.data.orders.edges.length - 1].cursor);
  
          this.setState({
            currentFilterCursorData : orderData.data.orders.edges,
            hasFilterPreviousPage : orderData.data.orders.pageInfo.hasPreviousPage,
            hasFilterNextPage : orderData.data.orders.pageInfo.hasNextPage,
            currentFilterCursor : orderData.data.orders.edges[orderData.data.orders.edges.length - 1].cursor,
            filterCursorDataArray : duumyCursorDataArray,
            filterPageNumber : dummyPageNumber + 1
          })
    
          return;
        }
        
        let duumyCursorDataArray = filterCursorDataArray;
        let orderData = await getAllFilterPaginateOrder(authToken, limit, cursor, tagArray);
  
        let filterData = duumyCursorDataArray.filter((data, index) => {
          data === orderData.data.orders.edges[orderData.data.orders.edges.length - 1].cursor
        });
        console.log("!!!!!!!!!!!!!!orderData printed here first", orderData.data.orders.edges, !(filterData.length > 0));
  
        if(!(filterData.length > 0)){
          duumyCursorDataArray.push(orderData.data.orders.edges[orderData.data.orders.edges.length - 1].cursor);
        }
  
        this.setState({
          currentFilterCursorData : orderData.data.orders.edges,
          hasFilterPreviousPage : orderData.data.orders.pageInfo.hasPreviousPage,
          hasFilterNextPage : orderData.data.orders.pageInfo.hasNextPage,
          currentFilterCursor : orderData.data.orders.edges[orderData.data.orders.edges.length - 1].cursor,
          filterCursorDataArray : duumyCursorDataArray,
          filterPageNumber : duumyCursorDataArray.length
        })
      }catch(error) {
        console.log("!!!!!!!!error in next Data", error);
      } finally {
        this.setState({
          isLoading : false
        })
      }
    }
  
    callFilterPreviousData = async (limit, cursor, tagArray) => {
        try{
          const { filterPageNumber, filterCursorDataArray } = this.state;
          const { authToken } = this.props;
          let dummyPageNumber = filterPageNumber;
          console.log("!!!!!!!!for privios page", limit, cursor);
    
          const { listSearchFlag, searchText, setListOrderData } = this.props;

          this.setState({
            isLoading : true
          });

          if(listSearchFlag) {
            let orderData = await searchOrder(authToken, searchText);
            console.log("!!!!!!!!!!orderData after search ", orderData);
            await setListOrderData(orderData.data);
            this.setState({
              isLoading : false
            });
            return;
          }

          if(cursor === null){
            return;
          }
      
          let orderData = await getAllFilterPaginateOrder(authToken, limit, cursor, tagArray);
    
          let duumyCursorDataArray = filterCursorDataArray.filter((data, index) => {
            return index !== filterPageNumber - 1
          });
          console.log("!!!!!!!!!!!!!!orderData printed here first previous pageNumber", orderData.data.orders.edges, duumyCursorDataArray.length);
    
          this.setState({
            currentFilterCursorData : orderData.data.orders.edges,
            hasFilterPreviousPage : orderData.data.orders.pageInfo.hasPreviousPage,
            hasFilterNextPage : orderData.data.orders.pageInfo.hasNextPage,
            currentFilterCursor : orderData.data.orders.edges[orderData.data.orders.edges.length - 1].cursor,
            filterPageNumber : duumyCursorDataArray.length,
            filterCursorDataArray : duumyCursorDataArray
          })
        }catch(error) {
          console.log("!!!!!!!!error in next Data", error);
        } finally {
          this.setState({
            isLoading : false
          })
        }
    }

    callFilterPreviousFirstData = async (limit, tagArray) => {
      try{
        const { filterPageNumber, filterCursorDataArray } = this.state;

        const { authToken } = this.props;
        let dummyPageNumber = filterPageNumber;
        console.log("!!!!!!!!for privios page", limit);

        const { listSearchFlag, searchText, setListOrderData } = this.props;

        this.setState({
          isLoading : true
        });

        if(listSearchFlag) {
          let orderData = await searchOrder(authToken, searchText);
          console.log("!!!!!!!!!!orderData after search ", orderData);
          await setListOrderData(orderData.data);
          this.setState({
            isLoading : false
          });
          return;
        }

        let orderData = await getAllFilterOrder(authToken, limit, tagArray);

        let duumyCursorDataArray = filterCursorDataArray.filter((data, index) => {
          return index !== filterPageNumber - 1
        });
        console.log("!!!!!!!!!!!!!!orderData printed here first previous pageNumber first", orderData.data.orders.edges, duumyCursorDataArray.length);

        this.setState({
          currentFilterCursorData : orderData.data.orders.edges,
          hasFilterPreviousPage : orderData.data.orders.pageInfo.hasPreviousPage,
          hasFilterNextPage : orderData.data.orders.pageInfo.hasNextPage,
          currentFilterCursor : orderData.data.orders.edges[orderData.data.orders.edges.length - 1].cursor,
          filterPageNumber : duumyCursorDataArray.length,
          filterCursorDataArray : duumyCursorDataArray
        })
      }catch(error) {
        console.log("!!!!!!!!error in next Data", error);
      } finally {
        this.setState({
          isLoading : false
        })
      }
    }

    resetFilterModal = async () => {
      const { setListSearchFlag, setListSearchResetFlag, setSearchText } = this.props;
      await setSearchText("");
      await setListSearchFlag(false);
      await setListSearchResetFlag(false);

      this.setState({
        currentCursor : null,
        currentFilterCursor : null,
        cursorDataArray : [],
        filterCursorDataArray : [],
        currentCursorData : [],
        currentFilterCursorData : [],
        hasPreviousPage : false,
        hasFilterPreviousPage : false,
        hasNextPage : false,
        hasFilterNextPage : false,
        pageNumber : 0,
        filterPageNumber : 0,
        limitNumber : 20,
        filterLimitNumber : 20,
        isFilterSelected : false,
        isDirectFilterSelected : false,
        filterQueryString : "",
        selectedRowKeys: [],
        tagSelectedData: false,
        filterSelectedData : false,
      });

      const { limitNumber } = this.state;
      await this.callNextData(limitNumber, null);
    }

    updateTagSubmit = async (values, fulfillProductArray) => {
      try{
        this.setState({
          isLoading: true
        })

        const { authToken, history, setLoginFlag, setUserData, setUserToken } = this.props;
        const { listSearchFlag, searchText, setListOrderData } = this.props;
        const { startIndex, fromTagName, fromTagArray, isFromTag, fromTagId, limitNumber, selectedRowKeys, pageNumber, cursorDataArray, filterPageNumber, filterCursorDataArray, filterTagArray, filterLimitNumber, isFilterSelected } = this.state;
        let tagArray = [];
        tagArray.push(values.tag);
        let orderIdArray = [];

        if(isFromTag) {
          orderIdArray.push({
            id : fromTagId,
            name : fromTagName,
            tagArray : fromTagArray
          });
        }else{
          la.map(selectedRowKeys, (data, inex) => {
            orderIdArray.push({
              id : data.id,
              name : data.name,
              tagArray : data.tags
            });
          });
        }

        console.log("!!!!!!!!!!fulfillProductArray", fulfillProductArray);

        let statusData = await updateTag(authToken, orderIdArray, tagArray, fulfillProductArray);
        if(statusData.status == 200){
          notification["success"]({
              message: 'Update Tag',
              description:
                'Successfully updated',
          });

          this.setState({
            selectedRowKeys : [],
            isFromTag : false,
            fromTagId : null,
            fromTagName : null,
            fromTagArray : null,
            fromTagData : null
          });

          console.log("!!!!!!!!!!!!!!!!!!pageNumber", cursorDataArray, pageNumber, cursorDataArray[pageNumber - 2]);

          if(listSearchFlag) {
            let orderData = await searchOrder(authToken, searchText);
            console.log("!!!!!!!!!!orderData after search ", orderData);
            await setListOrderData(orderData.data);

            this.setState({
              isLoading : false
            });
          }

          //filter selected
          if(isFilterSelected) {
            if(filterPageNumber === 1){
              let orderData = await getAllFilterOrder(authToken, filterLimitNumber, filterTagArray);
              this.setState({
                currentFilterCursorData : orderData.data.orders.edges,
              })
              return;
            }
  
            let orderData = await getAllFilterPaginateOrder(authToken, filterLimitNumber, filterCursorDataArray[filterPageNumber - 2], filterTagArray);
            this.setState({
              currentFilterCursorData : orderData.data.orders.edges,
            })

            return;
          }

          if(pageNumber === 1){
            let orderData = await getAllOrder(authToken, limitNumber);
            this.setState({
              currentCursorData : orderData.data.orders.edges,
            })
            return;
          }

          let orderData = await getAllPaginateOrder(authToken, limitNumber, cursorDataArray[pageNumber - 2]);
          this.setState({
            currentCursorData : orderData.data.orders.edges,
          })

        }else if (statusData.status == 401) {
            await setLoginFlag(false);
            await setUserData(null);
            await setUserToken(null);
            history.push(`${process.env.PUBLIC_URL}/login`);
        }
      }catch(err){
         console.log("!!!!!!!!!!!!!error printed here", err);
         notification["error"]({
            message: 'Update Tag',
            description: err,
        });
      } finally {
          this.setState({
              isLoading: false
          })
      }
    }

    addBulkFulfilment = async () => {
      try{
        this.setState({
          isLoading: true
        });


        const { authToken, history, setLoginFlag, setUserData, setUserToken, searchText } = this.props;
        const { startIndex, limitNumber, selectedRowKeys, pageNumber, cursorDataArray, filterPageNumber, filterCursorDataArray, filterTagArray, filterLimitNumber, isFilterSelected } = this.state;
        
        if(!(selectedRowKeys.length > 0)){
          notification["error"]({
              message: 'Choose Order',
              description: "Please choose one order to bulk fulfillment",
          });
          return;
        }

        let tagArray = [];
        tagArray.push("Fulfilled");

        let orderIdArray = [];
        la.map(selectedRowKeys, (data, inex) => {
          // orderIdArray.push(data.id);
          orderIdArray.push({
            id : data.id,
            name : data.name,
            tagArray : data.tags
          });
        });
        
        let statusData = await updateTag(authToken, orderIdArray, tagArray);
        if(statusData.status == 200){
          notification["success"]({
              message: 'Bulk Fulfill',
              description:
                'Successfully Fulfilled',
          });

          this.setState({
            selectedRowKeys : []
          });

          console.log("!!!!!!!!!!!!!!!!!!pageNumber", cursorDataArray, pageNumber, cursorDataArray[pageNumber - 2]);

          //filter selected
          if(isFilterSelected) {
            if(filterPageNumber === 1){
              let orderData = await getAllFilterOrder(authToken, filterLimitNumber, filterTagArray);
              this.setState({
                currentFilterCursorData : orderData.data.orders.edges,
              })
              return;
            }
  
            let orderData = await getAllFilterPaginateOrder(authToken, filterLimitNumber, filterCursorDataArray[filterPageNumber - 2], filterTagArray);
            this.setState({
              currentFilterCursorData : orderData.data.orders.edges,
            })

            return;
          }

          if(pageNumber === 1){
            let orderData = await getAllOrder(authToken, limitNumber);
            this.setState({
              currentCursorData : orderData.data.orders.edges,
            })
            return;
          }

          let orderData = await getAllPaginateOrder(authToken, limitNumber, cursorDataArray[pageNumber - 2]);
          this.setState({
            currentCursorData : orderData.data.orders.edges,
          })

        }else if (statusData.status == 401) {
            await setLoginFlag(false);
            await setUserData(null);
            await setUserToken(null);
            history.push(`${process.env.PUBLIC_URL}/login`);
        }
      }catch(err){
         console.log("!!!!!!!!!!!!!error printed here", err);
         notification["error"]({
            message: 'Bulk Fulfill',
            description: err,
        });
      } finally {
          this.setState({
              isLoading: false
          })
      }
    }
  
    onSelectChange = selectedRowKeys => {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.setState({ selectedRowKeys });
    };

    onColumnChange = (checked, data) => {
      const { selectedColumnArray } = this.state;
      let dummySelectedColumnArray = selectedColumnArray;
      console.log("!!!!!!!!!on column changes", checked, data);
      dummySelectedColumnArray[data] = checked;
      this.setState({
        selectedColumnArray : dummySelectedColumnArray
      })
    }

    callFilterDirectNextData = async (limit, cursor, queryString) => {
      try{
        const { filterCursorDataArray, filterPageNumber } = this.state;
        const { authToken, history, setLoginFlag, setUserData, setUserToken, setListOrderDataTotal } = this.props;

        let dummyPageNumber = filterPageNumber;
        console.log("!!!!!!!!for next page", limit, cursor);
        
        const { listSearchFlag, searchText, setListOrderData } = this.props;

        this.setState({
          isLoading : true
        });

        if(listSearchFlag) {
          let orderData = await searchOrder(authToken, searchText);
          console.log("!!!!!!!!!!orderData after search ", orderData);
          await setListOrderData(orderData.data);
          this.setState({
            isLoading : false
          });
          return;
        }
  
        if(cursor === null){
          let duumyCursorDataArray = [];
  
          let orderData = await getAllFilterDirectOrder(authToken, limit, queryString);
      
          console.log("!!!!!!!!!!!!!!orderData printed here first", orderData.data.orders.edges);
          duumyCursorDataArray.push(orderData.data.orders.edges[orderData.data.orders.edges.length - 1].cursor);
  
          this.setState({
            currentFilterCursorData : orderData.data.orders.edges,
            hasFilterPreviousPage : orderData.data.orders.pageInfo.hasPreviousPage,
            hasFilterNextPage : orderData.data.orders.pageInfo.hasNextPage,
            currentFilterCursor : orderData.data.orders.edges[orderData.data.orders.edges.length - 1].cursor,
            filterCursorDataArray : duumyCursorDataArray,
            filterPageNumber : dummyPageNumber + 1
          })
    
          return;
        }
        
        let duumyCursorDataArray = filterCursorDataArray;
        let orderData = await getAllFilterPaginateDirectOrder(authToken, limit, cursor, queryString);
  
        let filterData = duumyCursorDataArray.filter((data, index) => {
          data === orderData.data.orders.edges[orderData.data.orders.edges.length - 1].cursor
        });
        console.log("!!!!!!!!!!!!!!orderData printed here first", orderData.data.orders.edges, !(filterData.length > 0));
  
        if(!(filterData.length > 0)){
          duumyCursorDataArray.push(orderData.data.orders.edges[orderData.data.orders.edges.length - 1].cursor);
        }
  
        this.setState({
          currentFilterCursorData : orderData.data.orders.edges,
          hasFilterPreviousPage : orderData.data.orders.pageInfo.hasPreviousPage,
          hasFilterNextPage : orderData.data.orders.pageInfo.hasNextPage,
          currentFilterCursor : orderData.data.orders.edges[orderData.data.orders.edges.length - 1].cursor,
          filterCursorDataArray : duumyCursorDataArray,
          filterPageNumber : duumyCursorDataArray.length
        })
      }catch(error) {
        console.log("!!!!!!!!error in next Data", error);
      } finally {
        this.setState({
          isLoading : false
        })
      }
    }
  
    callFilterDirectPreviousData = async (limit, cursor, queryString) => {
        try{
          const { filterPageNumber, filterCursorDataArray } = this.state;
          const { authToken } = this.props;
          let dummyPageNumber = filterPageNumber;
          console.log("!!!!!!!!for privios page", limit, cursor);
          
          const { listSearchFlag, searchText, setListOrderData } = this.props;

          this.setState({
            isLoading : true
          });

          if(listSearchFlag) {
            let orderData = await searchOrder(authToken, searchText);
            console.log("!!!!!!!!!!orderData after search ", orderData);
            await setListOrderData(orderData.data);
            this.setState({
              isLoading : false
            });
            return;
          }

          if(cursor === null){
            return;
          }
      
          let orderData = await getAllFilterPaginateDirectOrder(authToken, limit, cursor, queryString);
    
          let duumyCursorDataArray = filterCursorDataArray.filter((data, index) => {
            return index !== filterPageNumber - 1
          });
          console.log("!!!!!!!!!!!!!!orderData printed here first previous pageNumber", orderData.data.orders.edges, duumyCursorDataArray.length);
    
          this.setState({
            currentFilterCursorData : orderData.data.orders.edges,
            hasFilterPreviousPage : orderData.data.orders.pageInfo.hasPreviousPage,
            hasFilterNextPage : orderData.data.orders.pageInfo.hasNextPage,
            currentFilterCursor : orderData.data.orders.edges[orderData.data.orders.edges.length - 1].cursor,
            filterPageNumber : duumyCursorDataArray.length,
            filterCursorDataArray : duumyCursorDataArray
          })
        }catch(error) {
          console.log("!!!!!!!!error in next Data", error);
        } finally {
          this.setState({
            isLoading : false
          })
        }
    }

    callFilterDirectPreviousFirstData = async (limit, queryString) => {
      try{
        const { filterPageNumber, filterCursorDataArray } = this.state;

        const { authToken } = this.props;
        let dummyPageNumber = filterPageNumber;
        console.log("!!!!!!!!for privios page", limit);
        const { listSearchFlag, searchText, setListOrderData } = this.props;

        this.setState({
          isLoading : true
        });

        if(listSearchFlag) {
          let orderData = await searchOrder(authToken, searchText);
          console.log("!!!!!!!!!!orderData after search ", orderData);
          await setListOrderData(orderData.data);
          this.setState({
            isLoading : false
          });
          return;
        }

        let orderData = await getAllFilterDirectOrder(authToken, limit, queryString);

        let duumyCursorDataArray = filterCursorDataArray.filter((data, index) => {
          return index !== filterPageNumber - 1
        });
        console.log("!!!!!!!!!!!!!!orderData printed here first previous pageNumber first", orderData.data.orders.edges, duumyCursorDataArray.length);

        this.setState({
          currentFilterCursorData : orderData.data.orders.edges,
          hasFilterPreviousPage : orderData.data.orders.pageInfo.hasPreviousPage,
          hasFilterNextPage : orderData.data.orders.pageInfo.hasNextPage,
          currentFilterCursor : orderData.data.orders.edges[orderData.data.orders.edges.length - 1].cursor,
          filterPageNumber : duumyCursorDataArray.length,
          filterCursorDataArray : duumyCursorDataArray
        })
      }catch(error) {
        console.log("!!!!!!!!error in next Data", error);
      } finally {
        this.setState({
          isLoading : false
        })
      }
    }

    // onClickRow = (e, record) => {
    //   const { selectedRowKeys, isFromTag} = this.state;
    //   console.log("!!!!!!!!!!on click row", record, selectedRowKeys, isFromTag);
    // }

    render() {
      const { selectedRowKeys, selectedColumnArray, isLoading, data, currentCursorData, hasPreviousPage, hasNextPage, currentCursor, pageNumber, cursorDataArray, limitNumber } = this.state;
      const { filterTagArray, isFilterSelected, isDirectFilterSelected, filterQueryString , currentFilterCursorData, hasFilterPreviousPage, hasFilterNextPage, currentFilterCursor, filterPageNumber, filterCursorDataArray, filterLimitNumber} = this.state;
      const { userTotal, listOrderData, listOrderDataTotal, listSearchFlag, searchLoader, authToken, primaryColor, loginUserData, listFilterData, filterColumn } = this.props;

      const rowSelection = {
        selectedRowKeys,
        onChange: this.onSelectChange,
      };

      // console.log("!!!!!!!!!filterColumn", filterColumn);

      const newColumn = this.columns.filter((data, index) => {
        if(data.key === "tags" || data.key === "fulfillment" || data.key === "action") {
          return true;
        }
        return filterColumn[data.key];
      })


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
          <div className="all-button-wrap" style={{ display : "inline-block", width : "100%" }}>
            {/* {
              la.map(Object.keys(selectedColumnArray), (data, index) => {
                return (
                  <div style={{ marginRight : "25px", marginBottom : "15px", float : "left", display : "inline-block" }}>
                      <div style={{ float : "left", fontSize : "16px", fontWeight : "500px" }}>
                        {data}
                      </div>
                      <div style={{ marginLeft : "10px", float : "left", marginTop : "2px" }}>
                        <Switch checked={selectedColumnArray[data]} onChange={(value) => this.onColumnChange(value, data)} />
                      </div>
                  </div>
                )
              })
            } */}
          </div>
          <div className="all-button-wrap" style={{ marginTop : "10px"}}>
            <div style={{ display : "inline-block", width : "100%" }}>
              <div className="button-wrap" style={{ float : "left" }}>
                <Button
                  // type="primary"
                  disabled={(loginUserData.role === "ADMIN" || loginUserData.role === "admin" || loginUserData.role === "edit_with" || loginUserData.role === "edit_without") ? false : true}
                  style={{ background: primaryColor, color: "#fff", cursor : "pointer"}}
                  onClick={() => this.showModal()}
                >
                  {this.props.t('update_tag_button_text')}
                </Button>
                <Popconfirm
                  // onConfirm={() => this.addBulkFulfilment()}
                  onConfirm={() => this.showBulkModal()}
                  title={`${this.props.t('bulk_fulfill_confirm')}`}
                >
                  <Button
                    // type="primary"
                    disabled={(loginUserData.role === "ADMIN" || loginUserData.role === "admin" || loginUserData.role === "edit_with") ? false : true}
                    style={{ background: primaryColor, color: "#fff", cursor : "pointer", marginLeft : "20px"}}
                    // onClick={() => this.addBulkFulfilment()}
                  >
                    {this.props.t('bulk_text')}
                  </Button>
                </Popconfirm>
                
              </div>
              {
                ( listSearchFlag || ( isFilterSelected || isDirectFilterSelected ) )? (
                  <div className="button-wrap" style={{ float : "right" }}>
                    <Button
                      // type="primary"
                      // disabled={(loginUserData.role === "ADMIN" || loginUserData.role === "admin" || loginUserData.role === "edit") ? false : true}
                      style={{ background: primaryColor, color: "#fff", cursor : "pointer"}}
                      onClick={() => this.resetFilterModal()}
                    >
                      {this.props.t('reset_button_text')}
                    </Button>
                  </div>
                )
                :
                <div className="button-wrap" style={{ float : "right" }}>
                  <Button
                    // type="primary"
                    // disabled={(loginUserData.role === "ADMIN" || loginUserData.role === "admin" || loginUserData.role === "edit") ? false : true}
                    style={{ background: primaryColor, color: "#fff", cursor : "pointer"}}
                    onClick={() => this.showFilterModal()}
                  >
                    {this.props.t('filter_tag_button_text')}
                  </Button>
                </div>
              }
            </div>
          </div>

          <div className="all-button-wrap" style={{ marginTop : "10px"}}>
            <div style={{ display : "inline-block", width : "100%" }}>
              <div className="button-wrap button-second-wrap" style={{ float : "left" }}>
                <Button
                  style={{ background: primaryColor, color: "#fff", cursor : "pointer"}}
                  onClick={() => this.callDirectFilter("-tag:*")}
                >
                  {this.props.t('all_without_tags')}
                </Button>
                <Button
                    style={{ background: primaryColor, color: "#fff", cursor : "pointer", marginLeft : "20px"}}
                    onClick={() => this.callDirectFilter("tag:*")}
                >
                    {this.props.t('all_with_tags')}
                </Button>
              </div>
            </div>
          </div>

          <div className="all-button-wrap" style={{ marginTop : "10px", marginBottom: "10px"}}>
            <div style={{ display : "inline-block", width : "100%" }}>
              {
                la.map(listFilterData, (data, index) => {
                  return  (
                    <div style={{ float : "left", marginRight : index === 0 ? "15px" : "15px" }}>
                      <Button
                        style={{ background: color[index % 3].value, color: "#fff", cursor : "pointer"}}
                        onClick={() => this.callDirectFilter(data.filter_string)}
                      >
                        {data.name}
                      </Button>
                    </div>
                  )
                }) 
              }
            </div>
          </div>

          <div>
            <Table
              loading={this.state.isLoading}
              rowKey={record => record.node}
              // onRow={(record, rowIndex) => {
              //   return {
              //     onClick : e => {
              //       this.onClickRow(e, record);
              //     }
              //   }
              // }}
              columns={newColumn}
              scroll={{ x: 1500 }}
              rowSelection={rowSelection}
              size={"small"}
              dataSource={listSearchFlag ? listOrderData : (isFilterSelected || isDirectFilterSelected) ? currentFilterCursorData : currentCursorData}
              pagination={false}
            />

            {
              isFilterSelected && !listSearchFlag ? (
                <div style={{ display : "inline-block", width : "100%", marginTop : "20px" }}>
                  <div className="pagination-wrap" style={{float : "right", width : "7%"}}>
                      <div style={{ display : "inline-block", width : "100%" }}>
                          <div style={{float : "left"}}>
                              <button
                                  disabled={!hasFilterPreviousPage}
                                  onClick={async () => {
                                      if(pageNumber - 2 > 0) {
                                          this.callFilterPreviousData(filterLimitNumber, filterCursorDataArray[filterPageNumber - 3], filterTagArray);
                                      }else{
                                          this.callFilterPreviousFirstData(filterLimitNumber, filterTagArray);
                                      }
                                  }}
                                  style={{ cursor : "pointer" }}
                              >
                                  <LeftOutlined />
                              </button>
                          </div>
                          <div style={{float : "right"}}>
                              <button
                                  disabled={!hasFilterNextPage}
                                  onClick={() => {
                                      this.callFilterNextData(filterLimitNumber, currentFilterCursor, filterTagArray);
                                  }}
                                  style={{ cursor : "pointer" }}
                              >
                                  <RightOutlined />
                              </button>
                          </div>
                      </div>
                  </div>
                </div>
              )
              : isDirectFilterSelected && !listSearchFlag ? (
                <div style={{ display : "inline-block", width : "100%", marginTop : "20px" }}>
                  <div className="pagination-wrap" style={{float : "right", width : "7%"}}>
                      <div style={{ display : "inline-block", width : "100%" }}>
                          <div style={{float : "left"}}>
                              <button
                                  disabled={!hasFilterPreviousPage}
                                  onClick={async () => {
                                      if(pageNumber - 2 > 0) {
                                          this.callFilterDirectPreviousData(filterLimitNumber, filterCursorDataArray[filterPageNumber - 3], filterQueryString);
                                      }else{
                                          this.callFilterDirectPreviousFirstData(filterLimitNumber, filterQueryString);
                                      }
                                  }}
                                  style={{ cursor : "pointer" }}
                              >
                                  <LeftOutlined />
                              </button>
                          </div>
                          <div style={{float : "right"}}>
                              <button
                                  disabled={!hasFilterNextPage}
                                  onClick={() => {
                                      this.callFilterDirectNextData(filterLimitNumber, currentFilterCursor, filterQueryString);
                                  }}
                                  style={{ cursor : "pointer" }}
                              >
                                  <RightOutlined />
                              </button>
                          </div>
                      </div>
                  </div>
                </div>
              ) : !listSearchFlag ? (
                <div style={{ display : "inline-block", width : "100%", marginTop : "20px" }}>
                  <div className="pagination-wrap" style={{float : "right", width : "7%"}}>
                      <div style={{ display : "inline-block", width : "100%" }}>
                          <div style={{float : "left"}}>
                              <button
                                  disabled={!hasPreviousPage}
                                  onClick={async () => {
                                      if(pageNumber - 2 > 0) {
                                          this.callPreviousData(limitNumber, cursorDataArray[pageNumber - 3]);
                                      }else{
                                          this.callPreviousFirstData(limitNumber);
                                      }
                                  }}
                                  style={{ cursor : "pointer" }}
                              >
                                  <LeftOutlined />
                              </button>
                          </div>
                          <div style={{float : "right"}}>
                              <button
                                  disabled={!hasNextPage}
                                  onClick={() => {
                                      this.callNextData(limitNumber, currentCursor);
                                  }}
                                  style={{ cursor : "pointer" }}
                              >
                                  <RightOutlined />
                              </button>
                          </div>
                      </div>
                  </div>
                </div>   
              )
              :
              null
            }
          </div>
          {this.state.tagSelectedData ? (
            <EditModal
              refx={(e) => (this.modalRef = e)}
              onClose={this.handleDetailsModalclose.bind(this)}
              tagSelectedData={this.state.tagSelectedData}
              authToken={authToken}
              title={this.props.t('update_tag_button_text')}
              fromTagName={this.state.fromTagName}
              fromTagData={this.state.fromTagData}
              isFromTag={this.state.isFromTag}
              selectedRowKeys={selectedRowKeys}
              loginUserData={this.props.loginUserData}
              onSubmit={this.updateTagSubmit}
            />
          ) : null}
          {this.state.bulkSelectedData ? (
            <BulkModal
              refx={(e) => (this.bulkModalRef = e)}
              onClose={this.handleDetailsBulkModalclose.bind(this)}
              bulkSelectedData={this.state.bulkSelectedData}
              title={this.props.t('bulk_uplaod_text')}
              authToken={authToken}
              fromTagName={this.state.fromTagName}
              fromTagData={this.state.fromTagData}
              isFromTag={this.state.isFromTag}
              selectedRowKeys={selectedRowKeys}
              loginUserData={this.props.loginUserData}
              onSubmit={this.updateTagSubmit}
            />
          ) : null}
          {
            this.state.filterSelectedData ? (
            <FilterModal
              refx={(e) => (this.filterModalRef = e)}
              onClose={this.handleDetailsFilterModalclose.bind(this)}
              filterSelectedData={this.state.filterSelectedData}
              authToken={authToken}
              fromTagName={this.state.fromTagName}
              fromTagData={this.state.fromTagData}
              isFromTag={this.state.isFromTag}
              selectedRowKeys={selectedRowKeys}
              onSubmit={this.filterTagSubmit}
            />
            )
            :
            null
          }
          {
            this.state.userLogsData ? (
              <OrderLogsModal
                admin={false}
                refx={(e) => (this.userLogsRef = e)}
                onClose={this.handleDetailsUserLogsModalclose.bind(this)}
                userLogsData={this.state.userLogsData}
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
    listOrderData: state.order.listOrderData,
    listOrderDataTotal: state.order.listOrderDataTotal,
    listFilterData: state.filter.listFilterData,
    searchLoader: state.auth.searchLoader,
    searchText: state.auth.searchText,
    loginUserData : state.auth.loginUserData,
    listTagDictionaryData : state.tag.listTagDictionaryData,
    filterColumn : state.filter.filterColumn,
    listSearchFlag : state.order.listSearchFlag,
    listSearchRestFlag : state.order.listSearchRestFlag
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
        },
        setSearchText: (searchText) => {
          dispatch({
              type : "SET_SEARCH_TEXT",
              searchText : searchText
          })
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withTranslation()(OrderRecordsTable)));