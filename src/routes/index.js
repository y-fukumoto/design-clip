import mainContents from '../components/main-contents.vue'
import designView from '../components/design.vue'

const routes = [
  {
    path: '/',
    component: mainContents
  },
  {
    path: '/design/:id',
    component: designView
  },
]

export default routes