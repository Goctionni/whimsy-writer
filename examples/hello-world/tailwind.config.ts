import type { Config } from 'tailwindcss';
import typographyPlugin from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{ts,tsx,html}', '../../node_modules/whimsy-writer/dist/**/*.js'],
  theme: {
    extend: {},
  },
  plugins: [typographyPlugin],
} satisfies Config;
