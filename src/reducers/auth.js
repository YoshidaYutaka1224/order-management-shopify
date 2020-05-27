import { SET_LOGIN_FLAG, SET_USER_DATA, SET_USER_AUTHTOKEN, SET_ROUTE_NAME, SET_SEARCH_TEXT, SET_SEARCH_LOADER } from "../constant/actionTypes";

const initial_state = {
    loginFlag : false,
    loginUserData : null,
    authToken : null,
    routeName : null ,
    searchText : null,
    searchLoader : false,
};

export default (state = initial_state, action) => {
    switch (action.type) {
        
        case SET_LOGIN_FLAG:
            return { ...state, loading: false, loginFlag: action.flag };
        
        case SET_USER_DATA:
            return { ...state, loading: false, loginUserData: action.userData };

        case SET_USER_AUTHTOKEN:
            return { ...state, loading: false, authToken: action.authToken };

        case SET_ROUTE_NAME:
            return { ...state, loading: false, routeName: action.routeName };

        case SET_SEARCH_TEXT:
            return { ...state, loading: false, searchText: action.searchText };

        case SET_SEARCH_LOADER:
            return { ...state, loading: false, searchLoader: action.searchLoader };

        default: return { ...state };
    }
}
