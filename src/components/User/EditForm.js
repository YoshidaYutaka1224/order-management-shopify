import { Modal, Button, Divider } from "antd";
import * as React from "react";
import { Layout, Input, TimePicker, Select } from "antd";
import { Formik, FieldProps, Field } from "formik";
import * as moment from "moment";
import styled from "styled-components";
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
      isLoading: false,
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
    allRoleType = [
        <Option key={"admin"} value={"admin"}>
            Admin
        </Option>,
       <Option key={"edit_without"} value={"edit_without"}>
            Edit without shopify action
        </Option>,
        <Option key={"edit_with"} value={"edit_with"}>
            Edit with Shopify action
        </Option>,
        <Option key={"view"} value={"view"}>
            View
        </Option>
    ];
    selectRoleType = "";
    isRoleChanged = false;
    selectedRoleDisplayName = "";
 
    componentDidMount() {
        console.log("component did mount");
        if(this.props.data.role === "admin"){
            this.selectedRoleDisplayName = "Admin"
        } else if(this.props.data.role === "edit_without"){
            this.selectedRoleDisplayName = "Edit without shopify action"
        } else if(this.props.data.role === "edit_with"){
            this.selectedRoleDisplayName = "Edit with Shopify action"
        } else if(this.props.data.role === "view"){
            this.selectedRoleDisplayName = "View"
        }
        this.selectRoleType = this.props.data.role;

        this.setState({
          
        });
    }

    handleSelectRoletype(value, option){
        this.selectRoleType = value;
        this.isRoleChanged = true;
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

        // if (!values.first_name) {
        //     errors.first_name = "User First name is required";
        // }
        // if (!values.last_name) {
        //     errors.last_name = "User Last name is required";
        // }
        if (!values.email) {
            errors.email = "Gym email is required";
        } else if (
        !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            String(values.email).toLowerCase()
        )
        ) {
            errors.email = "Please enter valid email";
        }
        // if (!values.phone) {
        //     errors.phone = "Mobile Number is required";
        // }
        // if(!(/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/.test(String(values.phone)))){
        //     errors.phone = "Please enter a valid phone number";
        // }
        if (!values.username) {
            errors.username = "Username is required";
        }
        if(this.selectRoleType === "") {
            errors.role = "Role is required";
        }
        if(!values.first_name) {
            errors.first_name = "First Name is required";
        }

        console.log("Validating errors -- ", errors);
        return errors;
    }


    handleSubmit = (values, action) => {
        console.log("Basic Value - ", values, this.props.data.id);

        values.role = this.selectRoleType;

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
        return (
            <div>
            <div>
            <Content style={{ background: "#fff", marginLeft: "10px" }}>
                <Formik
                initialValues={{
                    username: this.props.data.username,
                    email: this.props.data.email,
                    first_name : this.props.data.first_name,
                    last_name : this.props.data.last_name,
                    phone: this.props.data.phone,
                    role: this.props.data.role
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
                                {this.props.t('username_label')}
                                <Input
                                    id="username"
                                    placeholder="User Name"
                                    value={values.username}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.username && touched.username ? (
                                <p
                                    style={{
                                    color: "red",
                                    fontSize: "small",
                                    margin: "0"
                                    }}
                                >
                                    {errors.username}
                                </p>
                                ) : null}
                            </div>
                            <div className="formik-field-right">
                            {this.props.t('role_label')}
                                    <Field
                                    name="role"
                                    render={({ field }) => (
                                    <Select
                                        showSearch
                                        value={this.isRoleChanged  ? this.selectRoleType : this.selectedRoleDisplayName}
                                        defaultValue={values.role}
                                        placeholder="Choose Role"
                                        defaultActiveFirstOption={false}
                                        showArrow={true}
                                        style={{width : "100%"}}
                                        filterOption={false}
                                        onChange={value => setFieldValue("role", value)}
                                        onBlur={() => setFieldTouched("role", true)}
                                        onSelect={(value, option) =>
                                            this.handleSelectRoletype(value, option)
                                        }
                                    >
                                        {this.allRoleType}
                                    </Select>
                                    )}
                                />
                                {errors.role && touched.role ? (
                                <p
                                    style={{
                                    color: "red",
                                    fontSize: "small",
                                    margin: "0"
                                    }}
                                >
                                    {errors.role}
                                </p>
                                ) : null}
                            </div>
                        </div>

                        <div className="formik-field_wrap" >
                            <div className="formik-field-left">
                            {this.props.t('firstname_label')}
                                <Input
                                    id="first_name"
                                    placeholder="User First Name"
                                    value={values.first_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.first_name && touched.first_name ? (
                                <p
                                    style={{
                                    color: "red",
                                    fontSize: "small",
                                    margin: "0"
                                    }}
                                >
                                    {errors.first_name}
                                </p>
                                ) : null}
                            </div>
                            <div className="formik-field-right">
                            {this.props.t('lastname_label')}
                                <Input
                                    id="last_name"
                                    placeholder="User Last Name"
                                    value={values.last_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.last_name && touched.last_name ? (
                                <p
                                    style={{
                                    color: "red",
                                    fontSize: "small",
                                    margin: "0"
                                    }}
                                >
                                    {errors.last_name}
                                </p>
                                ) : null}
                            </div>
                        </div>


                        <div className="formik-field_wrap" >
                            {/* <div className="formik-field-left">
                                Phone
                                <Input
                                    id="phone"
                                    placeholder="User Phone"
                                    value={values.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.phone && touched.phone ? (
                                <p
                                    style={{
                                    color: "red",
                                    fontSize: "small",
                                    margin: "0"
                                    }}
                                >
                                    {errors.phone}
                                </p>
                                ) : null}
                            </div> */}
                            <div className="formik-field-left">
                            {this.props.t('email_label')}
                                <Input
                                    id="email"
                                    placeholder="Email"
                                    disabled={true}
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.email && touched.email ? (
                                <p
                                    style={{
                                    color: "red",
                                    fontSize: "small",
                                    margin: "0"
                                    }}
                                >
                                    {errors.email}
                                </p>
                                ) : null}
                            </div>
                        </div>

                        <Button
                        // type="primary"
                            style={{ marginTop: "19px", background: "#5C6AC4", color: "#fff"}}
                            onClick={handleSubmit}
                        >
                            {this.props.t('edit_button_text')}
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

export default withTranslation()(EditForm)