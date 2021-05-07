import React, {useEffect, useState} from "react";
import gql from 'graphql-tag';
import {
    Frame, Page, Layout, Banner, Toast, Form, FormLayout, Card,
    TextField, DisplayText, PageActions
} from '@shopify/polaris';
import { Mutation } from 'react-apollo';
import store from "store-js";
import {Context, useAppBridge} from '@shopify/app-bridge-react';
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

const EditProducts = () => {
    const [state, setState] = useState({
        variantId: '',
        name: '',
        price: '',
        discount: '',
    });
    const app = useAppBridge();
    const redirectToHome = () => {
        const redirect = Redirect.create(app);
        redirect.dispatch(Redirect.Action.APP, '/index');
    }
    const handleChange = (field) => {
        return (value) => setState({  ...state ,[field]: value })
    }
    useEffect(() => {
        const item = store.get('item');
        const name = item.title;
        const price = item.variants.edges[0].node?.price;
        const variantId = item.variants.edges[0].node?.id;
        const discounter = price * 0.1;
        setState({ name, price, variantId, discount: (price - discounter).toFixed(2) })
    })
    return (
        <Mutation mutation={UPDATE_PRICE}>
            {(mutateFunction, { data, error }) => {

                return (
                    <Frame>
                        <Page>
                            <Layout>
                                { (data && data?.productVariantUpdate) ? (<Toast content="Successfully updated"/>) : null }
                                <Layout.Section>
                                    { error ? (<Banner status="critical">{error.message}</Banner>) : null }
                                </Layout.Section>
                                <Layout.Section>
                                    <DisplayText size="large">{state.name}</DisplayText>
                                    <Form>
                                        <Card sectioned>
                                            <FormLayout>
                                                <FormLayout.Group>
                                                    <TextField prefix="$" type="price" label="Original price" value={state.price} readOnly/>
                                                    <TextField prefix="$" type="discount" label="Discounted price" value={state.discount} onChange={handleChange('discount')}/>
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
                                                            id: state.variantId,
                                                            price: state.discount
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
    );
};

export default EditProducts;
