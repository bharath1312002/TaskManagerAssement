/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#1E40AF',
        pending: '#F59E0B',
        inprogress: '#3B82F6',
        completed: '#10B981',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
} 