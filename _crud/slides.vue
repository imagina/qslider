<template></template>
<script>
export default {
  data() {
    return {
      crudId: this.$uid(),
    };
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        entityName: config('main.qslider.entityNames.slide'),
        apiRoute: 'apiRoutes.qslider.slides',
        permission: 'slider.slides',
        extraFormFields: 'Slider.crud-fields.slides',
        create: {
          title: this.$tr('slider.cms.newSlide'),
        },
        read: {
          columns: [],
          requestParams: {},
        },
        update: {
          title: this.$tr('slider.cms.updateSlide'),
          requestParams: { include: 'locatable' },
        },
        delete: true,
        formLeft: {
          id: { value: '' },
          userId: { value: this.$store.state.quserAuth.userId },
          title: {
            value: '',
            type: 'input',
            isTranslatable: true,
            props: {
              label: `${this.$tr('isite.cms.form.title')}`,
            },
          },
          caption: {
            value: '',
            type: 'input',
            isTranslatable: true,
            props: { label: this.$tr('slider.cms.label.buttonText') },
          },
          uri: {
            value: '',
            type: 'input',
            isTranslatable: true,
            props: {
              label: 'URI',
            },
          },
          url: {
            value: '',
            type: 'input',
            isTranslatable: true,
            props: {
              label: 'URL',
            },
          },
          externalImageUrl: {
            value: '',
            type: 'input',
            isTranslatable: true,
            props: {
              label: `${this.$tr('isite.cms.form.image')}`,
            },
          },
          summary: {
            value: '',
            type: 'input',
            isTranslatable: true,
            props: {
              type: 'textarea',
              label: `${this.$tr('isite.cms.form.summary')}`,
            },
          },
          customHtml: {
            value: '',
            type: 'html',
            isTranslatable: true,
            props: {
              label: `${this.$tr('isite.cms.form.description')}`,
            },
          },
        },
        formRight: {
          active: {
            value: '1',
            type: 'select',
            isTranslatable: true,
            props: {
              label: this.$tr('isite.cms.form.status'),
              options: [
                { label: this.$tr('isite.cms.label.enabled'), value: '1' },
                { label: this.$tr('isite.cms.label.disabled'), value: '0' },
              ],
            },
          },
          targetField: {
            name: 'target',
            value: null,
            type: 'select',
            props: {
              label: this.$tr('isite.cms.form.option'),
              options: [
                { label: 'Same tab', value: '_self' },
                { label: 'New tab', value: '_blank' },
              ],
            },
          },
          typeField: {
            name: 'type',
            value: null,
            type: 'select',
            props: {
              label: this.$tr('isite.cms.form.type'),
              options: [
                { label: 'Auto', value: 'auto' },
                { label: '360', value: '360' },
                { label: 'Video', value: 'video' },
                { label: 'Image', value: 'image' },
              ],
            },
          },
          responsive: {
            value: '1',
            type: 'select',
            props: {
              label: this.$tr('isite.cms.label.responsive'),
              options: [
                {
                  label: `${this.$tr('isite.cms.label.mobile')} & PC`,
                  value: '1',
                },
                { label: 'PC', value: '2' },
                { label: this.$tr('isite.cms.label.mobile'), value: '3' },
              ],
            },
          },
          countryId: {
            value: null,
            type: 'select',
            fakeFieldName: 'locatable',
            props: {
              label: this.$tr('isite.cms.label.country'),
              clearable: true,
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qlocations.countries',
              select: { label: 'name', id: 'id' },
            },
          },
          provinceId: {
            value: null,
            type: 'select',
            fakeFieldName: 'locatable',
            props: {
              label: this.$tr('isite.cms.label.department'),
              readonly: this.crudInfo.locatable?.countryId ? false : true,
              clearable: true,
            },
            loadOptions: {
              apiRoute: this.crudInfo.locatable?.countryId
                ? 'apiRoutes.qlocations.provinces'
                : false,
              select: { label: 'name', id: 'id' },
              requestParams: { filter: { country: this.crudInfo.locatable?.countryId } },
            },
          },
          cityId: {
            value: null,
            type: 'select',
            fakeFieldName: 'locatable',
            props: {
              label: this.$tr('isite.cms.form.city'),
              readonly: this.crudInfo.locatable?.provinceId ? false : true,
              clearable: true,
            },
            loadOptions: {
              apiRoute: this.crudInfo.locatable?.provinceId
                ? 'apiRoutes.qlocations.cities'
                : false,
              select: { label: 'name', id: 'id' },
              requestParams: {
                filter: { province_id: this.crudInfo.locatable?.provinceId },
              },
            },
          },
          mediasSingle: {
            value: {},
            type: 'media',
            props: {
              label: this.$tr('isite.cms.form.image'),
              zone: 'slideimage',
              entity: 'Modules\\Slider\\Entities\\Slide',
              entityId: null,
            },
          },
        },
      };
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {};
    },
  },
};
</script>
