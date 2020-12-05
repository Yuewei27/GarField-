<template>
  <div class="order">
     <van-popup v-model="show" round position="center" closeable :style="{ height: '30%' ,width:'70%'}" >
       <div class="orderPupup" v-for="(item,index) in puppopData" :key="index">
        <div class="OrderText">{{item.oid}}</div>
        <div class="OrderDress">
            <div class="orderName">姓名：<span>{{item.name}}</span></div>
            <div class="orderTel">电话：<span>{{item.tel}}</span></div>
            <div class="orderDress">地址：<span>{{item.address}}</span></div>
        </div>
       </div>
    </van-popup>
    <div>
      <Nav @gopack="goPack" :title="menuTitle" />
    </div>
  
    <AddRessList >
      <div v-if="isProHas" >
        <van-tabs
          v-model="tabIndex"
          color="#c38a60"
          title-active-color="#c38a60"
          line-height="2"
          @change="titleTab"
        >
          <van-tab
            :title="item.title"
            v-for="(item, index) in tabData"
            :key="index"
            
          >
            <div v-if="orderData.length > 0" >
              <div
                class="order-box"
                v-for="(curr, ind) in orderData"
                :key="curr.oid"
                
              >
                <OrderInfo
                  :info-text-title="curr.oid"
                  :date-time="curr.date | formatDate('yyyy-MM-dd hh:mm:ss')"
                  :pro-count="curr.count"
                  :total="curr.total"
                  :is-show-right="true"
                  :is-livery="curr.status == 2"
                  @confirm-livery="confirmLivery(curr, ind)"
                  @remove="remove(curr, ind)"
                  
                   
                >
                 <div @click="isPoppup(curr)">
                    <ListModule
                    v-for="(value, idx) in curr.data"
                    :item="value"
                    :key="idx"
                    
                  />
                 </div>
                </OrderInfo>
              </div>
            </div>
            <div v-else>
              <van-empty description="没有订单数据,马上去加入购物车吧!!!" />
            </div>
          </van-tab>
        </van-tabs>
      </div>
      <div v-else>
        <van-empty description="没有订单数据,马上去加入购物车吧!!!" />
      </div>
    </AddRessList>
  </div>
</template>

<script>
import "../assets/less/order.less";
import AddRessList from "../components/AddRessList.vue";
import OrderInfo from "../components/OrderInfo.vue";
import ListModule from "../components/ListModule.vue";
import Nav from "../components/Nav.vue";

export default {
  name: "Order",
  data() {
    return {
      
      menuTitle: "我的订单",
      // 下标
      tabIndex: 0,
      // 头部列表
      tabData: [{ title: "全部" }, { title: "进行中" }, { title: "已完成" }],
      // 订单时间
      // test: "2020-02-12T06:09:25.000Z",
      // 订单数据
      orderData: [],
      // 订单数据有无
      isProHas: true,
      // 是否弹窗
      show:false,
      // 弹窗数据
      puppopData:[]
    };
  },
  components: {
    AddRessList,
    OrderInfo,
    ListModule,
    Nav
  },
  created() {
    this.getProStatusData();
  },

  methods: {
    goPack() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 1500,
      });

      setTimeout(() => {
        this.$router.push({name:'Shopbag'});
      }, 1500);
    },

    // 是否弹窗
    isPoppup(curr){
      this.show = true;
      let obj = {
        oid:curr.oid,
        name:curr.data[0].receiver,
        address:curr.data[0].address,
        tel:curr.data[0].phone,
      }
      // console.log(obj)
      let arr = []
      arr.push(obj)
      this.puppopData = arr
    },
    // 头部列表切换
    //切换订单状态 0: 全部, 1: 进行中, 2: 已完成
    titleTab(name, title) {
      // 
      this.getProStatusData();
    },
    // 获取订单状态及订单数据
    getProStatusData() {
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
        url: "/findOrder",
        params: {
          appkey: this.appkey,
          tokenString,
          status: this.tabIndex,
        },
      })
        .then((res) => {
          this.$toast.clear();
          // 
          if (res.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (res.data.code == 70000) {
            if (this.tabIndex == 0 && res.data.result.length == 0) {
              this.isProHas = false;
              return;
            }

            //按照订单编号oid进行分类

            let orderDatas = [];
            res.data.result.map((v) => {
              //查找orderDatas的订单数据，如果找到，则将该商品存放在当前订单里面，累加当前订单的商品数量和当前订单的总金额

              for (let i = 0; i < orderDatas.length; i++) {
                if (orderDatas[i].oid == v.oid) {
                  orderDatas[i].data.push(v);
                  orderDatas[i].count += v.count;
                  orderDatas[i].total += v.count * v.price;
                  return;
                }
              }

              // 如果找不到当前订单数据，则初始化当前订单数据
              let obj = {};
              obj.oid = v.oid; //订单号
              obj.count = v.count; //数量
              obj.total = v.count * v.price; //金额
              obj.status = v.status; //状态码
              obj.date = v.createdAt; //时间
              obj.data = [v]; //订单数据
              orderDatas.push(obj);

              // 
            });
            // 根据oid 进行排序展示
            orderDatas= orderDatas.sort((a,b) => (a.oid < b.oid) ? 1 : ((b.oid < a.oid) ? -1 : 0)); 
         

            this.orderData = orderDatas;
            // console.log(this.orderData)
          }
        })
        .catch((err) => {
          
        });
    },
    // 确认收货
    confirmLivery(curr, ind) {
      // 
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
        method: "POST",
        url: "/receive",
        data: {
          appkey: this.appkey,
          tokenString,
          oid: curr.oid,
        },
      })
        .then((res) => {
          this.$toast.clear();
          // 
          if (res.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (res.data.code == 80000) {
            if (this.tabIndex == 1) {
              this.orderData.splice(ind, 1);
            }
            curr.status = 2; //状态码改变
          }
          this.$toast(res.data.msg);
        })
        .catch((err) => {
          
        });
    },
    remove(curr, ind) {
      // 
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
        method: "POST",
        url: "/removeOrder",
        data: {
          appkey: this.appkey,
          tokenString,
          oid: curr.oid,
        },
      })
        .then((res) => {
          this.$toast.clear();
          // 
          if (res.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if ((res.data.code = 90000)) {
            this.orderData.splice(ind, 1);
          }
          this.$toast(res.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
   
  },
 
};
</script>

<style lang="less" scoped>
</style>