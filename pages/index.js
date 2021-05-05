import { Page, Layout, EmptyState } from '@shopify/polaris';
const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

const Index = () => {
    return (
        <Page>
            <Layout>
                <EmptyState
                    image={img}
                    heading={'Discount your products temporarily'}
                    action={{
                        content: 'Select product',
                        onAction() {
                            console.log('OK')
                        }
                    }}
                >
                    <p>Select products to change their price temporarily.</p>
                </EmptyState>
            </Layout>
        </Page>
    )
}

export default Index;
