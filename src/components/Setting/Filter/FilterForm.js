import { Modal, Button, Divider, Spin } from "antd";
import * as React from "react";
import { Layout, Input, TimePicker, Select, Switch } from "antd";
import { Formik, FieldProps, Field } from "formik";
import * as moment from "moment";
import { getAllTags } from "../../../Graphs/Tag/listTag";
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

class FilterForm extends React.Component {
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
            shopifyFilter : {
                status : {
                    open : true,
                    closed : false,
                    cancelled : false
                },
                financial_status : {
                    authorized : false,
                    pending : true,
                    paid : false,
                    partially_paid : false,
                    refunded : false,
                    voided : false,
                    partially_refunded : false,
                    unpaid : false
                },
                fulfillment_status : {
                    shipped : false,
                    partial : false,
                    unshipped : true
                }
            }
        };
    }

    input;
    allTagType = [];
    selectTagType = [];
    allSelectType = [
        <Option key="custom_status" value="custom_status">
            {this.props.t("custom_status_drop")}
        </Option>,
        <Option key="shopify_filter" value="shopify_filter">
            {this.props.t("shopify_filter_drop")}
        </Option>,
        <Option key="shopify_filter_exclude_custom_status" value="shopify_filter_exclude_custom_status">
            {this.props.t("shopify_filter_exc_xustom_status_drop")}
        </Option>
    ];
    selectedSelectType = "custom_status";
 
    async componentDidMount() {
        const { authToken } = this.props;
        this.setState({
            isLoading : true
        });

        let tagData = await getAllTags(authToken, 0, 10000000);
        la.map(tagData.data, (subData, subIndex) => {
            if(subData.is_active) {
                this.allTagType.push(
                    <Option key={subData.name} value={subData.name}>
                        {subData.name}
                    </Option>
                )
            }
        })
        this.setState({
            isLoading : false
        });
    }

    handleSelectTagType(value, option){
        this.selectTagType = value;
    }

    handleSelectedSelectType(value, option){
        this.selectedSelectType = value;
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

        if((this.selectedSelectType === "custom_status" || this.selectedSelectType === "shopify_filter_exclude_custom_status") && (!(this.selectTagType.length > 0))) {
            errors.tag = "Tag is required";
        }
        if(!values.name) {
            errors.name = "Name is required";
        }
        if(this.selectedSelectType === ""){
            errors.selectType = "Please select type";
        }

        console.log("Validating errors -- ", errors);
        return errors;
    }


    handleSubmit = (values, action) => {
        console.log("Basic Value - ", values);

        values.tag = (this.selectedSelectType === "custom_status" || this.selectedSelectType === "shopify_filter_exclude_custom_status") ? this.selectTagType : [];
        values.filter_type = this.selectedSelectType;
        values.shopify_filter = this.state.shopifyFilter;

        this.props.onSubmit(values);
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

    onShopifyfilterChange = async (checked, fieldName, parentName = null) => {
        const { shopifyFilter } = this.state;
        let dummyShopifyFilter = { ...shopifyFilter };

        dummyShopifyFilter[parentName][fieldName] = checked;
        this.setState({
            shopifyFilter : dummyShopifyFilter
        });
    }

    render() {
        const { isLoading, shopifyFilter } = this.state;

        return (
            <div>
            <div>
            <Content style={{ background: "#fff", marginLeft: "10px" }}>
                <Formik
                initialValues={{
                    tag: undefined,
                    name: "",
                    filter_type : "custom_status",
                    shopify_filter : {}
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
                                        <div className="formik-field-left">
                                            {this.props.t("select_filter_label")}
                                                <Field
                                                    name="filter_type"
                                                    render={({ field }) => (
                                                    <Select
                                                        placeholder={this.props.t("select_filter_choose_label")}
                                                        showArrow={true}
                                                        defaultValue="custom_status"
                                                        style={{width : "100%"}}
                                                        filterOption={false}
                                                        onChange={value => {
                                                            setFieldValue("filter_type", value);
                                                        }}
                                                        onBlur={() => setFieldTouched("filter_type", true)}
                                                        onSelect={(value, option) =>
                                                            this.handleSelectedSelectType(value, option)
                                                        }
                                                    >
                                                        {this.allSelectType}
                                                    </Select>
                                                )}
                                            />
                                            {errors.selectType && touched.selectType ? (
                                            <p
                                                style={{
                                                color: "red",
                                                fontSize: "small",
                                                margin: "0"
                                                }}
                                            >
                                                {errors.selectType}
                                            </p>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="formik-field_wrap" >
                                        <div className="formik-field-left">
                                            {this.props.t("filter_name_label")}
                                            <Input
                                                id="name"
                                                placeholder={this.props.t("filter_name_label")}
                                                value={values.name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {errors.name && touched.name ? (
                                            <p
                                                style={{
                                                color: "red",
                                                fontSize: "small",
                                                margin: "0"
                                                }}
                                            >
                                                {errors.name}
                                            </p>
                                            ) : null}
                                        </div>
                                        <div className="formik-field-right">
                                            {
                                                (this.selectedSelectType === "custom_status" || this.selectedSelectType === "shopify_filter_exclude_custom_status") ? (
                                                    <div>
                                                        {this.props.t("tags_label")}
                                                        <Field
                                                            name="tag"
                                                            render={({ field }) => (
                                                            <Select
                                                                mode="multiple"
                                                                placeholder={this.props.t("tags_label")}
                                                                showArrow={true}
                                                                style={{width : "100%"}}
                                                                filterOption={false}
                                                                onChange={value => {
                                                                    setFieldValue("tag", value);
                                                                    this.handleSelectTagType(value)
                                                                }}
                                                                onBlur={() => setFieldTouched("tag", true)}
                                                                // onSelect={(value, option) =>
                                                                //     this.handleSelectTagType(value, option)
                                                                // }
                                                            >
                                                                {this.allTagType}
                                                            </Select>
                                                        )}
                                                    />
                                                    {errors.tag && touched.tag ? (
                                                    <p
                                                        style={{
                                                        color: "red",
                                                        fontSize: "small",
                                                        margin: "0"
                                                        }}
                                                    >
                                                        {errors.tag}
                                                    </p>
                                                    ) : null}
                                                    </div>
                                                )
                                                :
                                                null
                                            }
                                            
                                        </div>
                                    </div>

                                        {
                                            (this.selectedSelectType === "shopify_filter" || this.selectedSelectType === "shopify_filter_exclude_custom_status") ? (
                                                <div className="multi-column-wrap" style={{ marginTop : "20px"}}> 
                                                    <div className="switches-wrap">
                                                        <div className="title-wrap">
                                                            <span>
                                                                {this.props.t("status_filter_header")}
                                                            </span>
                                                        </div>
                                                        <div className="body-wrap" style={{ backgroundColor : "white" }}>
                                                            <div className="body-switch">
                                                                <Switch checked={shopifyFilter["status"]["open"]} style={{backgroundColor : shopifyFilter["status"]["open"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onShopifyfilterChange(checked, "open", "status")} />
                                                                <span>
                                                                    {this.props.t("open_filter")}
                                                                </span>
                                                            </div>
                                                            <div className="body-switch">
                                                                <Switch checked={shopifyFilter["status"]["closed"]} style={{backgroundColor : shopifyFilter["status"]["closed"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onShopifyfilterChange(checked, "closed", "status")} />
                                                                <span>
                                                                    {this.props.t("close_filter")}
                                                                </span>
                                                            </div>
                                                            <div className="body-switch">
                                                                <Switch checked={shopifyFilter["status"]["cancelled"]} style={{backgroundColor : shopifyFilter["status"]["cancelled"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onShopifyfilterChange(checked, "cancelled", "status")} />
                                                                <span>
                                                                    {this.props.t("cancel_filter")}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="switches-wrap">
                                                        <div className="title-wrap">
                                                            <span>
                                                                {this.props.t("financial_filter_header")}
                                                            </span>
                                                        </div>
                                                        <div className="body-wrap" style={{ backgroundColor : "white" }}>
                                                            <div className="body-switch">
                                                                <Switch checked={shopifyFilter["financial_status"]["authorized"]} style={{backgroundColor : shopifyFilter["financial_status"]["authorized"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onShopifyfilterChange(checked, "authorized", "financial_status")} />
                                                                <span>
                                                                    {this.props.t("authorized_filter")}
                                                                </span>
                                                            </div>
                                                            <div className="body-switch">
                                                                <Switch checked={shopifyFilter["financial_status"]["pending"]} style={{backgroundColor : shopifyFilter["financial_status"]["pending"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onShopifyfilterChange(checked, "pending", "financial_status")} />
                                                                <span>
                                                                    {this.props.t("pending_filter")}
                                                                </span>
                                                            </div>
                                                            <div className="body-switch">
                                                                <Switch checked={shopifyFilter["financial_status"]["paid"]} style={{backgroundColor : shopifyFilter["financial_status"]["paid"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onShopifyfilterChange(checked, "paid", "financial_status")} />
                                                                <span>
                                                                    {this.props.t("paid_filter")}
                                                                </span>
                                                            </div>
                                                            <div className="body-switch">
                                                                <Switch checked={shopifyFilter["financial_status"]["partially_paid"]} style={{backgroundColor : shopifyFilter["financial_status"]["partially_paid"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onShopifyfilterChange(checked, "partially_paid", "financial_status")} />
                                                                <span>
                                                                    {this.props.t("partially_paid_filter")}
                                                                </span>
                                                            </div>
                                                            <div className="body-switch">
                                                                <Switch checked={shopifyFilter["financial_status"]["refunded"]} style={{backgroundColor : shopifyFilter["financial_status"]["refunded"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onShopifyfilterChange(checked, "refunded", "financial_status")} />
                                                                <span>
                                                                    {this.props.t("refunded_filter")}
                                                                </span>
                                                            </div>
                                                            <div className="body-switch">
                                                                <Switch checked={shopifyFilter["financial_status"]["voided"]} style={{backgroundColor : shopifyFilter["financial_status"]["voided"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onShopifyfilterChange(checked, "voided", "financial_status")} />
                                                                <span>
                                                                    {this.props.t("voided_filter")}
                                                                </span>
                                                            </div>
                                                            <div className="body-switch">
                                                                <Switch checked={shopifyFilter["financial_status"]["partially_refunded"]} style={{backgroundColor : shopifyFilter["financial_status"]["partially_refunded"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onShopifyfilterChange(checked, "partially_refunded", "financial_status")} />
                                                                <span>
                                                                    {this.props.t("partially_refunded_filter")}
                                                                </span>
                                                            </div>
                                                            <div className="body-switch">
                                                                <Switch checked={shopifyFilter["financial_status"]["unpaid"]} style={{backgroundColor : shopifyFilter["financial_status"]["unpaid"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onShopifyfilterChange(checked, "unpaid", "financial_status")} />
                                                                <span>
                                                                    {this.props.t("unpaid_filter")}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="switches-wrap" style={{ width : "230px" }}>
                                                        <div className="title-wrap">
                                                            <span>
                                                                {this.props.t("fulfillment_filter_header")}
                                                            </span>
                                                        </div>
                                                        <div className="body-wrap" style={{ backgroundColor : "white" }}>
                                                            <div className="body-switch">
                                                                <Switch checked={shopifyFilter["fulfillment_status"]["shipped"]} style={{backgroundColor : shopifyFilter["fulfillment_status"]["shipped"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onShopifyfilterChange(checked, "shipped", "fulfillment_status")} />
                                                                <span>
                                                                    {this.props.t("shipped_filter")}
                                                                </span>
                                                            </div>
                                                            <div className="body-switch">
                                                                <Switch checked={shopifyFilter["fulfillment_status"]["unshipped"]} style={{backgroundColor : shopifyFilter["fulfillment_status"]["unshipped"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onShopifyfilterChange(checked, "unshipped", "fulfillment_status")} />
                                                                <span>
                                                                    {this.props.t("unshipped_filter")}
                                                                </span>
                                                            </div>
                                                            <div className="body-switch">
                                                                <Switch checked={shopifyFilter["fulfillment_status"]["partial"]} style={{backgroundColor : shopifyFilter["fulfillment_status"]["partial"] ? this.props.primaryColor : "#bababa"}} onChange={(checked) => this.onShopifyfilterChange(checked, "partial", "fulfillment_status")} />
                                                                <span>
                                                                    {this.props.t("partial_filter")}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                            :
                                            null
                                        }

                                    <Button
                                    // type="primary"
                                        style={{ marginTop: "19px", background: "#5C6AC4", color: "#fff"}}
                                        onClick={handleSubmit}
                                    >
                                        {this.props.t("save_button_text")}
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

export default withTranslation()(FilterForm)