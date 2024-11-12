import React from 'react';
import StarBackground from '@/components/StarBackground';
import ShootingStar from "@/components/ShootingStar";

const HomePage: React.FC = () => {
    return (
        <>
            <StarBackground />
            <ShootingStar />
            <div>
                <h1>Hi! I&#39;m Kshitij Patel</h1>
                {/* Add your other homepage content here */}
            </div>
        </>
    );
};

export default HomePage;