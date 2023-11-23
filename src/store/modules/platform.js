import { getData, deleteData } from "@/services/fetchData";

export default {
  namespaced: true,
  state() {
    return {
      accountInfo: null, // a hash map: (platform, [{}, {}, ...])
      accountList: null, // orginal list data
      logoutState: null,
      deleteState: null,
      isAuth: false,

      loading: false,
      error: {
        state: true,
        message: "",
      },

      deleteLoading: false,
      deleteError: {
        state: true,
        message: "",
      },

      logoutLoading: false,
      logoutError: {
        state: true,
        message: "",
      },
      selectedPlatform: null,
    };
  },
  getters: {
    isAuth(state) {
      return state.isAuth;
    },
    selectedPlatform(state) {
      return state.selectedPlatform;
    },
    accountInfo(state) {
      return state.accountInfo;
    },
    accountList(state) {
      return state.accountList;
    },
    deleteState(state) {
      return state.deleteState;
    },
    logoutState(state) {
      return state.logoutState;
    },

    loading(state) {
      return state.loading;
    },
    error(state) {
      return state.error;
    },
    deleteLoading(state) {
      return state.deleteLoading;
    },
    deleteError(state) {
      return state.deleteError;
    },
    logoutLoading(state) {
      return state.logoutLoading;
    },
    logoutError(state) {
      return state.logoutError;
    },
  },
  mutations: {
    setIsAuth(state, payload) {
      state.isAuth = payload;
    },
    setSelectedPlatform(state, payload) {
      state.selectedPlatform = payload;
    },
    setAccountInfo(state, payload) {
      state.accountInfo = payload;
    },
    setAccountList(state, payload) {
      state.accountList = payload;
    },
    setDeleteState(state, payload) {
      state.deleteState = payload;
    },

    setLogoutState(state, payload) {
      state.logoutState = payload;
    },

    setLoading(state, payload) {
      state.loading = payload;
    },
    setError(state, payload) {
      state.error = payload;
    },
    setDeleteLoading(state, payload) {
      state.deleteLoading = payload;
    },
    setDeleteError(state, payload) {
      state.deleteError = payload;
    },
    setLogoutLoading(state, payload) {
      state.logoutLoading = payload;
    },
    setLogoutError(state, payload) {
      state.logoutError = payload;
    },
  },
  actions: {
    deleteAccount(context, payload) {
      const id = payload.id;
      const JWTToken = context.rootGetters["auth/JWTToken"];
      const url =
        context.rootGetters["auth/baseUrl"] + "/accounts/delete/" + id;
      deleteData(url, JWTToken, context, "delete");
    },
    logoutAccount(context, payload) {
      const id = payload.id;
      const JWTToken = context.rootGetters["auth/JWTToken"];
      const url =
        context.rootGetters["auth/baseUrl"] + "/accounts/logout/" + id;
      deleteData(url, JWTToken, context, "logout");
    },
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

    handleDeleteData(context, payload) {
      const state = payload.success;
      context.commit("setDeleteState", state);
    },

    handleLogoutData(context, payload) {
      const state = payload.success;
      context.commit("setLogoutState", state);
    },
    handleData(context, payload) {
      const data = payload;
      context.commit("setAccountList", data);
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
