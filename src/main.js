import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { VueFire, VueFireAuth } from 'vuefire'
import { firebaseApp } from './firebase'
import { loadFonts } from './plugins/webfontloader'

loadFonts()

createApp(App)
  .use(router)
  .use(store)
  .use(vuetify).use(VueFire, { firebaseApp, modules: [VueFireAuth()] })
  .mount('#app')
