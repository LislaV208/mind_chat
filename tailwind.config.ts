import { join } from 'path';
import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { skeleton } from '@skeletonlabs/tw-plugin';
import { appTheme } from './app-theme';

const config = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {
			fontSize: {
				// Bazowe rozmiary czcionek
				'base': ['16px', '24px'],
				'lg': ['18px', '28px'],
				'xl': ['20px', '30px'],
				'2xl': ['24px', '32px'],
				'3xl': ['30px', '36px']
			},
			typography: {
				DEFAULT: {
					css: {
						fontSize: '16px',
						lineHeight: '24px',
						'@screen sm': {
							fontSize: '18px',
							lineHeight: '28px'
						}
					}
				}
			}
		}
	},
	plugins: [
		forms,
		typography,
		skeleton({
			themes: {
				custom: [appTheme]
			}
		})
	]
} satisfies Config;

export default config;
