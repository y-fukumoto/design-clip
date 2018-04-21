const store = {
  state: {
    error: {
      status: false,
      message: ''
    },
    loading: false,
    result: false,
    designs: [],
    scrapingData: {
      title: '',
      url: '',
      image: '',
    },
    registeredTags: [],
    selectTag: [],
    showDesign: {
      show: false,
      design: {}
    }
  },
  setError: function(err) {
    this.state.error.status = true,
    this.state.error.message = err.message
  },
  resetError: function() {
    this.state.error.status = false
  },
  setDesignData: function(data) {
    this.state.designs = data
    this.setRegisteredTags(this.state.designs)
  },
  setResult: function(boolean) {
    this.state.result = boolean
  },
  setLoading: function(boolean) {
    this.state.loading = boolean
  },
  //登録済のタグ一覧を重複を除き配列に設定
  setRegisteredTags: function(data) {
    let tags = []
    data.forEach((design) => {
      design.tags.forEach((tag) => {
        tags.push(tag)
      })
    })
    let filteredTags = []
    //比較用にJSON.stringfyをかけた配列を作る
    let objectTags = []
    tags.forEach((tag) => {
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
    this.state.registeredTags = parseTags
  },
  //登録済デザインにタグを追加
  addTagAtDesign: function(data, designId) {
    this.state.designs.forEach((design) => {
      if (design.id === designId) {
        design.tags.push({
          id: data.id,
          body: data.body
        })
      }
    })
    this.setRegisteredTags(this.state.designs)
  },
  addSelectTag: function(data) {
    let isSelected = this.state.selectTag.find((tag) => {
      return data.id === tag.id
    })
    if(isSelected) {
      //すでに選択していたら非選択に
      let selectedTags = this.state.selectTag.filter((tag) => {
        return data.id != tag.id
      })
      this.state.selectTag = selectedTags;
    } else {
      //選択していなければ選択に
      this.state.selectTag.push(data)
    }
  },
  //取得したスクショなどの情報を保存
  setScrapingData: function(data) {
    this.state.scrapingData.title = data.title
    this.state.scrapingData.url = data.url
    this.state.scrapingData.image = data.image
  },
  resetScrapingData: function() {
    this.state.scrapingData.title = ''
    this.state.scrapingData.url = ''
    this.state.scrapingData.image = ''
  },
  setShowDesign: function(design) {
    this.state.showDesign.design = design
    this.state.showDesign.show = true
  },
  setCloseDesign: function() {
    this.state.showDesign.show = false
  }
}

module.exports = store