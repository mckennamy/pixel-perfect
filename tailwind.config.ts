import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        body: ["EB Garamond", "Georgia", "serif"],
        kicker: ["Cinzel", "serif"],
        script: ["Great Vibes", "cursive"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        burg: {
          DEFAULT: "hsl(var(--burg))",
          mid: "hsl(var(--burg-mid))",
          light: "hsl(var(--burg-light))",
          pale: "hsl(var(--burg-pale))",
          tint: "hsl(var(--burg-tint))",
        },
        chartreuse: {
          DEFAULT: "hsl(var(--chartreuse))",
          mid: "hsl(var(--chartreuse-mid))",
          dark: "hsl(var(--chartreuse-dark))",
          pale: "hsl(var(--chartreuse-pale))",
        },
        olive: {
          DEFAULT: "hsl(var(--olive))",
          light: "hsl(var(--olive-light))",
          dark: "hsl(var(--olive-dark))",
        },
        moss: {
          DEFAULT: "hsl(var(--moss))",
          light: "hsl(var(--moss-light))",
          dark: "hsl(var(--moss-dark))",
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          light: "hsl(var(--gold-light))",
          pale: "hsl(var(--gold-pale))",
        },
        ink: {
          DEFAULT: "hsl(var(--ink))",
          mid: "hsl(var(--ink-mid))",
          light: "hsl(var(--ink-light))",
        },
        parchment: {
          DEFAULT: "hsl(var(--parchment))",
          d: "hsl(var(--parchment-d))",
        },
        cream: "hsl(var(--cream))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
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
        "envelope-float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "invitation-reveal": {
          "0%": { opacity: "0", transform: "scale(0.9) translateY(20px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "seal-pulse": {
          "0%, 100%": { opacity: "0.85", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.06)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "envelope-float": "envelope-float 3.5s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.7s ease-out forwards",
        "invitation-reveal": "invitation-reveal 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "seal-pulse": "seal-pulse 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
