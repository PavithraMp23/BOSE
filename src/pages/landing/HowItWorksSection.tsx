import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Upload, CheckCircle, Briefcase } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      icon: Upload,
      title: 'Upload',
      description: 'Students and institutions upload credentials to the BOSE platform securely.',
      color: 'from-[#3B82F6] to-[#00BFA6]',
    },
    {
      icon: CheckCircle,
      title: 'Verify',
      description: 'Blockchain technology validates authenticity, creating an immutable record.',
      color: 'from-[#00BFA6] to-[#10B981]',
    },
    {
      icon: Briefcase,
      title: 'Connect',
      description: 'Recruiters access verified talent, accelerating trust-first hiring decisions.',
      color: 'from-[#10B981] to-[#3B82F6]',
    },
  ];

  return (
    <section className="relative py-32 bg-white dark:bg-[#0B0C10]" id="how-it-works">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            How It
            <span className="bg-gradient-to-r from-blue-500 to-green-400 dark:from-[#3B82F6] dark:to-[#00BFA6] bg-clip-text text-transparent">
              {' '}
              Works
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Three simple steps to transform your credentials into verified proof of excellence.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 dark:from-[#3B82F6] via-green-200 dark:via-[#00BFA6] to-green-100 dark:to-[#10B981] transform -translate-y-1/2 opacity-20" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="relative">
                    <div className={`w-24 h-24 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-xl shadow-[#3B82F6]/20 group-hover:scale-110 transition-transform duration-300`}>
                      <step.icon size={40} className="text-white" />
                    </div>
                    <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-white dark:bg-[#0B0C10] border-2 border-blue-500 dark:border-[#3B82F6] rounded-full flex items-center justify-center font-bold text-gray-900 dark:text-white">
                      {index + 1}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs mx-auto">
                      {step.description}
                    </p>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-1 bg-gradient-to-r from-blue-200 dark:from-[#3B82F6] to-green-100 dark:to-[#00BFA6] opacity-20 transform -translate-x-12" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link
            to="/login"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-green-400 dark:from-[#3B82F6] dark:to-[#00BFA6] text-white rounded-lg font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/50 dark:hover:shadow-[#3B82F6]/50 transition-all duration-300"
          >
            Start Your Journey
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
