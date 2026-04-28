// frontend\src\router\index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminView from '../views/AdminView.vue'
import DevControlView from '../views/DevControlView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/admin', name: 'admin', component: AdminView },
    { 
      // Esta es tu ruta secreta
      path: '/dev-control-panel-secret', 
      name: 'dev-control', 
      component: DevControlView 
    },
    // Dentro de tu array de routes:
    {
        path: '/producto/:id', // El :id es vital para que reconozca cualquier muñeca
        name: 'ProductDetail',
        component: () => import('../views/ProductDetailView.vue')
    }
  ]
})

export default router