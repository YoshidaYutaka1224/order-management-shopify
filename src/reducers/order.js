import { SET_LIST_ORDER_DATA, SET_LIST_ORDER_DATA_TOTAL, SET_LIST_ORDER_DATA_FLAG, SET_LIST_ORDER_DATA_REST_FLAG } from "../constant/actionTypes";

const initial_state = {
    listOrderData : null,
    listOrderDataTotal: 0,
    listSearchFlag : false,
    listSearchRestFlag : false
};

export default (state = initial_state, action) => {
    switch (action.type) {

        case SET_LIST_ORDER_DATA:
            return { ...state, loading: false, listOrderData: action.listOrderData };

        case SET_LIST_ORDER_DATA_TOTAL:
            return { ...state, loading: false, listOrderDataTotal: action.listOrderDataTotal };

        case SET_LIST_ORDER_DATA_FLAG:
            return { ...state, loading: false, listSearchFlag: action.listSearchFlag };

        case SET_LIST_ORDER_DATA_REST_FLAG:
            return { ...state, loading: false, listSearchRestFlag: action.listSearchRestFlag };
            
        default: return { ...state };
    }
}
