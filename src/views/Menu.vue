<template>
  <div class="menu">
    <div>
      <Nav @gopack="goPack" :title="menuTitle"><slot></slot></Nav>
    </div>

    <div class="menu-box">
      <div class="menu-contain">
        <div class="menu-list" v-for="(item, index) in menuselect" :key="index">
          <div @click="enterMenuDetails(item)">
            <div class="menu-Img">
              <img :src="item.img" alt="" class="auto-img" />
            </div>
            <div class="menu-text">
              <div>
                <div class="menu-text-title">{{ item.title }}</div>
                <div class="menu-text-enname">{{ item.enname }}</div>
                <div class="menu-text-con">
                  <i>·</i>
                  <div>{{ item.deploy }}</div>
                  <i>·</i>
                </div>
                <div class="menu-text-mater">{{ item.textMater }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/menu.less";
import Nav from "../components/Nav.vue";

export default {
  name: "Menu",
  components: {
    Nav,
  },
  data() {
    return {
      // 标题
      menuTitle: "菜单",
      menuselect: [
        {
          img:
            "https://cdn.colorhub.me/I70x1aZ1dh36ykTvkcboA5lWdRZNBnwBbRXRqMj6kdI/auto/0/500/ce/0/bG9jYWw6Ly8vOWMv/OTUvM2VkMDQzOWEz/ZjJkMDkwYzFhYzBi/YmM0NzUzNjMyMDA3/ZDNiOWM5NS5qcGc.jpg",
          title: "拿铁",
          enname: "Latte",
          deploy: "调配",
          textMater: "浓缩咖啡，牛奶，榛子风味糖浆",
          tid: 1,
        },
        {
          img:
            "https://cdn.colorhub.me/JQmTpW3-IqU7QSMH_XeEJ6L2aeLzWcIs4mb-51hREck/auto/0/500/ce/0/bG9jYWw6Ly8vMzIv/OTUvYjdjZTFkYmQ3/ZDVkN2M2NDkzYzkx/ZTc5MzUzMGFhYjZh/MzM0MzI5NS5qcGVn.jpg",
          title: "咖啡",
          enname: "Coffee",
          deploy: "调配",
          textMater: "浓缩咖啡、牛奶",
          tid: 2,
        },
        {
          img:
            "https://cdn.colorhub.me/KABy3AxAhEGMNO67SdxjnkS8YMYWrIXt7L0NoporJxM/auto/0/500/ce/0/bG9jYWw6Ly8vYzAv/NmEvNWNiMzFlZGUw/OTg0YThhMTNjYjVk/NDA0YWE5ZmU3NTg5/NTc4YzA2YS5qcGVn.jpg",
          title: "瑞纳冰",
          enname: "Rena_Ice",
          deploy: "调配",
          textMater: "冰沙粉，牛奶，冰块，搅打稀奶油",
          tid: 3,
        },
      ],
    };
  },
  created() {},
  methods: {
    // 返回上一级
    goPack() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 1500,
      });

      setTimeout(() => {
        this.$router.go(-1);
      }, 1500);
    },
    enterMenuDetails(item) {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 1500,
      });
      setTimeout(() => {
        this.$router.push({ name: "MenuDetails", query: { tid: item.tid } });
      }, 1500);
    },
  },
};
</script>
