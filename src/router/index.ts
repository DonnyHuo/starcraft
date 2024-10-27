import { createRouter, createWebHashHistory } from 'vue-router';
import util from '@/globalUtil';
const router = createRouter({
  history: createWebHashHistory('/'),
  routes: [
    { path: '/:pathMatch(.*)*', redirect: '/' },
    {
      path: '/',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/admin',
      component: () => import('@/views/Admin.vue')
    },
    {
      path: '/Invite',
      component: () => import('@/views/Invite.vue')
    },
    {
      path: '/InviteDetails',
      component: () => import('@/views/InviteDetails.vue')
    },
    {
      path: '/Mining',
      component: () => import('@/views/Mining.vue')
    },
    {
      path: '/Facility',
      component: () => import('@/views/Facility.vue')
    },
    {
      path: '/Bags',
      component: () => import('@/views/Bags.vue')
    },
    {
      path: '/Fuel/:type',
      component: () => import('@/views/Fuel.vue')
    },
    {
      path: '/BuyRole/:type',
      component: () => import('@/views/BuyRole.vue')
    },
    {
      path: '/TokenInfo',
      component: () => import('@/views/TokenInfo.vue')
    },
    {
      path: '/BuyNode',
      component: () => import('@/views/BuyNode.vue')
    },
    {
      path: '/NodeReward',
      component: () => import('@/views/NodeReward.vue')
    },
    {
      path: '/RichPlan',
      component: () => import('@/views/RichPlan.vue')
    },
    {
      path: '/RichPlanInvite',
      component: () => import('@/views/RichPlanInvite.vue')
    },
    {
      path: '/Bind',
      component: () => import('@/views/Bind.vue')
    },
    {
      path: '/Bridge',
      component: () => import('@/views/Bridge.vue')
    },
  ]
});
router.beforeEach((to, from, next) => {
  util.toTop();
  next();
});

export default router;
