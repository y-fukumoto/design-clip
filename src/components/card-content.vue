<template>
<div class="row container">
  <template v-for="(design, index) in orderedById">
    <div class="col l4 m6 s12" :key="design.id">
      <div class="card">
        <div class="card-image">
          <img :src="'/images/' + design.image" alt="" class="card__image">
          <div class="card-title"><a :href="design.url" class="card-url" target="_blank">{{design.title}}</a></div>
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
          <a href="javascript:void(0);" @click="deleteDesign(design.id)">削除する</a>
        </div>
      </div>
    </div>
  </template>
</div>
</template>

<script>
import axios from 'axios'
import store from '../store'
export default {
  data() {
    return {
      state: store.state,
      editTag: []
    }
  },
  computed: {
    orderedById: function () {
      let orderedList = []
      orderedList = this.state.designs.slice().sort((a, b) => {
        return (a.updatedAt < b.updatedAt ? 1 : -1)
      })
      //TODO 選択したタグで絞込
      if(this.state.selectTag.length  > 0) {
        let filteredList = []
        this.state.selectTag.forEach((tag) => {

        })
        filteredList = orderedList.filter((design) => {
        })
        return filteredList
      }
      return orderedList
    }
  },
  methods: {
    deleteDesign: function(designId) {
      axios.post('/api/deletedesign', {
        id: designId
      })
      .then((res) => {
        console.log(res)
        store.setDesignData(res.data)
        this.$forceUpdate();
      })
    },
    editAddTag: function(designId, index) {
      console.log(this.editTag[index])
      axios.post('/api/addtag', {
        designId: designId,
        tag: this.editTag[index]
      })
      .then((res) => {
        store.addTagAtDesign(res.data, designId)
        store.addRegisteredTags(res.data)
        this.editTag[index] = ''
      })
    },
    deleteTag: function(designId, tagId) {
      axios.post('/api/deletetag', {
        designId: designId,
        tagId: tagId
      })
      .then(() => {
        const targetDesign = this.state.designs.find((design) => {
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
.card-image {
  max-height: 300px;
  overflow: hidden;
}

.card__text {
  margin-bottom: 5px;
}

.card-title {
  width: 100%;
  padding: 4px 16px;
  font-size: 14px;
  line-height: 1.2;
  background-color: rgba(0,0,0,.4);
  box-sizing: border-box;
}

.card-url {
  color: white;
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
</style>
