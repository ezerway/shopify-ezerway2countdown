import React from "react";
import {
    Page, Layout, Card,
    Form, FormLayout,
    Button, Stack, TextField
} from '@shopify/polaris';

export default class AnnotatedLayout extends React.Component {
    state = {
        discount: '10%'
    }
    render() {
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
                                        value={this.state.discount}
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
}
