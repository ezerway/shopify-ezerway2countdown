import React from "react";
import _ from 'lodash';
import {
    Page, Layout, Card,
    Form, FormLayout,
    Button, Stack, TextField,
    SettingToggle, TextStyle
} from '@shopify/polaris';

export default class AnnotatedLayout extends React.Component {
    state = {
        discount: '10%',
        enabled: false
    }
    render() {
        const { enabled, discount } = this.state;
        const textStatus = enabled ? 'enable' : 'disable';
        return (
            <Page>
                <Layout>
                    <Layout.AnnotatedSection
                        title="Default discount"
                        description="Add a product to Sample App, it will automatically be discounted."
                    >
                        <Card sectioned>
                            <Form onSubmit={this.handleSubmit}>
                                <FormLayout>
                                    <TextField
                                        label="Discount percentage"
                                        value={discount}
                                        type="discount"
                                        onChange={this.handleChange('discount')}
                                    />
                                    <Stack distribution={"trailing"}>
                                        <Button submit primary>Save</Button>
                                    </Stack>
                                </FormLayout>
                            </Form>
                        </Card>
                    </Layout.AnnotatedSection>
                    <Layout.AnnotatedSection
                        title="Price updates"
                        description="Temporarily disable all Sample App price updates"
                    >
                        <SettingToggle action={{
                            content: _.capitalize(textStatus),
                            onAction: this.handleToggle
                        }}
                        enabled={enabled}>
                            This setting is{' '}
                            <TextStyle variation={'strong'}>{textStatus}</TextStyle>
                        </SettingToggle>
                    </Layout.AnnotatedSection>
                </Layout>
            </Page>
        )
    }
    handleSubmit = () => {
        this.setState({ discount: this.state.discount });
        console.log(this.state);
    }
    handleChange = (field) => {
        return (value) => this.setState({ [field]: value })
    }
    handleToggle = () => {
        this.setState({ enabled: !this.state.enabled })
    }
}
