import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '首页' }
  },
  // 汉字模块
  {
    path: '/hanzi',
    name: 'HanziSearch',
    component: () => import('@/views/HanziSearch.vue'),
    meta: { title: '汉字查询' }
  },
  {
    path: '/hanzi/:char',
    name: 'HanziDetail',
    component: () => import('@/views/HanziDetail.vue'),
    meta: { title: '汉字详情' }
  },
  {
    path: '/wubi',
    name: 'WubiTable',
    component: () => import('@/views/WubiTable.vue'),
    meta: { title: '五笔字根表' }
  },
  // 诗词模块
  {
    path: '/poetry',
    name: 'PoetryList',
    component: () => import('@/views/PoetryList.vue'),
    meta: { title: '诗词' }
  },
  {
    path: '/poetry/tang',
    name: 'TangPoetry',
    component: () => import('@/views/PoetryList.vue'),
    props: { type: 'tang' },
    meta: { title: '唐诗' }
  },
  {
    path: '/poetry/song',
    name: 'SongCi',
    component: () => import('@/views/PoetryList.vue'),
    props: { type: 'song' },
    meta: { title: '宋词' }
  },
  {
    path: '/poetry/:id',
    name: 'PoetryDetail',
    component: () => import('@/views/PoetryDetail.vue'),
    meta: { title: '诗词详情' }
  },
  {
    path: '/author/:id',
    name: 'AuthorPage',
    component: () => import('@/views/AuthorPage.vue'),
    meta: { title: '作者' }
  },
  // 成语模块
  {
    path: '/idiom',
    name: 'IdiomList',
    component: () => import('@/views/IdiomList.vue'),
    meta: { title: '成语词典' }
  },
  {
    path: '/idiom/:word',
    name: 'IdiomDetail',
    component: () => import('@/views/IdiomDetail.vue'),
    meta: { title: '成语详情' }
  },
  // 歇后语模块
  {
    path: '/xiehouyu',
    name: 'XiehouyuList',
    component: () => import('@/views/XiehouyuList.vue'),
    meta: { title: '歇后语' }
  },
  // 收藏与历史
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('@/views/Favorites.vue'),
    meta: { title: '我的收藏' }
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('@/views/History.vue'),
    meta: { title: '浏览历史' }
  },
  // 设置
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings.vue'),
    meta: { title: '设置' }
  },
  // 关于
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
    meta: { title: '关于' }
  },
  // 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '页面未找到' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫 - 更新页面标题
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 汉字集` : '汉字集'
  next()
})

export default router
