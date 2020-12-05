<template>
  <div class="home" @click="Blur">
    <van-nav-bar fixed placeholder>
      <template #left>
        <div class="home-nav">
          <div>
            <div class="greetings">{{ hoursTip }}</div>
            <div class="city">{{ city }}</div>
          </div>
          <div class="nickName">{{ userInfo.nickName }}</div>
        </div>
      </template>
      <template #right>
        <div class="home-search">
          <van-search placeholder="输入商品名称" @input="searchGoods" />
          <div class="search-con" v-if="isSearch">
            <div
              class="search-list"
              v-for="(item, index) in searchData"
              :key="index"
            >
              <div @click="goDetail(item.pid)">{{ item.name }}</div>
            </div>
          </div>
        </div>
      </template>
    </van-nav-bar>

    <div class="home-content">
      <!-- 轮播图 -->
      <div class="banner-box">
        <van-swipe @change="changeCurrentIndex" :autoplay="3500">
          <van-swipe-item v-for="(item, index) in bannerData" :key="index">
            <img
              class="auto-img"
              :src="item.bannerImg"
              alt=""
              @click="goDetail(item.pid)"
            />
          </van-swipe-item>

          <template #indicator>
            <div class="index-box">
              <div
                :class="{ active: index == currentIndex }"
                v-for="(item, index) in bannerData"
                :key="index"
              ></div>
            </div>
          </template>
        </van-swipe>
      </div>

      <!-- 商品 -->
      <div class="product-box">
        <!-- 导航切换栏 -->
        <div class="product-contain">
          <div
            class="clearfix pro-title-box"
            v-for="(item, index) in recomTab"
            :key="index"
            @click="recomTabtoggle(item)"
            :class="[item.isRecomTab ? 'tabActive' : '']"
          >
            <span class="pro-title">{{ item.title }}</span>
          </div>
        </div>
        <!-- 商品展示栏 -->
        <!-- <div class="products clearfix"></div> -->
        <div class="ComProduce">
          <div
            class="pro-item fl"
            v-for="(item, index) in hotProduct"
            :key="index"
          >
            <div @click="goDetail(item.pid)">
              <img class="auto-img" :src="item.smallImg" />
            </div>
            <div class="products clearfix"></div>
            <div class="pro-info fl">
              <div class="pro-name one-text">{{ item.name }}</div>
              <div class="pro-enname one-text">{{ item.enname }}</div>
              <div class="pro-price">￥{{ item.price }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/home.less";

export default {
  name: "Home",
  data() {
    return {
      // 当前轮播图片索引
      currentIndex: 0,

      // 轮播数据
      bannerData: [],

      recomTab: [
        {
          title: "热卖推荐",
          isRecomTab: true,
          id: 1,
        },
        {
          title: "新品推荐",
          isRecomTab: false,
          id: 2,
        },
      ],

      //热卖商品数据
      hotProduct: [],

      //搜索结果列表
      searchData: [],

      isSearch: false,
      userInfo: {
        nickName: "",
      },

      // 时间提示
      hoursTip: "",

      // 当前所在城市
      city: "",
    };
  },
  created() {
    //获取轮播图数据
    this.getBannerData();

    //获取热卖推荐商品
    this.getHotProdect("isHot", 1);

    // 获取个人资料
    this.getUserInfo();
    // 设置时间段
    this.setTimePeriod();

    //  获取经纬度
    this.getPosition();
  },
  methods: {
    //  获取经纬度
    getPosition() {
    
      var data = {
        key: "TVSBZ-CGE66-3GXSY-MJBLO-7JZ32-LKBJO", //这个key就是你申请的密钥
      };
      var url = "https://apis.map.qq.com/ws/location/v1/ip"; //这个就是地理位置信息的接口
      data.output = "jsonp";
      this.$jsonp(url, data)
        .then((res) => {
          // console.log(res)
          this.city = res.result.ad_info.city;
          localStorage.setItem("posiLat", res.result.location.lat);
          localStorage.setItem("posilng", res.result.location.lng);
        })
        .catch((error) => {});
    },
    //搜索商品
    searchGoods(value) {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      //发起注册请求
      this.axios({
        //请求类型
        method: "GET",
        //请求路径
        url: "/search",

        //GET请求参数, object
        params: {
          appkey: this.appkey,
          name: value,
        },
      })
        .then((res) => {
          this.$toast.clear();

          if (res.data.code == "Q001") {
            this.isSearch = true;
            this.searchData = res.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          this.$toast("输入关键词有误");
        });
    },
    // 焦点触发事件
    Blur() {
      this.isSearch = false;
    },
    changeCurrentIndex(index) {
      //
      this.currentIndex = index;
    },
    //获取轮播图数据
    getBannerData() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      //发起注册请求
      this.axios({
        //请求类型
        method: "GET",
        //请求路径
        url: "/banner",

        //GET请求参数, object
        params: {
          appkey: this.appkey,
        },
      })
        .then((result) => {
          this.$toast.clear();

          //

          if (result.data.code == 300) {
            this.bannerData = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();

          //
        });
    },
    // 推荐栏切换
    recomTabtoggle(item) {
      for (let i = 0; i < this.recomTab.length; i++) {
        if (this.recomTab[i].isRecomTab) {
          this.recomTab[i].isRecomTab = false;
          break;
        }
      }
      item.isRecomTab = true;

      //获取热卖推荐商品
      if (item.id == "1") {
        this.getHotProdect("isHot", 1);
      } else if (item.id == "2") {
        this.getHotProdect("type", "coffee");
      }
    },
    getHotProdect(key, value) {
      //发起注册请求
      this.axios({
        //请求类型
        method: "GET",
        //请求路径
        url: "/typeProducts",

        //GET请求参数, object
        params: {
          appkey: this.appkey,
          key,
          value,
        },
      })
        .then((result) => {
          this.$toast.clear();

          //

          if (result.data.code == 500) {
            this.hotProduct = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    // 获取用户资料
    getUserInfo() {
      let tokenString = localStorage.getItem("tokenStr");

      if (!tokenString) {
        return;
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method: "GET",
        url: "/findMy",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((res) => {
          this.$toast.clear();
          //

          if (res.data.code == "A001") {
            this.userInfo.nickName = res.data.result[0].nickName;
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    // 设置时间段
    setTimePeriod() {
      let date = new Date();
      if (date.getHours() > 0 && date.getHours() <= 6) {
        this.hoursTip = "深夜好!";
      } else if (date.getHours() > 6 && date.getHours() <= 12) {
        this.hoursTip = "上午好!";
      } else if (date.getHours() > 12 && date.getHours() <= 18) {
        this.hoursTip = "下午好!";
      } else if (date.getHours() > 18 && date.getHours() <= 24) {
        this.hoursTip = "晚上好!";
      }
    },
    goDetail(pid) {
      this.isSearch = false;
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      setTimeout(() => {
        this.$router.push({ name: "Detail", params: { pid } });
      }, 1000);
    },
  },
};
</script>
