import { getData, postData } from "@/services/fetchData";

export default {
  namespaced: true,
  state() {
    return {
      plans: null, //  a hash map: (date, [{}, {}, ...])
      planList: null,
      detailInfo: null,
      publishState: null,
      isPublished: null,

      planLoading: false,
      planError: {
        state: true,
        message: "",
      },

      detailLoading: false,
      detailError: {
        state: true,
        message: "",
      },

      publishLoading: false,
      publishError: {
        state: true,
        message: "",
      },
    };
  },
  getters: {
    plans(state) {
      return state.plans;
    },
    detailInfo(state) {
      return state.detailInfo;
    },
    publishState(state) {
      return state.publishState;
    },
    planList(state) {
      return state.planList;
    },
    isPublished(state) {
      return state.isPublished;
    },

    planLoading(state) {
      return state.planLoading;
    },
    planError(state) {
      return state.planError;
    },
    detailLoading(state) {
      return state.detailLoading;
    },
    detailError(state) {
      return state.detailLoading;
    },
    publishLoading(state) {
      return state.publishLoading;
    },
    publishError(state) {
      return state.publishError;
    },
  },
  mutations: {
    setPlans(state, payload) {
      state.plans = payload;
    },
    setDetailInfo(state, payload) {
      state.detailInfo = payload;
    },
    setPublishState(state, payload) {
      state.publishState = payload;
    },
    setPlanList(state, payload) {
      state.planList = payload;
    },
    setIsPublished(state, payload) {
      state.isPublished = payload;
    },

    setPlanLoading(state, payload) {
      state.planLoading = payload;
    },
    setPlanError(state, payload) {
      state.planError = payload;
    },
    setDetailLoading(state, payload) {
      state.detailLoading = payload;
    },
    setDetailError(state, payload) {
      state.detailError = payload;
    },
    setPublishLoading(state, payload) {
      state.publishLoading = payload;
    },
    setPublishError(state, payload) {
      state.publishError = payload;
    },
  },
  actions: {
    getPlanInfo(context, payload) {
      const JWTToken = context.rootGetters["auth/JWTToken"];
      const url = context.rootGetters["auth/baseUrl"] + "/publish/plans";
      getData(url, JWTToken, context, "plan");
    },
    getDetailInfo(context, payload) {
      const id = payload.id;
      const JWTToken = context.rootGetters["auth/JWTToken"];
      const url =
        context.rootGetters["auth/baseUrl"] + `/publish/article/${id}`;

      getData(url, JWTToken, context, "detail");
    },
    postPublish(context, payload) {
      const JWTToken = context.rootGetters["auth/JWTToken"];
      // const url = context.rootGetters["auth/baseUrl"] + "/publish/article";
      const url = "http://127.0.0.1:5000" + "/wordpress_post";
      const data = payload;

      postData(url, data, JWTToken, context, "publish");
    },

    handlePublishData(context, payload) {
      context.commit("setPublishState", true);
    },
    handleDetailData(context, payload) {
      context.commit("setDetailInfo", payload);
    },
    handlePlanData(context, payload) {
      const data = payload;
      context.commit("setPlanList", data);
      const dateMap = new Map();
      data.forEach((plan) => {
        const date = plan.time.split(" ")[0];
        if (dateMap.has(date)) {
          dateMap.get(date).data.push(plan);
        } else {
          dateMap.set(date, {
            more: false,
            data: [plan],
          });
        }
      });
      context.commit("setPlans", dateMap);
    },
  },
};
