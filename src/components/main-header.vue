<template>
<nav>
  <div class="container">
    <div class="nav-wrapper">
      <a href="/" class="brand-logo">Stock</a>
      <ul class="right hide-on-med-and-down">
        <li class="header__user" @click="showDropdown = !showDropdown" v-if="user">
          <img :src="user.photos[0].value" class="header__icon"><span class="header__username">{{user.displayName}}</span>
          <div v-if="showDropdown" class="header__dropdown header-dropdown">
            <a href="/auth/logout" class="header-dropdown__link">ログアウト</a>
          </div>
        </li>
      </ul>
    </div>
  </div>
</nav>
</template>

<script>
export default {
  props: {
    user: {
      type: Object
    }
  },
  data() {
    return {
      showDropdown: false
    }
  },
  mounted: function() {
    console.log(this)
  }
}
</script>


<style lang="scss">
@import '../commonStyle/_common';
body {
  color: #484848;
}

.nav-wrapper {
  @include clearfix;
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

.header__user {
  cursor: pointer;
}

.header__icon {
  display: inline-block;
  width: 30px;
  margin-right: 6px;
  vertical-align: middle;
  border-radius: 30px;
}

.header__username {
  display: inline-block;
  vertical-align: middle;
}

.header__menu {
  position: relative;
}

.header__toggle {
  display: block;
  height: 64px;;
  color: #666666;
}

.header__dropdown {
  position: absolute;
  top: 64px;
  right: 0;
  width: 150px;
  background-color: white;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);
  z-index: 2;
}


.header-dropdown__link {
  line-height: 44px;
}

</style>
