<template>
  <div class="newAddress">
    <van-nav-bar
      :title="aid ? '编辑地址' : '新增地址'"
      left-text="返回"
      left-arrow
      fixed
      @click-left="goPack"
    />
    <van-address-edit
      show-postal
      show-set-default
      :address-info="addressInfo"
      :area-list="areaList"
      :show-delete="!!aid"
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      save-button-text="保存地址"
      @save="saveRess"
      @delete="removeAddress"
    />
  </div>
</template>

<script>
import areaList from "../assets/js/area";
export default {
  name: "NewAddress",
  data() {
    return {
      //   用户名
      addressInfo: {},
      areaList,

      //地址aid
      aid: "",
    };
  },
  
  created() {
    //aid: 如果存在，则表示编辑地址, 否则新增地址
    this.aid = this.$route.query.aid;
    //

    // 查询地址数据
    this.getAddRessData();

   
   
  },
  methods: {
   
   
    // 返回上一级
    goPack() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      setTimeout(() => {
        this.$router.go(-1);
      }, 800);
    },
    saveRess(content) {
      let tokenString = localStorage.getItem("tokenStr");
      if (!tokenString) {
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
      //   回调参值
      //

      let addressInfo = Object.assign({}, content);

      delete addressInfo.country;

      addressInfo.tokenString = tokenString;
      addressInfo.appkey = this.appkey;

      addressInfo.isDefault = Number(addressInfo.isDefault); //转数值
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      if (!this.aid) {
        console.log(this.aid)
        
        this.address(addressInfo, "/addAddress");
      } else {
        // 判断是否有更改地址
        let isModify = false;

        for (let key in this.addressInfo) {
          if (content[key] != this.addressInfo[key]) {
            isModify = true;
          }
        }
        if (isModify) {
          this.address(addressInfo, "/editAddress");
        } else {
          this.$toast("地址未有修改，无须再次保存");
          return;
        }
      }
    },

    // 新增地址和编辑地址
    address(addressInfo, url) {
      this.axios({
        method: "POST",
        url,
        data: addressInfo,
      })
        .then((res) => {
          this.$toast.clear();

          if (res.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (res.data.code == 9000 || res.data.code == 30000) {
            setTimeout(() => {
              this.$router.push({ name: "Address" });
            }, 800);
          }

          this.$toast(res.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    // 根据地址aid查询地址接口
    getAddRessData() {
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
        url: "/findAddressByAid",
        params: {
          appkey: this.appkey,
          tokenString,
          aid: this.aid,
        },
      })
        .then((res) => {
          this.$toast.clear();

          if (res.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (res.data.code == 40000) {
            let data = res.data.result[0];
            data.isDefault = Boolean(data.isDefault);
            this.addressInfo = data;
          }

          //   this.$toast(res.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    //删除地址
    removeAddress() {
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
        url: "/deleteAddress",
        data: {
          appkey: this.appkey,
          tokenString,
          aid: this.aid,
        },
      })
        .then((res) => {
          this.$toast.clear();
          //
          if (res.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (res.data.code == 10000) {
            setTimeout(() => {
              this.$router.push({ name: "Address" });
            }, 800);
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
.newAddress {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding-top: 50px;
  background-color: #e8e0d7;
  /deep/ .van-nav-bar {
    width: 100%;
    height: 50px;
    background-color: #a68679;
  }
  /deep/ .van-hairline--bottom::after {
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
  /deep/ .van-button--danger {
    color: #fff;
    background-color: #19120e;
    border: 0.02667rem solid #19120e;
  }
  /deep/ .van-switch--on {
    background-color: #a68679;
  }
}
</style>