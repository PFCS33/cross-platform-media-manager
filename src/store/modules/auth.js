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
      const data = {
        username: payload.data.email,
        password: payload.data.password,
      };
      const mode = payload.mode;

      const url = context.getters.baseUrl + "/" + mode;

      context.commit("setLoading", true);
      setTimeout(() => {
        context.commit("setLoading", false);
        context.commit("setError", {
          state: false,
          message: "",
          mode: mode,
        });
        // context.commit("setError", {
        //   state: true,
        //   message: "network error",
        //   mode: mode,
        // });
      }, 500);
      // fetch(url, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(data),
      // })
      //   .then((response) => {
      //     if (!response.ok) {
      //       throw new Error("RESPONSE ERROR");
      //     }
      //     return response.json();
      //   })
      //   .then((data) => {
      //     context.commit("setError", {
      //       state: false,
      //       message: "",
      //     });
      //     context.commit("setLoading", false);
      //     context.dispatch("handleData", data);
      //   })
      //   .catch((error) => {
      //     context.commit("setError", {
      //       state: true,
      //       message: error.message,
      //     });
      //     context.commit("setLoading", false);
      //     console.error("error:", error.message);
      //   });
    },
    handleData(context, payload) {
      console.log(data);
    },

    //     loadData(context, _payload) {
    //       const roadId = context.getters["roadId"];
    //       let file = null;
    //       if (roadId === 0) {
    //         file = "sum.csv";
    //       } else {
    //         file = `type_${roadId}.0.csv`;
    //       }
    //       const path = `../../../public/data/queue/${file}`;
    //       d3.csv(path, d3.autoType).then(function (data) {
    //         // 将字符串转换成数字
    //         data.forEach(function (d) {
    //           d["type1_num"] = +d["type1_num"];
    //           d["type10_num"] = +d["type10_num"];
    //           d["type3_num"] = +d["type3_num"];
    //           d["type4_num"] = +d["type4_num"];
    //           d["type6_num"] = +d["type6_num"];
    //         });
    //         //console.log("in actions:", data);
    //         context.commit("setDrawData", data);
    //         // console.log("loadDone");
    //         //console.log(data);
    //       });
    //     },
  },
};
