<script>
export default {
    name: 'img-preview',
    data: function () {
        return {
            Image: null,
            Preview: false
        }
    },
    methods: {
        Show: function (src) {
            this.$data.Image = src
            this.$data.Preview = true
        },
        Close: function () {
            this.$data.Preview = false
        }
    }
}
</script>

<template>
    <div v-if="Preview" class="ft-img-preview" v-on:click="Close">
        <img v-bind:src="Image"></img>
    </div>
</template>

<style>
  .ft-img-preview {
  position: fixed;
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: column;
  flex-direction: column;
  -webkit-justify-content: center;
  justify-content: center;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #fff;
  }
  .ft-img-preview > img {
  width: 100% !important;
  height: 7.50rem !important;
  display: block;
  }
</style>

