import React, { Fragment } from 'react';
import App  from 'next/app';
import Head from 'next/head';
import { Provider, Context } from '@shopify/app-bridge-react';
import { Redirect } from '@shopify/app-bridge/actions';
import { authenticatedFetch } from '@shopify/app-bridge-utils';
import { AppProvider } from '@shopify/polaris';
import ClientRouter   from '../components/ClientRouter';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import translations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/dist/styles.css';

const myFetch = (url, options) => {
    delete options.signal;
    console.log(options);
    return fetch(url, options);
};

function userLoggedInFetch(app) {
    const fetchFunction = authenticatedFetch(app, myFetch);

    return async (uri, options) => {
        const response = fetchFunction(uri, options);

        if (response.headers.get('X-Shopify-API-Request-Failure-Reauthorize') === '1') {
            const authUrlHeader = response.headers.get('X-Shopify-API-Request-Failure-Reauthorize-Url');
            const redirect = Redirect.create(app);
            redirect.dispatch(Redirect.Action.APP, authUrlHeader || '/auth');
            return null;
        }
    }
}

class MyProvider extends React.Component {
    static contextType = Context;
    render() {
        const app = this.context;

        const client = new ApolloClient({
            fetch: userLoggedInFetch(app),
            fetchOptions: {
                credentials: 'include'
            }
        })
        return (
            <ApolloProvider client={client}>
                {this.props.children}
            </ApolloProvider>
        );
    }
}

class MyApp extends App {
    render() {
        const { Component, pageProps, shopOrigin } = this.props;
        const config = { apiKey: API_KEY, shopOrigin, forceRedirect: true };
        return (
            <Fragment>
                <Head>
                    <title>Ezerway 2 Countdown</title>
                    <meta charSet="utf-8"/>
                </Head>
                <Provider config={config}>
                    <ClientRouter />
                    <AppProvider i18n={translations}>
                        <MyProvider>
                            <Component {...pageProps}/>
                        </MyProvider>
                    </AppProvider>
                </Provider>
            </Fragment>
        );
    }
}

MyApp.getInitialProps = async ({ ctx }) => {
    return {
        shopOrigin: ctx.query.shop
    }
};

export default MyApp;
