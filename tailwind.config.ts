import type { Config } from 'tailwindcss';

import aspectRatio from '@tailwindcss/aspect-ratio';
import tailwindForms from '@tailwindcss/forms';
import tailwindPlugin from 'tailwindcss/plugin';

const config: Config = {
  mode: `jit`,
  darkMode: `class`, // or 'media' or 'class'
  content: [
    `./src/pages/**/*.{js,ts,jsx,tsx,mdx}`,
    `./src/components/**/*.{js,ts,jsx,tsx,mdx}`,
    `./src/app/**/*.{js,ts,jsx,tsx,mdx}`,
    /// thirdweb package
    `thirdweb/react/**/*.{js,ts,jsx,tsx,mdx}`,
    `./node_modules/thirdweb/react/**/*.{js,ts,jsx,tsx,mdx}`,
  ],
  theme: {
    extend: {
      aspectRatio: {
        17: `17`,
        18: `18`,
        19: `19`,
        20: `20`,
        21: `21`,
      },
      colors: {
        'azure-blue': `#4A83F7`,
        'azure-blue-lighter': `#59689B`,
        'azure-blue-darker': `#1638B3`,
        'bright-blue': `#0384FC`,
        'bright-white': `#D0CECE`,
        'fade-red': `#FF5252`,
        'fade-white': `#B2B2B2`,
        'jet-black': `#141415`,
      },
      container: {
        center: true,
        padding: {
          DEFAULT: `1rem`,
          lg: `2rem`,
        },
      },
      fontFamily: {
        neometric: [`var(--font-neometric)`],
        'neometric-alt': [`var(--font-neometric-alt)`],
        montserrat: [`var(--font-montserrat)`],
        'montserrat-alt': [`var(--font-montserrat-alt)`],
        cyberbang: [`var(--font-cyberbang)`],
      },
    },
  },
  variants: {
    extend: {},
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    aspectRatio,
    tailwindForms({
      strategy: `class`,
    }),
    tailwindPlugin(({ addUtilities, addVariant }) => {
      addVariant(`hocus`, [`&:hover`, `&:focus`]);
      addVariant(`hoctive`, [`&:hover`, `&:active`]);
      addVariant(`foctive`, [`&:focus`, `&:active`]);
      addVariant(`hocustive`, [`&:hover`, `&:focus`, `&:active`]);

      addVariant(`mobile-menu-open`, [
        `&.mobile-menu-open`,
        `.mobile-menu-open &`,
      ]);

      addUtilities({ '.rich-text': {} });
    }),
  ],
};

export default config;
