<template>
  <div id="sliderIndex"
       class="q-layout-page row layout-padding">
    <!--TITLE-->
    <h1 class="q-headline text-primary">
      <q-icon name="fas fa-images"></q-icon>
      Sliders
    </h1>


    <div class="col-12 text-right backend-page relative-position">
      <div class="border-top-color row shadow-1" style="padding: 0px !important;">
        <!--Actions-->
        <div class="col-12 q-pa-md">
          <q-search
            hide-underline
            clearable
            color="primary"
            class="float-left"
            v-model="filter.search"
            @input="getData({pagination:pagination,search:filter.search})"
          />
          <q-btn-group class="q-mr-sm">
            <q-btn-toggle
              v-model="viewTable"
              toggle-color="primary"
              color="grey-3"
              text-color="grey-8"
              :options="[
                {icon: 'fas fa-align-justify', value: true},
                {icon: 'fas fa-th', value: false}
              ]"
            />
          </q-btn-group>
          <!--Button new record-->
          <q-btn icon="fas fa-edit" color="positive" label="New Slider"
                 @click="showSliderModal(false)" v-if="$auth.hasAccess('slider.sliders.create')"/>
          <!--Button refresh data-->
          <q-btn color="info" icon="fas fa-sync" class="q-ml-sm"
                 @click="getData({pagination:pagination,search:filter.search},true)"
          ></q-btn>
        </div>

        <!--== Carousels ==-->
        <div class="col-12 q-px-md" v-if="!viewTable">
          <div class="row gutter-xs">
            <div class="col-12 col-sm-4 col-md-3" v-for="slider in dataTable" :key="slider.id">
              <div class="q-subheading bg-primary text-white text-left q-px-sm q-py-xs">
                {{slider.id+'. '+slider.name}}
              </div>
              <q-carousel color="white" autoplay infinite quick-nav height="200px">
                <q-carousel-slide v-for="slide in slider.slides" :key="slide.id" :img-src="slide.imageUrl">
                  <!--== Video ==-->
                  <q-video
                    v-if="slide.url"
                    class="absolute-full"
                    :src="slide.url"
                  />
                </q-carousel-slide>
                <!--== Carousels Controls ==-->
                <q-carousel-control
                  slot="control-button"
                  slot-scope="carousel"
                  position="bottom-right"
                  :offset="[18, 22]"
                >
                  <q-btn color="primary" @click="carousel.toggleFullscreen()" icon="fas fa-expand">
                    <q-tooltip>Full Screen</q-tooltip>
                  </q-btn>
                </q-carousel-control>
              </q-carousel>
              <div class="row q-py-xs justify-end bg-grey-3">
                <!--== Slider Active ==-->
                <q-toggle v-model="slider.active" @input="updateOrCreateSlider(slider)">
                  <q-tooltip :offset="[5, 5]">
                    {{slider.active ? 'Unactive' : 'Active'}}
                  </q-tooltip>
                </q-toggle>

                <!--== Slider Edit ==-->
                <q-btn icon="fas fa-pen" color="positive" size="sm" class="q-mx-xs"
                       @click="showSliderModal(slider)" v-if="$auth.hasAccess('slider.sliders.edit')">
                  <q-tooltip :offset="[5, 5]">
                    Edit
                  </q-tooltip>
                </q-btn>

                <!--== Slider Delete ==-->
                <q-btn icon="far fa-trash-alt" color="negative" size="sm"
                       class="q-mx-xs" @click="dialogDeleteSlider.handler(slider.id)"
                       v-if="$auth.hasAccess('slider.sliders.destroy')">
                  <q-tooltip :offset="[5, 5]">
                    Delete
                  </q-tooltip>
                </q-btn>
              </div>
            </div>
            <div class="col-12">
              <q-pagination
                class="justify-center q-ma-lg"
                v-if="pagination.rowsNumber > 1"
                v-model="pagination.page"
                color="primary"
                @input="getData({pagination:pagination,search:filter.search})"
                :max="pagination.rowsNumber"
                :max-pages="6"
                boundary-links
                direction-links
              />
            </div>
          </div>
        </div>

        <!--== Table ==-->
        <div class="col-12" v-if="viewTable">
          <q-table
            :loading="loading"
            :data="dataTable"
            :columns="columns"
            :pagination.sync="pagination"
            row-key="filename"
            @request="getData"
            class="no-shadow"
          >
            <!--= Actions =-->
            <q-td slot="body-cell-actions"
                  slot-scope="props" :props="props">
              <!--== Slider Active ==-->
              <q-toggle v-model="props.row.active" @input="updateOrCreateSlider(props.row)">
                <q-tooltip :offset="[5, 5]">
                  {{props.row.active ? 'Unactive' : 'Active'}}
                </q-tooltip>
              </q-toggle>

              <q-btn
                icon="fas fa-pen"
                color="positive"
                size="sm"
                class="q-mx-xs"
                @click="showSliderModal(props.row)"
                v-if="$auth.hasAccess('slider.sliders.edit')"/>

              <q-btn
                icon="far fa-trash-alt"
                color="negative"
                size="sm"
                class="q-mx-xs"
                @click="dialogDeleteSlider.handler(props.row.id)"
                v-if="$auth.hasAccess('slider.sliders.destroy')"/>
            </q-td>

          </q-table>
        </div>
      </div>

      <!--Loading-->
      <inner-loading :visible="loading"/>
    </div>


    <q-modal v-model="modalSlider"
             v-if="sliderToEdit"
             id="sliderModalEdit"
             :content-css="{minWidth: '80vw', minHeight: '80vh'}">
      <q-modal-layout>
        <q-toolbar slot="header">
          <q-btn
            flat
            round
            dense
            v-close-overlay
            @click="getData({pagination:pagination,search:filter.search},true)"
            icon="keyboard_arrow_left"
          />
          <q-toolbar-title>
            Edit Slider
          </q-toolbar-title>
        </q-toolbar>


        <div class="layout-padding">
          <div class="row gutter-md">
            <div v-if="sliderToEdit.id" class="col-12 col-md-7 text-right">


              <draggable v-model="sliderToEdit.slides" group="slides">
                <div v-for="(slide,index) in sliderToEdit.slides" :key="'slide'+index"
                     :style="'background-image: url('+slide.imageUrl+'); position:relative'"
                     class="image border q-my-sm col-12 col-sm-4 col-md-3">

                  <div style="bottom: 5px; right: 5px; position: absolute;">
                    <q-btn icon="fas fa-pen" color="positive" round size="xs" class="q-mx-xs"
                           @click="showSlideModal(slide)"/>
                    <q-btn icon="far fa-trash-alt" color="negative" size="xs" class="q-mx-xs" round
                           @click="deleteSlide(slide.id, index)"/>

                  </div>


                </div>
              </draggable>
              <q-btn icon="add" color="positive" round size="xs" class="q-mx-xs" @click="showSlideModal(false)">
                <q-tooltip :offset="[5, 5]">
                  Add Slide
                </q-tooltip>
              </q-btn>
            </div>
            <div :class="'col-12 '+ (sliderToEdit.id ? 'col-md-5' : '')">
              <q-field
              >
                <q-input float-label="Name" type="text" v-model="sliderToEdit.name"/>
              </q-field>

              <q-field
                v-if="$auth.hasAccess('slider.sliders.edit-system-name')"
              >
                <q-input float-label="System Name" type="text" v-model="sliderToEdit.systemName"/>
              </q-field>
              <!--== Slide Active ==-->
              <q-toggle label="Active" v-model="sliderToEdit.active" class="q-my-sm">
                <q-tooltip :offset="[5, 5]">
                  {{sliderToEdit.active ? 'Unactive' : 'Active'}}
                </q-tooltip>
              </q-toggle>
            </div>
            <div class="col-12 text-center">
              <q-btn color="primary" label="Save" @click="updateOrCreateSlider(sliderToEdit); modalSlider = false"/>
            </div>

          </div>

        </div>
      </q-modal-layout>
    </q-modal>


    <q-modal v-model="modalSlide"

             :key="slideToEdit.id ? slideToEdit.id : ''"
             id="sliderModalEdit"
             :content-css="{minWidth: '80vw', minHeight: '80vh'}">
      <q-modal-layout>
        <q-toolbar slot="header">
          <q-btn
            flat
            round
            dense
            v-close-overlay
            icon="keyboard_arrow_left"
          />
          <q-toolbar-title>
            Edit Slide
          </q-toolbar-title>
        </q-toolbar>


        <div class="layout-padding">
          <locales v-model="locale"></locales>

          <div class="row gutter-xs" v-if="locale.success">

            <div class="col-12">
              <q-field
              >
                <q-input :float-label="'Title ('+locale.language+')'" type="text" v-model="locale.formTemplate.title"/>
              </q-field>
              <q-field
              >
                <q-input :float-label="'Caption ('+locale.language+')'" type="text"
                         v-model="locale.formTemplate.caption"/>
              </q-field>

              <q-field
              >
                <q-input :float-label="'URI ('+locale.language+')'" type="text" v-model="locale.formTemplate.uri"/>
              </q-field>

              <q-field
              >
                <q-input :float-label="'URL ('+locale.language+')'" type="text" v-model="locale.formTemplate.url"/>
              </q-field>
              <q-field
              >
                <q-input :float-label="'External Image Url ('+locale.language+')'" type="text"
                         v-model="locale.formTemplate.externalImageUrl"/>
              </q-field>

              <q-field
              >
                <q-editor :float-label="'Custom HTML ('+locale.language+')'" v-model="locale.formTemplate.customHtml"/>

              </q-field>

              <!--== Slide Active ==-->
              <q-toggle :label="'Active ('+locale.language+')'" v-model="locale.formTemplate.active" class="q-my-sm">
                <q-tooltip :offset="[5, 5]">
                  {{locale.formTemplate.active ? 'Unactive' : 'Active'}}
                </q-tooltip>
              </q-toggle>

              <q-field
              >
                <q-select
                  float-label="Target"
                  v-model="locale.formTemplate.target"
                  :options="[
                  {value: '_self', label: 'Same tab'},
                  {value: '_blank', label: 'New tab'}
                  ]"/>

              </q-field>

              <q-field
              >
                <q-select
                  float-label="Type"
                  v-model="locale.formTemplate.type"
                  :options="[
                  {value: 'auto', label: 'Auto'},
                  {value: '360', label: '360'},
                  {value: 'video', label: 'Video'},
                  {value: 'image', label: 'Image'}
                  ]"/>

              </q-field>
              <media-form
                entity="Modules\Slider\Entities\Slide"
                :entity-id="slideToEdit.id ? slideToEdit.id : ''"
                v-model="locale.formTemplate.mediasSingle"
                label="Slide Image"
                zone="slideimage"
                :key="mediaKey"
              />

            </div>
            <div class="col-12 text-center">
              <q-btn color="primary" label="Save" @click="updateOrCreateSlide(); modalSlide = false"/>
            </div>

          </div>

        </div>
      </q-modal-layout>
    </q-modal>
  </div>
