<template>
  <div class="main">
    <div class="main__form form">
      <div class="form__body container">
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
      tag: ''
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
      axios.post('/api/webshot',{url: this.url})
      .then((res) => {
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
  padding-left: 5px;
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
