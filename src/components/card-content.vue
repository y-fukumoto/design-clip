<template>
<div class="row container">
  <transition-group name="body" tag="div" class="cards" appear>
    <template v-for="(design, index) in orderedById">
      <div class="card" :key="design.id">
        <div class="card-image" @click="showDesign(design)">
          <img :src="'/images/' + design.image" alt="" class="card__image">
          <div class="card-title"><a :href="design.url" class="card-url" target="_blank">{{design.title}}</a></div>
        </div>
        <div class="card-content">
          <div v-for="(tag, index) in design.tags" :key="index" class="card-tag">
            <span class="card-tag__label">{{tag.body}}</span>
            <i @click="deleteTag(design.id, tag.id)" class="material-icons tiny card-tag__icon">clear</i>
          </div>
          <a @click="showTagInput(index)" class="card__add" v-if="!tagInput[index]">Add Tag</a>
          <p class="card__input card-input" v-if="tagInput[index]"><input type="text" v-model="editTag[index]" class="card-input__input"><a href="javascript:void(0);" @click="editAddTag(design.id, index)" class="card__add">Add</a></p>
        </div>
        <div class="card-action">
          <a href="javascript:void(0);" @click="showDesign(design)">開く</a>
          <a href="javascript:void(0);" @click="deleteDesign(design.id)">削除する</a>
        </div>
      </div>
    </template>
  </transition-group>
</div>
</template>

<script>
import axios from 'axios'
import store from '../store'
export default {
  data() {
    return {
      state: store.state,
      editTag: [],
      tagInput: {}
    }
  },
  computed: {
    orderedById: function () {
      let orderedList = []
      orderedList = this.state.designs.slice().sort((a, b) => {
        return (a.updatedAt < b.updatedAt ? 1 : -1)
      })
      let testFunc = (array, id) => {
        return array.some((item) => {
          return item.id == id
        })
      }
      //TODO 選択したタグで絞込
      if(this.state.selectTag.length  > 0) {
        let filteredList = new Set()
        this.state.selectTag.forEach((tag) => {
          let matchList = orderedList.filter((design) => {
            return testFunc(design.tags, tag.id)
          })
          matchList.forEach((match) => {
            filteredList.add(match)
          })
        })
        return Array.from(filteredList.values())
      }
      return orderedList
    },
  },
  methods: {
    deleteDesign: function(designId) {
      axios.post('/api/deletedesign', {
        id: designId
      })
      .then((res) => {
        store.setDesignData(res.data)
        this.$forceUpdate();
      })
    },
    showTagInput: function(index) {
      this.$set(this.tagInput, index, true)
    },
    editAddTag: function(designId, index, event) {
      console.log(event)
      let exist = false
      let input = this.editTag[index]
      //空文字の場合は何もしない
      if(!input) {
        exist = true
      }
      const targetDesign = this.state.designs.find((design) => {
        return design.id === designId
      })
      //すでにデザインに同じ文字のタグがあるかチェック
      targetDesign.tags.forEach((tag, index) => {
        if(tag.body === input) {
          exist = true
        }
      })
      if (!exist) {
        this.$set(this.tagInput, index, false)
        axios.post('/api/addtag', {
          designId: designId,
          tag: this.editTag[index]
        })
        .then((res) => {
          store.addTagAtDesign(res.data, designId)
          this.editTag[index] = ''
        })
      } else {
        this.editTag[index] = ''
        this.$forceUpdate();
      }
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
        store.setRegisteredTags(this.state.designs)
      }) 
    },
    showDesign: function(design) {
      store.setShowDesign(design)
    }
  }
}
</script>

<style lang="scss" scoped>

.body-enter-active {
  transition: transform .3s, opacity .3s;
}
.body-leave-active {
  transition: transform .5s, opacity .5s;
}
.body-move:not(.body-leave-active) {
  transition: transform .3s;
}
/* 表示される時 */
.body-enter {
  opacity: 0;
}
/* 消える時 */
.body-leave-to {
  opacity: 0;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}

.card {
  width: 290px;
  min-width: 290px;
  margin-right: 12px;
}

.card-image {
  height: 400px;
  overflow: hidden;
  cursor: pointer;
}

.card__text {
  margin-bottom: 5px;
}

.card__add {
  font-size: 12px;
  cursor: pointer;
}

.card-title {
  width: 100%;
  padding: 4px 16px;
  font-size: 14px;
  line-height: 1.2;
  background-color: rgba(0,0,0,.5);
  box-sizing: border-box;
}

.card-url {
  color: white;
}

.card-tag {
  display: inline-block;
  margin-right: 5px;
  margin-bottom: 4px;
  padding: 2px;
  font-size: 12px;
  border-radius: 4px;
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

.card-input__input {
  height: 28px;
  line-height: 28px;
  padding: 0 4px;
  border: 1px solid #efefef;
  transition: all .2s;
  &:focus {
    border: 1px solid #039be5;
  }
}

</style>
