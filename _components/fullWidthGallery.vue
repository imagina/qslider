<template>
  <div id="fullWidthCarousel" class="col-12">
    <q-carousel v-model="currentSlide" class="text-white" infinite>
      <q-carousel-slide :name="key" v-for="(picture , key) in gallery" :key="key" :img-src="picture.imageUrl">
        <div class="row q-container items-center full-height">
          <div class="text-center col-12 col-sm-8">
            <div class="text-h5 text-weight-medium">
              {{ picture.title }}
            </div>
            <div class="text-h3 text-weight-light" v-html="picture.customHtml"></div>
          </div>
        </div>
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>

<script>
  export default {
    name: "fullWidthGallery",
    props: {
      systemName: {default: false}
    },
    data() {
      return {
        currentSlide: 0,
        gallery: [],
      }
    },
    watch: {
      'systemName'() {
        this.getGallery()
      }
    },
    mounted() {
      this.getGallery()
    },
    methods: {
      getGallery: function () {
        let params = {
          refresh: true,
          params: {
            filter: {
              field: 'system_name'
            }
          }
        }
        this.$crud.show('apiRoutes.qslider.sliders', this.systemName, params).then(response => {
          this.gallery = response.data.slides;
        }).catch(error => {
          console.warn(error)
        });
      },
    }
  }
</script>

<style lang="stylus">
  #fullWidthCarousel
    .q-carousel
      height 70vh
      @media (max-width $breakpoint-sm)
        height 45vh

      .img-fluid
        width 100%
        height 100%
        background-size cover
        background-position center
        background-repeat no-repeat
        cursor pointer
        padding 0

      .custom-caption
        left 0
        top 50%

    .bg-image
      background-position center center
      background-size cover
      background-repeat no-repeat
      background-color rgba(0, 0, 0, .6)
      height 70vh

    .buttons-container
      .q-btn
        height 100px

        .q-icon
          font-size 4em
</style>
