import { resolve } from 'path'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },

  routeRules: {
    '/': { prerender: true }
  },

  alias: {
    '@css': resolve(__dirname, './assets/css'),
    '@scss': resolve(__dirname, './assets/scss')
  },

  css: ['@css/normalize.css', '@css/scrollbar.css', '@css/universal.css'],

  modules: [
    '@nuxtjs/color-mode',
    '@unocss/nuxt',
    '@vueuse/nuxt',
    'nuxt-icons',
    '@nuxtjs/device',
    [
      '@pinia/nuxt',
      {
        autoImports: [
          // 自动引入 `defineStore()`
          'defineStore',
          // 自动引入 `defineStore()` 并重命名为 `definePiniaStore()`
          ['defineStore', 'definePiniaStore']
        ]
      }
    ],
    '@vueuse/motion/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    ['@element-plus/nuxt', { importStyle: 'scss', themes: ['dark'] }]
  ],

  colorMode: {
    preference: 'system', // default value of $colorMode.preference
    fallback: 'dark', // fallback value if not system preference found
    globalName: '__NUXT_COLOR_MODE__',
    classPrefix: '',
    classSuffix: '',
    storageKey: 'nuxt-color-mode'
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
                    @use "@scss/element/common/override.scss" as common;
                    @use "@scss/element/dark/override.scss" as dark;
                    @use "@scss/index.scss" as *;
                `
        }
      }
    }
  },

  components: {
    dirs: [
      {
        path: '~/components',
        pathPrefix: false
      }
    ]
  },

  compatibilityDate: '2024-09-08'
})