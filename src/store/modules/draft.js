import { getData, postData } from "@/services/fetchData";

export default {
  namespaced: true,
  state() {
    return {
      drafts: null,
      deleteResult: null,
      detail: null,

      draftsLoading: false,
      draftsError: {
        state: true,
        message: "",
      },

      deleteLoading: false,
      deleteError: {
        state: true,
        message: "",
      },

      detailLoading: false,
      detailError: {
        state: true,
        message: "",
      },
    };
  },
  getters: {
    detail(state) {
      return state.detail;
    },
    drafts(state) {
      return state.drafts;
    },
    deleteResult(state) {
      return state.deleteResult;
    },

    draftsLoading(state) {
      return state.planLoading;
    },
    draftsError(state) {
      return state.planError;
    },
    deleteLoading(state) {
      return state.deleteLoading;
    },
    deleteError(state) {
      return state.deleteError;
    },

    detailLoading(state) {
      return state.detailLoading;
    },
    detailError(state) {
      return state.detailError;
    },
  },
  mutations: {
    setDetail(state, payload) {
      state.detail = payload;
    },

    setDrafts(state, payload) {
      state.drafts = payload;
    },
    setDeleteResult(state, payload) {
      state.deleteResult = payload;
    },

    setDraftsLoading(state, payload) {
      state.planLoading = payload;
    },
    setDraftsError(state, payload) {
      state.planError = payload;
    },
    setDeleteLoading(state, payload) {
      state.deleteLoading = payload;
    },
    setDeleteError(state, payload) {
      state.deleteError = payload;
    },
    setDetailLoading(state, payload) {
      state.detailLoading = payload;
    },
    setDetailError(state, payload) {
      state.detailError = payload;
    },
  },
  actions: {
    getDetailInfo(context, payload) {
      const id = payload.id;
      const JWTToken = context.rootGetters["auth/JWTToken"];
      const url = context.rootGetters["auth/baseUrl"] + `/draft/${id}`;
      getData(url, JWTToken, context, "detail");
    },
    getDraftsInfo(context, payload) {
      const JWTToken = context.rootGetters["auth/JWTToken"];
      const url = context.rootGetters["auth/baseUrl"] + "/draft/list";
      getData(url, JWTToken, context, "drafts");
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
    deleteDraft(context, payload) {
      const selectedIds = payload.selectedIds;
      const JWTToken = context.rootGetters["auth/JWTToken"];
      const url = context.rootGetters["auth/baseUrl"] + "/draft/delete";
      postData(url, payload.selectedIds, JWTToken, context, "delete");
    },
    handleDetailData(context, payload) {
      const data = payload;
      context.commit("setDetail", data);
    },

    handleDeleteData(context, payload) {
      const data = payload.success;

      context.commit("setDeleteResult", data);
    },
    handleDraftsData(context, payload) {
      const data = payload;

      context.commit("setDrafts", data);
    },
  },
};
