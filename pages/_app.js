import React, { Fragment } from 'react';
import App from 'next/app';
import Head from 'next/head';
import { Provider } from '@shopify/app-bridge-react';
import { AppProvider } from '@shopify/polaris';
import translations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/dist/styles.css';
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
                    <AppProvider i18n={translations}>
                        <Component {...pageProps}/>
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
