import { Modal, Button, Divider, Spin } from "antd";
import * as React from "react";
import { Layout, Input, TimePicker, Select } from "antd";
import { Formik, FieldProps, Field } from "formik";
import * as moment from "moment";
import { getAllTags } from "../../Graphs/Tag/listTag";
import styled from "styled-components";
import * as la from "lodash";

const { Content } = Layout;
const Option = Select.Option;
const { TextArea } = Input;
var amenities = [];

const StyleDivider = styled(Divider)`
  &.ant-divider-horizontal {
    margin: 14px 0px;
  }
`;

export class FilterForm extends React.Component {
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
    allTagType = [];
    selectTagType = [];
 
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

        if(!(this.selectTagType.length > 0)) {
            errors.tag = "Tag is required";
        }

        console.log("Validating errors -- ", errors);
        return errors;
    }


    handleSubmit = (values, action) => {
        console.log("Basic Value - ", values);

        values.tag = this.selectTagType;

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

    render() {
        const { isLoading } = this.state;

        return (
            <div>
            <div>
            <Content style={{ background: "#fff", marginLeft: "10px" }}>
                <Formik
                initialValues={{
                    tag: undefined,
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
                                            Tags
                                                <Field
                                                    name="tag"
                                                    render={({ field }) => (
                                                    <Select
                                                        mode="multiple"
                                                        placeholder="Choose Tag"
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
                                    </div>

                                    <Button
                                    // type="primary"
                                        style={{ marginTop: "19px", background: "#5C6AC4", color: "#fff"}}
                                        onClick={handleSubmit}
                                    >
                                        Filter
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
