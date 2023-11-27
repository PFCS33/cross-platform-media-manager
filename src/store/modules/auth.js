import { fetchAuthData } from "@/services/fetchData";
import { decodeJwtPayload } from "@/services/JWTToken";

export default {
  namespaced: true,
  state() {
    return {
      // baseUrl: "http://127.0.0.1:5000",
      baseUrl: "http://127.0.0.1:4523/m1/3581187-0-default",
      // 登录状态标记
      isLogin: false,
      // communication state
      loading: false,
      error: {
        state: true,
        message: "",
        mode: "",
      },

      // JWTToken: null,
      JWTToken:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6Im1hcmN5IiwiaWF0IjoxNzIwMDMxMjIwfQ.BCDIJO7w0FQOZKJXCM0D5IpvWNOab2XRB9DbELm2D48",
      // userInfo: null,
      userInfo: {
        name: "Marcy",
        id: "1",
        avatar: "https://i.imgur.com/Znxxtmm.jpg",
      },
    };
  },
  getters: {
    JWTToken(state) {
      return state.JWTToken;
    },
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
    setJWTToken(state, payload) {
      state.JWTToken = payload;
    },
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
        account: payload.data.email,
        password: payload.data.password,
      };
      const mode = payload.mode;

      const url = context.getters.baseUrl + "/auth/" + mode;

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

      fetchAuthData(url, { data: data, mode: mode }, context);
    },
    handleData(context, payload) {
      const mode = payload.mode;
      if (mode === "login") {
        // 存储并解析JWT Token
        const token = payload.data.token;
        context.commit("setJWTToken", token);
        const JWTTokenPayload = decodeJwtPayload(token);
        const userInfo = {
          id: JWTTokenPayload.sub,
          name: JWTTokenPayload.name,
          avatar: payload.data.avatar,
        };
        context.commit("setUserInfo", userInfo);
      }
    },
  },
};
