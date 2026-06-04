import { Activity, Layers, Factory, DollarSign } from 'lucide-react';

export const overviewStats = [
  {
    label: 'Total Medicines',
    value: '1,240',
    description: 'All registered products across verified suppliers.',
    icon: Activity
  },
  {
    label: 'Active Categories',
    value: '18',
    description: 'Categorized medicine groups with live compliance data.',
    icon: Layers
  },
  {
    label: 'Manufacturers',
    value: '52',
    description: 'Trusted suppliers and producers available in the system.',
    icon: Factory
  },
  {
    label: 'Avg. Price',
    value: '₹298.40',
    description: 'Average retail price across popular medicine batches.',
    icon: DollarSign
  }
];

export const lineData = [
  { day: 'Mon', medicines: 812 },
  { day: 'Tue', medicines: 945 },
  { day: 'Wed', medicines: 1020 },
  { day: 'Thu', medicines: 1180 },
  { day: 'Fri', medicines: 1345 },
  { day: 'Sat', medicines: 1270 },
  { day: 'Sun', medicines: 1435 }
];

export const pieData = [
  { name: 'Antibiotics', value: 31 },
  { name: 'Analgesics', value: 23 },
  { name: 'Vitamins', value: 18 },
  { name: 'Antivirals', value: 12 },
  { name: 'Others', value: 16 }
];

export const categoryProgress = [
  {
    label: 'Antibiotics',
    percentage: 89,
    tag: 'High',
    gradient: 'bg-gradient-to-r from-indigo-500 to-purple-500',
    colorClass: 'bg-violet-500/15 text-violet-200'
  },
  {
    label: 'Analgesics',
    percentage: 74,
    tag: 'Stable',
    gradient: 'bg-gradient-to-r from-emerald-400 to-teal-400',
    colorClass: 'bg-emerald-500/15 text-emerald-200'
  },
  {
    label: 'Vitamins',
    percentage: 62,
    tag: 'Growing',
    gradient: 'bg-gradient-to-r from-sky-400 to-cyan-400',
    colorClass: 'bg-sky-500/15 text-sky-200'
  },
  {
    label: 'Antivirals',
    percentage: 48,
    tag: 'Watch',
    gradient: 'bg-gradient-to-r from-amber-400 to-orange-400',
    colorClass: 'bg-amber-500/15 text-amber-200'
  }
];
