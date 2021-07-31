require('dotenv').config()

export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.APP_NAME || process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel: 'apple-touch-icon', href: '/favicon/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', href: '/favicon/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', href: '/favicon/favicon-16x16.png' },
      { rel: 'manifest', href: '/favicon/site.webmanifest' },
      { rel: 'mask-icon', href: '/favicon/safari-pinned-tab.svg'},

      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' },
      { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/flexboxgrid@6.3.1/dist/flexboxgrid.min.css' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet-minimap/3.6.1/Control.MiniMap.min.css' }
    ],
    script:[{src:'https://maps.googleapis.com/maps/api/js?key=AIzaSyB3Vrtfjoi2AStH_4n7LWKwSrSkMpxGX3I&libraries=places'}]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#ffffff' },
  /*
   ** Global CSS
   */
  css: [
    '@/assets/sass/app.scss',
    'node_modules/leaflet/dist/leaflet.css',
    'node_modules/leaflet-draw/dist/leaflet.draw.css'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/element-ui',
    '@/plugins/axios',
    '@/plugins/services',
    '@/plugins/api',
    '@/plugins/liquor-tree',
    { src: '@/plugins/leafLet', ssr: false }
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    // Doc: https://auth.nuxtjs.org
    '@nuxtjs/auth',
    // Doc: https://github.com/nuxt-community/style-resources-module
    '@nuxtjs/style-resources'
  ],
  /**
   * Nuxt Style Resources
   */
  styleResources: {
    scss: [
      './assets/sass/_variables.scss', // use underscore "_" & also file extension ".scss"
      './assets/sass/mixins/mixins.scss',
      './assets/sass/_global.scss'
    ]
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: 'http://143.244.178.63:8000/api'
  },
  /**
   ** Global middleware from auth module
   */
  router: {
    middleware: ['auth']
  },
  /**
   ** Schemes define authentication logic
   */
  auth: {
    redirect: {
      login: '/login',
      logout: '/login',
      home: '/',
      callback: '/login'
    },
    strategies: {
      local: {
        endpoints: {
          login: {
            url: 'auth/',
            method: 'post',
            propertyName: 'token'
          },
          logout: {
            url: 'user/logout/',
            method: 'post'
          },
          user: {
            url: 'user/info/',
            method: 'get',
            propertyName: 'user'
          }
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  vue: {
    config: {
      productionTip: false,
      devtools: true
    }
  },
  build: {
    transpile: [/^element-ui/],
    /*
     ** You can extend webpack config here
     */
    extend (config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
