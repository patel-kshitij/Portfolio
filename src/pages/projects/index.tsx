import React from 'react';
import Projects from '@/components/Projects';
import { NextPageWithLayout } from '@/pages/_app';
import styles from '@/styles/Projects.module.scss'

const AboutPage: NextPageWithLayout = () => {
    return (
        <div className={styles.projectWrapperParent}>
            <Projects />
        </div>
    );
};

export default AboutPage;