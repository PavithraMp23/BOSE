import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Building, UserCheck } from 'lucide-react';

export default function CTASection() {
    const roles = [
        {
            icon: Users,
            title: 'Student',
            description: 'Store and share verified credentials',
            href: '/login?role=student',
        },
        {
            icon: Building,
            title: 'Institution',
            description: 'Issue blockchain-verified credentials',
            href: '/login?role=institution',
        },
        {
            icon: UserCheck,
            title: 'Recruiter',
            description: 'Access pre-verified talent instantly',
            href: '/login?role=recruiter',
        },
    ];

    return (
        <section className="relative py-32 bg-white dark:bg-[#0B0C10] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/20 via-transparent to-[#00BFA6]/20 dark:from-[#3B82F6]/10 dark:via-transparent dark:to-[#00BFA6]/10" />

            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-[#3B82F6]/10 dark:bg-[#3B82F6]/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="relative max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        Ready to
                        <span className="bg-gradient-to-r from-[#3B82F6] to-[#00BFA6] bg-clip-text text-transparent">
                            {' '}
                            Get Started?
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Join thousands of students, institutions, and recruiters building the future of verified credentials.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {roles.map((role, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Link
                                to={role.href}
                                className="group relative block p-8 bg-gradient-to-br from-white/5 to-white/0 dark:from-[#0B0C10]/5 dark:to-[#0B0C10]/0 backdrop-blur-sm border border-white/10 dark:border-[#0B0C10]/10 rounded-2xl hover:border-[#3B82F6]/50 hover:shadow-2xl hover:shadow-[#3B82F6]/20 transition-all duration-300 text-center h-full"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-[#3B82F6] to-[#00BFA6] rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <role.icon size={32} className="text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{role.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">{role.description}</p>
                                <div className="flex items-center justify-center space-x-2 text-[#3B82F6] group-hover:text-[#00BFA6] transition-colors duration-300">
                                    <span className="font-semibold">Join Now</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Not sure which role fits you?
                    </p>
                    <Link
                        to="/about"
                        className="inline-flex items-center px-6 py-3 bg-white/5 dark:bg-[#0B0C10]/5 backdrop-blur-sm border border-white/10 dark:border-[#0B0C10]/10 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-white/10 dark:hover:bg-[#0B0C10]/10 transition-all duration-300"
                    >
                        Learn More About BOSE
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
