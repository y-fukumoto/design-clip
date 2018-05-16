<template>
  <div class="main">
    <h1 class="title">WebサイトのスクショをStock</h1>
    <h2 class="subtitle">Stockで出来ること</h2>
    <ol class="list">
      <li class="list__item">URLを入れるだけでページ全体のスクショが撮れる</li>
      <li class="list__item">タグ付けで簡単に分類</li>
      <li class="list__item">スクショはGoogle Driveに保存されるから、簡単に共有やダウンロード</li>
    </ol>
    <a href="/auth/google" class="button btn red lighten-1">Googleアカウントでログイン</a>
  </div>
</template>

<style lang="scss" scoped>
.main {

}

.title {
  margin-bottom: 40px;
  font-size: 36px;
  font-weight: bold;
  text-align: center;
}

.subtitle {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}

.list {
  margin: 0 40px 40px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.list__item {
  text-align: center;
  list-style: none;
}

.button {
  display: block;
  width: 280px;
  margin: 0 auto;
  color: white;
}

</style>
