<template>
  <div id="sliderIndex">
    <q-no-ssr>
      <!--List Carousel-->
      <div class="col-12 text-right backend-page relative-position">
        <div class="box row" style="padding: 0px !important;">
          <!--Actions-->
          <div class="col-12 q-pa-md">
            <!--Search-->
            <q-input clearable v-model="filter.search" dense outlined debounce="800"
                     :placeholder="`${$tr('isite.cms.label.search',{capitalize : true})}...`"
                     style="max-width: 200px" class="float-left"
                     @update:modelValue="getData({pagination:pagination,search:filter.search})">
              <template v-slot:append>
                <q-icon name="fas fa-search"/>
              </template>
            </q-input>

            <div class="float-right">
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
              <q-btn icon="fas fa-edit" color="green" :label="$tr('slider.cms.newSlider')"
                     @click="showSliderModal(false)" v-if="$hasAccess('slider.sliders.create')"/>
              <!--Button refresh data-->
              <q-btn color="info" icon="fas fa-sync" class="q-ml-sm"
                     @click="getData({pagination:pagination,search:filter.search},true)">
                <q-tooltip>{{$tr('isite.cms.label.refresh')}}</q-tooltip>
              </q-btn>
            </div>
          </div>

          <!--== Carousels ==-->
          <div class="col-12 q-px-md" v-if="!viewTable">
            <div class="row q-col-gutter-xs">
              <div class="col-12 col-sm-4 col-md-3" v-for="slider in dataTable" :key="slider.id">
                <div class="q-subheading bg-primary text-white text-left q-px-sm q-py-xs">
                  {{slider.id+'. '+slider.name}}
                </div>

                <q-carousel swipeable animated arrows v-model="carouselModel[slider.id]"
                            :fullscreen.sync="carouselFullScreen[slider.id]"
                             autoplay height="200px" :ref="`carousel${slider.id}`">

                  <q-carousel-slide v-for="slide in slider.slides" :key="slide.id"
                                    :name="slide.id" :img-src="slide.imageUrl">
                    <!--== Video ==-->
                    <q-video v-if="slide.url" class="absolute-full" :src="slide.url"/>
                  </q-carousel-slide>

                  <template v-slot:control>
                    <q-carousel-control position="bottom-right" :offset="[18, 18]">
                      <q-btn push round dense color="white" text-color="primary" icon="fa-light fa-expand"
                             :icon="carouselFullScreen[slider.id] ? 'fa-light fa-compress' : 'fa-light fa-expand'"
                             @click="carouselFullScreen[slider.id] = !carouselFullScreen[slider.id]"/>
                    </q-carousel-control>
                  </template>
                </q-carousel>

                <div class="row q-py-xs justify-end bg-grey-3">
                  <!--== Slider Edit ==-->
                  <q-btn icon="fas fa-pen" color="green" size="sm" class="q-mx-xs"
                         :to="{name: 'qslider.admin.sliders.show', params: {id: slider.id}}"
                         v-if="$hasAccess('slider.sliders.edit') && hasPermissionRecordMAster(slider).edit">
                    <q-tooltip :offset="[5, 5]">
                      {{$tr('isite.cms.label.edit')}}
                    </q-tooltip>
                  </q-btn>

                  <!--== Slider Delete ==-->
                  <q-btn icon="far fa-trash-alt" color="red" size="sm"
                         class="q-mx-xs" @click="dialogDeleteSlider.handler(slider.id)"
                         v-if="$hasAccess('slider.sliders.destroy') && hasPermissionRecordMAster(slider).destroy">
                    <q-tooltip :offset="[5, 5]">
                      {{$tr('isite.cms.label.delete')}}
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
                  @update:modelValue="getData({pagination:pagination,search:filter.search})"
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
              :rows="dataTable"
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
                  color="green"
                  size="sm"
                  class="q-mx-xs"
                  @click="showSliderModal(props.row)"
                  v-if="$hasAccess('slider.sliders.edit')"/>

                <q-btn
                  icon="far fa-trash-alt"
                  color="red"
                  size="sm"
                  class="q-mx-xs"
                  @click="dialogDeleteSlider.handler(props.row.id)"
                  v-if="$hasAccess('slider.sliders.destroy')"/>
              </q-td>

            </q-table>
          </div>
        </div>

        <!--Loading-->
        <inner-loading :visible="loading"/>
      </div>

      <!--Edit slider-->
      <q-dialog v-model="modalSlider" v-if="sliderToEdit" id="sliderModalEdit"
                :content-css="{minwidth: '80vw', minHeight: '80vh'}">
        <q-card class="relative-position backend-page" style="width: 500px;">
          <!--Header-->
          <q-toolbar class="bg-primary text-white">
            <q-toolbar-title>
              <label>{{$tr('slider.cms.createSlider')}}</label>
            </q-toolbar-title>
            <q-btn flat v-close-popup icon="fas fa-times"/>
          </q-toolbar>

          <div class=" q-pa-md row q-col-gutter-md">
            <div v-if="sliderToEdit.id" class="col-12 col-md-7 text-right">
              <!--Button add new-->
              <q-btn icon="fa-light fa-plus" color="green" class="q-mx-xs btn-small"
                     @click="showSlideModal(false)" :label="$tr('slider.cms.newSlide')"/>
              <!---Draggable-->
              <draggable
                v-model="sliderToEdit.slides"
                group="slides"
                item-key="id"
              >
                <template #item="{ element, index }">
                  <div
                    :key="'slide'+index"
                    :style="'background-image: url('+element.imageUrl+'); position:relative'"
                    class="image border q-my-sm col-12 col-sm-4 col-md-3"
                  >
                    <div style="bottom: 5px; right: 5px; position: absolute;">
                      <q-btn icon="fas fa-pen" color="green" size="xs" class="q-mx-xs"
                             v-if="hasPermissionRecordMAster(element).edit"
                             @click="showSlideModal(element)">
                        <q-tooltip>{{$tr('isite.cms.label.edit')}}</q-tooltip>
                      </q-btn>
                      <q-btn icon="far fa-trash-alt" color="red" size="xs" class="q-mx-xs"
                             v-if="hasPermissionRecordMAster(element).destroy"
                             @click="deleteSlide(element.id, index)">
                        <q-tooltip>{{$tr('isite.cms.label.delete')}}</q-tooltip>
                      </q-btn>
                    </div>
                  </div>
                </template>
              </draggable>
            </div>
            <div :class="'col-12 '+ (sliderToEdit.id ? 'col-md-5' : '')">
              <q-form @submit="updateOrCreateSlider(sliderToEdit)" ref="formContent"
                      @validation-error="$alert.error($tr('isite.cms.message.formInvalid'))"
                      autocomplete="off">
                <q-input :label="`${$tr('isite.cms.form.name')} *`" type="text" outlined dense
                         :rules="[val => !!val || $tr('isite.cms.message.fieldRequired')]"
                         @input="setSlug()" v-model="sliderToEdit.name"/>
                <!--System Name-->
                <q-input :label="`${$tr('isite.cms.form.slug')} *`" type="text" outlined dense
                         :rules="[val => !!val || $tr('isite.cms.message.fieldRequired')]"
                         v-model="sliderToEdit.systemName"/>
                <!--== Slide Active ==-->
                <q-select class="q-mb-md" :label="$tr('isite.cms.form.status')"
                          v-model="sliderToEdit.active"
                          emit-value map-options
                          :options="[
                              {label : $tr('isite.cms.label.enabled'), value : true},
                              {label : $tr('isite.cms.label.disabled'), value : false},
                            ]" outlined dense/>
                <!--Record Master-->
                <q-select :label="$tr('isite.cms.form.masterRecord')"
                          v-if="canManageRecordMaster"
                          emit-value map-options
                          v-model="sliderToEdit.options.masterRecord"
                          :options="[
                              {label: this.$tr('isite.cms.label.yes'), value: 1},
                              {label: this.$tr('isite.cms.label.no'), value: 0},
                            ]" outlined dense/>
              </q-form>
            </div>
          </div>

          <!--Footer-->
          <q-toolbar>
            <q-toolbar-title></q-toolbar-title>
            <q-btn color="green" :label="$tr('isite.cms.label.save')" :loading="loading"
                   @click="$refs.formContent.submit()"/>
          </q-toolbar>

          <!--Loading-->
          <inner-loading :visible="loading"/>
        </q-card>
      </q-dialog>

      <!--Edit slide-->
      <q-dialog v-model="modalSlide" :key="slideToEdit.id ? slideToEdit.id : ''" id="sliderModalEdit">
        <q-card class="backend-page" style="minWidth: 80vw; minHeight: 80vh">
          <!--Header-->
          <q-toolbar class="bg-primary text-white">
            <q-toolbar-title>{{$tr('slider.cms.updateSlide')}}</q-toolbar-title>
            <q-btn flat v-close-popup icon="fas fa-times"/>
          </q-toolbar>

          <!--Content-->
          <div class="q-pa-md bg-grey-1">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <locales v-model="locale"/>
              </div>
              <div v-if="locale.success" class="col-12 col-md-7">
                <q-input :label="`${$tr('isite.cms.form.title')} (${locale.language}) `"
                         type="text" v-model="locale.formTemplate.title" outlined dense/>
                <q-input :label="`${$tr('isite.cms.form.caption')} (${locale.language}) `"
                         type="text" outlined dense
                         v-model="locale.formTemplate.caption"/>
                <q-input :label="'URI ('+locale.language+')'" outlined dense
                         type="text" v-model="locale.formTemplate.uri"/>
                <q-input :label="'URL ('+locale.language+')'" type="text"
                         v-model="locale.formTemplate.url" outlined dense/>
                <q-input :label="`${$tr('isite.cms.form.image')} URL (${locale.language}) `"
                         type="text" outlined dense
                         v-model="locale.formTemplate.externalImageUrl"/>
                <q-editor :label="`${$tr('isite.cms.form.description')} (${locale.language}) `"
                          v-model="locale.formTemplate.customHtml" style="width: 100%"/>
              </div>
              <div v-if="locale.success" class="col-12 col-md-5">
                <q-select v-model="locale.formTemplate.options.masterRecord"
                          :label="$tr('isite.cms.form.masterRecord')"
                          v-if="canManageRecordMaster" outlined dense
                          emit-value map-options
                          :options="[
                              {label: this.$tr('isite.cms.label.yes'), value: 1},
                              {label: this.$tr('isite.cms.label.no'), value: 0},
                            ]"/>
                <!--== Slide Active ==-->
                <q-select :label="`${$tr('isite.cms.form.status')} (${locale.language})`"
                          v-model="locale.formTemplate.active" outlined dense
                          emit-value map-options
                          :options="[
                            {label : $tr('isite.cms.label.enabled'), value : true},
                            {label : $tr('isite.cms.label.disabled'), value : false},
                          ]"/>
                <q-select :label="`${$tr('isite.cms.form.option')}`" v-model="locale.formTemplate.target"
                          emit-value map-options
                          outlined dense :options="[
                            {value: '_self', label: 'Same tab'},
                            {value: '_blank', label: 'New tab'}
                          ]"/>
                <q-select :label="`${$tr('isite.cms.form.type')}`" v-model="locale.formTemplate.type"
                          emit-value map-options
                          outlined dense :options="[
                            {value: 'auto', label: 'Auto'},
                            {value: '360', label: '360'},
                            {value: 'video', label: 'Video'},
                            {value: 'image', label: 'Image'}
                          ]"/>
                <div class="input-title">{{`${$tr('isite.cms.form.image')}`}}</div>
                <media-form
                  entity="Modules\Slider\Entities\Slide"
                  :entity-id="slideToEdit.id ? slideToEdit.id : ''"
                  v-model="locale.formTemplate.mediasSingle"
                  zone="slideimage"
                  :key="mediaKey"
                />
              </div>
            </div>
          </div>

          <!--Footer-->
          <q-toolbar>
            <q-toolbar-title/>
            <q-btn color="green" :label="$tr('isite.cms.label.save')" icon="fas fa-save"
                   @click="updateOrCreateSlide(); modalSlide = false"/>
          </q-toolbar>
        </q-card>
      </q-dialog>
    </q-no-ssr>
  </div>
