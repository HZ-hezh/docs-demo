// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import Theme from '@escook/vitepress-theme'
import '@escook/vitepress-theme/style.css'
import './style.css'
import MotivationalQuote from './components/MotivationalQuote.vue'

/** @type {import('vitepress').Theme} */
export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      'home-features-after': () => h(MotivationalQuote)
    })
  },
  enhanceApp({ app, router, siteData }) {
    // 注册全局组件
    app.component('MotivationalQuote', MotivationalQuote)
  }
}
