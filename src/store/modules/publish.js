import { getData } from "@/services/fetchData";

export default {
  namespaced: true,
  state() {
    return {
      plans: null, //  a hash map: (date, [{}, {}, ...])
      loading: false,
      error: {
        state: true,
        message: "",
      },
    };
  },
  getters: {
    plans(state) {
      return state.plans;
    },

    loading(state) {
      return state.loading;
    },
    error(state) {
      return state.error;
    },
  },
  mutations: {
    setPlans(state, payload) {
      state.plans = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    setError(state, payload) {
      state.error = payload;
    },
  },
  actions: {
    getPlanInfo(context, payload) {
      const JWTToken = context.rootGetters["auth/JWTToken"];
      const url = context.rootGetters["auth/baseUrl"] + "/publish/plans";
      getData(url, JWTToken, context);
    },
    handleData(context, payload) {
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
