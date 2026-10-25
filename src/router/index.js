import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/Layout/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: Layout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/Home/index.vue')
        },
        {
          path: 'category/:id',
          name: 'category',
          component: () => import('@/views/Category/index.vue')
        },
        {
          path: 'category/sub/:id',
          name: 'subCategory',
          component: () => import('@/views/subCategory/index.vue')
        },
        {
          path: 'detail/:id',
          name:'detail',
          component: () => import('@/views/Detail/index.vue')
        },
        {
          path: 'cartlist',
          name:'cartlist',
          component: () => import('@/views/CartList/index.vue')
        },
        {
          path: 'checkout',
          name:'checkout',
          component: () => import('@/views/CheckOut/index.vue')
        },
        {
          path: 'pay',
          name:'pay',
          component: () => import('@/views/Pay/index.vue')
        },
        {
          path: 'paycallback',
          name:'paycallback',
          component: () => import('@/views/PayBack/index.vue')
        },
        {
          path: 'member',
          name:'member',
          component: () => import('@/views/Member/index.vue'),
          children: [
            {
              path: 'order',
              name:'order',
              component: () => import('@/views/Member/components/UserOrder.vue')
            },
            {
              path: '',
              name:'user',
              component: () => import('@/views/Member/components/UserInfo.vue')
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login/index.vue')
    },
    
  ],
  scrollBehavior () {
    return {
      top: 0
    }
  }
})
export default router
