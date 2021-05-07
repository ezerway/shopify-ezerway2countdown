import {
    useAppBridge,
    RoutePropagator as ShopifyRoutePropagator,
} from '@shopify/app-bridge-react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Redirect } from '@shopify/app-bridge/actions';

const RoutePropagator = () => {
    const router = useRouter();
    const { route } = router;
    const app = useAppBridge();

    useEffect(() => {
        app.subscribe(Redirect.ActionType.APP, ({ path }) => {
            router.push(path);
        });
    }, [app, router]);

    return app && route ? <ShopifyRoutePropagator location={route} /> : null;
};

export default RoutePropagator;
