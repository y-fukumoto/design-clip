import Vue from 'vue'
import mainHeader from './components/main-header.vue'
import mainContents from './components/main-contents.vue'
import materializeCss from 'materialize-css'

new Vue({
  el: '#app',
  components: {
    mainHeader,
    mainContents
  }
})