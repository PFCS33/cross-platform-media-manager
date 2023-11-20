import { getData } from "@/services/fetchData";

export default {
  namespaced: true,
  state() {
    return {
      plans: null, //  a hash map: (date, [{}, {}, ...])
      detailInfo: null,

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
    };
  },
  getters: {
    plans(state) {
      return state.plans;
    },
    detailInfo(state) {
      return state.detailInfo;
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
  },
  mutations: {
    setPlans(state, payload) {
      state.plans = payload;
    },
    setDetailInfo(state, payload) {
      state.detailInfo = payload;
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

    handleDetailData(context, payload) {
      context.commit("setDetailInfo", payload);
    },
    handlePlanData(context, payload) {
      const data = payload;
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
