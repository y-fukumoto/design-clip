<template>
  <transition name="design">
    <div class="design">
      <div class="design__header">
        <p class="design__title">{{state.showDesign.design.title}}</p>
        <p class="design__url">{{state.showDesign.design.url}}</p>
      </div>
      <div class="design__body">
        <img :src="'images/' + state.showDesign.design.image" alt="" class="design__image">
      </div>
      <a href="javascript:void(0)" @click="closeDesign()"><i class="material-icons medium design__close">close</i></a>
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
  methods: {
    closeDesign: function() {
      store.setCloseDesign()
    }
  }
}
</script>

<style lang="scss" scoped>
.design {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.9);
  z-index: 2;
  overflow-y: scroll;
  &-enter-active, &-leave-active {
    transition: opacity .3s, transform .3s;
  }
  &-enter, &-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.design__background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.design__header {
  width: 100%;
  height: 80px;
  padding: 20px 20px 0;
  background-color: white;
  box-sizing: border-box;
}

.design__body {
  width: 80%;
  margin: 0 auto;
  padding: 50px;
  color: white;
  text-align: center;
}

.design__title {
  margin-bottom: 10px;
  text-align: left;
}

.design__url {
  margin-bottom: 10px;
  text-align: left;
}

.design__image {
  max-width: 100%;
  box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.3)
}

.design__close {
  position: fixed;
  top: 10px;
  right: 10px;
  color: #999999;
  font-weight: normal;
}

</style>
