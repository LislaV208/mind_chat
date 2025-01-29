import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const appTheme: CustomThemeConfig = {
	name: 'app-theme',
	properties: {
		// =~= Theme Properties =~=
		'--theme-font-family-base': `system-ui`,
		'--theme-font-family-heading': `system-ui`,
		'--theme-font-color-base': '0 0 0',
		'--theme-font-color-dark': '255 255 255',
		'--theme-rounded-base': '9999px',
		'--theme-rounded-container': '8px',
		'--theme-border-base': '2px',
		// =~= Theme On-X Colors =~=
		'--on-primary': '0 0 0',
		'--on-secondary': '255 255 255',
		'--on-tertiary': '0 0 0',
		'--on-success': '0 0 0',
		'--on-warning': '0 0 0',
		'--on-error': '255 255 255',
		'--on-surface': '255 255 255',
		// =~= Theme Colors  =~=
		// primary | #1E88E5
		'--color-primary-50': '221 237 251', // #ddedfb
		'--color-primary-100': '210 231 250', // #d2e7fa
		'--color-primary-200': '199 225 249', // #c7e1f9
		'--color-primary-300': '165 207 245', // #a5cff5
		'--color-primary-400': '98 172 237', // #62aced
		'--color-primary-500': '30 136 229', // #1E88E5
		'--color-primary-600': '27 122 206', // #1b7ace
		'--color-primary-700': '23 102 172', // #1766ac
		'--color-primary-800': '18 82 137', // #125289
		'--color-primary-900': '15 67 112', // #0f4370
		// secondary | #8E24AA
		'--color-secondary-50': '238 222 242', // #eedef2
		'--color-secondary-100': '232 211 238', // #e8d3ee
		'--color-secondary-200': '227 200 234', // #e3c8ea
		'--color-secondary-300': '210 167 221', // #d2a7dd
		'--color-secondary-400': '176 102 196', // #b066c4
		'--color-secondary-500': '142 36 170', // #8E24AA
		'--color-secondary-600': '128 32 153', // #802099
		'--color-secondary-700': '107 27 128', // #6b1b80
		'--color-secondary-800': '85 22 102', // #551666
		'--color-secondary-900': '70 18 83', // #461253
		// tertiary | #FF7043
		'--color-tertiary-50': '255 234 227', // #ffeae3
		'--color-tertiary-100': '255 226 217', // #ffe2d9
		'--color-tertiary-200': '255 219 208', // #ffdbd0
		'--color-tertiary-300': '255 198 180', // #ffc6b4
		'--color-tertiary-400': '255 155 123', // #ff9b7b
		'--color-tertiary-500': '255 112 67', // #FF7043
		'--color-tertiary-600': '230 101 60', // #e6653c
		'--color-tertiary-700': '191 84 50', // #bf5432
		'--color-tertiary-800': '153 67 40', // #994328
		'--color-tertiary-900': '125 55 33', // #7d3721
		// success | #43A047
		'--color-success-50': '227 241 227', // #e3f1e3
		'--color-success-100': '217 236 218', // #d9ecda
		'--color-success-200': '208 231 209', // #d0e7d1
		'--color-success-300': '180 217 181', // #b4d9b5
		'--color-success-400': '123 189 126', // #7bbd7e
		'--color-success-500': '67 160 71', // #43A047
		'--color-success-600': '60 144 64', // #3c9040
		'--color-success-700': '50 120 53', // #327835
		'--color-success-800': '40 96 43', // #28602b
		'--color-success-900': '33 78 35', // #214e23
		// warning | #FDD835
		'--color-warning-50': '255 249 225', // #fff9e1
		'--color-warning-100': '255 247 215', // #fff7d7
		'--color-warning-200': '255 245 205', // #fff5cd
		'--color-warning-300': '254 239 174', // #feefae
		'--color-warning-400': '254 228 114', // #fee472
		'--color-warning-500': '253 216 53', // #FDD835
		'--color-warning-600': '228 194 48', // #e4c230
		'--color-warning-700': '190 162 40', // #bea228
		'--color-warning-800': '152 130 32', // #988220
		'--color-warning-900': '124 106 26', // #7c6a1a
		// error | #eb0400
		'--color-error-50': '252 217 217', // #fcd9d9
		'--color-error-100': '251 205 204', // #fbcdcc
		'--color-error-200': '250 192 191', // #fac0bf
		'--color-error-300': '247 155 153', // #f79b99
		'--color-error-400': '241 79 77', // #f14f4d
		'--color-error-500': '235 4 0', // #eb0400
		'--color-error-600': '212 4 0', // #d40400
		'--color-error-700': '176 3 0', // #b00300
		'--color-error-800': '141 2 0', // #8d0200
		'--color-error-900': '115 2 0', // #730200
		// surface | #121212
		'--color-surface-50': '219 219 219', // #dbdbdb
		'--color-surface-100': '208 208 208', // #d0d0d0
		'--color-surface-200': '196 196 196', // #c4c4c4
		'--color-surface-300': '160 160 160', // #a0a0a0
		'--color-surface-400': '89 89 89', // #595959
		'--color-surface-500': '18 18 18', // #121212
		'--color-surface-600': '16 16 16', // #101010
		'--color-surface-700': '14 14 14', // #0e0e0e
		'--color-surface-800': '11 11 11', // #0b0b0b
		'--color-surface-900': '9 9 9' // #090909
	}
};
