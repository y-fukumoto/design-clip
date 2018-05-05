<template>
  <div class="main">
    <div class="main__form form">
      <div class="form__body container">
        <div class="device">
          <a @click="deviceDropdown = !deviceDropdown" class="device__state">
            <i v-if="device === 'pc'"><i class="material-icons">desktop_mac</i></i>
            <i v-if="device === 'sp'"><i class="material-icons">smartphone</i></i>
          </a>
          <div class="device__body" v-if="deviceDropdown">
            <a @click="changeDevice('pc')" class="device__link"><i class="material-icons">desktop_mac</i></a>
            <a @click="changeDevice('sp')" class="device__link"><i class="material-icons">smartphone</i></a>
          </div>
        </div>
        <input class="form__input" type="url" name="url" v-model="url" placeholder="ウェブサイトのURL" required @keyup.enter="getScreenshot">
        <a href="javascript:void(0)" @click="getScreenshot" class="form__button btn btn-flat red lighten-1"><i class="material-icons form__icon">camera_alt</i><span class="form__text">スクショ撮影</span></a>
        <span v-if="state.error.status" class="form__error">{{state.error.message}}</span>
      </div>
    </div>
    <div class="tags container">
      <p class="tags__title">Tag</p>
      <div @click="selectTag(tag)" class="waves-effect waves-light btn-flat btn-small grey lighten-4" :class="[tag.selected? 'tag--selected' : '']" v-for="tag in state.registeredTags" :key="tag.id">{{tag.body}}</div>
    </div>
    <result-content v-if="state.result"></result-content>
    <card-content></card-content>
    <loading v-if="state.loading"></loading>
    <design v-if="state.showDesign.show"></design>
  </div>
</template>

<script>
import axios from 'axios'
import store from '../store'
import resultContent from './result-content.vue'
import cardContent from './card-content.vue'
import loading from './loading.vue'
import design from './design.vue'
export default {
  data() {
    return {
      url: '',
      state: store.state,
      tags: [],
      tag: '',
      device: 'pc',
      deviceDropdown: false
    }
  },
  components: {
    resultContent,
    cardContent,
    loading,
    design
  },
  mounted: function() {
    axios.get('/api/designs')
    .then((res) => {
      store.setDesignData(res.data)
      store.setRegisteredTags(res.data)
    })
  },
  methods: {
    getScreenshot: function() {
      store.setLoading(true)
      axios.post('/api/webshot',{url: this.url, device: this.device})
      .then((res) => {
        console.log(res.data)
        store.resetError()
        store.setScrapingData(res.data)
        store.setResult(true)
        store.setLoading(false)
        this.url = ''
      })
      .catch((error) => {
        store.setLoading(false)
        store.setError(error)
      })
    },
    changeDevice: function(device) {
      this.device = device
      this.deviceDropdown = !this.deviceDropdown
    },
    selectTag: function(tag) {
      tag.selected = !tag.selected
      store.addSelectTag(tag)
      this.$forceUpdate()
    }
  }
}
</script>


<style lang="scss" scoped>

.form {
  margin-bottom: 20px;
  padding: 20px 0;
  background-color: #efefef;
}

.form__body {
  position: relative;
}

.form__input {
  height: 44px;
  margin-bottom: 0;
  padding-left: 64px;
  border: none;
  background-color: white;
}

.form__button {
  position: absolute;
  top: 4px;
  right: 10px;
  color: white;
}

.form__icon {
  display: inline-block;
  margin-right: 4px;
  vertical-align: middle;
}

.form__text {
  display: inline-block;
  vertical-align: middle;
}

.form__error {
  color: red;
}

.device {
  position: absolute;
  top: 0;
  left: 0;
}

.device__body {
  position: absolute;
  top: 44px;
  left: 0;
  width: 45px;
  background-color: white;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  z-index: 2;
}

.device__link {
  display: block;
  padding: 4px 0;
  text-align: center;
  color: #666666;
  border-bottom: 1px solid #efefef;
  cursor: pointer;
}

.device__state {
  position: relative;
  display: block;
  width: 60px;
  height: 44px;
  padding-left: 8px;
  line-height: 56px;
  color: #666666;
  background-color: #f7f7f7;
  cursor: pointer;
  &:after {
    position: absolute;
    top: 50%;
    right: 8px;
    margin-top: -3px;
    content: '';
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 6px 5px 0 5px;
    border-color: #5c5c5c transparent transparent transparent;
  }
}

.tags {
  margin-bottom: 20px;
}

.tags__title {
  margin-bottom: 5px;
}

.tag {
  &:hover {
    background-color: #bdbdbd;
  }
  &--selected {
    background-color: #bdbdbd;
  }
}

.list {
  width: 950px;
  overflow: hidden;
  margin: 0 auto;
}

</style>
