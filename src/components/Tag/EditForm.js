import { Modal, Button, Divider, Spin } from "antd";
import * as React from "react";
import { Layout, Input, TimePicker, Select } from "antd";
import { Formik, FieldProps, Field } from "formik";
import * as moment from "moment";
import styled from "styled-components";
import * as la from "lodash";
import { color } from "../../constant/comman";
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

class EditForm extends React.Component {
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
    };
  }

    input;
    allColorType = [];
    selectedColorType = "";
    selectDisplayColorName = "";
    isColorChanged = false;
    allBgColorType = [];
    selectedBgColorType = "";
    selectedDisplayBgColorName = "";
    isBgColorChanged = false;

    componentDidMount() {
        this.setState({
            isLoading : true
        });

        la.map(color, (data, index) => {
            if(data.value === this.props.data.text_color) {
                this.selectedColorType = data.value;
                this.selectDisplayColorName = data.name;
            }
            if(data.value === this.props.data.background_color) {
                this.selectedBgColorType = data.value;
                this.selectedDisplayBgColorName = data.name;
            }
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

        this.setState({
            isLoading : false
        });
    }

    onChange(time, timeString) {
        console.log(time, timeString);
    }


    handleSelectColortype(value, option){
        this.selectedColorType = value;
        this.isColorChanged = true;
    }

    handleSelectBgColortype(value, option){
        this.selectedBgColorType = value;
        this.isBgColorChanged = true;
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
        console.log("Basic Value - ", values, this.props.data.id);

        values.text_color = this.selectedColorType;
        values.background_color = this.selectedBgColorType;
        this.props.onSubmit(values, this.props.data.id);
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

    render() {
        const { isLoading } = this.state;
        
        return (
            <div>
            <div>
            <Content style={{ background: "#fff", marginLeft: "10px" }}>
                <Formik
                initialValues={{
                    name: this.props.data.name,
                    description: this.props.data.description,
                    text_color : this.props.data.text_color,
                    background_color : this.props.data.background_color
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
                    return isLoading 
                    ?
                    (  
                        <div style={{ marginLeft: "20px" }}>
                            <Spin
                                size="large"
                                style={{ width: "100%", margin: "0 auto" }}
                            />
                        </div> 
                    )
                    : (
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
                                            value={this.isColorChanged  ? this.selectedColorType : this.selectDisplayColorName}
                                            defaultValue={values.text_color}
                                            placeholder={this.props.t('text_color_placeholder')}
                                            defaultActiveFirstOption={false}
                                            showArrow={true}
                                            style={{width : "100%"}}
                                            filterOption={false}
                                            onChange={value => setFieldValue("text_color", value)}
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
                                            value={this.isBgColorChanged  ? this.selectedBgColorType : this.selectedDisplayBgColorName}
                                            defaultValue={values.background_color}
                                            placeholder={this.props.t('bg_color_placeholder')}
                                            defaultActiveFirstOption={false}
                                            showArrow={true}
                                            style={{width : "100%"}}
                                            filterOption={false}
                                            onChange={value => setFieldValue("background_color", value)}
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
                            {this.props.t('save_button_text')}
                        </Button>
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

export default withTranslation()(EditForm);