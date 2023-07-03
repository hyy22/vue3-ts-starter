import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/demo',
    name: 'demo',
    component: () => import('@/views/demo/demo.vue'),
    // children: [],
    meta: {
      title: '测试',
      icon: 'Tickets',
      permission: '1',
    },
  },
  {
    path: '/demo2',
    name: 'demo2',
    component: () => import('@/views/demo/demo.vue'),
    // children: [],
    meta: {
      title: '测试2',
      icon: 'Tickets',
      permission: '1',
    },
  },
];

export default routes;
