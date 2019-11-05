export default {
  //Home Page
  index: {
    permission: 'slider.sliders.index',
    activated: true,
    path: '/slider/index',
    name: 'qslider.admin.sliders',
    page: () => import('@imagina/qslider/_pages/admin/index'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qslider.sidebar.adminIndex',
    icon: 'fas fa-images',
    authenticated: true,
  },
}
