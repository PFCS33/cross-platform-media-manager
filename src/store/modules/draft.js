import { getData, postData } from "@/services/fetchData";

export default {
  namespaced: true,
  state() {
    return {
      drafts: null,
      deleteResult: null,

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
    };
  },
  getters: {
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
  },
  mutations: {
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
  },
  actions: {
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
