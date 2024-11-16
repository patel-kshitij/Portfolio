import React from 'react';
import ContactMe from '@/components/ContactMe';
import { NextPageWithLayout } from '@/pages/_app';
import styles from '@/styles/Projects.module.scss'

const ContactPage: NextPageWithLayout = () => {
    return (
        <div className={styles.projectWrapperParent}>
            <ContactMe />
        </div>
    );
};

export default ContactPage;