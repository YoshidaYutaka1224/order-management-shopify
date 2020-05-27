import { createStore, applyMiddleware, compose } from 'redux';

// middlewares
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'
import { loadState,saveState } from "./localstorage";
// Import custom components
import reducers from '../reducers/index';


function saveToLocalStorage(state) {
    try {
        const serializedState = JSON.stringify(state)
        localStorage.setItem('state', serializedState)
    }catch(e){
        return undefined
    }
}

/**
 * Create a Redux store that holds the app state.
 */
let persistedState = loadState();
const store = createStore(reducers,  persistedState,  compose(
    applyMiddleware(thunkMiddleware, logger),

    //For working redux dev tools in chrome (https://github.com/zalmoxisus/redux-devtools-extension)
    window.devToolsExtension ? window.devToolsExtension() : function (f) {
        return f;
    }
));

// eslint-disable-next-line
const unsubscribe = store.subscribe(() => {
    const state = store.getState();
    saveToLocalStorage(state);
});


export default store;