export interface StarConfig {
    smallStarPercentage: number;
    mediumStarPercentage: number;
    largeStarPercentage: number;
    colors: string[];
    screenSizeStarMultiplier: {
        small: number;
        medium: number;
        large: number;
    };
    blinkingStarPercentage: number;
}

const starConfig: StarConfig = {
    smallStarPercentage: 0.8,
    mediumStarPercentage: 0.15,
    largeStarPercentage: 0.05,
    colors: ["#ffffff", "#f4e99b"], // 90% White and 10% yellowish tint
    screenSizeStarMultiplier: {
        small: 100,  // Smaller screens have more stars
        medium: 300, // Medium screens have even more stars
        large: 600,  // Larger screens have the most stars
    },
    blinkingStarPercentage: 0.5, // 3% of the stars will blink
};

export default starConfig;