import { defineConfigWithTheme } from 'vitepress'
import escookConfig from '@escook/vitepress-theme/config'
import { set_sidebar } from "./utils/auto_sidebar.mjs"

export default defineConfigWithTheme({
  base: '/',
  extends: escookConfig,
  head:[["link",{rel:"icon",href:"/earth.png"}]], //菜单图标
  title: "资源推荐",
  description: "A VitePress Site",
  
  // 忽略死链接，特别是 localhost 链接
  ignoreDeadLinks: [
    /^http:\/\/localhost/ ,
  ],
  
  // 开发服务器配置
  vite: {
    server: {
      proxy: {
        '/api/music': {
          target: 'http://47.113.102.160:9000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/music/, '/docs-demo/music'),
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          },
        }
      }
    }
  },
  
  themeConfig: {
    outlineTitle:"目录",
    outline:[2,4],
    logo: '/earth.png',
    nav: [
      {  text: '首页', link: '/' },
      { text: '资源合集', link: '/backend/' },
      // { text: '测试', items: [
      //   { text: '自动生成侧边栏1', link: '/backend/rabbitmq/' },
      //   { text: '自动生成侧边栏2', link: '/.vitepress/front-end/react/' }
      // ] } ,
    ],

    sidebar: {
      "/backend": set_sidebar("/backend"),
    },
    // sidebar:false,   //关闭侧边栏
    // aside:"left",    //设置右侧侧边栏在左侧最示
    socialLinks: [
      { icon: 'github', link: 'https://github.com/HZ-hezh' }
    ],
    footer: {
      copyright: 'Copyright © 2019-present Evan You'
    },
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档"
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换"
            }
          }
        }
      }
    },
    // 自定义音乐播放器配置
    customMusicPlayer: {
      list: [
        {
          name: "把回忆拼好给你",
          src: "/music/cici_-把回忆拼好给你.flac"
        }
      ],
      loop: true,
      autoplay: false,
      enable: true,
      visible: true
    },
    // 5. 可选配置：关闭鼠标点击彩色效果（默认开启）
    confetti: false

  }
})
