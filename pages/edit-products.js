import React from "react";
import gql from 'graphql-tag';
import {
    Frame, Page, Layout, Banner, Toast, Form, FormLayout, Card,
    TextField, DisplayText, PageActions
} from '@shopify/polaris';
import { Mutation } from 'react-apollo';
import store from "store-js";
import {useAppBridge} from '@shopify/app-bridge-react';
import { Redirect } from '@shopify/app-bridge/actions';

const UPDATE_PRICE = gql`
mutation productVariantUpdate($input: ProductVariantInput!) {
    productVariantUpdate(input: $input) {
      product {
        title
      }
      productVariant {
        id
        price
      }
    }
  }
`;

class EditProducts extends React.Component {
    state = {
        variantId: '',
        name: '',
        price: '',
        discount: '',
    }
    componentDidMount() {
        this.setState({ discount: this.itemToBeConsumed() })
    }

    render() {
        const { name, price, discount, variantId } = this.state;
        const redirectToHome = () => {
            const app = useAppBridge();
            const redirect = Redirect.create(app);
            redirect.dispatch(Redirect.Action.APP, '/index');
        }

        return (
            <Mutation mutation={UPDATE_PRICE}>
                {(mutateFunction, { data, error }) => {

                    return (
                        <Frame>
                            <Page>
                                <Layout>
                                    { (data && data?.productVariantUpdate) ? (<Toast content="Sucessfully updated"/>) : null }
                                    <Layout.Section>
                                        { error ? (<Banner status="critical">{error.message}</Banner>) : null }
                                    </Layout.Section>
                                    <Layout.Section>
                                        <DisplayText size="large">{name}</DisplayText>
                                        <Form>
                                            <Card sectioned>
                                                <FormLayout>
                                                    <FormLayout.Group>
                                                        <TextField prefix="$" type="price" label="Original price" value={price} readOnly/>
                                                        <TextField prefix="$" type="discount" label="Discounted price" value={discount} onChange={this.handleChange('discount')}/>
                                                    </FormLayout.Group>
                                                    <p>
                                                        This sale price will expire in two weeks
                                                    </p>
                                                </FormLayout>
                                            </Card>
                                            <PageActions
                                                primaryAction={[
                                                    {
                                                        content: 'Save',
                                                        onAction: () => {
                                                            const productVariableInput = {
                                                              id: variantId,
                                                              price: discount
                                                            };
                                                            mutateFunction({ variables: { input: productVariableInput } });
                                                        }
                                                    }
                                                ]}
                                                secondaryActions={[
                                                    {
                                                        content: 'Close',
                                                        onAction: redirectToHome
                                                    }
                                                ]}
                                            />
                                        </Form>
                                    </Layout.Section>
                                </Layout>
                            </Page>
                        </Frame>
                    )
                }}
            </Mutation>
        )
    }
    handleChange = (field) => {
        return (value) => this.setState({ [field]: value })
    }
    itemToBeConsumed = () => {
        const item = store.get('item');
        const name = item.title;
        const price = item.variants.edges[0].node?.price;
        const variantId = item.variants.edges[0].node?.id;
        this.setState({ name, price, variantId });
        const discounter = price * 0.1;
        return (price - discounter).toFixed(2);
    }
}

export default EditProducts;
