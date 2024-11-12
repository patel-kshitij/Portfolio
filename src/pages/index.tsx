import React from 'react';
import StarBackground from '@/components/StarBackground';
import ShootingStar from "@/components/ShootingStar";
import Greeting from "@/components/Greeting";
import styles from '@/styles/index.module.scss';

const IndexPage: React.FC = () => {
    return (
        <div className={styles.pageWrapper}>
            <StarBackground />
            <ShootingStar />
            <div className={styles.greetingWrapper}>
                <Greeting />
            </div>
        </div>
    );
};

export default IndexPage;
