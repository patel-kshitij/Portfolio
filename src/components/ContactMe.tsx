"use client"

import React, { useEffect, useState } from 'react';
import styles from '../styles/ContactMe.module.scss';
import {useRouter} from "next/navigation";

const Contact: React.FC = () => {
    const [contentVisible, setContentVisible] = useState(false);
    const [arrowVisible, setArrowVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            setContentVisible(true);
        }, 500);
        setTimeout(() => {
            setArrowVisible(true);
        }, 1000);
    }, []);

    const handleArrowClick = () => {
        router.push('/');
    };

    function handleLinkedInIconClick() {
        window.open("https://www.linkedin.com/in/kshitijkumar-patel-077358175/", "_blank");
    }

    function handleGithubIconClick() {
        window.open("https://github.com/patel-kshitij", "_blank");
    }

    return (
        <div className={`${styles.contactWrapper} ${contentVisible ? styles.contentVisible : ''}`}>
            <div className={styles.headerContainer}>
                <div className={styles.iconsContainer}>
                    <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="8" width="20" height="12" rx="2" ry="2"></rect>
                        <line x1="6" y1="12" x2="6" y2="12"></line>
                        <line x1="10" y1="12" x2="10" y2="12"></line>
                        <line x1="14" y1="12" x2="14" y2="12"></line>
                        <line x1="18" y1="12" x2="18" y2="12"></line>
                    </svg>
                    <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="7" y="4" width="10" height="16" rx="5" ry="5"></rect>
                        <line x1="12" y1="8" x2="12" y2="8"></line>
                    </svg>
                </div>
                <h1 className={styles.contactTitle}>Contact Me</h1>
            </div>
            <p className={styles.contactText}>
                The fastest way to reach me is through <a href="mailto:me@patelkshitij.com" className={styles.mailLink}>
                mail</a>.
            </p>
            <p className={styles.contactText}>Thanks for visiting.</p>
            <p className={styles.contactText}>New updates will come for the portfolio and all the suggestions are welcome.
                The source for the portfolio is <a href="https://github.com/patel-kshitij/Portfolio" target="_blank" rel="noopener noreferrer"
                                                   className={styles.sourceLink}>here</a>.</p>
            <div className={styles.socialMediaIconsContainer}>
                <svg onClick={handleLinkedInIconClick} className={styles.socialMediaIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor"
                     stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                </svg>
                <svg onClick={handleGithubIconClick} className={styles.socialMediaIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor"
                     stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path
                        d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77 5.44 5.44 0 0 0 3 8.52c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 8.5 18.13V22"></path>
                </svg>
            </div>
            <button className={`${styles.arrowButton} ${arrowVisible ? styles.arrowVisible : ''}`}
                    onClick={handleArrowClick}>
                <div className={styles.arrowCircle}>
                    <svg className={styles.arrowIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </div>
            </button>
        </div>
    );
};

export default Contact;