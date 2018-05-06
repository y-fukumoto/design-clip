import mainContents from '../components/main-contents.vue'
import designView from '../components/design.vue'

const a = {
  template: '<div>a</div>'
}

const routes = [
  {
    path: '/',
    component: mainContents
  },
  {
    path: '/aa',
    component: a
  },
  {
    path: '/design/:id',
    component: designView
  },
]

export default routes