import { fetchAuthData } from "@/services/fetchData";

export default {
  namespaced: true,
  state() {
    return {
      baseUrl: "http://127.0.0.1:5000",
      // 登录状态标记
      isLogin: false,
      // communication state
      loading: false,
      error: {
        state: true,
        message: "",
        mode: "",
      },

      userInfo: {
        username: "Alex",
        user_id: 1,
      },
    };
  },
  getters: {
    userInfo(state) {
      return state.userInfo;
    },
    isLogin(state) {
      return state.isLogin;
    },
    loading(state) {
      return state.loading;
    },
    error(state) {
      return state.error;
    },
    baseUrl(state) {
      return state.baseUrl;
    },
  },
  mutations: {
    setUserInfo(state, payload) {
      state.userInfo = payload;
    },
    setIsLogin(state, payload) {
      state.isLogin = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    setError(state, payload) {
      state.error = payload;
    },
  },
  actions: {
    uploadData(context, payload) {
      const data = {
        username: payload.data.email,
        password: payload.data.password,
      };
      const mode = payload.mode;

      const url = context.getters.baseUrl + "/" + mode;

      /* fake-------------------------------------------------------------------------- */
      // context.commit("setLoading", true);
      // setTimeout(() => {
      //   context.commit("setLoading", false);
      //   context.commit("setError", {
      //     state: false,
      //     message: "",
      //     mode: mode,
      //   });
      //   context.commit("setIsLogin", true);
      //   // context.commit("setError", {
      //   //   state: true,
      //   //   message: "network error",
      //   //   mode: mode,
      //   // });
      /* -------------------------------------------------------------------------- */
      // }, 500);

      fetchAuthData(url, data, context);
    },
    handleData(context, payload) {
      console.log(payload);

      // TODO: set userInfo
    },
  },
};
