import { getData } from "@/services/fetchData";

export default {
  namespaced: true,
  state() {
    return {
      info: null, //  a hash map: (date, [{}, {}, ...])
      //   detailInfo: null,

      infoLoading: false,
      infoError: {
        state: true,
        message: "",
      },

      //   detailLoading: false,
      //   detailError: {
      //     state: true,
      //     message: "",
      //   },
    };
  },
  getters: {
    info(state) {
      return state.info;
    },
    // detailInfo(state) {
    //   return state.detailInfo;
    // },

    infoLoading(state) {
      return state.infoLoading;
    },
    infoError(state) {
      return state.infoError;
    },
    // detailLoading(state) {
    //   return state.detailLoading;
    // },
    // detailError(state) {
    //   return state.detailLoading;
    // },
  },
  mutations: {
    setInfo(state, payload) {
      state.info = payload;
    },
    // setDetailInfo(state, payload) {
    //   state.detailInfo = payload;
    // },

    setInfoLoading(state, payload) {
      state.infoLoading = payload;
    },
    setInfoError(state, payload) {
      state.infoError = payload;
    },
    // setDetailLoading(state, payload) {
    //   state.detailLoading = payload;
    // },
    // setDetailError(state, payload) {
    //   state.detailError = payload;
    // },
  },
  actions: {
    getUserInfo(context, payload) {
      const JWTToken = context.rootGetters["auth/JWTToken"];
      const url = context.rootGetters["auth/baseUrl"] + "/user/info";
      getData(url, JWTToken, context, "info");
    },
    // getDetailInfo(context, payload) {
    //   const id = payload.id;
    //   const JWTToken = context.rootGetters["auth/JWTToken"];
    //   const url =
    //     context.rootGetters["auth/baseUrl"] + `/publish/article/${id}`;

    //   getData(url, JWTToken, context, "detail");
    // },

    // handleDetailData(context, payload) {
    //   context.commit("setDetailInfo", payload);
    // },
    handleInfoData(context, payload) {
      const data = payload;

      context.commit("setInfo", data);
    },
  },
};
