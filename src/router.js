import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './components/home-view/HomeView.vue';
import ShowDetails from './components/show-details/ShowDetails.vue'
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/show/:id',
    name: 'show-details',
    component: ShowDetails,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
