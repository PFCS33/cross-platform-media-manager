import { createStore } from "vuex";
import authModule from "./modules/auth";
import platformModule from "./modules/platform";
import publishModule from "./modules/publish";
import draftModule from "./modules/draft";
import userModule from "./modules/user";
const store = createStore({
  modules: {
    auth: authModule,
    platform: platformModule,
    publish: publishModule,
    draft: draftModule,
    user: userModule,
  },
});

export default store;
