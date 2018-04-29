const Foo = {
  template: '<div>/</div>'
}

const Bar = {
  template: '<div>/foo</div>'
}

const routes = [
  {
    path: '/foo',
    component: Foo
  },
  {
    path: '/bar',
    component: Bar
  },
]

export default routes