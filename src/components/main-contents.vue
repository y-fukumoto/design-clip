<template>
  <div class="main">
    <div class="main__form">
      <input class="main__input" type="url" name="url" v-model="url" placeholder="ページのURLを入力" required @keyup.enter="getScreenshot">
      <a href="javascript:void(0)" @click="getScreenshot">スクリーンショットを取得</a>
    </div>
    <div class="main__result">
      <div class="result__info">
        <p class="result__title" v-if="getTitle">ページタイトル：{{getTitle}}</p>
        <p class="result__url" v-if="getUrl"><a :href="getUrl">{{getUrl}}</a></p>
        <a href="javascript:void(0)" @click="saveDesign" class="result__save" v-if="getImage">保存する</a>
      </div>
      <img :src="'/images/' + getImage" alt="" v-if="getImage" class="result__image">
    </div>
    <div class="list">
      <template v-for="(design, index) in designs">
        <div class="card" :key="design.id">
          <p><a :href="design.url">{{design.title}}</a></p>
          <p class="card__images"><img :src="'/images/' + design.image" alt="" class="card__image"></p>
          <a href="javascript:void(0);" @click="deleteDesign(index)">削除する</a>
        </div>
      </template>
    </div>
    <div v-if="isLoading" class="loading"></div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      isLoading: false,
      url: '',
      getTitle: '',
      getUrl: '',
      getImage: '',
      designs: []
    }
  },
  mounted: function() {
    axios.get('/api/designs')
    .then((res) => {
      this.designs = res.data
    })
  },
  methods: {
    getScreenshot: function() {
      this.isLoading = true
      axios.post('/api/webshot',{url: this.url})
      .then((res) => {
        console.log(res)
        this.getTitle = res.data.title
        this.getUrl = res.data.url
        this.getImage = res.data.image
        this.isLoading = false
      })
    },
    saveDesign: function() {
      axios.post('/api/savedesign', {
        title: this.getTitle,
        url: this.getUrl,
        image: this.getImage
      })
      .then((res) => {
        this.designs = res.data
        this.getTitle = ''
        this.getUrl = ''
        this.getImage = ''
        this.$forceUpdate();
      })
    },
    deleteDesign: function(index) {
      axios.post('/api/deletedesign', {
        id: this.designs[index].id
      })
      .then((res) => {
        this.designs = res.data
        this.$forceUpdate();
      })
    }
  }
}
</script>


<style lang="scss" scoped>
@import '../commonStyle/_reset';
.main {
  position: relative;
}

.main__form {
  margin-bottom: 20px;
  text-align: center;
}

.main__input {
  width: 600px;
  padding: 0 5px;
  font-size: 16px;
  line-height: 40px;
  box-sizing: border-box;
}

.main__result {
  overflow: hidden;
  margin: 0 40px;
}

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

.list {
  width: 950px;
  overflow: hidden;
  margin: 0 auto;
}

.card {
  width: 300px;
  height: 400px;
  float: left;
  overflow: hidden;
  margin-right: 10px;
  margin-bottom: 20px;
  border: 1px solid #efefef
}

.card__images {
  height: 300px;
  overflow: hidden;
}

.card__image {
  width: 100%;
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
