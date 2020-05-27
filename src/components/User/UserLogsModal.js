import * as React from "react";
import { Modal, Spin, Timeline } from "antd";
import { getAllUserLogs } from "../../Graphs/User/listUserAllLogs";
import * as la from "lodash";
import { withTranslation } from 'react-i18next';

var moment = require("moment");

class UserLogsModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            data: [],
            recordDetails: {},
            isLoading: false, // Fixme this should be true
            closable: true,
            userLogsData: []
        };
    }

    async componentDidMount() {
        try{
            if (this.props.refx) {
                this.props.refx(this);
            }

            this.setState({
                isLoading : true
            });

            let userCustomLogsData = await getAllUserLogs(this.props.authToken, this.props.userLogsData.id);
            console.log("!!!!!!!!userLogsData", userCustomLogsData);

            this.setState({
                userLogsData : userCustomLogsData.data,
                isLoading : false
            });
        }catch(e) {
            console.log("!!!!!!eeror ", e);
            this.setState({
                isLoading : false
            });
        }
    }

    dateFormat(date) {
        var oldDate = new Date(date),
        momentObj = moment(oldDate).utc(),
        newDate = momentObj.format("Do MMM YYYY HH:mm");
    
        return newDate;
    }

    handleOk = (e) => {
        this.setState({
            visible: false
        });
    };

    handleCancel = (e) => {
        this.hide();
    };

    show() {
        this.setState({
            visible: true
        });
    }

    hide() {
        this.setState({
            visible: false
        });
        this.props.onClose();
    }

    render() {
        const { userLogsData } = this.state;

        return (
            // <StyleBox>
            <Modal
                width="600px"
                closable={this.state.closable}
                visible={this.state.visible}
                title={this.props.title}
                className="full-screen-modal"
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={null}
                destroyOnClose={true}
            >
                {this.state.isLoading ? (
                    <div style={{ justifyContent: "center" }}>
                        <Spin />
                    </div>
                ) : (
                    <div className="logs-wrap">
                        {
                            userLogsData.length > 0 ? (
                                <Timeline>
                                    {
                                        la.map(userLogsData, (data, index) => {
                                            let oldTagArray = JSON.parse(data.old_tags);
                                            let newTagArray = JSON.parse(data.new_tags);

                                            let oldTagString = "";
                                            let newTagString = "";

                                            la.map(oldTagArray, (oldData, oldIndex) => {
                                                if(oldIndex === (oldTagArray.length - 1)){
                                                    oldTagString = oldTagString + oldData;
                                                    return;
                                                }

                                                oldTagString = oldTagString + oldData + ", ";
                                            })

                                            la.map(newTagArray, (newData, newIndex) => {
                                                if(newIndex === (newTagArray.length - 1)){
                                                    newTagString = newTagString + newData;
                                                    return;
                                                }

                                                newTagString = newTagString + newData + ", ";
                                            })

                                            return (
                                                <Timeline.Item>
                                                    {oldTagString === "" ? `${data.order_name} - ${data.user_name} changed status to ${newTagString} on ${this.dateFormat(data.changed_at)}` :  `${data.order_name} - ${data.user_name} changed status from ${oldTagString} to ${newTagString} on ${this.dateFormat(data.changed_at)}`}
                                                </Timeline.Item>
                                            )
                                        })
                                    }
                                </Timeline>
                            ) : (
                                <div>
                                   {this.props.t('no_logs_text')}
                                </div>
                            )
                        }
                    </div>
                )}
            </Modal>
        );
  }
}

export default withTranslation()(UserLogsModal);