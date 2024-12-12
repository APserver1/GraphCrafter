import React from 'react';
import { motion } from 'framer-motion';
import { ParsedData } from '../types/DataTypes';

interface BarChartProps {
  data: ParsedData | null;
  currentIndex: number;
}

export const BarChart: React.FC<BarChartProps> = ({ data, currentIndex }) => {
  if (!data) return null;

  const sortedData = [...data.data].sort(
    (a, b) => b.values[currentIndex] - a.values[currentIndex]
  );

  const maxValue = Math.max(...sortedData.map(item => item.values[currentIndex]));

  return (
    <div className="h-[600px] w-full p-4">
      {sortedData.map((item, index) => (
        <motion.div
          key={item.label}
          className="flex items-center mb-4"
          initial={{ y: 0 }}
          animate={{ y: index * 60 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={item.image}
            alt={item.label}
            className="w-10 h-10 rounded-full mr-2"
          />
          <div className="flex-1">
            <motion.div
              className="h-12 rounded-r-lg"
              style={{ backgroundColor: item.color }}
              initial={{ width: 0 }}
              animate={{
                width: `${(item.values[currentIndex] / maxValue) * 100}%`
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="ml-2 w-20 text-right font-bold">
            {item.values[currentIndex].toLocaleString()}
          </div>
        </motion.div>
      ))}
    </div>
  );
}