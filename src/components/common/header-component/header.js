import React, { useState ,Fragment } from 'react';
import logo from '../../../assets/images/endless-logo.png';
import Language from './language';
import UserMenu from './userMenu';
import Notification from './notification';
import SearchHeader from './searchHeader';
import { Link } from 'react-router-dom';
import { AlignLeft, Maximize, Bell, MessageCircle, MoreHorizontal, Search } from 'react-feather';
import { useSelector, useDispatch } from 'react-redux';
import { searchUser } from "../../../Graphs/User/searchUser";
import { searchTag } from "../../../Graphs/Tag/searchTag";
import { searchOrder } from "../../../Graphs/Order/searchOrder";
import { useTranslation } from 'react-i18next';

import Logo from "../../../assets/images/logo.png";

const Header = () => {
  const [sidebar, setSidebar] = useState(false);
  const [rightSidebar, setRightSidebar] = useState(true);
  const [headerbar, setHeaderbar] = useState(true);

  const primaryColor = localStorage.getItem('primary_color');

 const openCloseSidebar = () => {
    if (sidebar) {
      setSidebar(!sidebar)
      document.querySelector(".page-main-header").classList.remove('open');
      document.querySelector(".page-sidebar").classList.remove('open');
    } else {
      setSidebar(!sidebar)
      document.querySelector(".page-main-header").classList.add('open');
      document.querySelector(".page-sidebar").classList.add('open'); 
    }
  }

  function showRightSidebar() {
    if (rightSidebar) {
      setRightSidebar(!rightSidebar)
      document.querySelector(".right-sidebar").classList.add('show');
    } else {
      setRightSidebar(!rightSidebar)
      document.querySelector(".right-sidebar").classList.remove('show');
    }
  }

  //full screen function
  function goFull() {
    if ((document.fullScreenElement && document.fullScreenElement !== null) ||
      (!document.mozFullScreen && !document.webkitIsFullScreen)) {
      if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

  const dispatch = useDispatch();
  const searchText = useSelector(content => content.auth.searchText);
  const routeName = useSelector(content => content.auth.routeName);
  const authToken = useSelector(content => content.auth.authToken);

  const { t, i18n } = useTranslation();


  
  async function handleSearchKeyword(textValue) {
    console.log("!!!!!!!!!!!onchange method", textValue, searchText);
    dispatch({
      type: 'SET_SEARCH_TEXT',
      searchText: textValue
    });
    if(routeName === "USER") {
      dispatch({
        type: 'SET_SEARCH_TEXT',
        searchText: textValue
      });
      dispatch({
        type: 'SET_SEARCH_LOADER',
        searchLoader: true
      });
      await listSearchUserData(textValue);
    } else if (routeName === "TAG") {
      dispatch({
        type: 'SET_SEARCH_TEXT',
        searchText: textValue
      });
      dispatch({
        type: 'SET_SEARCH_LOADER',
        searchLoader: true
      });
      await listSearchTagData(textValue);
    }else if(routeName === "ORDER") {
      return;
    }
  }

  async function handleEnter(e) {
    console.log("!!!!!!!!!!orderData after search begin", e.charCode, e.target.value);
    if(e.charCode === 13 && routeName === "ORDER") {
      dispatch({
        type: 'SET_SEARCH_TEXT',
        searchText: e.target.value
      });
      dispatch({
        type: 'SET_SEARCH_LOADER',
        searchLoader: true
      });
      dispatch({
        type: 'SET_LIST_ORDER_DATA_FLAG',
        listSearchFlag: true
      });
      await listSearchOrderData(e.target.value);
    }
  }

  async function listSearchOrderData(textValue) {
    if(textValue === "") {
      dispatch({
        type: 'SET_SEARCH_LOADER',
        searchLoader: false
      });
      dispatch({
        type: 'SET_LIST_ORDER_DATA_FLAG',
        listSearchFlag: false
      });
      dispatch({
        type: 'SET_LIST_ORDER_DATA_REST_FLAG',
        listSearchRestFlag: false
      });
      return;
    }

    let orderData = await searchOrder(authToken, textValue);
    console.log("!!!!!!!!!!orderData after search ", orderData);

    if(orderData.status === 200){
        //set user data
        await dispatch({
          type: 'SET_LIST_ORDER_DATA',
          listOrderData: orderData.data
        });
        await dispatch({
          type: 'SET_LIST_ORDER_DATA_REST_FLAG',
          listSearchRestFlag: orderData.isRest
        });
    }

    dispatch({
      type: 'SET_SEARCH_LOADER',
      searchLoader: false
    });
  }

  async function listSearchTagData(textValue) {
    let tagData = await searchTag(authToken, textValue, 0, 10);
    console.log("!!!!!!!!!!tagData after search ", tagData.total);

    if(tagData.status == 200){
        //set user data
        await dispatch({
          type: 'SET_LIST_TAG_DATA',
          listTagData: tagData.data
        });
        await dispatch({
          type: 'SET_LIST_TAG_DATA_TOTAL',
          listTagDataTotal: tagData.total
        });

    }
    dispatch({
      type: 'SET_SEARCH_LOADER',
      searchLoader: false
    });
  }

  async function listSearchUserData(textValue) {
    let userData = await searchUser(authToken, textValue, 0, 10);
    console.log("!!!!!!!!!!userData after search ", userData.total);

    if(userData.status == 200){
        //set user data
        await dispatch({
          type: 'SET_LIST_USER_DATA',
          listUserData: userData.data
        });
        await dispatch({
          type: 'SET_LIST_USER_DATA_TOTAL',
          listUserDataTotal: userData.total
        });

    }
    dispatch({
      type: 'SET_SEARCH_LOADER',
      searchLoader: false
    });
  }

  return (
    <Fragment>
      <div className="page-main-header" >
        <div className="main-header-right row">
          <div className="main-header-left d-lg-none">
            <div className="logo-wrapper">
              <Link to="/dashboard">
                {/* <img className="img-fluid" src={logo} alt="" /> */}
                <img className="header-logo" src={Logo} alt="logo" />
              </Link>
            </div>
          </div>
          <div className="mobile-sidebar d-block">
            <div className="media-body text-right switch-sm">
              <label className="switch">
                <a href="#javascript" onClick={() => openCloseSidebar()}>
                  <AlignLeft />
                </a>
              </label>
            </div>
          </div>
          <div className="nav-right col p-0">
            <ul className={`nav-menus ${headerbar ? '' : 'open'}`}>
              <li>
                <Fragment>
                  <div>
                      <form className="form-inline search-form">
                        {
                          routeName === "DASHBOARD" || routeName === "SETTING" || routeName === "MYLOGS" ? 
                            null
                            :
                              <div style={{ width : "100%" }}>
                                <div className="form-group">
                                  <input
                                      className="form-control-plaintext searchIcon"
                                      type="text"
                                      placeholder={
                                        routeName === "USER" 
                                        ?
                                        `${t("search_user_text")}`
                                        :
                                        routeName === "TAG"
                                        ?
                                        `${t("search_tag_text")}`
                                        :
                                        routeName === "ORDER" 
                                        ?
                                        `${t("search_order_text")}`
                                        :
                                        "Search"
                                      }
                                      value={searchText}
                                      onChange={(e) => handleSearchKeyword(e.target.value)}
                                      onKeyPress={(e) => handleEnter(e)}
                                  />
                                  <span className="d-sm-none mobile-search">
                                      <Search />
                                  </span>
                              </div>
                              <div className="form-group input-search-wrap">
                                  <input
                                      className="input-search"
                                      type="text"
                                      placeholder={
                                        routeName === "USER" 
                                        ?
                                        "Search User"
                                        :
                                        routeName === "TAG"
                                        ?
                                        "Search Tag"
                                        :
                                        "Search"
                                      }
                                      onChange={(e) => handleSearchKeyword(e.target.value)}
                                      onKeyPress={(e) => handleEnter(e)}
                                  />
                                </div>
                            </div>
                        }
                      </form>
                  </div>
                </Fragment> 
              </li>
              {/* <li>
                <SearchHeader />
              </li> */}
              {/* <li>
                <a onClick={goFull} className="text-dark" href="#!">
                  <Maximize />
                </a>
              </li> */}
              {/* <li className="onhover-dropdown">
                <a className="txt-dark" href="#javascript">
                  <h6>EN</h6></a>
                <Language />
              </li>
              <li className="onhover-dropdown">
                <Notification />
                <Bell />
                <span className="dot"></span>
                <Notification />
              </li> */}
              <li style={{marginRight : "0px"}}>
                {/* <a href="#javascript" onClick={showRightSidebar}>
                  <MessageCircle />
                  <span className="dot"></span>
                </a> */}
                <a onClick={goFull} className="text-dark" href="#!">
                  <Maximize />
                </a>
              </li>
              <UserMenu />
            </ul>
            <div className="d-lg-none mobile-toggle pull-right" onClick={() => setHeaderbar(!headerbar)}><MoreHorizontal/></div>
          </div>
          <script id="result-template" type="text/x-handlebars-template">
            <div className="ProfileCard u-cf">
              <div className="ProfileCard-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-airplay m-0"><path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1">
                </path>
                  <polygon points="12 15 17 21 7 21 12 15"></polygon>
                </svg>
              </div>
              <div className="ProfileCard-details">
                <div className="ProfileCard-realName"></div>
              </div>
            </div>
          </script>
          <script id="empty-template" type="text/x-handlebars-template">
            <div className="EmptyMessage">Your search turned up 0 results. This most likely means the backend is down, yikes!</div>
          </script>
        </div>
      </div>
    </Fragment>
  )
};
export default Header;