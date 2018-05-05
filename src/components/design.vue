<template>
  <transition name="design">
    <div class="design">
      <div class="design__header">
        <p class="design__title">{{state.showDesign.design.title}}</p>
        <p class="design__url"><a :href="state.showDesign.design.url" target="_blank">{{state.showDesign.design.url}}</a></p>
      </div>
      <div class="design__body">
        <img :src="'https://drive.google.com/uc?export=view&id=' + state.showDesign.design.image" @load="loaded()" alt="" class="design__image">
      </div>
      <div class="design__background" @click="closeDesign()"></div>
      <a href="javascript:void(0)" @click="closeDesign()" class="design__close"><i class="material-icons medium">close</i></a>
    </div>
  </transition>
</template>

<script>
import axios from 'axios'
import store from '../store'

export default {
  data() {
    return {
      state: store.state
    }
  },
  mounted: function() {
  },
  methods: {
    closeDesign: function() {
      store.setCloseDesign()
    },
    loaded: function() {
      const headerHeight = document.querySelector('.design__header').clientHeight
      const imgHeight = document.querySelector('.design__body').clientHeight
      console.log(headerHeight)
      console.log(imgHeight)
      document.querySelector('.design__background').style.height = headerHeight + imgHeight + 'px'
    }
  }
}
</script>

<style lang="scss" scoped>
.design {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  &-enter-active, &-leave-active {
    transition: opacity .3s, transform .3s;
  }
  &-enter, &-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.design__header {
  position: relative;
  width: 100%;
  height: 56px;
  padding: 10px 10px 0;
  background-color: white;
  z-index: 3;
  box-sizing: border-box;
}

.design__body {
  position: relative;
  width: 80%;
  margin: 0 auto;
  padding: 20px;
  color: white;
  text-align: center;
  z-index: 3;
}

.design__title {
  margin-bottom: 6px;
  text-align: left;
}

.design__url {
  text-align: left;
}

.design__image {
  max-width: 100%;
  box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.3)
}

.design__close {
  position: absolute;
  top: 0px;
  right: 10px;
  color: #999999;
  font-weight: normal;
  z-index: 3;
}

.design__background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #efefef;
}
</style>
