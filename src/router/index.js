import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login/index.vue'
import Layout from '@/views/Layout/index.vue'
import Category from '@/views/category/index.vue'
import Home from '@/views/Home/index.vue'
import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // path和component对应关系的位置
  routes: [
    {
      path:'/',
      component: Layout,
      children: [
        {
          path: "",
          component: Home
        },
        {
          path: "category",
          component: Category
        }
      ]
    },
    {
      path:'/login',
      component: Login,
      children: [
        {
          path: "",
          component: Home
        }
      ]
    }
  ],
})

export default router
