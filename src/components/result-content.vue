<template>
  <div class="result">
    <div class="result__body">
      <div class="result__images">
        <img :src="'/images/' + state.scrapingData.image" alt="" class="result__image">
      </div>
      <div class="result__info">
        <h2 class="result__title">ウェブサイトの情報</h2>
        <p class="result__page">{{state.scrapingData.title}}</p>
        <p class="result__url"><a :href="state.scrapingData.url">{{state.scrapingData.url}}</a></p>
        <div class="result__select select" v-if="state.registeredTags.length > 0">
          <h2 class="select__title">タグ</h2>
          <a href="javascript:void(0);" class="select__tag btn btn-flat white" @click="selectTag(tag)" v-for="tag in state.registeredTags" :key="tag.id">{{tag.body}}</a>
          <div class="select__add">
            <a href="javascript:void(0);" class="select__button btn btn-flat white" @click="tagInput = !tagInput" v-if="!tagInput">新しくタグを追加</a>
            <input type="text" class="select__input" v-if="tagInput" v-model="tag" @keyup.enter="addTag()">
          </div>
        </div>
        <div class="result-tag">
          <p class="result-tag__title">登録するタグ</p>
          <p class="result-tag__tag" v-for="tag in tags" :key="tag.id">#{{tag}}</p>
      </div>
        <a href="javascript:void(0)" @click="saveDesign" class="result__save btn red lighten-1">保存する</a>
        <a href="javascript:void(0)" @click="quitResult" class="result__quit btn btn-flat grey lighten-5">やめる</a>
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
      tag: '',
      tagInput: false
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
    selectTag: function(tag) {
      const newTag = tag.body
      // 重複していたら取り除く
      let newTags = this.tags.filter((tag) => {
        return tag != newTag
      })
      newTags.push(newTag)
      this.tags = newTags
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
    quitResult: function() {
      axios.post('/api/quitresult', {
        image: this.state.scrapingData.image
      })
      .then((res) => {
        store.resetScrapingData()
        store.setResult(false)
      })
    }
  }
}
</script>

<style scoped>
.result {
  position: fixed;
  background-color: #efefef;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 10;
}

.result__body {
  overflow-y: scroll;
  width: 900px;
  max-height: 100%;
  margin: 50px auto;
  padding: 50px 10px;
  background-color: white;
}

.result__images {
  float: left;
  width: 450px;
  margin-right: 30px;
}

.result__image {
  max-width: 100%;
}

.result__info {
  float: left;
  width: 350px;
}

.result__title {
  margin: 0 0 16px 0;
  font-size: 20px;
  font-weight: bold;
}

.result__page {
  margin-bottom: 6px;
  font-size: 16px;
}

.result__url {
  margin-bottom: 30px;
  font-size: 16px;
  word-break: break-all;
}

.select {
  margin-bottom: 10px;
}

.select__title {
  margin: 0 0 16px 0;
  font-size: 20px;
  font-weight: bold;
}

.select__tag {
  display: inline-block;
  margin-right: 4px;
  margin-bottom: 4px;
  text-align: center;
  border: 1px solid rgba(160, 160, 160, 0.2);
}

.select__button {
  border: 1px solid rgba(160, 160, 160, 0.2);
}

.result-tag {
  margin-bottom: 20px;
}

.result-tag__title {
  margin-bottom: 6px;
}

.result-tag__tag {
  display: inline-block;
  margin-right: 5px;
  margin-bottom: 4px;
  padding: 5px;
  background-color: #f5f5f5;
}

.result__save {
  color: white;
}
</style>
