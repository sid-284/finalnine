/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
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
        border: "var(--color-border)", /* light-gray */
        input: "var(--color-input)", /* white */
        ring: "var(--color-ring)", /* sage-green */
        background: "var(--color-background)", /* warm-white */
        foreground: "var(--color-foreground)", /* rich-black */
        primary: {
          DEFAULT: "var(--color-primary)", /* sophisticated-charcoal */
          foreground: "var(--color-primary-foreground)", /* white */
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", /* refined-gray */
          foreground: "var(--color-secondary-foreground)", /* white */
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", /* red */
          foreground: "var(--color-destructive-foreground)", /* white */
        },
        muted: {
          DEFAULT: "var(--color-muted)", /* subtle-gray */
          foreground: "var(--color-muted-foreground)", /* medium-gray */
        },
        accent: {
          DEFAULT: "var(--color-accent)", /* sage-green */
          foreground: "var(--color-accent-foreground)", /* white */
        },
        popover: {
          DEFAULT: "var(--color-popover)", /* pure-white */
          foreground: "var(--color-popover-foreground)", /* rich-black */
        },
        card: {
          DEFAULT: "var(--color-card)", /* pure-white */
          foreground: "var(--color-card-foreground)", /* rich-black */
        },
        success: {
          DEFAULT: "var(--color-success)", /* sage-green */
          foreground: "var(--color-success-foreground)", /* white */
        },
        warning: {
          DEFAULT: "var(--color-warning)", /* amber */
          foreground: "var(--color-warning-foreground)", /* white */
        },
        error: {
          DEFAULT: "var(--color-error)", /* red */
          foreground: "var(--color-error-foreground)", /* white */
        },
        surface: "var(--color-surface)", /* subtle-depth */
        // Updated pastel colors to complement the new sage green theme
        pastelPink: '#FFD1DC',
        pastelYellow: '#FFFACD',
        pastelBlue: '#B5E3FF',
        pastelGreen: '#C1F7C7',
        pastelPurple: '#E0BBE4',
        pastelSage: '#B8C9A8', // New sage pastel to complement the main color
        brand: '#92b174', // Direct access to the brand color
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        "3xl": "var(--radius-3xl)",
        full: "var(--radius-full)",
        'xl': '1.5rem',
        '2xl': '2rem',
        'cute': '1.25rem',
      },
      fontFamily: {
        sans: ["Gruppo", "ui-sans-serif", "system-ui"],
        serif: ["Gruppo", "Georgia", "serif"],
        display: ["Gruppo", "ui-sans-serif", "system-ui"],
        italic: ["Gruppo", "Georgia", "serif"],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        'fluid-sm': 'clamp(0.875rem, 2vw, 1rem)',
        'fluid-base': 'clamp(1rem, 2.5vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 3vw, 1.25rem)',
        'fluid-xl': 'clamp(1.25rem, 3.5vw, 1.5rem)',
        'fluid-2xl': 'clamp(1.5rem, 4vw, 2rem)',
        'fluid-3xl': 'clamp(1.875rem, 4.5vw, 2.5rem)',
        'fluid-4xl': 'clamp(2.25rem, 5vw, 3rem)',
        'fluid-5xl': 'clamp(3rem, 6vw, 4rem)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'DEFAULT': 'var(--shadow-md)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        'inner': 'var(--shadow-inner)',
        'none': 'var(--shadow-none)',
        'card': 'var(--elevation-card)',
        'modal': 'var(--elevation-modal)',
        'sage': '0 4px 24px 0 rgba(146, 177, 116, 0.15)', // Updated to use the new sage green color
        'brand': '0 4px 24px 0 rgba(146, 177, 116, 0.15)', // Brand shadow with the new color
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "shimmer": "shimmer 2s linear infinite",
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
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      backdropBlur: {
        'luxury': '8px',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      gridTemplateColumns: {
        'masonry': 'repeat(auto-fill, minmax(280px, 1fr))',
      },
      aspectRatio: {
        'product': '3/4',
        'hero': '16/9',
        'square': '1/1',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}
