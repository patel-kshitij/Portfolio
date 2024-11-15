import React from 'react';
import Greeting from '@/components/Greeting';
import { NextPageWithLayout } from './_app';
import styles from "@/styles/index.module.scss"

const IndexPage: NextPageWithLayout = () => {
    return (
        <div className={styles.greetingWrapper}>
            <Greeting />
        </div>
    );
};

export default IndexPage;