import { motion } from 'framer-motion';

const CategoryTile = ({ category, index = 0 }) => {
  const { name, image, itemCount } = category;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -6 }}
      className="group flex flex-col items-center gap-4 p-6 bg-white rounded-2xl border border-border hover:border-accent/20 shadow-soft hover:shadow-soft-md transition-all duration-500 cursor-pointer"
    >
      <div className="w-20 h-20 rounded-2xl bg-bg-primary flex items-center justify-center overflow-hidden group-hover:bg-accent-light transition-colors duration-500">
        <img
          src={image}
          alt={name}
          className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-text-primary text-sm group-hover:text-accent transition-colors duration-300">
          {name}
        </h3>
        <p className="text-xs text-text-secondary mt-1">{itemCount} Items</p>
      </div>
    </motion.div>
  );
};

export default CategoryTile;
