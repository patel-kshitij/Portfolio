"use client"

import React, { useEffect, useState } from 'react';
import styles from '@/styles/Greeting.module.scss';
import { useRouter } from 'next/navigation';

const Greeting: React.FC = () => {
    const [lineAnimated, setLineAnimated] = useState(false);
    const [textVisible, setTextVisible] = useState(false);
    const [arrowVisible, setArrowVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            setLineAnimated(true);
        }, 500);

        setTimeout(() => {
            setTextVisible(true);
        }, 1000);

        setTimeout(() => {
            setArrowVisible(true);
        }, 1500);
    }, []);

    const handleArrowClick = () => {
        router.push('/about');
    };

    return (
        <div className={styles.greetingWrapper}>
            <div className={styles.greetingContainer}>
                <div className={styles.iconsContainer}>
                    <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="6" width="20" height="12" rx="2" ry="2"></rect>
                        <line x1="6" y1="10" x2="6" y2="10"></line>
                        <line x1="10" y1="10" x2="10" y2="10"></line>
                        <line x1="14" y1="10" x2="14" y2="10"></line>
                        <line x1="18" y1="10" x2="18" y2="10"></line>
                    </svg>
                    <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="7" y="2" width="10" height="16" rx="5" ry="5"></rect>
                        <line x1="12" y1="6" x2="12" y2="6"></line>
                    </svg>
                </div>
                <div className={styles.textContainer}>
                    <div className={`${styles.line} ${lineAnimated ? styles.lineAnimated : ''}`}></div>
                    <h1 className={`${styles.greetingText} ${textVisible ? styles.textVisible : ''}`}>
                        Hi! I&#39;m<br/>
                        <span className={styles.name}>Kshitij Patel</span>
                    </h1>
                </div>
                <button className={`${styles.arrowButton} ${arrowVisible ? styles.arrowVisible : ''}`}
                        onClick={handleArrowClick}>
                <div className={styles.arrowCircle}>
                        <svg className={styles.arrowIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default Greeting;
