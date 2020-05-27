import {
    Switch,
    Spin
  } from "antd";
import * as React from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import * as la from "lodash";
import { withTranslation } from 'react-i18next';

var moment = require("moment");

class ColumnPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: [],
        isLoading: false,
      };
    }

    onfilterColumnchange = async (checked, textString, parentColumn = null) => {
        try{
            console.log("!!!!!!!!!!textString", checked, textString, parentColumn);
            this.setState({
                isLoading  : true
            })
            const { filterColumn, setColumnData } = this.props;
            let dummyFilterColumn = { ...filterColumn };

            if(textString === "ShippingAddressAll") {
                dummyFilterColumn["ShippingAddressAll"] = checked;
                dummyFilterColumn["ShippingAddress"]["FirstName"] = checked;
                dummyFilterColumn["ShippingAddress"]["LastName"] = checked;
                dummyFilterColumn["ShippingAddress"]["Company"] = checked;
                dummyFilterColumn["ShippingAddress"]["Telephone"] = checked;
                dummyFilterColumn["ShippingAddress"]["AddressLine1"] = checked;
                dummyFilterColumn["ShippingAddress"]["AddressLine2"] = checked;
                dummyFilterColumn["ShippingAddress"]["City"] = checked;
                dummyFilterColumn["ShippingAddress"]["Province"] = checked;
                dummyFilterColumn["ShippingAddress"]["Zip"] = checked;
                dummyFilterColumn["ShippingAddress"]["Country"] = checked;

                await setColumnData(dummyFilterColumn);
                this.setState({
                    isLoading  : false
                });
                
                return;
            }

            if(textString === "BillingAddressAll") {
                dummyFilterColumn["BillingAddressAll"] = checked;
                dummyFilterColumn["BillingAddress"]["FirstName"] = checked;
                dummyFilterColumn["BillingAddress"]["LastName"] = checked;
                dummyFilterColumn["BillingAddress"]["Company"] = checked;
                dummyFilterColumn["BillingAddress"]["Telephone"] = checked;
                dummyFilterColumn["BillingAddress"]["AddressLine1"] = checked;
                dummyFilterColumn["BillingAddress"]["AddressLine2"] = checked;
                dummyFilterColumn["BillingAddress"]["City"] = checked;
                dummyFilterColumn["BillingAddress"]["Province"] = checked;
                dummyFilterColumn["BillingAddress"]["Zip"] = checked;
                dummyFilterColumn["BillingAddress"]["Country"] = checked;

                await setColumnData(dummyFilterColumn);
                this.setState({
                    isLoading  : false
                });
                return;
            }

            if(textString === "CustomerInformationAll") {
                dummyFilterColumn["CustomerInformationAll"] = checked;
                dummyFilterColumn["CustomerInformation"]["Email"] = checked;
                dummyFilterColumn["CustomerInformation"]["Phone"] = checked;
                dummyFilterColumn["CustomerInformation"]["OrderCount"] = checked;
                dummyFilterColumn["CustomerInformation"]["CustomerNote"] = checked;

                await setColumnData(dummyFilterColumn);
                this.setState({
                    isLoading  : false
                });

                return;
            }

            if(parentColumn !== null) {
                dummyFilterColumn[parentColumn][textString] = checked;
            }else{
                dummyFilterColumn[textString] = checked;
            }

            await setColumnData(dummyFilterColumn);
            this.setState({
                isLoading  : false
            });
        }catch(e) {
            console.log("!!!!!!!!!!!!!!error printed here", e);
        }
    }
  
    render() {
      const { isLoading } = this.state;
      const { filterColumn, searchLoader, primaryColor, authToken } = this.props;

      console.log("1!!!!!!!!!!!!!!filterColumn ", filterColumn, filterColumn["orderPrinter"]);

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
        <div className="all-column-wrap">
            <div classname="all-single-switch-wrap">
                <div className="column-switch-wrap">
                    <Switch checked={filterColumn["orderPrinter"]} style={{backgroundColor : filterColumn["orderPrinter"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "orderPrinter")} />
                    <span>
                        {this.props.t('order_printer_toggle')}
                    </span>
                </div>
                <div className="column-switch-wrap">
                    <Switch checked={filterColumn["orderNumber"]} style={{backgroundColor : filterColumn["orderNumber"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "orderNumber")} />
                    <span>
                        {this.props.t('order_number_toggle')}
                    </span>
                </div>
                <div className="column-switch-wrap">
                    <Switch checked={filterColumn["Products"]} style={{backgroundColor : filterColumn["Products"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "Products")} />
                    <span>
                        {this.props.t('product_toggle')}
                    </span>
                </div>
                <div className="column-switch-wrap">
                    <Switch checked={filterColumn["ShippingLabels"]} style={{backgroundColor : filterColumn["ShippingLabels"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "ShippingLabels")} />
                    <span>
                        {this.props.t('shipping_label_toggle')}
                    </span>
                </div>
                <div className="column-switch-wrap">
                    <Switch checked={filterColumn["Notes"]} style={{backgroundColor : filterColumn["Notes"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "Notes")} />
                    <span>
                        {this.props.t('notes_toggle')}
                    </span>
                </div>
                <div className="column-switch-wrap">
                    <Switch checked={filterColumn["ShippingMethod"]} style={{backgroundColor : filterColumn["ShippingMethod"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "ShippingMethod")} />
                    <span>
                        {this.props.t('shipping_method_toggle')}
                    </span>
                </div>
                <div className="column-switch-wrap">
                    <Switch checked={filterColumn["PaymentMethod"]} style={{backgroundColor : filterColumn["PaymentMethod"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "PaymentMethod")} />
                    <span>
                        {this.props.t('payment_method_toggle')}
                    </span>
                </div>
                <div className="column-switch-wrap">
                    <Switch checked={filterColumn["OrderTotal"]} style={{backgroundColor : filterColumn["OrderTotal"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "OrderTotal")} />
                    <span>
                        {this.props.t('order_total_toggle')}
                    </span>
                </div>
                <div className="column-switch-wrap">
                    <Switch checked={filterColumn["TrackingNumber"]} style={{backgroundColor : filterColumn["TrackingNumber"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "TrackingNumber")} />
                    <span>
                        {this.props.t('tracking_number_toggle')}
                    </span>
                </div>
                <div className="column-switch-wrap">
                    <Switch checked={filterColumn["Signature"]} style={{backgroundColor : filterColumn["Signature"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "Signature")} />
                    <span>
                        {this.props.t('signature_toggle')}
                    </span>
                </div>
            </div>
            <div className="multi-column-wrap"> 
                <div className="switches-wrap">
                    <div className="title-wrap">
                        <Switch checked={filterColumn["ShippingAddressAll"]} style={{backgroundColor : filterColumn["ShippingAddressAll"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "ShippingAddressAll")} />
                        <span>
                            {this.props.t('shippingaddress_header')}
                        </span>
                    </div>
                    <div className="body-wrap">
                        <div className="body-switch">
                            <Switch checked={filterColumn["ShippingAddress"]["FirstName"]} style={{backgroundColor : filterColumn["ShippingAddress"]["FirstName"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "FirstName", "ShippingAddress")} />
                            <span>
                                {this.props.t('first_name_toggle')}
                            </span>
                        </div>
                        <div className="body-switch">
                            <Switch checked={filterColumn["ShippingAddress"]["LastName"]} style={{backgroundColor : filterColumn["ShippingAddress"]["LastName"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "LastName", "ShippingAddress")} />
                            <span>
                                {this.props.t('last_name_toggle')}
                            </span>
                        </div>
                        <div className="body-switch">
                            <Switch checked={filterColumn["ShippingAddress"]["Company"]} style={{backgroundColor : filterColumn["ShippingAddress"]["Company"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "Company", "ShippingAddress")} />
                            <span>
                                {this.props.t('company_toggle')}
                            </span>
                        </div>
                        <div className="body-switch">
                            <Switch checked={filterColumn["ShippingAddress"]["Telephone"]} style={{backgroundColor : filterColumn["ShippingAddress"]["Telephone"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "Telephone", "ShippingAddress")} />
                            <span>
                                {this.props.t('telephone_toggle')}
                            </span>
                        </div>
                        <div className="body-switch">
                            <Switch checked={filterColumn["ShippingAddress"]["AddressLine1"]} style={{backgroundColor : filterColumn["ShippingAddress"]["AddressLine1"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "AddressLine1", "ShippingAddress")} />
                            <span>
                                {this.props.t('laddress_line_1_toggle')}
                            </span>
                        </div>
                        <div className="body-switch">
                            <Switch checked={filterColumn["ShippingAddress"]["AddressLine2"]} style={{backgroundColor : filterColumn["ShippingAddress"]["AddressLine2"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "AddressLine2", "ShippingAddress")} />
                            <span>
                                {this.props.t('laddress_line_2_toggle')}
                            </span>
                        </div>
                        <div className="body-switch">
                            <Switch checked={filterColumn["ShippingAddress"]["City"]} style={{backgroundColor : filterColumn["ShippingAddress"]["City"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "City", "ShippingAddress")} />
                            <span>
                                {this.props.t('city_toggle')}
                            </span>
                        </div>
                        <div className="body-switch">
                            <Switch checked={filterColumn["ShippingAddress"]["Province"]} style={{backgroundColor : filterColumn["ShippingAddress"]["Province"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "Province", "ShippingAddress")} />
                            <span>
                                {this.props.t('province_toggle')}
                            </span>
                        </div>
                        <div className="body-switch">
                            <Switch checked={filterColumn["ShippingAddress"]["Zip"]} style={{backgroundColor : filterColumn["ShippingAddress"]["Zip"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "Zip", "ShippingAddress")} />
                            <span>
                                {this.props.t('zip_toggle')}
                            </span>
                        </div>
                        <div className="body-switch">
                            <Switch checked={filterColumn["ShippingAddress"]["Country"]} style={{backgroundColor : filterColumn["ShippingAddress"]["Country"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "Country", "ShippingAddress")} />
                            <span>
                                {this.props.t('country_toggle')}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="switches-wrap">
                    <div className="title-wrap">
                        <Switch checked={filterColumn["BillingAddressAll"]} style={{backgroundColor : filterColumn["BillingAddressAll"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "BillingAddressAll")} />
                        <span>
                            {this.props.t('billingaddress_header')}
                        </span>
                    </div>
                    <div className="body-wrap">
                        <div className="body-switch">
                            <Switch checked={filterColumn["BillingAddress"]["FirstName"]} style={{backgroundColor : filterColumn["BillingAddress"]["FirstName"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "FirstName", "BillingAddress")} />
                            <span>
                                {this.props.t('first_name_toggle')}
                            </span>
                        </div>
                        <div className="body-switch">
                            <Switch checked={filterColumn["BillingAddress"]["LastName"]} style={{backgroundColor : filterColumn["BillingAddress"]["LastName"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "LastName", "BillingAddress")} />
                            <span>
                                {this.props.t('last_name_toggle')}
                            </span>
                        </div>
                        <div className="body-switch">
                            <Switch checked={filterColumn["BillingAddress"]["Company"]} style={{backgroundColor : filterColumn["BillingAddress"]["Company"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "Company", "BillingAddress")} />
                            <span>
                                {this.props.t('company_toggle')}
                            </span>
                        </div>
                        <div className="body-switch">
                            <Switch checked={filterColumn["BillingAddress"]["Telephone"]} style={{backgroundColor : filterColumn["BillingAddress"]["Telephone"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "Telephone", "BillingAddress")} />
                            <span>
                                {this.props.t('telephone_toggle')}
                            </span>
                        </div>
                        <div className="body-switch">
                            <Switch checked={filterColumn["BillingAddress"]["AddressLine1"]} style={{backgroundColor : filterColumn["BillingAddress"]["AddressLine1"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "AddressLine1", "BillingAddress")} />
                            <span>
                                {this.props.t('laddress_line_1_toggle')}
                            </span>
                        </div>
                        <div className="body-switch">
                            <Switch checked={filterColumn["BillingAddress"]["AddressLine2"]} style={{backgroundColor : filterColumn["BillingAddress"]["AddressLine2"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "AddressLine2", "BillingAddress")} />
                            <span>
                                {this.props.t('laddress_line_2_toggle')}
                            </span>
                        </div>
                        <div className="body-switch">
                            <Switch checked={filterColumn["BillingAddress"]["City"]} style={{backgroundColor : filterColumn["BillingAddress"]["City"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "City", "BillingAddress")} />
                            <span>
                                {this.props.t('city_toggle')}
                            </span>
                        </div>
                        <div className="body-switch">
                            <Switch checked={filterColumn["BillingAddress"]["Province"]} style={{backgroundColor : filterColumn["BillingAddress"]["Province"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "Province", "BillingAddress")} />
                            <span>
                                {this.props.t('province_toggle')}
                            </span>
                        </div>
                        <div className="body-switch">
                            <Switch checked={filterColumn["BillingAddress"]["Zip"]} style={{backgroundColor : filterColumn["BillingAddress"]["Zip"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "Zip", "BillingAddress")} />
                            <span>
                                {this.props.t('zip_toggle')}
                            </span>
                        </div>
                        <div className="body-switch">
                            <Switch checked={filterColumn["BillingAddress"]["Country"]} style={{backgroundColor : filterColumn["BillingAddress"]["Country"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "Country", "BillingAddress")} />
                            <span>
                                {this.props.t('country_toggle')}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="switches-wrap" style={{ width : "230px" }}>
                    <div className="title-wrap">
                        <Switch checked={filterColumn["CustomerInformationAll"]} style={{backgroundColor : filterColumn["CustomerInformationAll"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "CustomerInformationAll")} />
                        <span>
                            {this.props.t('customer_info_header')}
                        </span>
                    </div>
                    <div className="body-wrap">
                        <div className="body-switch">
                            <Switch checked={filterColumn["CustomerInformation"]["Email"]} style={{backgroundColor : filterColumn["CustomerInformation"]["Email"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "Email", "CustomerInformation")} />
                            <span>
                                {this.props.t('email_toggle')}
                            </span>
                        </div>
                        <div className="body-switch">
                            <Switch checked={filterColumn["CustomerInformation"]["Phone"]} style={{backgroundColor : filterColumn["CustomerInformation"]["Phone"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "Phone", "CustomerInformation")} />
                            <span>
                                {this.props.t('phone_toggle')}
                            </span>
                        </div>
                        <div className="body-switch">
                            <Switch checked={filterColumn["CustomerInformation"]["OrderCount"]} style={{backgroundColor : filterColumn["CustomerInformation"]["OrderCount"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "OrderCount", "CustomerInformation")} />
                            <span>
                                {this.props.t('ordercount_toggle')}
                            </span>
                        </div>
                        <div className="body-switch">
                            <Switch checked={filterColumn["CustomerInformation"]["CustomerNote"]} style={{backgroundColor : filterColumn["CustomerInformation"]["CustomerNote"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onfilterColumnchange(checked, "CustomerNote", "CustomerInformation")} />
                            <span>
                                {this.props.t('customernote_toggle')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      );
    }
}
  
const mapStateToProps = state => ({
    authToken: state.auth.authToken,
    filterColumn: state.filter.filterColumn,
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
        setColumnData: (filterColumn) => {
            dispatch({
                type : "SET_LIST_FILTER_COLUMN",
                filterColumn : filterColumn
            })
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withTranslation()(ColumnPage)));