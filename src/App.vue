<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
body {
  width: 100%;
  height: 100%;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.auto-img {
  width: 100%;
  // height: 220px;
  display: block;
}
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}

.fl {
  float: left;
}
.fr {
  float: right;
}

.one-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
