<template>
  <div class="detail">
    <div>
      <Nav @gopack="goPack" :title="menuTitle" />
       <div class="right-img" @click="showShare = true">
            <img src="../assets/image/fenxiang.png" alt="" />
        </div>
    </div>
    <van-share-sheet
      v-model="showShare"
      title="立即分享给好友"
      :options="options"
    />

    <div class="delta-box">
      <div class="del-Img">
        <img class="auto-img" :src="detailData.large_img" alt="" />
        <div class="del-img-pro-name">
          <div>{{ detailData.name }}</div>
          <span>￥{{ detailData.price }}</span>
        </div>
      </div>
      <div class="contain">
        <div class="con-select">
          <div
            class="con-select-box"
            v-for="(item, index) in detailData.rules"
            :key="index"
          >
            <span class="con-temper">{{ item.title }}</span>
            <span
              class="con-tem-select"
              :class="{
                temActive: item.ruleIndex == i,
                'large-text': v.title.length >= 4,
              }"
              v-for="(v, i) in item.rule"
              :key="i"
              @click="tasteToggle(item, i)"
              >{{ v.title }}</span
            >
          </div>
        </div>

        <div class="con-priceBox">
          <div class="con-price">选择数量</div>
          <div class="con-count">
            <van-stepper
              v-model="temCount"
              theme="round"
              button-size="24"
              disable-input
            />
          </div>
        </div>

        <div class="con-descrtion">
          <div class="con-des-title">商品描述</div>
          <div
            class="con-des-text"
            v-for="(item, index) in detailData.desc"
            :key="index"
          >
            <p>{{ index + 1 }}、{{ item }}</p>
          </div>
        </div>

        <div class="actionIcon">
          <van-goods-action>
            <van-goods-action-icon
              icon="cart-o"
              text="购物袋"
              :badge="shopBagCount == 0 ? '' : shopBagCount"
              :color="shopBagCount > 0 ? '#724123' : '#646566'"
              :to="{ name: 'Shopbag' }"
            />
            <van-goods-action-icon
              :icon="isLike ? 'star' : 'star-o'"
              :text="isLike ? '已收藏' : '收藏'"
              color="#724123"
              @click="toggleFindLike"
            />
            <van-goods-action-button
              color="#e7b993"
              type="warning"
              text="加入购物车"
              @click="addShopBag"
            />
            <van-goods-action-button
              type="danger"
              text="立即购买"
              @click="buyNow(false)"
            />
          </van-goods-action>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/detail.less";
import Nav from "../components/Nav.vue";

