import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import NProgress from "nprogress";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/home/index",
  },
  {
    path: "/404",
    name: "ErrorPage",
    component: () => import("~/views/errorPages/index.vue"),
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("~/views/home/index.vue"),
    children: [
      {
        path: "/home/index",
        name: "指纹审核",
        component: () => import("~/views/index/index.vue"),
        meta: {
          icon: "home-outlined",
          keepAlive: true,
        },
      },
      {
        path: "/home/detect",
        name: "探针管理",
        component: () => import("~/views/detect/index.vue"),
        meta: {
          icon: "home-outlined",
          keepAlive: true,
        },
      },
    ],
  },
  // {
  //   path: "/:pathMatch(.*)*",
  //   redirect: "/404",
  // },
];

const index = createRouter({
  history: createWebHashHistory(),
  routes,
});
index.beforeEach((to, from) => {
  if (!NProgress.isStarted()) {
    NProgress.start();
  }
});

index.afterEach((to, from) => {
  NProgress.done();
});

export default index;
