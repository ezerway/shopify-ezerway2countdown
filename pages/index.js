import React from "react";
import {
    Page, Layout, EmptyState,
} from '@shopify/polaris';
import { ResourcePicker, TitleBar } from '@shopify/app-bridge-react';

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

class Index extends React.Component {
    state = {
        open: false
    }
    render() {
        const { open } = this.state;
        return (
            <Page>
                <TitleBar title={'Ezerway 2 countdown'} primaryAction={{
                    content: 'Select product',
                    onAction: this.openResourcePicker
                }} />
                <ResourcePicker resourceType={'Product'} open={open}
                                onSelection={this.handleSelection}
                                onCancel={this.closeResourcePicker}/>
                <Layout>
                    <EmptyState
                        heading={'Discount your products temporarily'}
                        action={{
                            content: 'Select product',
                            onAction: this.openResourcePicker
                        }}
                        image={img}
                    >
                        <p>Select products to change their price temporarily.</p>
                    </EmptyState>
                </Layout>
            </Page>
        )
    }
    openResourcePicker = () => this.setState({ open: true });
    closeResourcePicker = () => this.setState({ open: false });
    handleSelection = (resources) => {
        this.closeResourcePicker();
        console.log(resources)
    }
}

export default Index;
