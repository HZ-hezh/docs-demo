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
      { icon: 'github', link: 'https://github.com/HZ-hezh' },
      { 
        icon: {
          svg: '<svg t="1749708413499" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2632" width="200" height="200"><path d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112 331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3-34 109.5-23 154.8-14.6 155.8 18 2.2 70.1-82.4 70.1-82.4 0 49 25.2 112.9 79.8 159-26.4 8.1-85.7 29.9-71.6 53.8 11.4 19.3 196.2 12.3 249.5 6.3 53.3 6 238.1 13 249.5-6.3 14.1-23.8-45.3-45.7-71.6-53.8 54.6-46.2 79.8-110.1 79.8-159 0 0 52.1 84.6 70.1 82.4 8.5-1.1 19.5-46.4-14.5-155.8z" p-id="2633"></path></svg>'
        },
        
        link: '点击链接加入群聊【AAA钻石大陆开船车】：https://qm.qq.com/q/kRufauzTDa'
       }
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
          name: "纯音乐",
          src: "/music/下载.mp4"
        } ,{
          name: "春娇与志明",
          src: "/music/街道办GDC_欧阳耀莹-春娇与志明.flac"
        },
        {
          name: "溯",
          src: "/music/CORSAK胡梦周_马吟吟-溯(Reverse)-reverse.flac"
        },
        {
          name: "天若有情",
          src: "/music/桃-天若有情 (赖仔版).mp3"
        },
        {
          name: "梦回还",
          src: "/music/呦猫UNEKO-梦回还.flac"
        },
        {
          name: "把回忆拼好给你",
          src: "/music/cici_-把回忆拼好给你.flac"
        } ,
        {
          name: "红尘客栈",
          src: "/music/周杰伦-红尘客栈.flac"
        },
        {
          name: "兰亭序",
          src: "/music/周杰伦-兰亭序.flac"
        },
        {
          name: "青花瓷",
          src: "/music/周杰伦-青花瓷.flac"
        },
        {
          name: "个人简介",
          src: "/music/风吹流年-个人简介(说唱).flac"
        },
        {
          name: "我的天空Remix",
          src: "/music/张德帅Sway-你的(我的天空Remix).flac"
        } ,
        {
          name: "数码宝贝",
          src: "/music/和田光司-Butter-Fly-《数码宝贝》TV动画片头曲.flac"
        } 
      ],
      loop: true,
      autoplay: false,
      enable: true,
      visible: true
    },
    // 关闭鼠标点击彩色效果
    confetti: false
  }
})
