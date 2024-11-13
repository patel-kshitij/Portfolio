"use client"

import React, { useEffect, useState } from 'react';
import styles from '../styles/AboutMe.module.scss';
import {useRouter} from "next/navigation";

const AboutMe: React.FC = () => {
    const [contentVisible, setContentVisible] = useState(false);
    const [arrowVisible, setArrowVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            setContentVisible(true);
        }, 500);
        setTimeout(() => {
            setArrowVisible(true);
        }, 1500);
    }, []);

    const handleArrowClick = () => {
        router.push('/projects');
    };

    return (
        <div className={`${styles.aboutMeWrapper} ${contentVisible ? styles.contentVisible : ''}`}>
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
                <h1 className={styles.aboutMeText}>About Me</h1>
            </div>
            <p className={styles.aboutMeDescription}>
                I&#39;m 25 years old and a passionate newbie software developer. Sometimes I think I
                spend more time with my code than with actual people, but hey, code never talks back.
            </p>
            <p className={styles.aboutMeDescription}>
                I&#39;ve worked with several programming languages, including <span style={{color: '#9B7EBD'}}>Python, Java, and Go</span>. Python is my comfort
                zone, Java makes me feel like a grown-up, and Go? Well, it keeps me on my toes.
            </p>
            <p className={styles.aboutMeDescription}>
                <span style={{color: '#9B7EBD'}}> Problem-solving </span> is where I truly shine. I enjoy tackling complex challenges and breaking them down into
                elegant, efficient solutions. Whether it&#39;s debugging an issue or architecting a new feature, I love
                the thrill of solving problems. Plus, there&#39;s nothing like the rush of fixing a bug that has been haunting me for hours—it&#39;s like
                slaying a dragon, but nerdier.
            </p>
            <p className={styles.aboutMeDescription}>
                When I&#39;m not coding, you&#39;ll find me exploring the world—<span style={{color: '#9B7EBD'}}>traveling </span>to new places, experiencing
                different cultures, and finding inspiration beyond the screen.  I&#39;m also a massive <span style={{color: '#9B7EBD'}}>foodie</span>; if
                there&#39;s good food around, you can bet I&#39;m first in line. I also firmly believe that every
                journey needs a good snack, a questionable playlist and great company.
            </p>
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

export default AboutMe;