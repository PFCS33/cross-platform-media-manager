import { getData } from "@/services/fetchData";

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
    // TODO 账号绑定流程
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
        case "wordpress":
          break;
      }

      const url = context.rootGetters["auth/baseUrl"] + serverRouter;
      const data = {
        user_id: user_id,
        platform: platform,
        validation1: code,
      };

      // fetchAuthorizeData(url, data, context);
    },
    getAccountInfo(context, payload) {
      const JWTToken = context.rootGetters["auth/JWTToken"];
      const url = context.rootGetters["auth/baseUrl"] + "/accounts";
      getData(url, JWTToken, context);
    },
    handleData(context, payload) {
      const data = payload;
      const platformMap = new Map();
      data.forEach((info) => {
        const platform = info.platform;
        if (platformMap.has(platform)) {
          platformMap.get(platform).push(info);
        } else {
          platformMap.set(platform, [info]);
        }
      });
      context.commit("setAccountInfo", platformMap);
    },
  },
};
