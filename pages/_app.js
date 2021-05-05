import React, { Fragment } from 'react';
import App from 'next/app';
import Head from 'next/head';
import { AppProvider } from '@shopify/polaris';
import translations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/dist/styles.css';

export default class MyApp extends App {
    render() {
        const { Component, pageProps } = this.props;
        return (
            <Fragment>
                <Head>
                    <title>Ezerway 2 Countdown</title>
                    <meta charSet="utf-8"/>
                </Head>
                <AppProvider i18n={translations}>
                    <Component {...pageProps}/>
                </AppProvider>
            </Fragment>
        );
    }
}
