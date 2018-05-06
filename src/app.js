import Vue from 'vue'
import mainHeader from './components/main-header.vue'
import mainContents from './components/main-contents.vue'
import materializeCss from 'materialize-css'
import VueAnalytics from 'vue-analytics'

import axios from 'axios'
import store from './store'

import VueRouter from 'vue-router';
import routes from './routes/';
const router = new VueRouter({
  routes,
});
Vue.use(VueRouter);
Vue.use(VueAnalytics, {
  id: 'UA-49863180-2',
  router
})

const getData = async () => {
  const res = await axios.get('/api/designs')
  store.setDesignData(res.data)
  store.setRegisteredTags(res.data)
  return
}

getData().then(() => {
  new Vue({
    el: '#app',
    router: router,
    components: {
      mainHeader
    }
  })
})

