<template></template>
<script>
  export default {
    data() {
      return {
        crudId: this.$uid()
      }
    },
    computed: {
      crudData() {
        return {
          crudId: this.crudId,
          entityName: config("main.qslider.entityNames.slider"),
          apiRoute: 'apiRoutes.qslider.sliders',
          permission: 'slider.sliders',
          extraFormFields: 'Slider.crud-fields.slider',
          create: {
            title: this.$tr('slider.cms.newSlider'),
          },
          read: {
            columns: [
              {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', style: 'width: 50px'},
              {name: 'name', label: this.$tr('isite.cms.form.name'), field: 'name', align: 'rigth'},
              {name: 'systemName', label: this.$tr('isite.cms.form.systemName'), field: 'systemName', align: 'rigth'},
              {name: 'type', label: this.$tr('isite.cms.form.type'), field: 'type', align: 'rigth'},

              {name: 'active', label: this.$tr('isite.cms.form.status'), field: 'active', align: 'left'},
              {
                name: 'created_at', label: this.$tr('isite.cms.form.createdAt'), field: 'createdAt', align: 'left',
                format: val => val ? this.$trd(val) : '-',
              },
              {name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left'},
            ],
            requestParams: {}
          },
          update: {
            to: 'qslider.admin.sliders.show'
          },
          delete: true,
          formLeft: {
            id: {value: ''},
            userId: {value: this.$store.state.quserAuth.userId},
            name: {
              value: '',
              type: 'input',
              props: {
                label: `${this.$tr('isite.cms.form.name')}*`,
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired')
                ],
              },
            },
            active: {
              value: '1',
              type: 'select',
              props: {
                label: this.$tr('isite.cms.form.status'),
                options: [
                  {label: this.$tr('isite.cms.label.enabled'), value: '1'},
                  {label: this.$tr('isite.cms.label.disabled'), value: '0'},
                ]
              }
            },
            type: {
              value: 'slider',
              type: 'select',
              props: {
                label: this.$tr('isite.cms.form.type'),
                options: [
                  {label: this.$tr('slider.cms.form.slider'), value: 'slider'},
                  {label: this.$tr('slider.cms.form.banner'), value: 'banner'},
                ]
              }
            },
          },
          formRight: {},
        }
      },
      //Crud info
      crudInfo() {
        return this.$store.state.qcrudComponent.component[this.crudId] || {}
      }
    },
  }
</script>
