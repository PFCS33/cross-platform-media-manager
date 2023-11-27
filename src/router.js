import { createRouter, createWebHistory } from "vue-router";
import store from "./store/index.js";

import MainPage from "@/views/MainPage.vue";
import AuthPage from "@/views/AuthPage.vue";
import RedirectPage from "@/views/RedirectPage.vue";
import NotFoundPage from "@/views/NotFoundPage.vue";

import LoginCard from "@/components/auth/Login.vue";
import SignupCard from "@/components/auth/Signup.vue";
import HomePage from "@/components/project/HomePage.vue";
import PlatformPage from "@/components/project/platform/Platform.vue";
import PostPublishPage from "@/components/project/publish/PostPublish.vue";
import HistoryPage from "@/components/project/History.vue";
import StatisticPage from "./components/project/Statistic.vue";
import DraftPage from "@/components/project/DraftBot.vue";
import ConfigPage from "./components/project/config/Config.vue";
import { ElMessage } from "element-plus";

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
      redirect: "/main/home",
      meta: {
        requiredAuth: true,
      },
      children: [
        {
          path: "home",
          component: HomePage,
          name: "home",
        },
        {
          path: "platform",
          component: PlatformPage,
          name: "platform",
        },
        {
          path: "publish",
          component: PostPublishPage,
          name: "publish",
        },
        {
          path: "history",
          component: HistoryPage,
          name: "history",
        },
        {
          path: "statistic",
          component: StatisticPage,
          name: "statistic",
        },
        {
          path: "draft",
          component: DraftPage,
          name: "draft",
        },
        {
          path: "config",
          component: ConfigPage,
          name: "config",
        },
      ],
    },
    {
      path: "/redirect",
      component: RedirectPage,
      name: "redirect",
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

  if (to.path === "/redirect") {
    const code = to.query.code;

    if (window.opener && !window.opener.closed && window !== window.opener) {
      window.opener.postMessage(
        { status: "success", code: code },
        "http://192.168.56.1:5173" // 父窗口的原点
      );
    }

    // store.dispatch("platform/postAuthCode", {
    //   code: code,
    // });
  } else if (requiredAuth && !store.getters["auth/isLogin"]) {
    next("/auth/login");
  } else if (requiredUnAuth && store.getters["auth/isLogin"]) {
    next("/main");
  } else {
    next();
  }
});
export default router;
