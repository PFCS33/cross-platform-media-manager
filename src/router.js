import { createRouter, createWebHistory } from "vue-router";
import store from "./store/index.js";

import MainPage from "./views/MainPage.vue";
import AuthPage from "./views/AuthPage.vue";
import NotFoundPage from "./views/NotFoundPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/auth",
    },
    {
      path: "/auth",
      component: AuthPage,
      meta: {
        requiredUnAuth: true,
      },
    },
    {
      path: "/main",
      component: MainPage,
      meta: {
        requiredAuth: true,
      },
    },
    {
      path: "/:notFound(.*)",
      component: NotFoundPage,
    },
  ],
});

router.beforeEach(function (to, from, next) {
  const requiredAuth = to.matched.some((record) => record.meta.requiredAuth);

  if (requiredAuth && !store.getters["auth/isLogin"]) {
    next("/auth");
  } else if (to.meta.requiredUnAuth && store.getters.isLoggedin) {
    next("/main");
  } else {
    next();
  }
});
export default router;
