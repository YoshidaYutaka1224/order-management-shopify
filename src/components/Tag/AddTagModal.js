/* eslint-disable */

import { Modal, Button, Divider } from "antd";
import * as React from "react";
import { Layout, Input, TimePicker, Select } from "antd";
import { Formik, FieldProps, Field } from "formik";
import * as moment from "moment";
import { color } from "../../constant/comman";
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

class AddTagModal extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDetailsModalclose = this.handleDetailsModalclose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            locationList: [],
            recordSelectedtoView: null,
            data: [],
            view: false,
            index: null,
            isLoading: false,
            popup: false,
            checked: false,
            item: null,
            filters: null,
            visible: false,
            inputVisible: false,
            inputValue: "",
            time: "",
            isShouldComponentUpdate : false,
            closeTime: "",
            closeTimeString: "",
            timeString: "",
            roleType: "1",
        };
    }

    input;
    allColorType = [];
    selectedColorType = "";
    allBgColorType = [];
    selectedBgColorType = "";

    componentDidMount() {
        la.map(color, (data, index) => {
            this.allColorType.push(
                <Option key={data.value} value={data.value}>
                    <div style={{ display : "inline-block", width: "100%" }}>
                        <div style={{ width : "10px", height : "10px", backgroundColor : data.value, float : "left", borderRadius : "5px" }}>
                        </div>
                        <span style={{ float : "left", margin: "0px", padding: "0px", marginLeft : "10px", marginTop : "5px", lineHeight : "0px" }}>
                            {data.name}
                        </span>
                    </div>
                </Option>
            );
            this.allBgColorType.push(
                <Option key={data.value} value={data.value}>
                    <div style={{ display : "inline-block", width: "100%" }}>
                        <div style={{ width : "10px", height : "10px", backgroundColor : data.value, float : "left", borderRadius : "5px" }}>
                        </div>
                        <span style={{ float : "left", margin: "0px", padding: "0px", marginLeft : "10px", marginTop : "5px", lineHeight : "0px" }}>
                            {data.name}
                        </span>
                    </div>
                </Option>
            )
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { isShouldComponentUpdate } = nextState;
        console.log("!!!!!!!!!!!!!update 1", nextState);
        if(!isShouldComponentUpdate){
            this.selectedColorType = "";
            this.selectedBgColorType = ""
        }

        return true;
    }

    handleSelectColortype(value, option){
        this.selectedColorType = value;
    }

    handleSelectBgColortype(value, option){
        this.selectedBgColorType = value;
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
    
        if (!values.name) {
            errors.name = "Tag name is required";
        }
        if (!values.description) {
            errors.description = "Description is required";
        }
        if(this.selectedColorType === "") {
            errors.text_color = "Color is required";
        }
        if(this.selectedBgColorType === "") {
            errors.background_color = "Background Color is required";
        }

        console.log("Validating errors -- ", errors);
        return errors;
    }

    handleSubmit = (values, action) => {
        console.log("Basic Value - ", values);

        values.text_color = this.selectedColorType;
        values.background_color = this.selectedBgColorType;
        this.props.onSubmit(values);
        
        this.setState({
            visible: false,
            isShouldComponentUpdate : false 
        });
    }

    showModal = () => {
        this.setState({
            visible: true,
            isShouldComponentUpdate : true
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
            visible: false,
            isShouldComponentUpdate : false
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
    
    render() {
        const { primaryColor } = this.props;

        return (
            <div>
                <div onClick={this.showModal} style={{width : "100px", backgroundColor : primaryColor, color : "white", padding : "7px 0px", textAlign : "center", borderRadius : "50px"}}>
                    ADD
                </div>
                <Modal
                    destroyOnClose={true}
                    title="Add Tag"
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                <Content style={{ background: "#fff", marginLeft: "10px" }}>
                    <Formik
                    initialValues={{
                        name: "",
                        description: "",
                        text_color : undefined,
                        background_color : undefined
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
                            <div className="formik-field_wrap" >
                                <div className="formik-field-left">
                                    {this.props.t('tagname_label')}
                                    <Input
                                        id="name"
                                        placeholder={this.props.t('tagname_label')}
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
                                    {this.props.t('description_label')}
                                    <TextArea
                                        id="description"
                                        placeholder={this.props.t('description_label')}
                                        value={values.description}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.description && touched.description ? (
                                    <p
                                        style={{
                                        color: "red",
                                        fontSize: "small",
                                        margin: "0"
                                        }}
                                    >
                                        {errors.description}
                                    </p>
                                    ) : null}
                                </div>
                            </div>

                            <div className="formik-field_wrap" >
                                <div className="formik-field-left">
                                    {this.props.t('text_color')}
                                    <Field
                                        name="text_color"
                                        render={({ field }) => (
                                        <Select
                                            showSearch
                                            style={{ width: "100%" }}
                                            placeholder={this.props.t('text_color_placeholder')}
                                            {...field}
                                            onChange={value => {
                                                setFieldValue("text_color", value);
                                            }}
                                            onBlur={() => setFieldTouched("text_color", true)}
                                            onSelect={(value, option) =>
                                                this.handleSelectColortype(value, option)
                                            }
                                        >
                                            {this.allColorType}
                                        </Select>
                                        )}
                                    />
                                    {errors.text_color && touched.text_color ? (
                                    <p
                                        style={{
                                        color: "red",
                                        fontSize: "small",
                                        margin: "0"
                                        }}
                                    >
                                        {errors.text_color}
                                    </p>
                                    ) : null}
                                </div>
                                <div className="formik-field-right">
                                    {this.props.t('bg_color')}
                                    <Field
                                        name="background_color"
                                        render={({ field }) => (
                                        <Select
                                            showSearch
                                            style={{ width: "100%" }}
                                            placeholder={this.props.t('bg_color_placeholder')}
                                            {...field}
                                            onChange={value => {
                                                setFieldValue("background_color", value);
                                            }}
                                            onBlur={() => setFieldTouched("background_color", true)}
                                            onSelect={(value, option) =>
                                                this.handleSelectBgColortype(value, option)
                                            }
                                        >
                                            {this.allBgColorType}
                                        </Select>
                                        )}
                                    />
                                    {errors.background_color && touched.background_color ? (
                                    <p
                                        style={{
                                        color: "red",
                                        fontSize: "small",
                                        margin: "0"
                                        }}
                                    >
                                        {errors.background_color}
                                    </p>
                                    ) : null}
                                </div>
                            </div>

                            <Button
                            // type="primary"
                                style={{ marginTop: "19px", background: "#5C6AC4", color: "#fff"}}
                                onClick={handleSubmit}
                            >
                                {this.props.addText}
                            </Button>
                        </div>
                        );
                    }}
                    </Formik>
                </Content>
                </Modal>
            </div>
        );
    }
}

export default withTranslation()(AddTagModal);