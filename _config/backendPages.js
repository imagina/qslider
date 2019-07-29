//Layout container
import master from 'src/layouts/master'
import config from 'src/layouts/config'

//Middleware
import auth from '@imagina/quser/_router/middlewares/auth'
import access from '@imagina/quser/_router/middlewares/access'

export default {
  //Home Page
  index: {
    permission: 'slider.sliders.index',
    activated: true,
    path: '/slider/index',
    name: 'qslider.admin.sliders',
    layout: require('@imagina/qslider/_layouts/admin/index').default,
    containerLayout: master,
    title: 'qslider.sidebar.adminIndex',
    icon: 'fas fa-images',
    middleware: [auth,access]
  },
}
