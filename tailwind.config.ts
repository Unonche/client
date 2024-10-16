import { join } from 'path'
import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { skeleton } from '@skeletonlabs/tw-plugin'
import { myCustomTheme } from './theme'

export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}', join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')],
	theme: {
		extend: {
			animation: {
        'spin-slow': 'spin 20s linear infinite',
      }
		},
	},
	plugins: [
		forms,
		typography,
		skeleton({
			themes: {
				custom: [myCustomTheme]
				// preset: [
				// 	{
				// 		name: 'gold-nouveau',
				// 		enhancements: true,
				// 	},
				// ],
			},
		}),
	],
} satisfies Config;
