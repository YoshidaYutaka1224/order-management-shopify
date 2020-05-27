import { combineReducers } from 'redux';
import Customizer from './customizer.reducer';
import auth from './auth';
import user from "./user";
import order from "./order";
import tag from "./tag";
import filter from "./filter";



const reducers = combineReducers({
    Customizer,
    auth,
    user,
    order,
    tag,
    filter
});

export default reducers;