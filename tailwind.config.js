/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Updated Colors - Blue #0388fc and White #FFFFFF
        'coventry-blue': '#0388fc',
        'coventry-white': '#FFFFFF',
        
        border: "#e2e8f0",
        input: "#f8fafc",
        ring: "#0388fc",
        background: "#FFFFFF",
        foreground: "#0388fc",
        primary: {
          DEFAULT: "#0388fc", // New Blue
          foreground: "#FFFFFF", // White
        },
        secondary: {
          DEFAULT: "#f8fafc",
          foreground: "#0388fc",
        },
        destructive: {
          DEFAULT: "#dc2626",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#f1f5f9",
          foreground: "#64748b",
        },
        accent: {
          DEFAULT: "#f8fafc",
          foreground: "#0388fc",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#0388fc",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#0388fc",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "confetti": {
          "0%": { transform: "rotateZ(0deg)" },
          "100%": { transform: "rotateZ(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 3s ease-in-out infinite",
        "confetti": "confetti 3s linear infinite",
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0388fc 0%, #0ea5e9 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        'gradient-accent': 'linear-gradient(135deg, #0388fc 0%, #FFFFFF 100%)',
      },
      boxShadow: {
        'primary': '0 4px 14px 0 rgba(3, 136, 252, 0.3)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'badge': '0 8px 25px -5px rgba(3, 136, 252, 0.4)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

