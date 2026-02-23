import { motion } from 'framer-motion';
import { Shield, Lock, Zap, Globe, Award, TrendingUp } from 'lucide-react';

export default function FeatureSection() {
  const features = [
    {
      icon: Shield,
      title: 'Blockchain Verification',
      description:
        'Every credential is cryptographically verified and immutably stored on the blockchain, ensuring complete authenticity and preventing fraud.',
    },
    {
      icon: Lock,
      title: 'Decentralized Storage',
      description:
        'Your achievements are stored securely across a distributed network, giving you complete ownership and control over your professional identity.',
    },
    {
      icon: Zap,
      title: 'Instant Recruitment',
      description:
        'Connect with verified opportunities instantly. Recruiters access pre-verified credentials, eliminating delays and accelerating hiring decisions.',
    },
    {
      icon: Globe,
      title: 'Global Accessibility',
      description:
        'Access your verified credentials anywhere, anytime. Break geographical barriers and showcase your skills to the world.',
    },
    {
      icon: Award,
      title: 'Institution Trust',
      description:
        'Universities and institutions issue tamper-proof credentials, building trust and maintaining academic integrity across the ecosystem.',
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description:
        'Track your skill development journey with verified milestones. Build a comprehensive, trustworthy professional portfolio.',
    },
  ];

  return (
    <section className="relative py-32 bg-white dark:bg-[#0B0C10]" id="features">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Three Pillars of
            <span className="bg-gradient-to-r from-[#3B82F6] to-[#00BFA6] bg-clip-text text-transparent">
              {' '}
              Trust
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            BOSE redefines credential management through verification, storage, and recruitment—all powered by blockchain transparency.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative p-8 bg-gradient-to-br from-white/5 to-white/0 dark:from-[#1a202c]/40 dark:to-[#0B0C10]/0 backdrop-blur-sm border border-gray-300 dark:border-white/10 rounded-2xl hover:border-[#3B82F6]/50 hover:shadow-xl hover:shadow-[#3B82F6]/10 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/5 to-[#00BFA6]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-[#3B82F6] to-[#00BFA6] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon size={28} className="text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
