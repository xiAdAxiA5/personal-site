import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { time: '睡眠', hours: 8, color: '#6366f1' },
  { time: '工作', hours: 8, color: '#06b6d4' },
  { time: '学习', hours: 3, color: '#8b5cf6' },
  { time: '运动', hours: 1, color: '#10b981' },
  { time: '娱乐', hours: 2, color: '#f59e0b' },
  { time: '社交', hours: 1, color: '#ef4444' },
  { time: '其他', hours: 1, color: '#6b7280' },
];

const total = data.reduce((s, d) => s + d.hours, 0);

export default function LifeTimeChart() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-4"
        >
          生命时间图
        </motion.h2>
        <p className="text-center text-gray-400 dark:text-gray-500 mb-12">每天24小时的时间分配</p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-100 dark:border-border-dark"
        >
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  backgroundColor: 'rgba(255,255,255,0.95)',
                }}
              />
              <Area
                type="monotone"
                dataKey="hours"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#colorGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {data.map((d) => (
              <div key={d.time} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-gray-500 dark:text-gray-400">{d.time}</span>
                <span className="font-medium dark:text-white">{Math.round((d.hours / total) * 100)}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
