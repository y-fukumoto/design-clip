<template>
  <div class="result">
    <div class="result__body">
      <div class="result__info">
        <p class="result__title">ページタイトル：{{state.scrapingData.title}}</p>
        <p class="result__url"><a :href="state.scrapingData.url">{{state.scrapingData.url}}</a></p>
        <p class="result__input">タグ：<input type="text" v-model="tag"><a @click="addTag()">タグ追加</a></p>
        <p class="result__tag" v-for="tag in tags" :key="tag.id">{{tag}}</p>
        <a href="javascript:void(0)" @click="saveDesign" class="result__save btn red lighten-1">保存する</a>
      </div>
      <div class="result__images">
        <img :src="'/images/' + state.scrapingData.image" alt="" class="result__image">
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import store from '../store'
export default {
  data() {
    return {
      state: store.state,
      tags: [],
      tag: ''
    }
  },
  methods: {
    addTag: function() {
      const newTag = this.tag
      // 重複していたら取り除く
      let newTags = this.tags.filter((tag) => {
        return tag != newTag
      })
      newTags.push(newTag)
      this.tags = newTags
      this.tag = ''
    },
    saveDesign: function() {
      axios.post('/api/savedesign', {
        title: this.state.scrapingData.title,
        url: this.state.scrapingData.url,
        image: this.state.scrapingData.image,
        tags: this.tags
      })
      .then((res) => {
        store.setDesignData(res.data)
        store.resetScrapingData()
        store.setResult(false)
        store.setRegisteredTags(res.data)
        this.$forceUpdate();
      })
    },    
  }
}
</script>

<style scoped>
.result {
  position: fixed;
  background-color: rgba(255,255,255,.4);
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 10;
}

.result__body {
  overflow-y: scroll;
  width: 80%;
  max-height: 100%;
  margin: 50px auto;
  background-color: white;
}

.result__info {
  float: left;
  width: 30%;
}

.result__images {
  float: left;
  width: 70%;
}

.result__image {
  max-width: 100%;
}

.result__save {
  color: white;
}
</style>
