"use client"

import React, { useEffect, useState } from 'react';
import starConfig from '@/config/starsConfig';
import styles from '@/styles/StarBackground.module.scss';
import clsx from 'clsx';

const StarBackground: React.FC = () => {
    const [stars, setStars] = useState<React.ReactElement[]>([]);

    useEffect(() => {
        const createStars = () => {
            const starElements: React.ReactElement[] = [];
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const starCount = getStarCount(screenWidth);

            for (let i = 0; i < starCount; i++) {
                const size = getStarSize();
                const color = Math.random() < 0.1 ? "#f4e99b" : "#ffffff"; // 10% yellow, 90% white
                const intensity = Math.random() * 0.5 + 0.5; // Random intensity between 0.5 and 1
                const top = Math.random() * screenHeight;
                const left = Math.random() * screenWidth;
                const isBlinking = Math.random() < starConfig.blinkingStarPercentage; // 3% chance of blinking

                starElements.push(
                    <div
                        key={i}
                        className={clsx(styles.star, { [styles.blinking]: isBlinking })}
                        style={{
                            width: size,
                            height: size,
                            backgroundColor: color,
                            opacity: intensity,
                            top: `${top}px`,
                            left: `${left}px`,
                        }}
                    />
                );
            }

            setStars(starElements);
        };

        const getStarCount = (screenWidth: number): number => {
            if (screenWidth < 768) {
                return starConfig.screenSizeStarMultiplier.small;
            } else if (screenWidth < 1200) {
                return starConfig.screenSizeStarMultiplier.medium;
            } else {
                return starConfig.screenSizeStarMultiplier.large;
            }
        };

        const getStarSize = (): string => {
            const random = Math.random();
            if (random < starConfig.smallStarPercentage) {
                return '1px';
            } else if (random < starConfig.smallStarPercentage + starConfig.mediumStarPercentage) {
                return '2px';
            } else {
                return '3px';
            }
        };

        createStars();
        window.addEventListener('resize', createStars);

        return () => window.removeEventListener('resize', createStars);
    }, []);

    return <div className={styles.starBackground}>{stars}</div>;
};

export default StarBackground;
