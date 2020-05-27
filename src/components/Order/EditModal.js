import * as React from "react";
import { Modal, Spin } from "antd";
import EditForm from "./EditForm";

export class EditModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            data: [],
            recordDetails: {},
            isLoading: false, // Fixme this should be true
            closable: true
        };
    }

    componentDidMount() {
        if (this.props.refx) {
            this.props.refx(this);
        }
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

        return (
        // <StyleBox>
        <Modal
            width="600px"
            closable={this.state.closable}
            visible={this.state.visible}
            title={this.props.isFromTag ? `${this.props.title} ( ${this.props.fromTagName} )` : `${this.props.title}`}
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
                <EditForm data={this.props.tagSelectedData} fromTag={this.props.isFromTag} fromTagData={this.props.fromTagData} selectedRowKeys={this.props.selectedRowKeys} loginUserData={this.props.loginUserData} authToken={this.props.authToken} onSubmit={this.props.onSubmit} handleCancel={this.handleCancel}/>
            )}
        </Modal>
        );
  }
}
