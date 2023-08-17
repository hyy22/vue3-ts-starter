import { RouteRecordRaw } from 'vue-router';

const AccountSetting = () => import('@/views/setting/accountSetting.vue');
const MenuSetting = () => import('@/views/setting/menuSetting.vue');
const routes: RouteRecordRaw[] = [
  {
    path: '/setting',
    name: 'setting',
    redirect: '/setting/account_setting',
    meta: {
      title: '账户设置',
      icon: 'Setting',
    },
    children: [
      {
        path: '/setting/account_setting',
        name: 'accountSetting',
        component: AccountSetting,
        meta: {
          title: '账户管理',
          icon: 'User',
          keepAlive: true,
        },
      },
      {
        path: '/setting/menu_setting',
        name: 'menuSetting',
        component: MenuSetting,
        meta: {
          title: '菜单管理',
          icon: 'Memo',
          permission: '1',
        },
      },
    ],
  },
];

export default routes;
