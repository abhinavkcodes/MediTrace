import { motion } from 'framer-motion';

export default function StatGrid({ stats }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
      {stats.map((stat) => (
        <motion.article
          key={stat.label}
          whileHover={{ y: -5 }}
          className="group rounded-[2rem] border border-white/10 bg-[#11131a]/95 p-6 shadow-glow backdrop-blur-2xl transition duration-300"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
              <p className="mt-4 text-4xl font-semibold text-white">{stat.value}</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500/15 to-emerald-500/10 text-indigo-200 shadow-sm shadow-indigo-500/10">
              <stat.icon className="h-7 w-7" />
            </div>
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-400">{stat.description}</p>
        </motion.article>
      ))}
    </div>
  );
}
