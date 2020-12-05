<template>
  <div class="payment">
    <van-nav-bar
      title="提交订单"
      left-text="返回"
      left-arrow
      fixed
      placeholder
      @click-left="goPack"
    />
    <div class="pay-box">
      <div class="shipAddress">
        <div class="pay-ship-con">
          <div class="con-text">
            <span @click="openSelectAddress">选择收货地址</span>
            <van-icon class="arrow" name="arrow" />
          </div>
          <div class="addressInfo">
            <div class="user-info">
              <div class="user-name">{{ currentAddress.name }}</div>
              <div class="user-phone">{{ currentAddress.tel }}</div>
              <div class="defualt" v-if="currentAddress.isDefault">默认</div>
            </div>
            <div class="detail-address">{{ currentAddress.address }}</div>
          </div>
        </div>
      </div>
      <!-- 订单列表 -->
      <div class="pay-order-list">
        <OrderInfo
          info-text-title="订单信息"
          :pro-count="productTotal.count"
          :total="productTotal.total"
        >
          <ListModule
            v-for="(item, index) in payProduct"
            :key="index"
            :item="item"
            :is-numerical="false"
          ></ListModule>
        </OrderInfo>
      </div>
      <div class="btn-box">
        <van-button
          type="primary"
          block
          round
          color="#19120e"
          class="btn"
          @click="payTie"
          >立即结算</van-button
        >
      </div>
    </div>

    <van-popup is-link v-model="isOpen" position="bottom" closeable>
      <div class="address-title">选择地址</div>
      <van-address-list
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        @add="newAddress"
        @select="selectAddress"
      />
    </van-popup>
  </div>
</template>

<script>
import "../assets/less/payment.less";
import OrderInfo from "../components/OrderInfo.vue";
import ListModule from "../components/ListModule.vue";

export default {
  name: "Payment",
  data() {
    return {
      //   商品数据
      payProduct: [],

      // 地址列表
      list: [],
      // 选择地址ID
      chosenAddressId: "",

      // 当前地址
      currentAddress: [],

      // 商品总价
      productTotal: {
        count: 0,
        total: 0,
      },
      // 是否弹出选择
      isOpen: false,

      // 经纬度
      lat: "",
      lng: "",
      //用户信息
      accountInfo: {
        nickName: "",
        phone: "",
      },
    };
  },
  // 局部注册
  components: {
    OrderInfo,
    ListModule,
  },
  created() {
    this.sids = this.$route.query.sids.split("-");
    //

    this.getAllproduct();

    this.getAddressData();

    this.getAccountInfo();

    this.checkPosition();
  },
  methods: {
    // 是否需要当前位置作为收货地址
    setPosition() {
      this.$dialog
        .confirm({
          title: "确认设置当前位置",
          message: "是否需要当前位置作为收货地址?",
          confirmButtonColor: "#0C34BA",
        })
        .then(() => {
          //确认设置当前位置作为收货地址
          this.getPisition();
        })
        .catch((err) => {});
    },

    // 查找是否有经纬度
    checkPosition() {
      this.lat = localStorage.getItem("posiLat");
      this.lng = localStorage.getItem("posilng");
      // console.log(this.lat,this.lng)
      if (this.lat && this.lng) {
        this.setPosition();
      }
    },
    // 获取所在地的地址
    getPisition() {
      let arr = [];
      arr.push(this.lat, this.lng);
      let str = arr.join(",");
      // console.log(str);

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "https://api.it120.cc/common/map/qq/address",
        params: {
          key: "TVSBZ-CGE66-3GXSY-MJBLO-7JZ32-LKBJO",
          location: str,
        },
      })
        .then((res) => {
          this.$toast.clear();

          let address =
            res.data.data.result.address +
            res.data.data.result.address_reference.crossroad.title;
          // console.log(this.accountInfo)
          let obj = {
            address: address,
            tel: this.accountInfo.phone,
            name: this.accountInfo.nickName,
          };

          let arr = [];
          // console.log(obj)
          arr.push(obj);
          // this.chosenAddressId = .aid;
          this.chosenAddressId = this.accountInfo.userId
          this.currentAddress = arr[0];
        })
        .catch((err) => {
          // console.log(err);
        });
    },
    // 获取用户个人资料
    getAccountInfo() {
      let tokenString = localStorage.getItem("tokenStr");

      if (!tokenString) {
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method: "GET",
        url: "/findAccountInfo",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((res) => {
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (res.data.code == "B001") {
            let data = res.data.result[0];
            this.accountInfo = data;
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
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

    // 获取地址列表
    getAddressData() {
      let tokenString = localStorage.getItem("tokenStr");
      if (!tokenString) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/findAddress",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((res) => {
          this.$toast.clear();
          //
          if (res.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (res.data.code == 20000) {
            // console.log(res)
            res.data.result.map((v) => {
              v.isDefault = Boolean(v.isDefault); //转布尔值
              v.id = v.aid;
              v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`;

              if (v.isDefault) {
                this.chosenAddressId = v.aid;
                this.currentAddress = v;
              }
            });
            // console.log(res.data.result)
            // 默认地址
            this.list = res.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    // 根据sid获取商品数据
    getAllproduct() {
      let tokenString = localStorage.getItem("tokenStr");

      if (!tokenString) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/commitShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(this.sids),
        },
      })
        .then((res) => {
          this.$toast.clear();
          if (res.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (res.data.code == 50000) {
            //
            if (res.data.result.length == 0) {
              //如果没有商品可购买，则跳转到购物袋页面
              return this.$router.push({ name: "Shopbag" });
            }
            res.data.result.map((v) => {
              this.productTotal.count += v.count;
              this.productTotal.total += v.count * v.price;
            });
            this.payProduct = res.data.result;
          } else {
            this.$toast(res.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    // 打开选择列表
    openSelectAddress() {
      this.isOpen = true;
    },
    // 新增地址
    newAddress() {
      this.$router.push({ name: "NewAddress" });
    },
    // 选择地址
    selectAddress(item, index) {
      this.isOpen = false;
      this.currentAddress = item;
    },
    // 支付页面
    payMent() {
      let tokenString = localStorage.getItem("tokenStr");

      if (!tokenString) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "POST",
        url: "/pay",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(this.sids),
          phone: this.currentAddress.tel,
          address: this.currentAddress.address,
          receiver: this.currentAddress.name,
        },
      })
        .then((res) => {
          this.$toast.clear();
          if (res.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else {
            this.$toast(res.data.msg);
            setTimeout(() => {
              this.$router.push({ name: "Order" });
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    //结算提示
    payTie() {
      if (!this.chosenAddressId) {
        this.$toast("请选择地址");
        return;
      }

      this.$dialog
        .confirm({
          title: "确认订单",
          message: "是否立即结算?",
          confirmButtonColor: "#0C34BA",
        })
        .then(() => {
          //提交订单
          this.payMent();
        })
        .catch((err) => {});
    },
  },
};
</script>


