import { motion } from 'framer-motion';
import { travelPlaces } from '../../data/travel';
import { MapPin } from 'lucide-react';

const springGentle = { type: 'spring' as const, stiffness: 170, damping: 28, mass: 1 };

export default function TravelMap() {
  return (
    <section className="py-20 px-4 bg-gray-50/50 dark:bg-gray-900/30 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={springGentle}
          className="text-3xl md:text-4xl font-bold text-center mb-4"
        >
          去过的地方
        </motion.h2>
        <p className="text-center text-gray-400 dark:text-gray-500 mb-12">在世界各地留下的足迹</p>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={springGentle}
          className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-border-dark overflow-hidden p-1"
        >
          <div className="relative w-full h-[400px] bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden">
            <svg viewBox="0 0 1000 500" className="w-full h-full opacity-20 dark:opacity-30">
              <circle cx="200" cy="150" r="3" fill="#6366f1" />
              <circle cx="220" cy="145" r="3" fill="#6366f1" />
              <circle cx="240" cy="140" r="3" fill="#6366f1" />
              <circle cx="180" cy="160" r="3" fill="#6366f1" />
              <circle cx="500" cy="120" r="3" fill="#6366f1" />
              <circle cx="520" cy="115" r="3" fill="#6366f1" />
              <circle cx="480" cy="130" r="3" fill="#6366f1" />
              <circle cx="800" cy="100" r="3" fill="#6366f1" />
              <circle cx="780" cy="110" r="3" fill="#6366f1" />
              <circle cx="300" cy="200" r="3" fill="#6366f1" />
              <circle cx="350" cy="250" r="3" fill="#6366f1" />
              <circle cx="600" cy="300" r="3" fill="#6366f1" />
              <circle cx="700" cy="200" r="3" fill="#6366f1" />
              <circle cx="150" cy="280" r="3" fill="#6366f1" />
              <circle cx="400" cy="350" r="3" fill="#6366f1" />
              <circle cx="550" cy="180" r="3" fill="#6366f1" />
              <circle cx="650" cy="150" r="3" fill="#6366f1" />
              <circle cx="750" cy="350" r="3" fill="#6366f1" />
              <circle cx="850" cy="250" r="3" fill="#6366f1" />
              <circle cx="100" cy="200" r="3" fill="#6366f1" />
              <circle cx="900" cy="180" r="3" fill="#6366f1" />
              <circle cx="450" cy="280" r="3" fill="#6366f1" />
              <circle cx="250" cy="320" r="3" fill="#6366f1" />
              <circle cx="680" cy="380" r="3" fill="#6366f1" />
            </svg>

            {travelPlaces.map((place, i) => {
              const x = ((place.lng + 180) / 360) * 100;
              const y = ((90 - place.lat) / 180) * 100;
              return (
                <div
                  key={place.id}
                  className="absolute group cursor-pointer"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ ...springGentle, delay: i * 0.1 }}
                  >
                    <MapPin size={20} className="text-primary hover:text-accent transition-colors fill-primary/30" />
                  </motion.div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-1.5 whitespace-nowrap shadow-lg">
                      <div className="font-medium">{place.name}</div>
                      <div className="text-gray-300 text-[10px]">{place.description}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {travelPlaces.map((place) => (
            <motion.span
              key={place.id}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="px-4 py-2 rounded-full text-sm bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-border-dark text-gray-600 dark:text-gray-300 hover:border-primary/30 transition-colors cursor-pointer"
            >
              📍 {place.name}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
