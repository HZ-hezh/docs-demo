// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import Theme from '@escook/vitepress-theme'
import '@escook/vitepress-theme/style.css'
import './style.css'
import CustomMusicPlayer from './components/CustomMusicPlayer.vue'

/** @type {import('vitepress').Theme} */
export default {
  ...Theme,
  Layout() {
    return h(Theme.Layout, null, {
      'layout-bottom': () => h(CustomMusicPlayer)
    })
  },
  enhanceApp({ app }) {
    if (Theme.enhanceApp) {
      Theme.enhanceApp({ app })
    }
    // 注册自定义音乐播放器组件
    app.component('CustomMusicPlayer', CustomMusicPlayer)
  }
}

