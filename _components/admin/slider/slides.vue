<template>
  <div class="row relative-position">
    <div class="col-12">
      <!---Component CRUD Slided -->
      <div class="text-right q-mb-md">
        <crud :crud-data="import('modules/qslider/_crud/slides')" ref="crudSlide"
              type="button-create" :crud-props="{unelevated : true, rounded : true}"
              @updated="$emit('refresh')" @created="$emit('refresh')"
              :custom-data="{formLeft : {sliderId: {value : $route.params.id}}, formRight: { codeAds} }"/>
      </div>
      <!--Items-->
      <draggable
        @change="updateOrderSlides"
        v-model="slider.slides"
        group="slides"
        item-key="id"
      >
        <template #item="{ element, index }">
          <q-card
            class="my-card q-mb-md"
            :key="'slide'+index"
          >
            <div class="row items-center q-pa-sm">
              <!--Title-->
              <div class="col-6">
                <q-chip square icon="fas fa-images" text-color="white" :color="element.active ? 'positive' : 'grey'">
                  {{ element.title }}
                </q-chip>
              </div>
              <!--Actions-->
              <div class="col-6 text-right">
                <q-btn color="blue-4" size="sm" round icon="fas fa-pen" unelevated class="q-mr-sm"
                       @click="$refs.crudSlide.update(element)"/>
                <q-btn @click="deleteSlideDialog(element.id, index)" color="red" unelevated
                       size="sm" round icon="far fa-trash-alt"/>
              </div>
            </div>
            <q-separator/>
            <div class="full-width" v-if="element.imageUrl">
              <iframe
                v-if="(typeof element.imageUrl == 'string') && element.imageUrl.includes('youtube.com')"
                width="100%"
                height="300"
                :src="element.imageUrl"
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
              </iframe>
              <video
                width="100%"
                height="300"
                v-else-if="(typeof element.imageUrl == 'mp4') && element.imageUrl.includes('mp4')"
                class='img-responsive center-block'
                loop
                :controls='false'>
                <source :src="element.imageUrl" type='video/mp4'>
              </video>
              <div
                v-else
                :style="`
        background: url('${element.mediaFiles.slideimage ? element.mediaFiles.slideimage.mediumThumb : ''}');
        background-size: cover;
        background-position: center;
        height: 300px;
        display: block;
        max-width: 100%;`">
              </div>
            </div>
            <div class="full-width" v-else-if="element.url">
              <iframe
                v-if="(typeof element.url == 'string') && element.url.includes('youtube.com')"
                width="100%"
                height="300"
                :src="element.url"
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
              </iframe>
              <video
                width="100%"
                height="300"
                v-else-if="(typeof element.url == 'mp4') && element.url.includes('mp4')"
                class='img-responsive center-block'
                loop
                :controls='false'>
                <source :src="element.url" type='video/mp4'>
              </video>
            </div>
          </q-card>
        </template>
        <!--Item-->
      </draggable>
    </div>
    <!--Loading-->
    <inner-loading :visible="loading"/>
  </div>
</template>

<script>
import renderMedia from 'modules/qslider/_components/admin/slide/renderMedia'
import draggable from 'vuedraggable'
import { eventBus } from 'src/plugins/utils'

export default {
  components: {
    draggable,
    renderMedia
  },
  mounted() {
    this.init()
  },
  data() {
    return {
      loading: false
    }
  },
  props: {
    slider: {
      type: Object,
      default: () => ({
        id: 0,
      })
    },
  },
  emits: ['refresh'],
  watch: {},
  computed: {
    codeAds(){
      if(this.slider.type == 'banner'){
        return {
          value: '',
          type: 'input',
          isTranslatable: true,
          props: {
            type: 'textarea',
            label: `${this.$tr('slider.cms.label.codeAds')}`
          }
        }
      }
      return {}
    }
  },
  methods: {
    init() {
      this.openEditSlide()
    },
    openEditSlide() {
      setTimeout(() => {
        if (this.$route.query.edit) {
          let slideToEdit = (this.slider.slides || []).find(item => item.id == this.$route.query.edit)
          if (slideToEdit) this.$refs.crudSlide.update(slideToEdit)
        }
      }, 500)
    },
    hasPermissionRecordMAster(record) {
      let options = record.options || false
      let response = {
        create: true,
        edit: true,
        index: true,
        destroy: true,
      }
      if (options && parseInt(options.masterRecord)) {
        response = {
          create: this.$hasAccess('isite.master.records.create'),
          edit: this.$hasAccess('isite.master.records.edit'),
          index: this.$hasAccess('isite.master.records.index'),
          destroy: this.$hasAccess('isite.master.records.destroy')
        }
      }
      return response
    },
    log() {
      let slides = this.slider.slides.map(slide => ({id: slide.id}))
      console.error(slides)
    },
    updateOrderSlides() {
      let slides = this.slider.slides.map(slide => ({id: slide.id}))
      let data = {
        slider: slides
      }
      this.loading = true
      this.$crud.create('apiRoutes.qslider.orderSlides', data).then(response => {
        this.$alert.success({message: `${this.$tr('isite.cms.message.recordUpdated')}`})
        this.loading = false
      }).catch(error => {
        this.$alert.error({message: this.$tr('isite.cms.message.errorRequest'), pos: 'bottom'})
        console.warn(error)
        this.loading = false
      })
    },
    deleteSlideDialog(slideId, pos) {
      this.$q.dialog({
        title: 'Confirm',
        ok: 'Delete',
        message: 'You are sure to eliminate this slide?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$crud.delete('apiRoutes.qslider.slides', slideId).then(response => {
          this.$alert.info({message: this.$tr('isite.cms.message.recordDeleted')})
          //this.slider.slides.splice(pos, 1)
          eventBus.emit('deleteSlide', 'deleteSlide')
        }).catch(error => {
          this.$alert.error({message: this.$tr('isite.cms.message.recordNoDeleted'), pos: 'bottom'})
        })
      }).onCancel(() => {
      })
    },
  }
}
</script>

<style scoped>

</style>
