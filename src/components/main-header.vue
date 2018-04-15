<template>
<nav>
  <div class="container">
    <div class="nav-wrapper">
      <a href="/" class="brand-logo">Logo</a>
      <ul class="right hide-on-med-and-down">
        <li><a href="/auth/logout" class="header__link waves-effect waves-light">ログアウト</a></li>
      </ul>
    </div>
  </div>
</nav>
</template>

<style lang="scss">
@import '../commonStyle/_common';
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