export default {
  name: "Detail",
  components: {
    Nav,
  },
  data() {
    return {
      menuTitle: "商品详情",
      pid: "",
      // 数据缓存
      detailData: [],

      // 选择商品的数量
      temCount: 0,
      // 购物袋的数量
      shopBagCount: 0,

      // 是否收藏商品
      isLike: false,

      // 判断是否分享商品
      showShare: false,
      options: [
        { name: "微信", icon: "wechat" },
        { name: "微博", icon: "weibo" },
        { name: "复制链接", icon: "link" },
        { name: "分享海报", icon: "poster" },
        { name: "二维码", icon: "qrcode" },
      ],
    };
  },
  created() {
    this.pid = this.$route.params.pid;
    // 
    // 获取商品详情数据
    this.getProductDetail();

    //查询用户是否已经收藏该商品
    this.findLike();

    // 查询用户购物袋的数量
    this.checkShopBagCount();
  },
  methods: {
    //获取商品详情数据
    getProductDetail() {
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
        url: "/productDetail",

        //GET请求参数, object
        params: {
          appkey: this.appkey,
          pid: this.pid,
        },
      })
        .then((res) => {
          this.$toast.clear();

          // 
          if (res.data.code == 600) {
            // res.data.result[0].desc =  res.data.result[0].desc.split('/\n/')
            // this.detailData = res.data.result;
            let data = res.data.result[0];

            data.desc = data.desc.split(/\n/);

            let rules = [];

            let ruleData = ["tem", "sugar", "milk", "cream"];
            ruleData.map((v) => {
              let r = {};
              r.title = data[v + "_desc"];

              //激活下标
              r.ruleIndex = 0;

              //每项规格
              r.rule = [];

              //获取规格字符串
              let ruleString = data[v].split("/");
              ruleString.map((value) => {
                if (value != "") {
                  r.rule.push({ title: value });
                }
              });

              if (r.rule.length > 0) {
                rules.push(r);
              }
            });

            data.rules = rules;

            this.detailData = data;

            // 
          } else {
            
          }
        })
        .catch((err) => {
          this.$toast.clear();

          
        });
    },
    // 口味规格切换
    tasteToggle(item, i) {
      // 
      if (item.ruleIndex == i) {
        return;
      }

      item.ruleIndex = i;
    },

    // 返回上一级
    goPack() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      setTimeout(() => {
        this.$router.go(-1);
      }, 1500);
    },
    // 添加收藏
    toggleFindLike() {
      let tokenString = localStorage.getItem("tokenStr");

      if (!tokenString) {
        this.$toast("请先登录，即将为您跳转");
        setTimeout(() => {
          return this.$router.push({ name: "Login" });
        }, 1000);
      }

      let url = this.isLike ? "/notlike" : "/like";

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      //发起收藏商品请求
      this.axios({
        method: "POST",
        url,
        data: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString,
        },
      })
        .then((res) => {
          this.$toast.clear();
          //  
          if (res.data.code == 700) {
            //token无效，跳回登录界面
            this.$toast("请先登录，即将为您跳转");

            setTimeout(() => {
              this.$router.push({ name: "Login" });
            }, 500);
          } else if (res.data.code == 800) {
            this.isLike = true;
          } else if (res.data.code == 900) {
            // 取消收藏商品
            this.isLike = false;
          }

          this.$toast(res.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
    //查询用户是否收藏该商品
    findLike() {
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
        url: "/findlike",
        params: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString,
        },
      })
        .then((res) => {
          this.$toast.clear();

          // 
          if (res.data.code == 1000) {
            if (res.data.result.length > 0) {
              this.isLike = true;
            }
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //查询用户的购物袋数量
    checkShopBagCount() {
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
        url: "/shopcartRows",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((res) => {
          this.$toast.clear();
          // 
          if (res.data.code == 8000) {
            if (res.data.result > 0) {
              // 数据的长度作为购物袋的数量
              this.shopBagCount = res.data.result;
            }
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    // 加入购物袋
    addShopBag(isBuy) {
      let tokenString = localStorage.getItem("tokenStr");

      if (!tokenString) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
      // 请求的参数
      let addShopData = {
        tokenString,
        appkey: this.appkey,
        pid: this.pid,
        count: this.temCount,
      };

      // 记录获取的商品规格信息
      let produceMsg = [];
      // 
      //遍历productDetail.rules数组获取选择的商品规格
      this.detailData.rules.map((v) => {
        // 
        produceMsg.push(v.rule[v.ruleIndex].title);
      });

      addShopData.rule = produceMsg.join("/");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "POST",
        url: "/addShopcart",
        data: addShopData,
      })
        .then((res) => {
          this.$toast.clear();

          // 
          if (res.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (res.data.code == 3000) {
            if (isBuy) {
              this.$toast(res.data.msg);
              // 检查商品规格是否有一致的
              if (res.data.status == 1) {
                this.shopBagCount++;
              }
            } else {
              this.$toast.loading({
                message: "加载中...",
                forbidClick: true,
                duration: 0,
              });
              setTimeout(() => {
                this.$toast.clear();
                this.$router.push({
                  name: "Payment",
                  query: { sids: res.data.sid },
                });
              }, 800);

              return;
            }
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
    //  立即购买
    buyNow(isBuy) {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      setTimeout(() => {
        this.$toast.clear();
        this.addShopBag(isBuy);
      }, 800);
    },
    // 分享
    onSelect(option) {
      Toast(option.name);
      this.showShare = false;
    },
  },
};
</script>
