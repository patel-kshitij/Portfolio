import React from 'react';
import AboutMe from '@/components/AboutMe';
import { NextPageWithLayout } from '@/pages/_app';
import styles from '@/styles/AboutMe.module.scss'
const AboutPage: NextPageWithLayout = () => {
    return (
        <div className={styles.aboutMeWrapperParent}>
            <AboutMe />
        </div>
    );
};

export default AboutPage;