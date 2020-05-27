import { SET_LIST_USER_DATA, SET_LIST_USER_DATA_TOTAL } from "../constant/actionTypes";
import ConfigDB from '../data/customizer/config';

const initial_state = {
    listUserData : null,
    listUserDataTotal: 0,
};

export default (state = initial_state, action) => {
    switch (action.type) {

        case SET_LIST_USER_DATA:
            return { ...state, loading: false, listUserData: action.listUserData };

        case SET_LIST_USER_DATA_TOTAL:
            return { ...state, loading: false, listUserDataTotal: action.listUserDataTotal };
            
        default: return { ...state };
    }
}
