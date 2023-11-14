import { createStore } from "vuex";
import authModule from "./modules/auth";
import platformModule from "./modules/platform";
import publishModule from "./modules/publish";
const store = createStore({
  modules: {
    auth: authModule,
    platform: platformModule,
    publish: publishModule,
  },
});

export default store;
