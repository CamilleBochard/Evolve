// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import react from '@astrojs/react';

const FONTS_DIRECTORY = './src/assets/fonts';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Epilogue',
      cssVariable: '--font-epilogue',
      fallbacks: ['sans-serif'],
      options: {
        variants: [
          {
            weight: '100 900',
            style: 'normal',
            src: [`${FONTS_DIRECTORY}/Epilogue-VariableFont_wght.woff2`],
          },
          {
            weight: '100 900',
            style: 'italic',
            src: [`${FONTS_DIRECTORY}/Epilogue-Italic-VariableFont_wght.woff2`],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Plus Jakarta Sans',
      cssVariable: '--font-plus-jakarta-sans',
      fallbacks: ['sans-serif'],
      options: {
        variants: [
          {
            weight: '200 800',
            style: 'normal',
            src: [`${FONTS_DIRECTORY}/PlusJakartaSans-VariableFont_wght.woff2`],
          },
          {
            weight: '200 800',
            style: 'italic',
            src: [
              `${FONTS_DIRECTORY}/PlusJakartaSans-Italic-VariableFont_wght.woff2`,
            ],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Syne',
      cssVariable: '--font-syne',
      fallbacks: ['sans-serif'],
      options: {
        variants: [
          {
            weight: '400 800',
            style: 'normal',
            src: [`${FONTS_DIRECTORY}/Syne-VariableFont_wght.woff2`],
          },
        ],
      },
    },
  ],
});
