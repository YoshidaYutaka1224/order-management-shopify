import React, { Fragment, useEffect, Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ScrollContext } from 'react-router-scroll-4';
import * as serviceWorker from './serviceWorker';
import Router from "./router/index";

//css
import "./assets/css/bootstrap.css";
import "./assets/css/comman1.css";
import "./assets/css/comman2.css";
import "./assets/css/comman.css";
import "./assets/css/responsive.css";

import './i18n';

// ** Import custom components for redux**
import { Provider } from 'react-redux';
import store from './store/index';
import App from "./components/app";

// Import custom Components 

import Default from './components/dashboard/defaultCompo/default';
import Login from './components/Login/Login';

import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";
import { setContext } from "apollo-link-context";

const httpLink = createHttpLink({
    uri: "https://dharma-tech-dev.myshopify.com/admin/api/graphql.json"
});

const authLink = setContext(async (_, { headers }) => {
    return {
        headers: {
          "X-Shopify-Access-Token" : "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yash"
        }
    };
});

const client = new ApolloClient({
    fetchOptions: {
        mode: 'no-cors',
    },
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
        dataIdFromObject: o => {
            if(o.id) {
                return `${o.__typename}-${o.id}`;
            }
            return `${o.__typename}-${o.cursor}`;
        }
    })
});

//firebase Auth
function Root() {
    useEffect(() => {
        const layout = localStorage.getItem('layout_version')
        document.body.classList.add(layout);
    }, []);
    return (
        <div className="App">
            <Provider store={store}>
                <Suspense fallback={null}>
                    <ApolloProvider client={client}>
                        <BrowserRouter basename={'/'}>
                            <ScrollContext>
                                <Router />
                            </ScrollContext>
                        </BrowserRouter>
                    </ApolloProvider>
                </Suspense>
            </Provider>
        </div>
    );
}

ReactDOM.render(<Root />, document.getElementById('root'));

serviceWorker.unregister();