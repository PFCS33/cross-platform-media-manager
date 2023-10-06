export default {
  namespaced: true,
  state() {
    return {
      // 登录状态标记
      isLogin: false,
    };
  },
  getters: {
    isLogin(state) {
      return state.isLogin;
    },
  },
  mutations: {
    setIsLogin(state, payload) {
      state.isLogin = payload;
    },
  },
  actions: {
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