</template>

<script>
  /*Components*/
  import draggable from 'vuedraggable'
  import mediaForm from 'modules/qmedia/_components/form'

  export default {
    props: {},
    components: {
      draggable: draggable,
      mediaForm
    },
    mounted () {
      this.$nextTick(function () {
        this.getData({ pagination: this.pagination, search: this.filter.search })
      })
    },
    data () {
      return {
        carouselModel: {},
        carouselFullScreen: {},
        locale: {
          fields: {
            target: null,
            externalImageUrl: '',
            mediasSingle: {},
            sliderId: '',
            position: 0,
            type: 'auto',
            options: {
              masterRecord: 0
            }
          },
          fieldsTranslatable: {
            title: '',
            caption: '',
            active: true,
            url: '',
            uri: '',
            customHtml: '',
          }
        },
        dataTable: [],
        mediaKey: this.$uid(),
        modalSlider: false,
        modalSlide: false,
        sliderToEdit: { options: { masterRecord: 0 } },
        slideToEdit: { options: { masterRecord: 0 } },
        dialogDeleteSlider: {
          handler: (id) => {
            this.$q.dialog({
              title: 'Confirm',
              ok: 'Delete',
              message: 'you are sure to eliminate this slider?',
              cancel: 'Cancel'
            }).onOk(() => {
              this.deleteSlider(id)
            }).onCancel(() => {
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
          { name: 'id', label: 'ID', field: 'id' },
          {
            name: 'name', label: 'Name', field: 'name',
            align: 'left', sortable: true, style: 'width: 40%'
          },
          {
            name: 'createdAt', label: 'Created At', field: 'createdAt',
            format: val => val ? this.$trd(val) : '-',
            align: 'left', sortable: true
          },
          {
            name: 'actions', label: 'actions', align: 'center'
          },

        ],
      }
    },
    computed: {
      //Has manage master record
      canManageRecordMaster () {
        let response = true

        if (this.sliderToEdit.id && !this.$hasAccess('isite.master.records.edit')) {
          response = false
        }
        if (!this.sliderToEdit.id && !this.$hasAccess('isite.master.records.create')) {
          response = false
        }

        return response
      },
    },
    methods: {
      async getData ({ pagination, search }, refresh = false) {
        this.loading = true
        // clear storage cache
        if (refresh) {
          this.$cache.remove('apiRoutes.qslider.sliders')
        }

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
        this.$crud.index('apiRoutes.qslider.sliders', params).then(response => {
          this.dataTable = response.data

          this.pagination.rowsPerPage = response.meta.page.perPage
          this.pagination.page = response.meta.page.currentPage
          this.pagination.rowsNumber = response.meta.page.lastPage

          if (this.modalSlider) {
            let slider = this.dataTable.find(slider => slider.id === this.sliderToEdit.id)
            this.sliderToEdit = slider
          }

          this.loading = false
        }).catch(error => {
          this.$apiResponse.handleError(error, () => {
            this.$alert.error({message: this.$tr('isite.cms.message.errorRequest'), pos: 'bottom'})
            this.loading = false//hide loading
          })
        })
      },

      showSliderModal (slider) {
        if (slider) {
          this.sliderToEdit = this.$clone(Object.assign({}, this.sliderToEdit, slider))
        } else {
          this.sliderToEdit = {
            name: '',
            systemName: '',
            active: true,
            slides: [],
            options: { masterRecord: 0 }
          }
        }
        this.modalSlider = true
      },

      showSlideModal (slide) {
        if (slide) {
          //slide.mediasSingle = {}
          this.slideToEdit = slide
          this.locale.form = slide
        } else {
          this.locale.form = this.slideToEdit = {
            title: '',
            caption: '',
            active: 1,
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
        this.mediaKey = this.$uid()
        this.modalSlide = true
      },

      updateOrCreateSlider (data) {
        this.loading = true
        if (this.sliderToEdit.id) {
          this.$crud.update('apiRoutes.qslider.sliders', data.id, data).then(response => {
            this.$alert.info({ message: this.$tr('isite.cms.message.recordUpdated') })
            this.getData({ pagination: this.pagination, search: this.filter.search }, true)
            this.modalSlider = false
          }).catch(error => {
            this.$alert.error({ message: this.$tr('isite.cms.message.recordNoUpdated') })
            this.loading = false
          })
        } else {
          this.$crud.create('apiRoutes.qslider.sliders', data).then(response => {
            this.$alert.info({ message: `${this.$tr('isite.cms.message.recordCreated')}` })
            this.getData({ pagination: this.pagination, search: this.filter.search }, true)
            this.modalSlider = false
          }).catch(error => {
            this.$alert.error({ message: `${this.$tr('isite.cms.message.recordNoCreated')}` })
            this.loading = false
          })
        }
      },

      updateOrCreateSlide () {
        this.loading = true
        if (this.slideToEdit.id) {
          this.$crud.update('apiRoutes.qslider.slides', this.slideToEdit.id, this.locale.form).then(response => {
            this.$alert.info({ message: this.$tr('isite.cms.message.recordUpdated') })
            this.getData({ pagination: this.pagination, search: this.filter.search }, true)
          }).catch(error => {
            this.$alert.error({ message: this.$tr('isite.cms.message.recordNoUpdated') })
            this.loading = false
          })
        } else {
          this.$crud.create('apiRoutes.qslider.slides', this.locale.form).then(response => {
            this.$alert.info({ message: `${this.$tr('isite.cms.message.recordCreated')}` })
            this.getData({ pagination: this.pagination, search: this.filter.search }, true)
          }).catch(error => {
            this.$alert.error({ message: `${this.$tr('isite.cms.message.recordNoCreated')}` })
            this.loading = false
          })
        }

      },

      deleteSlider (id) {
        this.loading = true
        this.$crud.delete('apiRoutes.qslider.sliders', id).then(response => {
          this.$alert.info({ message: this.$tr('isite.cms.message.recordDeleted') })
          this.getData({ pagination: this.pagination, search: this.filter.search }, true)
        }).catch(error => {
          this.$alert.error({ message: this.$tr('isite.cms.message.recordNoDeleted'), pos: 'bottom' })
          this.loading = false
        })
      },

      deleteSlide (slideId, pos) {
        this.loading = true
        this.$crud.delete('apiRoutes.qslider.slides', slideId).then(response => {
          this.$alert.info({ message: this.$tr('isite.cms.message.recordDeleted') })
          this.sliderToEdit.slides.splice(pos, 1)
          this.getData({ pagination: this.pagination, search: this.filter.search }, true)
        }).catch(error => {
          this.$alert.error({ message: this.$tr('isite.cms.message.recordNoDeleted'), pos: 'bottom' })
          this.loading = false
        })
      },

      //Complete slug Only when is creation
      setSlug () {
        if (!this.sliderToEdit.id) {
          //Set slug as title
          let slug = this.sliderToEdit.name.trim().split(' ').join('-').toLowerCase()
          this.sliderToEdit.systemName = this.$clone(slug.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
        }
      },

      hasPermissionRecordMAster (record) {
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
      }
    }
  }
</script>
<style lang="scss">
  #sliderModalEdit {
    .image {
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center center;
      cursor: all-scroll;
      height: 150px;
      overflow: hidden;
    }
  }
</style>
