export default {
  namespaced: true,
  state() {
    return {
      baseUrl: "http://127.0.0.1:5000",
      // 登录状态标记
      isLogin: true,
      // communication state
      loading: false,
      error: {
        state: true,
        message: "",
        mode: "",
      },
    };
  },
  getters: {
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
      console.log(payload);
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
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then(async (response) => {
          if (!response.ok) {
            return response.json().then((data) => {
              throw new Error(data.message);
            });
          }
          return response.json();
        })
        .then((data) => {
          context.commit("setError", {
            state: false,
            message: "",
            mode: mode,
          });
          context.commit("setLoading", false);
          context.dispatch("handleData", data);
        })
        .catch((error) => {
          context.commit("setError", {
            state: true,
            message: error.message,
            mode: mode,
          });
          context.commit("setLoading", false);
          console.error("error:", error.message);
        });
    },
    handleData(context, payload) {
      console.log(payload);
    },
  },
};
