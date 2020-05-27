import { Modal, Button, Divider, Spin } from "antd";
import * as React from "react";
import { Layout, Input, TimePicker, Select, Checkbox } from "antd";
import { Formik, FieldProps, Field } from "formik";
import * as moment from "moment";
import { getAllTags } from "../../Graphs/Tag/listTag";
import styled from "styled-components";
import * as la from "lodash";
import { withTranslation } from 'react-i18next';

const { Content } = Layout;
const Option = Select.Option;
const { TextArea } = Input;
var amenities = [];

const StyleDivider = styled(Divider)`
  &.ant-divider-horizontal {
    margin: 14px 0px;
  }
`;

class BulkForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTime = this.handleTime.bind(this);
    this.handleCloseTime = this.handleCloseTime.bind(this);
    this.handleDetailsModalclose = this.handleDetailsModalclose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      locationList: [],
      recordSelectedtoView: null,
      data: [],
      view: false,
      index: null,
      isLoading: true,
      popup: false,
      checked: false,
      item: null,
      filters: null,
      visible: false,
      inputVisible: false,
      inputValue: "",
      time: "",
      closeTime: "",
      closeTimeString: "",
      timeString: "",
      roleType: "1",
      fulfillProductArray : [],
      allProduct : true,
      sampleFromArray : []
    };
  }

    input;
 
    async componentDidMount() {
        const { authToken, loginUserData } = this.props;
        this.setState({
            isLoading : true
        });

        const dummyfulfillAraay = this.state.fulfillProductArray;
        la.map(this.props.selectedRowKeys, (data, index) => {
            let subArray = {};
            subArray["allProduct"] = true;
            subArray["notifyCustomer"] = true;

            la.map(data.lineItems.edges, (sunData, subIndex) => {
                subArray[sunData.node.id] = true;
            })

            let finalPushObject = {};
            finalPushObject[data.id] = subArray;
            dummyfulfillAraay.push(finalPushObject);
        });

        this.setState({
            isLoading : false,
            fulfillProductArray : dummyfulfillAraay,
        });
    }

    onChange(time, timeString) {
        console.log(time, timeString);
    }

    handleChange(value) {
        console.log(`selected ${value}`);
        amenities = value;
    }

    validateForm = (values) => {
        const errors: any = {};
        console.log("Validating form -- ", values);

        console.log("Validating errors -- ", errors);
        return errors;
    }


    handleSubmit = (values, action) => {
        console.log("Basic Value - ", values);

        values.tag = "Fulfilled";

        this.props.onSubmit(values, this.state.fulfillProductArray);
        this.props.handleCancel();
        
        this.setState({
            visible: false,
        });
    }

    showModal = () => {
        this.setState({
            visible: true
        });
    };

    handleOk = (e) => {
        console.log(e);
        this.setState({
            visible: false
        });
    };

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false
        });
    };

    handleTime(e, s) {
        this.setState({
            time: e,
            timeString: s
        });
    }

    handleCloseTime(e, s) {
        this.setState({
            closeTime: e,
            closeTimeString: s
        });
    }

    handleDetailsModalclose(item) {
        this.setState({
            view: false,
            lat: item.lat,
            long: item.lng
        });
    }

    onNotiCustomerChanged = (e, parentId, index) => {
        const { fulfillProductArray } = this.state;
        let dummyProductarray = { ...fulfillProductArray };

        dummyProductarray[index][parentId]["notifyCustomer"] = e.target.checked;
        this.setState({
            fulfillProductArray : dummyProductarray
        })
    }

    onNotifyLineItemChange = (e, id, parentId, index) => {
        const { fulfillProductArray } = this.state;
        let dummyProductarray = { ...fulfillProductArray };

        dummyProductarray[index][parentId][id] = e.target.checked;

        let allFlag = false;
        
        la.forEach(Object.values(dummyProductarray[index][parentId]), (subData, subIndex) => {
            if(!subData) {
                allFlag = subData;
                return false;
            }
            allFlag = subData;
        });

        dummyProductarray[index][parentId]["allProduct"] = allFlag;
        this.setState({
            fulfillProductArray : dummyProductarray
        })
    }

    onAllProductChanged = (e) => {
        const { fulfillProductArray } = this.state;
        let dummyProductarray = { ...fulfillProductArray };
        la.map(dummyProductarray, (data, index) => {
            la.map(Object.keys(data), (subValue, subIndex) => {
                la.map(Object.values(data), (subDummyValue, subDummyIndex) => {
                    la.map(Object.keys(subDummyValue), (lineData, lineIndex) => {
                        dummyProductarray[index][subValue][lineData] = e.target.checked;
                    })
                });
            });
        });

        this.setState({
            fulfillProductArray : dummyProductarray,
            allProduct : e.target.checked
        })
    }

    render() {
        const { isLoading, fulfillProductArray, allProduct } = this.state;
        console.log("!!!!!!!!!!!!pre data render", fulfillProductArray);

        return (
            <div>
            <div>
            <Content style={{ background: "#fff", marginLeft: "10px" }}>
                <Formik
                initialValues={{
                }}
                validate={this.validateForm}
                onSubmit={this.handleSubmit}
                >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    setFieldValue,
                    setFieldTouched,
                    isSubmitting
                }) => {
                    return (
                    <div>
                        {
                            isLoading ? (  
                                <div style={{ marginLeft: "0px" }}>
                                   <Spin
                                        size="large"
                                        style={{ margin : "0 auto", width : "100%" }}
                                    />
                                </div> 
                            )
                            : (
                                <div>
                                    <div className="formik-field_wrap" >
                                        <div>
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th scope="col">{this.props.t('order_header_text')}</th>
                                                        <th scope="col"><Checkbox checked={allProduct} onChange={(e) => this.onAllProductChanged(e)}>{this.props.t('product_header')}</Checkbox></th>
                                                        <th scope="col">{this.props.t('notify_header')}</th>
                                                        <th scope="col">{this.props.t('order_total_header')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        la.map(this.props.selectedRowKeys, (data, index) => {
                                                            return (
                                                                <tr>
                                                                    <td>
                                                                        {data.name}
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            la.map(data.lineItems.edges, (subData, subIndex) => {
                                                                                return (
                                                                                    <div>
                                                                                        <Checkbox disabled={subData.node.fulfillmentStatus === "fulfilled" || subData.node.fulfillment_status === "fulfilled" ? true : false} checked={fulfillProductArray[index][data.id][subData.node.id]} onChange={(e) => this.onNotifyLineItemChange(e, subData.node.id, data.id, index)}>{subData.node.name}</Checkbox>
                                                                                    </div>
                                                                                )
                                                                            })
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        <Checkbox checked={fulfillProductArray[index][data.id]["notifyCustomer"]} onChange={(e) => this.onNotiCustomerChanged(e, data.id, index)}></Checkbox>
                                                                    </td>
                                                                    <td>
                                                                        {`${data.totalPriceSet.presentmentMoney.currencyCode ? data.totalPriceSet.presentmentMoney.currencyCode : data.totalPriceSet.presentmentMoney.currency_code} ${data.totalPriceSet.presentmentMoney.amount}`}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <Button
                                    // type="primary"
                                        style={{ marginTop: "19px", background: "#5C6AC4", color: "#fff"}}
                                        onClick={handleSubmit}
                                    >
                                        {this.props.t('change_button_text')}
                                    </Button>
                                </div>
                            )
                        }
                    </div>
                    );
                }}
                </Formik>
            </Content>
            </div>
        </div>
        );
    }
}

export default withTranslation()(BulkForm)