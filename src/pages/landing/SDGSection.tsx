import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Lightbulb } from 'lucide-react';

export default function SDGSection() {
  const sdgs = [
    {
      icon: GraduationCap,
      number: 'SDG 4',
      title: 'Quality Education',
      description:
        'Ensuring inclusive and equitable quality education through transparent credential verification and accessible learning records.',
      color: 'from-[#C5192D] to-[#E74C3C]',
    },
    {
      icon: Briefcase,
      number: 'SDG 8',
      title: 'Decent Work',
      description:
        'Promoting sustained, inclusive economic growth and productive employment by connecting verified talent with opportunities.',
      color: 'from-[#A21942] to-[#C2185B]',
    },
    {
      icon: Lightbulb,
      number: 'SDG 9',
      title: 'Innovation & Infrastructure',
      description:
        'Building resilient infrastructure and fostering innovation through blockchain-powered decentralized systems.',
      color: 'from-[#FD6925] to-[#FF9800]',
    },
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
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100/5 dark:bg-white/5 backdrop-blur-sm border border-gray-200/10 dark:border-white/10 rounded-full mb-6">
            <span className="text-green-500 dark:text-[#00BFA6] text-sm font-semibold">UN Sustainable Development Goals</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Building a
            <span className="bg-gradient-to-r from-blue-500 to-green-400 dark:from-[#3B82F6] dark:to-[#00BFA6] bg-clip-text text-transparent">
              {' '}
              Better Future
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            BOSE aligns with the United Nations' vision for global progress, leveraging technology to create equitable access to opportunity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sdgs.map((sdg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden"
            >
              <div className="relative p-8 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-white/20 transition-all duration-300 h-full">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${sdg.color} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />

                <div className="relative">
                  <div className={`w-16 h-16 bg-gradient-to-br ${sdg.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <sdg.icon size={32} className="text-white" />
                  </div>

                  <div className="inline-block px-3 py-1 bg-white/10 rounded-full mb-4">
                    <span className="text-sm font-bold text-white">{sdg.number}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4">{sdg.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{sdg.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 p-8 bg-gradient-to-r from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl"
        >
          <p className="text-center text-gray-300 text-lg">
            By ensuring verified credentials and transparent hiring, BOSE contributes to reducing inequality and fostering global collaboration for sustainable development.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
