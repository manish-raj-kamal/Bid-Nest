import { motion } from 'framer-motion';
import { UserPlus, Search, Trophy } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    number: '01',
    title: 'Create Account',
    description: 'Register for free and set up your profile to start your auction journey.',
  },
  {
    icon: Search,
    number: '02',
    title: 'Browse & Bid',
    description: 'Explore curated auctions across categories and place your bids in real time.',
  },
  {
    icon: Trophy,
    number: '03',
    title: 'Win & Collect',
    description: 'Win auctions and receive your premium items with secure, insured delivery.',
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-20"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-3">
            Simple Process
          </p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-text-primary tracking-tight">
            How It Works
          </h2>
          <p className="mt-4 text-text-secondary max-w-lg mx-auto">
            Get started in minutes with our streamlined three-step process.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative group"
              >
                <div className="bg-white rounded-3xl p-8 lg:p-10 border border-border shadow-soft hover:shadow-soft-md transition-all duration-500 h-full">
                  {/* Step Number */}
                  <span className="text-5xl font-extrabold text-accent/10 absolute top-6 right-8 select-none">
                    {step.number}
                  </span>

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-accent-light flex items-center justify-center mb-6 group-hover:bg-accent group-hover:shadow-soft-md transition-all duration-500">
                    <Icon className="w-6 h-6 text-accent group-hover:text-white transition-colors duration-500" />
                  </div>

                  <h3 className="text-lg font-bold text-text-primary mb-3">{step.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{step.description}</p>
                </div>

                {/* Connector line (hidden on last item and mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 lg:-right-6 w-8 lg:w-12 h-[2px] bg-gradient-to-r from-border to-transparent" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
