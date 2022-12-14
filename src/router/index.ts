import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import NProgress from "nprogress";
import { message } from "ant-design-vue";

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
      {
        path: "/home/confirm",
        name: "验证指纹",
        component: () => import("~/views/confirm/index.vue"),
        meta: {
          icon: "home-outlined",
          keepAlive: true,
        },
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("~/views/login/index.vue"),
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

  const token: string | null = sessionStorage.getItem("token");
  if (to.fullPath !== "/login" && token !== "token") {
    index.push("/login");
    // 如果不是从/重定向过来的
    if (from.fullPath !== "/") {
      message.error("请先登录！");
    }
  }
});

index.afterEach((to, from) => {
  NProgress.done();
});

export default index;
