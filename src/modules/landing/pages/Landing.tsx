import React from 'react';
import DarkModeToggle from '../../../components/DarkModeToggle';
import HeroSection from '../components/HeroSection';
import FeatureSection from '../components/FeatureSection';
import HowItWorksSection from '../components/HowItWorksSection';
import SDGSection from '../components/SDGSection';
import TestimonialsSection from '../components/TestimonialsSection';
import CTASection from '../components/CTASection';

export default function Landing() {
    return (
        <div className="min-h-screen bg-white dark:bg-[#0B0C10] transition-colors duration-300">
            <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
                <span className="text-gray-800 dark:text-gray-200 text-sm font-medium hidden sm:block">
                    Theme
                </span>
                <DarkModeToggle />
            </div>
            <HeroSection />
            <FeatureSection />
            <HowItWorksSection />
            <SDGSection />
            <TestimonialsSection />
            <CTASection />
        </div>
    );
}
