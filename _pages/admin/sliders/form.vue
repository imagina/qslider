<template>
  <div
    id="pageId"
    class="q-layout-page layout-padding">
    <div class="q-mb-lg backend-page">
      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-md-5">
          <div class="box">
            <div class="row gutter-y-sm">
              <div class="col-12 relative-position">
                <sliderForm :form-data="slider"/>
                <inner-loading :visible="loading"/>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-md-7">
          <div class="box">
            <div class="row gutter-y-sm">
              <div class="col-12 relative-position">
                <sliderSlides :slider="slider" v-if="!loading" @refresh="getSlider(true)"/>
                <inner-loading :visible="loading"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import sliderForm from 'modules/qslider/_components/admin/slider/form'
  import sliderSlides from 'modules/qslider/_components/admin/slider/slides'
  import { eventBus } from 'src/plugins/utils'

  export default {
    components:{
      sliderForm,
      sliderSlides
    },
    beforeUnmount () {
      eventBus.off('deleteSlide', this.getSlider)
      eventBus.off('page.data.refresh')
    },
    mounted() {
      this.init()
    },
    data () {
      return {
        loading: false,
        slider:{}
      }
    },
    methods:{
      init(){
        eventBus.on('page.data.refresh', () => this.getSlider(true))//Listen refresh event
        this.getSlider(true)
        eventBus.on('deleteSlide', this.getSlider)
      },
      //Get slider data
      getSlider( refresh = false ){
        let criteria = this.$route.params.id
        let params = {
          refresh : refresh,
          params: {}
        }
        this.loading = true
        this.$crud.show('apiRoutes.qslider.sliders', criteria, params).then( response => {
          this.slider =  response.data
          this.loading = false
        }).catch( error => {
          this.$apiResponse.handleError(error, () => {
            console.warn(error)
            this.loading = false
            this.$alert.error({message: this.$tr('isite.cms.message.errorRequest'), pos: 'bottom'})
          })
        })
      },
    }
  }
</script>
