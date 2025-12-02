/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 主色调 - 水墨灰
        primary: {
          DEFAULT: '#2c3e50',
          light: '#3d5a73',
          dark: '#1a252f',
        },
        // 强调色 - 朱砂红
        accent: {
          DEFAULT: '#c0392b',
          light: '#e74c3c',
        },
        // 辅助色 - 青瓷绿
        secondary: '#16a085',
        // 背景色
        bg: {
          page: '#f8f9fa',
          card: '#ffffff',
          hover: '#f1f3f4',
          active: '#e8eaed',
        },
        // 文字色
        text: {
          primary: '#1f2937',
          secondary: '#4b5563',
          tertiary: '#9ca3af',
        },
        // 边框色
        border: {
          DEFAULT: '#e5e7eb',
          light: '#f3f4f6',
        },
      },
      fontFamily: {
        sans: ['"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        poetry: ['"LXGW WenKai"', '"楷体"', '"STKaiti"', '"KaiTi"', 'serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', '"SF Mono"', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
