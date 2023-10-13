export default {
  namespaced: true,
  state() {
    return {
      accountInfo: null, // a hash map: (platform, [{}, {}, ...])
    };
  },
  getters: {
    accountInfo(state) {
      return state.accountInfo;
    },
  },
  mutations: {
    setAccountInfo(state, payload) {
      state.accountInfo = payload;
    },
  },
  actions: {
    getAccountInfo(context, payload) {
      let dataFromBackend = null;
      // false
      setTimeout(() => {
        dataFromBackend = [
          {
            username: "aaa",
            platform: "weibo",
            isLogin: false,
          },
          {
            username: "bbb",
            platform: "weibo",
            isLogin: true,
          },
          {
            username: "ccc",
            platform: "weibo",
            isLogin: true,
          },

          {
            username: "aaaa",
            platform: "x",
            isLogin: true,
          },
          {
            username: "bbbb",
            platform: "facebook",
            isLogin: true,
          },
          {
            username: "cccc",
            platform: "instogram",
            isLogin: true,
          },
        ];
        const platformMap = new Map();
        dataFromBackend.forEach((info) => {
          const platform = info.platform;
          if (platformMap.has(platform)) {
            platformMap.get(platform).push(info);
          } else {
            platformMap.set(platform, [info]);
          }
        });

        context.commit("setAccountInfo", platformMap);
      }, 500);
    },
  },
};
