export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        '0B0C10': '#0B0C10',
        '1F2833': '#1F2833',
        '45A29E': '#45A29E',
        '66FCF1': '#66FCF1',
        'C5C6C7': '#C5C6C7',
        '3B82F6': '#3B82F6',
        '00BFA6': '#00BFA6',
        '10B981': '#10B981',
        // If you use white5, white10, white20, etc.
        white5: 'rgba(255,255,255,0.05)',
        white10: 'rgba(255,255,255,0.10)',
        white20: 'rgba(255,255,255,0.20)',
      }
    }
  },
  plugins: [],
}
