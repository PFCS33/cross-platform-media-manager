import { createRouter, createWebHistory } from "vue-router";
import store from "./store/index.js";

import MainPage from "@/views/MainPage.vue";
import AuthPage from "@/views/AuthPage.vue";
import NotFoundPage from "@/views/NotFoundPage.vue";

import LoginCard from "@/components/auth/Login.vue";

import SignupCard from "@/components/auth/Signup.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/auth/login",
    },
    {
      path: "/auth",
      component: AuthPage,
      meta: {
        requiredUnAuth: true,
      },
      redirect: "/auth/login",

      children: [
        {
          path: "login",
          component: LoginCard,
          name: "login",
        },
        {
          path: "signup",
          component: SignupCard,
          name: "signup",
        },
      ],
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
  const requiredUnAuth = to.matched.some(
    (record) => record.meta.requiredUnAuth
  );

  if (requiredAuth && !store.getters["auth/isLogin"]) {
    next("/auth/login");
  } else if (requiredUnAuth && store.getters["auth/isLogin"]) {
    next("/main");
  } else {
    next();
  }
});
export default router;
