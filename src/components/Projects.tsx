"use client"

import React, { useEffect, useState } from 'react';
import styles from '../styles/Projects.module.scss';
import {useRouter} from "next/navigation";

const projects = [
    {
        title: 'SkillSwap',
        description: 'A Java-Spring, Next.js based web application for connecting local communities\' skills.',
        link: 'https://github.com/patel-kshitij/Skillswap',
        technologies: ""
    },
    {
        title: 'Ecomart Backend',
        description: 'A Django based set of REST APIs for a second-hand marketplace.',
        link: 'https://github.com/patel-kshitij/Ecomart-be',
    },
    {
        title: 'Serverless Image Processor',
        description: 'A simple yet efficient image processing API that is completely serverless with Infrastructure as Code.',
        link: 'https://github.com/patel-kshitij/Serverless-Image-Processing',
    },
    {
        title: 'Player Performance Prediction',
        description: 'A data science project to predict player performance in upcoming matches for FIFA.',
    },
];

const Projects: React.FC = () => {
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
        router.push('/contact');
    };

    return (
        <div className={`${styles.projectsWrapper} ${contentVisible ? styles.contentVisible : ''}`}>
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
                <h1 className={styles.projectsText}>Projects</h1>
            </div>
            <div className={`${styles.projectsContainer}`}>
                {projects.map((project, index) => (
                    <div key={index} className={styles.projectItem}>
                        {project.link ? (
                            <a href={project.link} target="_blank" rel="noopener noreferrer"
                               className={styles.projectLink}>
                                {project.title}
                            </a>
                        ) : (
                            <span className={styles.projectTitle}>{project.title}</span>
                        )}
                        <p className={styles.projectDescription}>{project.description}</p>
                    </div>
                ))}
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

export default Projects;