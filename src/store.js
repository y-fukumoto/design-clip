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
    selectTag: []
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
  },
  setResult: function(boolean) {
    console.log(boolean)
    this.state.result = boolean
    console.log(this.state.result)
  },
  setLoading: function(boolean) {
    console.log(boolean)
    this.state.loading = boolean
    console.log(this.state.result)
  },
  setRegisteredTags: function(data) {
    let tags = []
    data.forEach((design) => {
      design.tags.forEach((tag) => {
        tags.push(tag)
      })
    })
    this.state.registeredTags = tags
  },
  //登録済デザインにタグを追加
  addTagAtDesign: function(data, designId) {
    const targetDesign = this.state.designs.find((design) => {
      return design.id === designId
    })
    targetDesign.tags.push(data)
  },
  addSelectTag: function(tag) {
    this.state.selectTag.push(tag)
  },
  //登録済デザインのタグをタグ一覧に追加
  addRegisteredTags: function(data) {
    this.state.registeredTags.push(data)
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
  }
}

module.exports = store