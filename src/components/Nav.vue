<template>
  <div class="nav">
    <van-nav-bar
      :title="title"
      left-text="返回"
      left-arrow
      fixed
      placeholder
      @click-left="goPack"
    >
    </van-nav-bar>
  </div>
</template>

<script>
export default {
  name: "Nav",
  props: {
    title: {
      type: String,
      default: "",
    },
  },
  methods: {
    goPack() {
      this.$emit("gopack");
    },
   
  },
};
</script>

<style lang="less" scoped>
/deep/ .van-nav-bar {
  width: 100%;
  height: 50px;
  // background: linear-gradient(to right,#e7e5e6 20%, #debb99);

  background-color: #a68679;
}

/deep/ .van-nav-bar .van-icon,
/deep/ .van-nav-bar__text {
  color: #333;
  font-size: 16px;
}

/deep/ .van-nav-bar__title {
  font-size: 18px;
  font-weight: bold;
}

/deep/ .van-nav-bar::after {
  border: none;
}
</style>