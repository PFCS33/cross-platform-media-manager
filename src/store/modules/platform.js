import { fetchAuthorizeData } from "@/services/fetchData";

export default {
  namespaced: true,
  state() {
    return {
      accountInfo: null, // a hash map: (platform, [{}, {}, ...])
      loading: false,
      error: {
        state: true,
        message: "",
      },
      selectedPlatform: null,
    };
  },
  getters: {
    selectedPlatform(state) {
      return state.selectedPlatform;
    },
    accountInfo(state) {
      return state.accountInfo;
    },

    loading(state) {
      return state.loading;
    },
    error(state) {
      return state.error;
    },
  },
  mutations: {
    setSelectedPlatform(state, payload) {
      state.selectedPlatform = payload;
    },
    setAccountInfo(state, payload) {
      state.accountInfo = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    setError(state, payload) {
      state.error = payload;
    },
  },
  actions: {
    postAuthCode(context, payload) {
      const code = payload.code;
      const platform = payload.platform;
      const user_id = context.rootGetters["auth/userInfo"]["user_id"];
      let serverRouter = null;
      switch (platform) {
        case "weibo":
          serverRouter = "/auth_create_account";
          break;
        case "x":
          break;
        case "facebook":
          break;
        case "instogram":
          break;
      }

      const url = context.rootGetters["auth/baseUrl"] + serverRouter;
      const data = {
        user_id: user_id,
        platform: platform,
        validation1: code,
      };

      fetchAuthorizeData(url, data, context);
    },
    getAccountInfo(context, payload) {
      let dataFromBackend = null;
      context.commit("setLoading", true);
      // fake interface
      setTimeout(() => {
        dataFromBackend = [
          {
            username: "aaa",
            platform: "weibo",
            isLogin: false,
          },
          {
            username: "bbb",
            platform: "weibo",
            isLogin: true,
          },
          {
            username: "ccc",
            platform: "weibo",
            isLogin: true,
          },

          {
            username: "aaaa",
            platform: "x",
            isLogin: true,
          },
          {
            username: "bbbb",
            platform: "facebook",
            isLogin: true,
          },
          {
            username: "cccc",
            platform: "instogram",
            isLogin: true,
          },
        ];
        const platformMap = new Map();
        dataFromBackend.forEach((info) => {
          const platform = info.platform;
          if (platformMap.has(platform)) {
            platformMap.get(platform).push(info);
          } else {
            platformMap.set(platform, [info]);
          }
        });

        context.commit("setAccountInfo", platformMap);

        context.commit("setLoading", false);
        context.commit("setError", {
          state: false,
          message: "load succeeded",
        });
      }, 1000);
    },
  },
};
