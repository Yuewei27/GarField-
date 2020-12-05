<template>
  <div class="menuDetails">
    <div>
      <Nav @gopack="goPack" :title="menuTitle" />
    </div>
    <div class="menuDeta-box">
      <div class="bg">
        <img src="../assets/image/shopbag-bg.jpg" alt="" class="auto-img" />
      </div>
      <div class="contain">
        <div class="clearfix"></div>
        <div class="con-list">
          <div v-for="(item, index) in menuProduct" :key="index" @click="goDetail(item.pid)">
            <div class="con-img">
              <img :src="item.smallImg" alt="" class="auto-img" />
            </div>
            <div class="con-conver">
              <div class="con-text-title">{{ item.name }}</div>
              <div class="con-enname">{{ item.enname }}</div>
              <div class="con-price">￥{{ item.price }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/menuDetails.less";
import Nav from "../components/Nav.vue";

export default {
  name: "MenuDetails",
   components: {
    Nav,
  },
  data() {
    return {
      tid: -1,
      //   商品数据
      menuProduct: [],
       menuTitle: "菜单",
    };
  },
  created() {
    this.tid = this.$route.query.tid;

    this.getProduct();
  },
  methods: {
    // 返回上一级
    goPack() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: false,
        duration: 1500,
      });

      setTimeout(() => {
        this.$router.go(-1);
      }, 1500);
    },
    getProduct() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/type",
        params: {
          appkey: this.appkey,
        },
      })
        .then((res) => {
          this.$toast.clear();
          // 
          if (res.data.code == 400) {
            res.data.result.map((v) => {
              if (this.tid == v.id) {
                this.typeProduct(v.type);
              }
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();

          
        });
    },

    typeProduct(value) {
      this.axios({
        method: "GET",
        url: "/typeProducts",
        params: {
          appkey: this.appkey,
          key: "type",
          value,
        },
      })
        .then((res) => {
          this.$toast.clear();
          // 
          if (res.data.code == 500) {
            this.menuProduct = res.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();

          
        });
    },
    // 跳转到详情页
     goDetail(pid){
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
      });
      setTimeout(() => {
        this.$router.push({name: 'Detail', params: {pid}});
      },1000)
    },
  },
};
</script>

