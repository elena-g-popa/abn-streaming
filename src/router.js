import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './components/home-view/HomeView.vue';
import ShowDetails from './components/show-details/ShowDetails.vue'
import WatchList from './components/watch-list/WatchList.vue'

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
  {
    path: '/watch-list',
    name: 'watch-list',
    component: WatchList,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  },
});

export default router;
