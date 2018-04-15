<template>
  <div class="main__result">
    <div class="result__info">
      <p class="result__title">ページタイトル：{{state.scrapingData.title}}</p>
      <p class="result__url"><a :href="state.scrapingData.url">{{state.scrapingData.url}}</a></p>
      <p class="result__input">タグ：<input type="text" v-model="tag"><a @click="addTag()">タグ追加</a></p>
      <p class="result__tag" v-for="tag in tags" :key="tag.id">{{tag}}</p>
      <a href="javascript:void(0)" @click="saveDesign" class="result__save">保存する</a>
    </div>
    <img :src="'/images/' + state.scrapingData.image" alt="" class="result__image">
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
.result__info {
  float: left;
}

.result__images {
  float: left;
}

.result__save {
  display: block;
  width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border: 1px solid #efefef;
}
</style>
