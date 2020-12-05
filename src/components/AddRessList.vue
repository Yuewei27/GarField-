<template>
  <div class="addRessList">
    <div class="bg"></div>
    <div class="contain">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddRessList",
};
</script>

<style lang="less" scoped>
.addRessList {
  // padding-top: 50px;
  .bg {
    height: 100px;
    width: 100%;
    background-color: #724123;
    
  }

  .content {
    margin: 0 10px;
    position: relative;
    top: -20px;
    background-color: #fff;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    padding: 10px;
  }
}
</style>