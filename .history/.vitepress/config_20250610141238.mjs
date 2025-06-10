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
    // 4. 可选配置：启用背景音乐小组件 - 使用播放列表支持随机播放
    musicBall: {
      list: [
        {
          name: "Butter-Fly",
          src: "http://47.113.102.160:9000/docs-demo/music/和田光司-Butter-Fly-《数码宝贝》TV动画片头曲.flac"
        },
        {
          name: "把回忆拼好给你",
          src: "/music/cici_-把回忆拼好给你.flac"
        },
        {
          name: "个人简历",
          src: "http://47.113.102.160:9000/docs-demo/music/风吹流年-个人简介(说唱).flac"
        },
        {
          name: "不说",
          src: "http://47.113.102.160:9000/docs-demo/music/%E5%91%A8%E5%85%AC-%E4%B8%8D%E8%AF%B4.flac"
        },
        {
          name: "春桥与志明",
          src: "http://47.113.102.160:9000/docs-demo/music/街道办GDC_欧阳耀莹-春娇与志明.flac"
        },
        {
          name: "崂山道士",
          src: "http://47.113.102.160:9000/docs-demo/music/失恋无罪-崂山道士 (要学神仙驾鹤飞天1.1x).flac"
        },
        {
          name: "天若有情",
          src: "http://47.113.102.160:9000/docs-demo/music/桃-天若有情 (赖仔版).mp3"
        },
        {
          name: "梦回还",
          src: "http://47.113.102.160:9000/docs-demo/music/呦猫UNEKO-梦回还.flac"
        },
        {
          name: "朵",
          src: "http://47.113.102.160:9000/docs-demo/music/赵雷-朵.flac"
        },
        {
          name: "红尘客栈",
          src: "http://47.113.102.160:9000/docs-demo/music/周杰伦-红尘客栈.flac"
        },
        {
          name: "个人简历",
          src: "http://47.113.102.160:9000/docs-demo/music/周杰伦-兰亭序.flac"
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
