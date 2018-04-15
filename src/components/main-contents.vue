<template>
  <div class="main">
    <div class="main__form form">
      <div class="form__body container">
        <input class="form__input" type="url" name="url" v-model="url" placeholder="ウェブサイトのURL" required @keyup.enter="getScreenshot">
        <a href="javascript:void(0)" @click="getScreenshot" class="form__button btn red lighten-1">スクリーンショットを取得</a>
      </div>
    </div>
    <div class="main__result" v-if="result">
      <div class="result__info">
        <p class="result__title" v-if="getTitle">ページタイトル：{{getTitle}}</p>
        <p class="result__url" v-if="getUrl"><a :href="getUrl">{{getUrl}}</a></p>
        <p class="result__input">タグ：<input type="text" v-model="tag"><a @click="addTag()">タグ追加</a></p>
        <p class="result__tag" v-for="tag in tags" :key="tag.id">{{tag}}</p>
        <a href="javascript:void(0)" @click="saveDesign" class="result__save" v-if="getImage">保存する</a>
      </div>
      <img :src="'/images/' + getImage" alt="" v-if="getImage" class="result__image">
    </div>
    <div class="tags container">
      <p class="tags__title">タグ一覧</p>
      <a href="#" class="waves-effect waves-light btn-small" v-for="tag in filterAllTag" :key="tag.id">{{tag.body}}</a>
    </div>
    <div class="row container">
      <template v-for="(design, index) in orderedById">
        <div class="col l4 m6 s12" :key="design.id">
          <div class="card">
            <div class="card-image">
              <img :src="'/images/' + design.image" alt="" class="card__image">
              <span class="card-title">{{design.title}}</span>
            </div>
            <div class="card-content">
              <p class="card__text">タグ</p>
              <div v-for="(tag, index) in design.tags" :key="index" class="card-tag">
                <span class="card-tag__label">{{tag.body}}</span>
                <i @click="deleteTag(design.id, tag.id)" class="material-icons tiny card-tag__icon">clear</i>
              </div>
              <p class="result__input"><input type="text" v-model="editTag[index]"><a @click="editAddTag(design.id, index)">タグ追加</a></p>
            </div>
            <div class="card-action">
              <a href="#">開く</a>
              <a href="javascript:void(0);" @click="deleteDesign(index)">削除する</a>
            </div>
          </div>
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
      result: false,
      url: '',
      getTitle: '',
      getUrl: '',
      getImage: '',
      tags: [],
      tag: '',
      designs: [],
      allTag: [],
      editTag: []
    }
  },
  computed: {
    filterAllTag: function() {
      let filteredTags = []
      //比較用にJSON.stringfyをかけた配列を作る
      let objectTags = []
      this.allTag.forEach((tag) => {
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
    orderedById: function () {
      let orderedList = []
      orderedList = this.designs.slice().sort((a, b) => {
        return (a.updatedAt < b.updatedAt ? 1 : -1)
      })
      return orderedList
    }
  },
  mounted: function() {
    axios.get('/api/designs')
    .then((res) => {
      this.designs = res.data
      console.log(res.data)
      this.setTag(res.data)
    })
  },
  methods: {
    setTag: function(designs) {
      let tags = []
      designs.forEach((design) => {
        design.tags.forEach((tag) => {
          tags.push(tag)
        })
      })
      this.allTag = tags
    },
    getScreenshot: function() {
      this.isLoading = true
      axios.post('/api/webshot',{url: this.url})
      .then((res) => {
        console.log(res)
        this.getTitle = res.data.title
        this.getUrl = res.data.url
        this.getImage = res.data.image
        this.result = true
        this.isLoading = false
      })
    },
    saveDesign: function() {
      console.log(this.tags)
      axios.post('/api/savedesign', {
        title: this.getTitle,
        url: this.getUrl,
        image: this.getImage,
        tags: this.tags
      })
      .then((res) => {
        this.designs = res.data
        this.getTitle = ''
        this.getUrl = ''
        this.getImage = ''
        this.result = false
        this.setTag(res.data)
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
    },
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
    editAddTag: function(designId, index) {
      console.log(this.editTag[index])
      axios.post('/api/addtag', {
        designId: designId,
        tag: this.editTag[index]
      })
      .then((res) => {
        const targetDesign = this.designs.find((design) => {
          return design.id === designId
        })
        targetDesign.tags.push(res.data)
        this.allTag.push(res.data)
        this.editTag[index] = ''
      })
    },
    deleteTag: function(designId, tagId) {
      axios.post('/api/deletetag', {
        designId: designId,
        tagId: tagId
      })
      .then(() => {
        const targetDesign = this.designs.find((design) => {
          return design.id === designId
        })
        targetDesign.tags.forEach((tag, index) => {
          if(tag.id === tagId) {
            targetDesign.tags.splice(index, 1)
          }
        })
        this.allTag.forEach((tag, index) => {
          if(tag.id === tagId) {
            this.allTag.splice(index, 1)
          }
        })
      }) 
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

.card-image {
  max-height: 300px;
  overflow: hidden;
}

.card__text {
  margin-bottom: 5px;
}

.card-tag {
  display: inline-block;
  margin-right: 5px;
  padding: 5px;
  background-color: #f5f5f5;
}

.card-tag__label {
  display: inline-block;
  vertical-align: middle;
}

.card-tag__icon {
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
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

.loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, .6)
}
</style>
