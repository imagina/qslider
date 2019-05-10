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
    name: 'app.slider.index',
    layout: require('@imagina/qslider/_layouts/index').default,
    containerLayout: master,
    title: 'Slider',
    icon: 'fas fa-list-alt',
    middleware: [auth]
  },
}
