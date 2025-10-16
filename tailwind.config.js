// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background-primary': '#F5F5F5',    // Branco Suave
        'background-secondary': '#FFFFFF', // Branco para Cards/Modais
        'text-primary': '#2D3748',          // Cinza Escuro
        'text-secondary': '#718096',        // Cinza Médio
        'brand-primary': '#288cfa',         // Azul Confiante
        'brand-primary-hover': '#1A75D3',   // Azul mais escuro para hover
        'status-success': '#2E865F',        // Verde Crescimento
        'status-danger': '#E53E3E',         // Vermelho Urgente
      },
      fontFamily: {
        sans: ['Source Sans Pro', 'sans-serif'], // Fonte para corpo de texto
        display: ['Raleway', 'sans-serif'],     // Fonte para títulos
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.3s ease-out',
      },
      keyframes: {
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}