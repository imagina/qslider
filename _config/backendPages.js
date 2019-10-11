export default {
  //Home Page
  index: {
    permission: 'slider.sliders.index',
    activated: true,
    path: '/slider/index',
    name: 'qslider.admin.sliders',
    page: () => import('@imagina/qslider/_layouts/admin/index'),
    layout: () => import('src/layouts/master'),
    title: 'qslider.sidebar.adminIndex',
    icon: 'fas fa-images',
    authenticated: true,
  },
}
