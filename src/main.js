import { createApp } from 'vue' // auto generated from vue
import App from './App.vue'     // "
import router from './router'   // router import from vue
import store from './store'     // functions we need to communicate with the back-end (vue plugin)
import vuetify from './plugins/vuetify' // vue plugin for styling and design
import { VueFire, VueFireAuth } from 'vuefire' // authentification between user and Firebase
import { firebaseApp } from './firebase'
import { loadFonts } from './plugins/webfontloader' // text fonts

loadFonts()

createApp(App)
  .use(router)
  .use(store)
  .use(vuetify).use(VueFire, { firebaseApp, modules: [VueFireAuth()] })
  .mount('#app')
