import { SET_LIST_TAG_DATA, SET_LIST_TAG_DATA_TOTAL, SET_LIST_TAG_DICTIONARY } from "../constant/actionTypes";
import ConfigDB from '../data/customizer/config';

const initial_state = {
    listTagData : null,
    listTagDataTotal: 0,
    listTagDictionaryData : null
};

export default (state = initial_state, action) => {
    switch (action.type) {

        case SET_LIST_TAG_DATA:
            return { ...state, loading: false, listTagData: action.listTagData };

        case SET_LIST_TAG_DATA_TOTAL:
            return { ...state, loading: false, listTagDataTotal: action.listTagDataTotal };

        case SET_LIST_TAG_DICTIONARY:
            return { ...state, loading: false, listTagDictionaryData: action.listTagDictionaryData };
                
        default: return { ...state };
    }
}
