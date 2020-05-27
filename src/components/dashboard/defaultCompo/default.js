import React, { Fragment, Component } from 'react';
import Breadcrumb from '../../common/breadcrumb';
import CountUp from 'react-countup';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Users, Tag, ShoppingBag } from 'react-feather';
import { callAllKpis } from "../../../Graphs/Dashboard/callKpis";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

class Default extends Component {
    constructor(props){
        super(props);
        this.state = {
            userCount : 0,
            tagCount : 0,
            orderCount : 0,
            isLoading : false
        }
    }

    async componentDidMount() {
        try{
            const { authToken, history, setLoginFlag, setUserData, setUserToken, setRouteName } = this.props;
            this.setState({
                isLoading : true
            });

            await setRouteName("DASHBOARD");
            let responseKpiData = await callAllKpis(authToken);

            if(responseKpiData.status == 200){
                //set kpi data
                this.setState({
                    userCount : responseKpiData.data.userCount,
                    tagCount : responseKpiData.data.tagCount,
                    orderCount : responseKpiData.data.orderCount
                })
            }else if (responseKpiData.status == 401) {
                await setLoginFlag(false);
                await setUserData(null);
                await setUserToken(null);
                history.push(`${process.env.PUBLIC_URL}/login`);
            }

        }catch(e){
            console.log("!!!!!!!!error in did mount", e);
        } finally {
            this.setState({
                isLoading : false
            });
        }
    }

    render() {
        const  { userCount, tagCount, orderCount } = this.state;
        const { loginUserData } = this.props;

        return (
            <Fragment>
                <Breadcrumb parent={this.props.t('DASHBOARD')} title={this.props.t('DASHBOARD')} />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-6 col-xl-3 col-lg-6">
                            {
                                loginUserData && loginUserData.role === "ADMIN" ? 
                                (
                                    <Link to="/user">
                                        <div className="card o-hidden">
                                            <div className="bg-primary b-r-4 card-body">
                                                <div className="media static-top-widget">
                                                <div className="align-self-center text-center">
                                                    <Users />
                                                </div>
                                                <div className="media-body"><span className="m-0">{this.props.t('toatl_user_text')}</span>
                                                    <h4 className="mb-0 counter">
                                                    <CountUp className="counter" end={userCount} />
                                                    </h4>
                                                    <Users className="icon-bg" />
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )
                                :
                                (
                                    <div className="card o-hidden">
                                        <div className="bg-primary b-r-4 card-body">
                                            <div className="media static-top-widget">
                                            <div className="align-self-center text-center">
                                                <Users />
                                            </div>
                                            <div className="media-body"><span className="m-0">{this.props.t('toatl_user_text')}</span>
                                                <h4 className="mb-0 counter">
                                                <CountUp className="counter" end={userCount} />
                                                </h4>
                                                <Users className="icon-bg" />
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        <div className="col-sm-6 col-xl-3 col-lg-6">
                            {
                                loginUserData && (loginUserData.role === "ADMIN" || loginUserData.role === "admin") ? 
                                (
                                    <Link to="/tag">
                                        <div className="card o-hidden">
                                            <div className="bg-primary b-r-4 card-body">
                                                <div className="media static-top-widget">
                                                <div className="align-self-center text-center">
                                                    <Tag />
                                                </div>
                                                <div className="media-body"><span className="m-0">{this.props.t('total_tag_text')}</span>
                                                    <h4 className="mb-0 counter">
                                                    <CountUp className="counter" end={tagCount} />
                                                    </h4>
                                                    <Tag className="icon-bg" />
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )
                                :
                                (
                                    <div className="card o-hidden">
                                        <div className="bg-primary b-r-4 card-body">
                                            <div className="media static-top-widget">
                                            <div className="align-self-center text-center">
                                                <Tag />
                                            </div>
                                            <div className="media-body"><span className="m-0">{this.props.t('total_tag_text')}</span>
                                                <h4 className="mb-0 counter">
                                                <CountUp className="counter" end={tagCount} />
                                                </h4>
                                                <Tag className="icon-bg" />
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        <div className="col-sm-6 col-xl-3 col-lg-6">
                            <Link to="/order">
                                <div className="card o-hidden">
                                    <div className="bg-primary b-r-4 card-body">
                                        <div className="media static-top-widget">
                                        <div className="align-self-center text-center">
                                            <ShoppingBag />
                                        </div>
                                        <div className="media-body"><span className="m-0">{this.props.t('total_order_text')}</span>
                                            <h4 className="mb-0 counter">
                                            <CountUp className="counter" end={orderCount} />
                                            </h4>
                                            <ShoppingBag className="icon-bg" />
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        {/* <div className="col-sm-6 col-xl-3 col-lg-6">
                            <div className="card o-hidden">
                            <div className="bg-primary b-r-4 card-body">
                                <div className="media static-top-widget">
                                <div className="align-self-center text-center">
                                    <Navigation />
                                </div>
                                <div className="media-body">
                                    <span className="m-0">Total Cities</span>
                                    <h4 className="mb-0 counter">
                                    <CountUp className="counter" end={cityCount} />
                                    </h4>
                                    <Navigation className="icon-bg" />
                                </div>
                                </div>
                            </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    authToken: state.auth.authToken,
    loginUserData: state.auth.loginUserData
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
        setRouteName: (routeName) => {
            dispatch({
                type : "SET_ROUTE_NAME",
                routeName : routeName
            })
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withTranslation()(Default)));