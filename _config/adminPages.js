export default {
  //Home Page
  index: {
    permission: 'slider.sliders.manage',
    activated: true,
    path: '/slider/index',
    name: 'qslider.admin.sliders',
    crud : import('@imagina/qslider/_crud/sliders'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'slider.cms.sidebar.adminSlider',
    icon: 'fas fa-file-export',
    authenticated: true,
    subHeader: {refresh: true}
  },
  showSlider: {
    permission: 'slider.sliders.index',
    activated: true,
    path: '/slider/show/:id',
    name: 'qslider.admin.sliders.show',
    page: () => import('@imagina/qslider/_pages/admin/sliders/form'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'slider.cms.sidebar.adminSliderEdit',
    icon: 'fas fa-image',
    authenticated: true,
    subHeader : {
      refresh: true,
      breadcrumb: ['qslider.index']
    }
  },
  createSlide: {
    permission: 'slider.sliders.index',
    activated: true,
    path: '/slide/create/:sliderId',
    name: 'qslider.admin.slide.create',
    page: () => import('@imagina/qslider/_pages/admin/slide/create.vue'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'slider.cms.sidebar.adminIndex',
    icon: 'fas fa-images',
    authenticated: true,
  },
  updateSlide: {
    permission: 'slider.sliders.index',
    activated: true,
    path: '/slide/update/:sliderId/:id',
    name: 'qslider.admin.slide.update',
    page: () => import('@imagina/qslider/_pages/admin/slide/show.vue'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'slider.cms.sidebar.adminIndex',
    icon: 'fas fa-images',
    authenticated: true,
  },
}
