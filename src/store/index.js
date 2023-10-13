import { createStore } from "vuex";
import authModule from "./modules/auth";
import platformModule from "./modules/platform";
const store = createStore({
  modules: {
    auth: authModule,
    platform: platformModule,
  },
});

export default store;
