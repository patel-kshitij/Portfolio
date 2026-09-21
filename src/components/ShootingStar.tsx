"use client"

import React, { useEffect, useRef, useState } from 'react';
import shootingStarConfig from '@/config/shootingStarConfig';
import styles from '@/styles/ShootingStar.module.scss';

const ShootingStar: React.FC = () => {
    const [shootingStars, setShootingStars] = useState<React.ReactElement[]>([]);
    // A shooting star is nothing but movement, so visitors who ask for less motion
    // get none at all and no timers run for them (docs/product/site.md, point 6).
    const [wantsMotion, setWantsMotion] = useState(false);
    // Every star ever created gets its own number, so two stars born in the same
    // millisecond can never share a React key.
    const nextKey = useRef(0);

    useEffect(() => {
        const query = window.matchMedia('(prefers-reduced-motion: reduce)');
        const read = () => setWantsMotion(!query.matches);
        read();
        query.addEventListener('change', read);
        return () => query.removeEventListener('change', read);
    }, []);

    useEffect(() => {
        if (!wantsMotion) return;

        // Every timer this effect starts, so all of them can be stopped again.
        // Development mode mounts a component twice; without this the first loop
        // keeps running forever alongside the second one.
        const timers = new Set<ReturnType<typeof setTimeout>>();

        const later = (run: () => void, delayMs: number) => {
            const timer = setTimeout(() => {
                timers.delete(timer);
                run();
            }, delayMs);
            timers.add(timer);
        };

        const createShootingStar = () => {
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const startTop = Math.random() * (screenHeight / 2); // Start at a random height in the upper half of the screen
            const startLeft = screenWidth;
            const endTop = screenHeight;
            const endLeft = 0;

            const angle = Math.atan2(endTop, endLeft - startLeft) * (180 / Math.PI); // Calculate angle for the tail

            const shootingStarElement = (
                <div
                    key={nextKey.current++}
                    className={styles.shootingStarContainer}
                    style={{
                        top: `${startTop}px`,
                        left: `${startLeft}px`,
                        animationDuration: `${shootingStarConfig.speed}s`,
                    }}
                >
                    <div className={styles.shootingStar}/>
                    <div
                        className={styles.shootingStarTail}
                        style={{
                            width: `${shootingStarConfig.trailLength}px`,
                            transform: `rotate(${180 + angle}deg)`,
                        }}
                    />
                </div>
            );

            setShootingStars((prev) => [...prev, shootingStarElement]);

            // Remove shooting star after animation ends
            later(() => {
                setShootingStars((prev) => prev.slice(1));
            }, shootingStarConfig.speed * 1000);
        };

        const generateShootingStar = () => {
            createShootingStar();
            const nextStarDelay =
                shootingStarConfig.frequencySeconds * 1000 +
                Math.random() * shootingStarConfig.frequencyRandomness * 1000;
            later(generateShootingStar, nextStarDelay);
        };

        generateShootingStar();

        return () => {
            for (const timer of timers) clearTimeout(timer);
            timers.clear();
            // Stars already on screen would otherwise stay forever: their own
            // removal timer has just been cleared.
            setShootingStars([]);
        };
    }, [wantsMotion]);

    return <div className={styles.shootingStarContainerWrapper}>{shootingStars}</div>;
};

export default ShootingStar;
