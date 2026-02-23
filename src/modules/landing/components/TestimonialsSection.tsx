import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export default function TestimonialsSection() {
    const testimonials = [
        {
            name: 'Sarah Chen',
            role: 'Computer Science Graduate',
            institution: 'Stanford University',
            avatar: 'SC',
            rating: 5,
            text: 'BOSE gave me complete control over my academic credentials. Landing my dream job was seamless thanks to instant verification.',
        },
        {
            name: 'Dr. Michael Roberts',
            role: 'Dean of Admissions',
            institution: 'MIT',
            avatar: 'MR',
            rating: 5,
            text: 'The transparency and security BOSE provides has revolutionized how we issue and verify credentials. A game-changer for academic integrity.',
        },
        {
            name: 'Emily Thompson',
            role: 'Senior Recruiter',
            institution: 'Google',
            avatar: 'ET',
            rating: 5,
            text: 'BOSE eliminated weeks of verification delays. We can now hire top talent faster with complete confidence in their credentials.',
        },
    ];

    const stats = [
        { value: '98%', label: 'Verification Accuracy' },
        { value: '10K+', label: 'Verified Credentials' },
        { value: '50+', label: 'Partner Institutions' },
        { value: '95%', label: 'User Satisfaction' },
    ];

    return (
        <section className="relative py-32 bg-white dark:bg-[#0B0C10]">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        Trusted by
                        <span className="bg-gradient-to-r from-blue-500 to-green-400 dark:from-[#3B82F6] dark:to-[#00BFA6] bg-clip-text text-transparent">
                            {' '}
                            Thousands
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Students, institutions, and recruiters worldwide rely on BOSE for verified credentials.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative p-8 bg-gradient-to-br from-white/5 to-white/0 dark:from-[#0F1115]/5 dark:to-[#0B0C10]/0 backdrop-blur-sm border border-white/10 dark:border-[#0F1115]/10 rounded-2xl hover:border-[#3B82F6]/50 transition-all duration-300"
                        >
                            <Quote size={40} className="text-[#3B82F6]/30 mb-6" />

                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{testimonial.text}</p>

                            <div className="flex items-center mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} size={16} className="text-[#00BFA6] fill-current" />
                                ))}
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#3B82F6] to-[#00BFA6] rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold">{testimonial.avatar}</span>
                                </div>
                                <div>
                                    <p className="text-white font-semibold">{testimonial.name}</p>
                                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                                    <p className="text-gray-500 text-xs">{testimonial.institution}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8"
                >
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="text-center p-6 bg-white/5 dark:bg-[#0F1115]/5 backdrop-blur-sm border border-white/10 dark:border-[#0F1115]/10 rounded-xl"
                        >
                            <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</p>
                            <p className="text-gray-400 dark:text-gray-500 text-sm">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
