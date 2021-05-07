import React, { Fragment } from 'react';
import App  from 'next/app';
import Head from 'next/head';
import {Provider, useAppBridge} from '@shopify/app-bridge-react';
import { Redirect } from '@shopify/app-bridge/actions';
import { authenticatedFetch } from '@shopify/app-bridge-utils';
import { AppProvider } from '@shopify/polaris';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import ClientRouter from '../components/ClientRouter';
import RoutePropagator from '../components/RoutePropagator';

import translations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/dist/styles.css';

const myFetch = (url, options) => {
    delete options.signal;
    return fetch(url, options);
};

function userLoggedInFetch(app) {
    const fetchFunction = authenticatedFetch(app, myFetch);

    return async (uri, options) => {
        const response = await fetchFunction(uri, options);

        if (response.headers.get('X-Shopify-API-Request-Failure-Reauthorize') === '1') {
            const authUrlHeader = response.headers.get('X-Shopify-API-Request-Failure-Reauthorize-Url');
            const redirect = Redirect.create(app);
            redirect.dispatch(Redirect.Action.APP, authUrlHeader || '/auth');
            return null;
        }
        return response;
    }
}

const MyProvider = (props) => {
    const app = useAppBridge();
    const client = new ApolloClient({
        fetch: userLoggedInFetch(app),
        fetchOptions: {
            credentials: 'include'
        }
    })
    const Component = props.Component;
    return (
        <ApolloProvider client={client}>
            <Component {...props} />
        </ApolloProvider>
    );
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
                <AppProvider i18n={translations}>
                    <Provider config={config}>
                        <ClientRouter />
                        <RoutePropagator />
                        <MyProvider Component={Component} {...pageProps}/>
                    </Provider>
                </AppProvider>
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