</template>
<script>
  /*Plugins*/
  import {alert} from '@imagina/qhelper/_plugins/alert'
  import {uid} from 'quasar'

  /*Services*/
  import sliderService from '@imagina/qslider/_services/index'

  /*Components*/
  import draggable from 'vuedraggable'
  import mediaForm from '@imagina/qmedia/_components/form'
  import locales from '@imagina/qsite/_components/locales'
  import innerLoading from 'src/components/master/innerLoading'

  export default {
    props: {},
    components: {
      draggable,
      mediaForm,
      locales,
      innerLoading
    },
    watch: {},
    computed: {},
    mounted() {
      this.$nextTick(function () {
        this.getData({pagination: this.pagination, search: this.filter.search});
      })
    },
    data() {
      return {
        locale: {
          fields: {
            target: null,
            externalImageUrl: '',
            mediasSingle: {},
            sliderId: '',
            position: 0,
            type: 'auto'
          },
          fieldsTranslatable: {
            title: '',
            caption: '',
            active: false,
            url: '',
            uri: '',
            customHtml: '',
          }
        },
        dataTable: [],
        mediaKey: uid(),
        modalSlider: false,
        modalSlide: false,
        sliderToEdit: {},
        slideToEdit: {},
        dialogDeleteSlider: {
          handler: (id) => {
            this.$q.dialog({
              title: 'Confirm',
              ok: 'Delete',
              message: 'you are sure to eliminate this slider?',
              cancel: 'Cancel'
            }).then(() => {
              this.deleteSlider(id)
            }).catch(() => {
            })
          }
        },
        viewTable: false,
        pagination: {
          page: 1,
          rowsPerPage: 15,
          rowsNumber: 1
        },
        loading: false,
        filter: {
          search: ''
        },
        columns: [
          {name: 'id', label: 'ID', field: 'id'},
          {
            name: 'name', label: 'Name', field: 'name',
            align: 'left', sortable: true, style: 'width: 40%'
          },
          {
            name: 'createdAt', label: 'Created At', field: 'createdAt',
            format: val => val ? this.$d(this.$moment(val, 'YYYY-MM-DD HH:mm').toDate(), 'short', this.$q.i18n.lang) : '-',
            align: 'left', sortable: true
          },
          {
            name: 'actions', label: 'actions', align: 'center'
          },

        ],
      }
    },
    methods: {
      async getData({pagination, search}, refresh = false) {

        this.loading = true
        // clear storage cache
        if (refresh)
          this.$helper.clearCache('apiRoutes.slider.sliders')

        let params = {
          params: {
            filter: {
              search: this.filter.search,
              allTranslations: true
            },
            page: pagination.page,
            take: pagination.rowsPerPage,
          },
          refresh: refresh
        }

        // index all media by params
        sliderService.crud.index('apiRoutes.slider.sliders', params).then(response => {
          this.dataTable = response.data

          this.pagination.rowsPerPage = response.meta.page.perPage;
          this.pagination.page = response.meta.page.currentPage;
          this.pagination.rowsNumber = response.meta.page.lastPage;

          if (this.modalSlider) {
            let slider = this.dataTable.find(slider => slider.id === this.sliderToEdit.id);
            this.sliderToEdit = slider;
          }

          this.loading = false
        })

      },

      showSliderModal(slider) {

        if (slider) {
          this.sliderToEdit = slider;
        } else {
          this.sliderToEdit = {
            name: '',
            systemName: '',
            active: false,
            slides: []
          }
        }
        this.modalSlider = true
      },

      showSlideModal(slide) {

        if (slide) {
          //slide.mediasSingle = {}
          this.slideToEdit = slide
          this.locale.form = slide
        } else {
          this.locale.form = this.slideToEdit = {
            title: '',
            caption: '',
            active: false,
            url: '',
            uri: '',
            customHtml: '',
            target: null,
            externalImageUrl: '',
            mediasSingle: {},
            sliderId: this.sliderToEdit.id,
            position: this.sliderToEdit.slides.length
          }
          this.locale.form.sliderId = this.sliderToEdit.id
          this.locale.form.position = this.sliderToEdit.slides.length
        }
        this.mediaKey = uid()
        this.modalSlide = true
      },

      updateOrCreateSlider(data) {
        this.loading = true
        if (this.sliderToEdit.id) {
          sliderService.crud.update('apiRoutes.slider.sliders', data.id, data).then(response => {
            alert.success('Slider updated', 'top')
            this.getData({pagination: this.pagination, search: this.filter.search}, true)

          }).catch(error => {
            alert.error('Slider not updated', 'bottom', false, 2500)
            this.loading = false
          })
        } else {
          sliderService.crud.create('apiRoutes.slider.sliders', data).then(response => {
            alert.success('Slider created', 'top')
            this.getData({pagination: this.pagination, search: this.filter.search}, true)

          }).catch(error => {
            alert.error('Slider not created', 'bottom', false, 2500)
            this.loading = false
          })
        }
      },

      updateOrCreateSlide() {
        this.loading = true
        if (this.slideToEdit.id) {
          sliderService.crud.update('apiRoutes.slider.slides', this.slideToEdit.id, this.locale.form).then(response => {
            alert.success('Slide updated', 'top')
            this.getData({pagination: this.pagination, search: this.filter.search}, true)
          }).catch(error => {
            alert.error('Slide not updated', 'bottom', false, 2500)
            this.loading = false
          })
        } else {
          sliderService.crud.create('apiRoutes.slider.slides', this.locale.form).then(response => {
            alert.success('Slide created', 'top')
            this.getData({pagination: this.pagination, search: this.filter.search}, true)
          }).catch(error => {
            alert.error('Slide not created', 'bottom', false, 2500)
            this.loading = false
          })
        }

      },

      deleteSlider(id) {
        this.loading = true
        sliderService.crud.delete('apiRoutes.slider.sliders', id).then(response => {
          alert.success('Slider Deleted', 'top')
          this.getData({pagination: this.pagination, search: this.filter.search}, true)
        }).catch(error => {
          alert.error('Slider not deleted', 'bottom', false, 2500)
          this.loading = false
        })
      },

      deleteSlide(slideId, pos) {
        this.loading = true
        sliderService.crud.delete('apiRoutes.slider.slides', slideId).then(response => {
          alert.success('Slide Deleted', 'top')
          this.sliderToEdit.slides.splice(pos, 1);
          this.getData({pagination: this.pagination, search: this.filter.search}, true)
        }).catch(error => {
          alert.error('Slide not deleted', 'bottom', false, 2500)
          this.loading = false
        })
      }
    }

  }
</script>
<style lang="stylus">
  @import "~variables";
  #sliderModalEdit
    .image
      background-repeat no-repeat
      background-size contain
      background-position center center
      cursor all-scroll
      height 150px
      overflow hidden
</style>
