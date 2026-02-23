import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Database, Users } from 'lucide-react';

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-[#0B0C10]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/10 dark:from-[#3B82F6]/10 via-transparent to-green-100/10 dark:to-[#00BFA6]/10" />

            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 dark:bg-[#3B82F6]/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-200/20 dark:bg-[#00BFA6]/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 py-32 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-8"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100/5 dark:bg-white/5 backdrop-blur-sm border border-gray-200/10 dark:border-white/10 rounded-full"
                    >
                        <Shield size={16} className="text-green-500 dark:text-[#00BFA6]" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                            Powered by DAPCVRN Technology
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight"
                    >
                        Verified. Decentralized.
                        <br />
                        <span className="bg-gradient-to-r from-blue-500 to-green-400 dark:from-[#3B82F6] dark:to-[#00BFA6] bg-clip-text text-transparent">
                            Empowered.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
                    >
                        Your achievements, forever verified. BOSE transforms how the world verifies, stores, and values skill through blockchain-backed transparency.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-8"
                    >
                        <Link
                            to="/login"
                            className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-green-400 dark:from-[#3B82F6] dark:to-[#00BFA6] text-white rounded-lg font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/50 dark:hover:shadow-[#3B82F6]/50 transition-all duration-300 flex items-center space-x-2"
                        >
                            <span>Get Started</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a
                            href="#how-it-works"
                            className="px-8 py-4 bg-gray-100/5 dark:bg-white/5 backdrop-blur-sm border border-gray-200/10 dark:border-white/10 text-gray-900 dark:text-white rounded-lg font-semibold text-lg hover:bg-gray-200/10 dark:hover:bg-white/10 transition-all duration-300"
                        >
                            Learn More
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 max-w-4xl mx-auto"
                    >
                        {[
                            { icon: Shield, label: 'Blockchain Verified', value: '100%' },
                            { icon: Database, label: 'Credentials Stored', value: '50K+' },
                            { icon: Users, label: 'Active Users', value: '10K+' },
                        ].map((stat, index) => (
                            <div
                                key={index}
                                className="p-6 bg-gray-100/5 dark:bg-white/5 backdrop-blur-sm border border-gray-200/10 dark:border-white/10 rounded-xl hover:bg-gray-200/10 dark:hover:bg-white/10 transition-all duration-300"
                            >
                                <stat.icon size={32} className="text-blue-500 dark:text-[#3B82F6] mx-auto mb-4" />
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</p>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
