<template>
  <div class="address">
    <van-nav-bar
      title="地址列表"
      left-text="返回"
      left-arrow
      fixed
      @click-left="goPack"
    />
    <AddRessList>
      <div v-if="list.length > 0">
        <van-address-list
          :list="list"
          default-tag-text="默认"
          :switchable="false"
          @add="add"
          @edit="edit"
        />
      </div>
      <div class="address-empty" v-else>
        <van-empty description="没有地址数据" />
      </div>
    </AddRessList>
  </div>
</template>

<script>
import AddRessList from "../components/AddRessList.vue";

export default {
  name: "Address",
  data() {
    return {
      list: [],
    };
  },
  created() {
    this.getAddressData();
      
  },
  components: {
    AddRessList,
  },
  methods: {
   
    goPack() {
      this.$router.go(-1);
    },
    //获取地址列表数据
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
          
          if (res.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (res.data.code == 20000) {
            res.data.result.map((v) => {
              // 
              v.isDefault = Boolean(v.isDefault); //转布尔值
              v.id = v.aid;
              v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`;
            });

            this.list = res.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
    //新增地址
    add() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      setTimeout(() => {
        this.$toast.clear();
        this.$router.push({ name: "NewAddress" });
      }, 800);
    }, //编辑地址

    edit(item) {
      //item.aid: 地址aid
      // 
      setTimeout(() => {
        this.$router.push({ name: "NewAddress", query: { aid: item.aid } }); // 
      }, 800);
    },
  },
};
</script>

<style lang="less" scoped>
.address {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #e8e0d7;

  /deep/ .van-nav-bar {
    width: 100%;
    height: 50px;
    background-color: #a68679;
  }

  /deep/ .van-hairline--bottom::after {
    border: none;
  }

  /deep/ .van-nav-bar .van-icon,
  /deep/ .van-nav-bar__text {
    color: black;
    font-size: 16px;
  }

  /deep/ .van-nav-bar__title {
    font-size: 18px;
    font-weight: bold;
  }
  /deep/ .addRessList[data-v-45208fd2] {
    padding-top: 50px;
  }
  /deep/ .contain {
    transform: translateY(-20px);
    padding: 0 10px;
  }
  /deep/ .van-address-list {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    // position: relative;
    // top: 0px;
    background-color: #f5f5f5;

    /deep/ .van-radio-group{
      
      max-height: 438px;
      overflow: hidden;
    }
    /deep/ .van-address-item {
      border-bottom: 1px solid #ccc;
      margin-bottom: 0;
    }

    /deep/ .van-address-item:last-child {
      border-bottom: none;
    }
  }

  /deep/ .van-tag--danger {
    background-color: #e7b993;
  }

  /deep/ .van-button--danger {
    background-color: #333;
    border-color: #333;
  }
  /deep/ .van-address-list__bottom {
    background-color: #e8e0d7;
  }

  .address-empty {
    transform: translateY(-10px);

    background-color: #fff;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
  /deep/ .van-empty {
  }
}
</style>