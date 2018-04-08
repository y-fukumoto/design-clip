<template>
  <div class="header">
    <div class="header__body">
      <h1 class="header__title">デザインクリップ</h1>
      <a href="/auth/logout" class="header__link">ログアウト</a>
    </div>
  </div>

</template>

<style lang="scss">
@import '../commonStyle/_reset';
body {
  color: #484848;
}

.header {
  height: 80px;
  line-height: 80px;
  margin-bottom: 20px;
  overflow: hidden;
  border-bottom: 1px solid #efefef;
}

.header__body {
  margin: 0 40px;
}

.header__title {
  display: inline-block;
}

.header__link {
  float: right;
  display: block;
  text-decoration: none;
}

</style>
