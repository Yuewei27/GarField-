<template>
  <div class="shopbag">
    <div>
      <Nav @gopack="goPack" :title="menuTitle"  />
      <div class="isEditCss" @click="isEditMeth">
        <div v-if="shopbagData.length > 0">
          {{ isEdit ? "完成" : "编辑" }}
        </div>
      </div>
    </div>
 

    <div v-if="shopbagData.length == 0">
      <van-empty description="购物袋空空如也，去逛一逛！">
        <van-button round color="#e7b993" class="bottom-button" @click="goWalk">
          逛一逛
        </van-button>
      </van-empty>
    </div>
    <div class="shopbag-box" v-else>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        offset="20"
        @load="loadData"
      >
        <div class="shopbag-product">
          <div
            class="shop-pro-item"
            v-for="(item, index) in shopbagData"
            :key="item.sid"
          >
            <div class="pro-item-cell">
              <div class="cell-item">
                <van-swipe-cell :disabled="!isEdit">
                  <div class="cell-item-box">
                    <div class="cell-item-con">
                      <div class="check-box">
                        <van-checkbox
                          checked-color="#c38a60"
                          v-model="item.isChecked"
                          @click="multipleChoice"
                        />
                      </div>
                      <!-- 组件 -->
                      <div class="pro-info-box-item">
                        <ListModule
                          :item="item"
                          :is-numerical="true"
                          @coo="changeCount"
                        />
                      </div>
                    </div>
                  </div>

                  <template #right>
                    <van-button
                      square
                      type="danger"
                      text="删除"
                      @click="removeOne(index, item.sid)"
                    />
                  </template>
                </van-swipe-cell>
              </div>
            </div>
          </div>
        </div>
      </van-list>

      <van-submit-bar
        v-if="!isEdit"
        :price="total"
        button-text="提交订单"
        button-color="#19120e"
        @submit="commit"
      >
        <van-checkbox v-model="isAllChecked" @click="allSelected"
          >全选</van-checkbox
        >
      </van-submit-bar>

      <van-submit-bar
        v-else
        button-text="删除选择"
        button-color="#EE0A24"
        @submit="removeSelected"
      >
        <van-checkbox v-model="isAllChecked" @click="allSelected"
          >全选</van-checkbox
        >
      </van-submit-bar>
    </div>
  </div>
</template>

<script>
import "../assets/less/shopbag.less";
import ListModule from "../components/ListModule.vue";
import Nav from "../components/Nav.vue";

