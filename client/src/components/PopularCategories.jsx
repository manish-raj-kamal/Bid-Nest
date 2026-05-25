import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import CategoryTile from './ui/CategoryTile';

import electronicsImg from '../assets/category_electronics.png';
import vehiclesImg from '../assets/category_vehicles.png';
import realEstateImg from '../assets/category_realestate.png';
import artImg from '../assets/category_art.png';
import jewelryImg from '../assets/category_jewelry.png';
import collectiblesImg from '../assets/category_collectibles.png';

const categories = [
  { name: 'Electronics', image: electronicsImg, itemCount: '12K' },
  { name: 'Vehicles', image: vehiclesImg, itemCount: '890' },
  { name: 'Real Estate', image: realEstateImg, itemCount: '320' },
  { name: 'Art', image: artImg, itemCount: '540' },
  { name: 'Jewelry', image: jewelryImg, itemCount: '760' },
  { name: 'Collectibles', image: collectiblesImg, itemCount: '430' },
];

const PopularCategories = () => {
  return (
    <section id="categories" className="py-20 lg:py-28 bg-gradient-to-b from-transparent via-accent/[0.015] to-transparent">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-12 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-3">
              Browse by Category
            </p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-text-primary tracking-tight">
              Popular Categories
            </h2>
          </motion.div>

          <motion.a
            href="#"
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-dark transition-colors group"
          >
            View all
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </motion.a>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <CategoryTile key={category.name} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;
