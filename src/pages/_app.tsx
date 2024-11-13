import type { AppProps } from 'next/app';
import type { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';
import StarBackground from '@/components/StarBackground';
import ShootingStar from '@/components/ShootingStar';

export type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    // Use getLayout if defined, otherwise use default layout
    const getLayout = Component.getLayout || ((page) => (
        <div>
            <StarBackground />
            <ShootingStar />
            {page}
        </div>
    ));

    return getLayout(<Component {...pageProps} />);
}

export default MyApp;