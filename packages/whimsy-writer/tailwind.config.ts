import type { Config } from 'tailwindcss';
import typographyPlugin from '@tailwindcss/typography';

export default {
  content: ['./src/lib/**/*.{ts,tsx,html}'],
  theme: {
    extend: {},
  },
  plugins: [typographyPlugin],
} satisfies Config;
