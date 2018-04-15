<template>
  <div class="main">
    <div class="main__form form">
      <div class="form__body container">
        <input class="form__input" type="url" name="url" v-model="url" placeholder="ウェブサイトのURL" required @keyup.enter="getScreenshot">
        <a href="javascript:void(0)" @click="getScreenshot" class="form__button btn red lighten-1">スクリーンショットを取得</a>
      </div>
    </div>
    <div class="tags container">
      <p class="tags__title">タグ一覧</p>
      <div @click="selectTag(tag)" class="waves-effect waves-light btn-small" v-for="tag in filterAllTag" :key="tag.id">{{tag.body}}</div>
    </div>
    <result-content v-if="state.result"></result-content>
    <card-content></card-content>
    <div v-if="state.loading" class="loading"></div>
  </div>
</template>

<script>
import axios from 'axios'
import store from '../store'
import resultContent from './result-content.vue'
import cardContent from './card-content.vue'
export default {
  data() {
    return {
      url: '',
      state: store.state,
      tags: [],
      tag: '',
    }
  },
  components: {
    resultContent,
    cardContent
  },
  computed: {
    filterAllTag: function() {
      let filteredTags = []
      //比較用にJSON.stringfyをかけた配列を作る
      let objectTags = []
      this.state.registeredTags.forEach((tag) => {
        objectTags.push(JSON.stringify(tag))
      })
      filteredTags = objectTags.filter((tag, index, self) => {
        return self.indexOf(tag) === index
      })
      //dataに突っ込むときにJSON.parseして戻す
      let parseTags = []
      filteredTags.forEach((tag) => {
        parseTags.push(JSON.parse(tag))
      })
      return parseTags
    },
  },
  mounted: function() {
    axios.get('/api/designs')
    .then((res) => {
      console.log("mounted2")
      store.setDesignData(res.data)
      store.setRegisteredTags(res.data)
    })
  },
  methods: {
    getScreenshot: function() {
      store.setLoading(true)
      axios.post('/api/webshot',{url: this.url})
      .then((res) => {
        console.log(res)
        store.setScrapingData(res.data)
        store.setResult(true)
        console.log(store.state)
        store.setLoading(false)
      })
    },
    selectTag: function(tag) {
      console.log(tag)
      store.addSelectTag(tag)
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
  padding-left: 5px;
  background-color: white;
}

.form__button {
  position: absolute;
  top: 5px;
  right: 10px;
  color: white;
}

.tags {
  margin-bottom: 20px;
}

.tags__title {
  margin-bottom: 5px;
}

.list {
  width: 950px;
  overflow: hidden;
  margin: 0 auto;
}

.loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, .6)
}
</style>
