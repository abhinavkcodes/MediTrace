import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 20px 80px rgba(99, 102, 241, 0.18)'
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at top, rgba(99, 102, 241, 0.14), transparent 32%), radial-gradient(circle at bottom right, rgba(16, 185, 129, 0.08), transparent 24%)'
      },
      colors: {
        surface: '#15161a',
        surface2: '#1f2026',
        surface3: '#272933',
        text: '#f8fafc',
        muted: '#9ca3af'
      }
    }
  },
  plugins: [forms]
};
