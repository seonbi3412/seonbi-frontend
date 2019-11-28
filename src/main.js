import Vue from 'vue'
import VueSession from 'vue-session'
import App from './App.vue'
import router from './router'
import store from './store'
import BootstrapVue from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import VueAwesomeSwiper from 'vue-awesome-swiper'
import StarRating from 'vue-star-rating'

// require styles
import 'swiper/dist/css/swiper.css'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret, faTrashAlt, faPen, faSearch, faHeart } from '@fortawesome/free-solid-svg-icons'



library.add(faUserSecret, faTrashAlt, faPen, faSearch, faHeart)

Vue.component('star-rating', StarRating)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(VueAwesomeSwiper, /* { default global options } */)
Vue.config.productionTip = false
Vue.use(VueSession)
Vue.use(BootstrapVue)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')