export default {
  name: "Shopbag",
  data() {
    return {
      menuTitle: "购物袋",

      isCheck: false,
      count: 1,
      isAllChecked: false,

      //是否处于编辑状态
      isEdit: false,
      //所有购物袋的数据
      allShopbagData: [],
      //   截取后购物袋加载的数据
      shopbagData: [],

      //每次触底懒加载截取数据
      dataCount: 8,

      //开始截取购物袋数据位置
      startIndex: 0,

      //   订单金额
      total: 0,
      // 触发懒加载
      loading: false,
      //   判断是否完成加载
      finished: false,
    };
  },
  // 局部注册
  components: {
    ListModule,
    Nav,
  },
  created() {
    //获取购物袋的数据
    this.getShopbagData();
  },
  methods: {
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
    // 是否编辑
    isEditMeth() {
      this.isEdit = !this.isEdit;
    },
    //获取购物袋数据
    getShopbagData() {
      //获取token
      let tokenString = localStorage.getItem("tokenStr");
      //   
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

      //发起获取购物袋数据请求
      this.axios({
        method: "GET",
        url: "/findAllShopcart",
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
          } else if (res.data.code == 5000) {
            res.data.result.map((v) => {
              v.isChecked = false;
            });

            this.allShopbagData = res.data.result;

            //根据开始截取位置和截取数据数量设置购物袋显示的数据
            this.shopbagData = this.allShopbagData.slice(
              this.startIndex,
              this.startIndex + this.dataCount
            );

            this.startIndex += this.dataCount;

            //未加载
            this.loading = false;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
    // 懒加载
    loadData() {
      // 
      setTimeout(() => {
        let data = this.allShopbagData.slice(
          this.startIndex,
          this.startIndex + this.dataCount
        );

        this.startIndex += this.dataCount;
        this.shopbagData.push(...data);

        this.isAllChecked = false;

        if (data.length < this.dataCount) {
          // 没有数据
          this.finished = true;
        } else {
          // 触发时都手动关闭
          this.loading = false;
        }
      }, 1500);
    },

    // 全选
    allSelected() {
      this.shopbagData.map((v) => {
        v.isChecked = this.isAllChecked;
      });

      this.totalPrice();
    },
    // 单选
    multipleChoice() {
      this.totalPrice();

      for (let i = 0; i < this.shopbagData.length; i++) {
        if (!this.shopbagData[i].isChecked) {
          this.isAllChecked = false;
          return;
        }
      }
      this.isAllChecked = true;
    },
    // 滑动删除
    removeOne(index, sid) {
      let tokenString = localStorage.getItem("tokenStr");
      //删除购物袋数量请求
      this.axios({
        method: "POST",
        //  url: "/removeShopcart", 假删
        url: "/deleteShopcart", //真删
        data: {
          appkey: this.appkey,
          sids: JSON.stringify([sid]),
          tokenString,
        },
      })
        .then((res) => {
          this.$toast.clear();
          // 
          if (res.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (res.data.code == 7000) {
            this.$toast(res.data.msg);
            //如果删除成功, 则移除页面的商品，重新计算订单总金额
            this.shopbagData.splice(index, 1);
            this.totalPrice();
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    // 判断是否有勾选
    isSelected() {
      for (let i = 0; i < this.shopbagData.length; i++) {
        if (this.shopbagData[i].isChecked) {
          return true;
        }
      }
      return false;
    },

    // 勾选删除
    removeSelected() {
      let isHas = this.isSelected();
      if (!isHas) {
        this.$toast("请先勾选删除的商品 ");
        return;
      }

      let sids = [];
      this.shopbagData.map((v) => {
        if (v.isChecked) {
          sids.push(v.sid);
        }
      });

      let tokenString = localStorage.getItem("tokenStr");

      if (!tokenString) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }

      this.axios({
        method: "POST",
        //  url: "/removeShopcart", 假删
        url: "/deleteShopcart", //真删
        data: {
          appkey: this.appkey,
          sids: JSON.stringify(sids),
          tokenString,
        },
      })
        .then((res) => {
          this.$toast.clear();
          // 
          if (res.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (res.data.code == 7000) {
            this.$toast(res.data.msg);

            for (let i = 0; i < this.shopbagData.length; i++) {
              if (this.shopbagData[i].isChecked) {
                this.shopbagData.splice(i, 1);
                i--;
              }
            }

            this.totalPrice();
          }
          this.$toast(res.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    // 数量修改
    changeCount(item) {
      // 
      let tokenString = localStorage.getItem("tokenStr");

      this.axios({
        method: "POST",
        url: "/modifyShopcartCount",
        data: {
          appkey: this.appkey,
          tokenString,
          sid: item.sid,
          count: item.count,
        },
      })
        .then((res) => {
          this.$toast.clear();
          
          if (res.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (res.data.code == 6000) {
            // this.$toast(res.data.msg)
            if (item.isChecked) {
              this.totalPrice();
            }
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
    //计算订单总金额
    totalPrice() {
      this.total = 0;

      this.shopbagData.map((v) => {
        if (v.isChecked) {
          this.total += v.price * v.count;
        }
      });

      this.total *= 100;
    },
    // 提交订单
    commit() {
      let isHas = this.isSelected();
      if (!isHas) {
        this.$toast("请选择购买的商品");
        return;
      }
      let sids = [];
      this.shopbagData.map((v) => {
        if (v.isChecked) {
          sids.push(v.sid);
        }
      });
      this.$router.push({ name: "Payment", query: { sids: sids.join("-") } });
    },
    // 逛回首页
    goWalk() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      setTimeout(() => {
        this.$router.push({ name: "Home" });
      }, 800);
    },
  },
};
</script>
