import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import expressiveCode from 'astro-expressive-code';

// https://astro.build/config
export default defineConfig({
	integrations: [
		expressiveCode(),
		starlight({
			title: 'Soori 🪄',
			social: {
				github: 'https://github.com/eunjae-lee/soori',
			},
			sidebar: [
				{
					label: 'Guides',
					items: [
						{ label: 'Why Compile-Time Library?', link: '/guides/why/' },
						{ label: 'Getting Started', link: '/guides/getting-started/' },
						{ label: 'Configuration', link: '/guides/config/' },
						{ label: 'Examples', link: '/guides/examples/' },
					],
				},
				// {
				// 	label: 'Reference',
				// 	autogenerate: { directory: 'reference' },
				// },
			],
		}),
	],
});
