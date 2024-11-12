export interface ShootingStarConfig {
    frequencySeconds: number;
    speed: number;
    trailLength: number;
    frequencyRandomness: number; // Adjusts the randomness in the frequency
}

const shootingStarConfig: ShootingStarConfig = {
    frequencySeconds: 15,
    speed: 200, // Fixed speed for shooting star, 20 seconds
    trailLength: 20, // Length of the trail, configurable
    frequencyRandomness: 5, // Randomness in the range of +/-5 seconds
};

export default shootingStarConfig;