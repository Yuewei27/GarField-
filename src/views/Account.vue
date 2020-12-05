<template>
  <div class="account">
      <div>
      <Nav @gopack="goPack" :title="menuTitle" />
    </div>
  
    <AddRessList>
      <div class="accout-box">
        <van-cell title="头像" :center="true">
          <div>
            <div class="user-img fr">
              <img class="auto-img" :src="accountInfo.userImg" alt="" />
              <van-uploader class="upload-box" :after-read="uploadUserImg" />
            </div>
          </div>
        </van-cell>
        <van-cell title="用户id" :center="true">{{
          accountInfo.userId
        }}</van-cell>
        <van-cell title="手机号" :center="true">{{
          accountInfo.phone
        }}</van-cell>
        <van-cell title="昵称" :center="true">
          <van-field
            v-model="accountInfo.nickName"
            class="field-box"
            placeholder="输入昵称"
            maxlength="12"
            @change="uploadNickName"
          />
        </van-cell>
        <div class="desc-box">
          <div class="desc-content">
            <van-field
              v-model="accountInfo.desc"
              rows="2"
              autosize
              label="简介"
              type="textarea"
              maxlength="30"
              placeholder="输入简介"
              show-word-limit
              input-align="right"
              @change="uploadDesc"
            />
          </div>
        </div>
      </div>
    </AddRessList>
  </div>
</template>

<script>
import "../assets/less/accountInfo.less";
import AddRessList from "../components/AddRessList.vue";
import Nav from "../components/Nav.vue";

export default {
  name: "Account",
  data() {
    return {
      menuTitle: "个人资料",
      accountInfo: {
        nickName: "",
        desc: "",
        phone: "",
        userId: "",
      },
    };
  },
  created() {
    this.getAccountInfo();
  },
  components: {
    AddRessList,
    Nav
  },
  methods: {
    goPack() {
      this.$router.go(-1);
    },
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
            if (data.desc == "") {
              data.desc = "这家伙很懒，什么都没有留下...";
            }
            this.accountInfo = data;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    // 上传头像
    uploadUserImg(file) {
      let type = ["png", "gif", "jpg", "jpeg"];
      // 文件大小限制
      let size = 1;
      // 文件类型
      
      let fileType = file.file.type.split("/")[1];
      if (type.indexOf(fileType) == -1) {
        this.$toast(`文件类型不支持${type.join(",")}`);
        return;
      }

      // 文件大小 1MB = 1024kB = 1024 * 1024B
      let filesize = file.file.size / 1024 / 1024;
      if (filesize > size) {
        this.$toast(`文件允许最大不能超过${size}MB`);
        return;
      }

      // 处理base64位
      let base64 = file.content.replace(/^data:image\/[A-Za-z]+;base64,/, "");

      //发起请求
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
        url: "/updateAvatar",
        data: {
          appkey: this.appkey,
          tokenString,
          imgType: fileType,
          serverBase64Img: base64,
        },
      })
        .then((res) => {
          this.$toast.clear();
          if (res.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (res.data.code == "H001") {
            this.accountInfo.userImg = res.data.userImg;
          }
          this.$toast(res.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    // 修改昵称
    uploadNickName() {
      if (!this.accountInfo.nickName) {
        this.$toast("昵称不能为空");
        return;
       
      }

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
        url: "/updateNickName",
        data: {
          appkey: this.appkey,
          tokenString,
          nickName: this.accountInfo.nickName,
        },
      })
        .then((res) => {
          this.$toast.clear();
          

          if (res.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else {
            this.$toast(res.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
    // 修改简介
    uploadDesc() {
      if (!this.accountInfo.desc) {
        this.$toast("昵称不能为空");
        return;
      }

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
        url: "/updateDesc",
        data: {
          appkey: this.appkey,
          tokenString,
          desc: this.accountInfo.desc,
        },
      })
        .then((res) => {
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else {
            this.$toast(res.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.clear();  
        });
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .van-nav-bar {
  width: 100%;
  height: 50px;

  background-color: #a68679;
}
/deep/ .van-nav-bar .van-icon,
/deep/ .van-nav-bar__text {
  color: #333;
  font-size: 16px;
}
/deep/ .van-nav-bar__title {
  font-size: 18px;
  font-weight: bold;
}
/deep/ .van-cell {
  color: #333;
}
</style>