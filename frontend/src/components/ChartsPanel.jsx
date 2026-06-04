import { ResponsiveContainer, Line, LineChart, Pie, PieChart, Cell, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#f59e0b'];

export default function ChartsPanel({ lineData, pieData }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <motion.section
        whileHover={{ y: -4 }}
        className="rounded-[2rem] border border-white/10 bg-[#11131a]/95 p-6 shadow-glow backdrop-blur-2xl"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Trend</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Medicine intake trend</h3>
          </div>
          <span className="rounded-full bg-slate-800/80 px-3 py-2 text-sm text-slate-200 ring-1 ring-white/10">
            Weekly view
          </span>
        </div>
        <div className="mt-6 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 12, right: 8, left: -14, bottom: 6 }}>
              <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
              <XAxis dataKey="day" stroke="#94a3b8" tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 18,
                  border: '1px solid rgba(148,163,184,0.16)',
                  background: '#0b1120',
                  color: '#f8fafc'
                }}
              />
              <Line type="monotone" dataKey="medicines" stroke="#818cf8" strokeWidth={4} dot={{ r: 4, fill: '#eef2ff' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      <motion.section
        whileHover={{ y: -4 }}
        className="rounded-[2rem] border border-white/10 bg-[#11131a]/95 p-6 shadow-glow backdrop-blur-2xl"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Distribution</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Category share</h3>
          </div>
          <span className="rounded-full bg-slate-800/80 px-3 py-2 text-sm text-slate-200 ring-1 ring-white/10">
            Updated now
          </span>
        </div>
        <div className="mt-6 flex h-[320px] flex-col items-center justify-center gap-6">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={58} outerRadius={90} paddingAngle={4}>
                {pieData.map((entry, index) => (
                  <Cell key={`slice-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 18,
                  border: '1px solid rgba(148,163,184,0.16)',
                  background: '#0b1120',
                  color: '#f8fafc'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid w-full grid-cols-2 gap-4 text-sm text-slate-300">
            {pieData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-3 rounded-3xl bg-white/5 px-4 py-3">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: colors[index] }} />
                <div>
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="text-slate-400">{item.value}% share</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
