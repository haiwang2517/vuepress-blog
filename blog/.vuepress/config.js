module.exports = {
  locales:{
    '/':{
      lang: 'zh-CN'
    }
  },
  title: "Hspace Blog",
  description: '每天进步一点点',
  dest: 'public',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }]
  ],
  theme: 'reco',
  themeConfig: {
    type: 'blog',
    // 菜单设置
    nav: [
      { text: '首页', link: '/', icon: 'reco-home' },
      { text: '时间线', link: '/timeline/', icon: 'reco-date' },
      { text: 'github' ,link: 'https://github.com/haiwang2517', icon: 'reco-github'}
    ],
    //文章内容中的左边栏显示
    sidebar: { 
      '/article/integrated/':[
        'integratedSonar'
      ],
      '/article/restructure/':[
        'restructure'
      ],
      '/article/vpn/':[
        'trojanVpn'
      ],
      '/article/sql/':[
        'sqlOptimization'
      ]
    },  
    // 博客设置
    blogConfig: {
      category: {
        location: 2 // 在导航栏菜单中所占的位置，默认2
      },
      tag: {
        location: 3 // 在导航栏菜单中所占的位置，默认3
      }
    },
    friendLink: [
      {
        title: '午后南杂',
        desc: 'Enjoy when you can, and endure when you must.',
        email: '1156743527@qq.com',
        link: 'https://www.recoluan.com'
      },
      {
        title: 'vuepress-theme-reco',
        desc: 'A simple and beautiful vuepress Blog & Doc theme.',
        avatar: "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
        link: 'https://vuepress-theme-reco.recoluan.com'
      },
    ],
    logo: '/logo.png',
    // 搜索设置
    search: true,
    searchMaxSuggestions: 10,
    // 自动形成侧边导航
    //  sidebar: 'auto',
    // 最后更新时间
    lastUpdated: 'Last Updated',
    // 作者
    author: 'Ken Hai',
    // 作者头像
    authorAvatar: '/avatar.png',
    // 备案号
    // record: 'xxxx',
    // 项目开始时间
    startYear: '2020',
    valineConfig: {
      appId: '6tvWY6yUznCziLSwNcdvDF5Q-gzGzoHsz',// your appId
      appKey: '8oXEjYFAaEJAgMIs4HJACxMy', // your appKey
      isShowComments: true
    }
  },
  markdown: {
    lineNumbers: true
  },
  plugins: ['@vuepress/active-header-links']
}  
