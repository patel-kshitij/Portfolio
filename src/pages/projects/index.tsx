import React from 'react';
import Projects from '@/components/Projects';
import { NextPageWithLayout } from '@/pages/_app';
import styles from '@/styles/Projects.module.scss'

const ProjectsPage: NextPageWithLayout = () => {
    return (
        <div className={styles.projectWrapperParent}>
            <Projects />
        </div>
    );
};

export default ProjectsPage;