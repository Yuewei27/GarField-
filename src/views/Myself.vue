<template>
  <div class="myself">
    <div
      class="my-bg"
      :style="{ backgroundImage: `url('${userInfo.userBg}')` }"
    >
      <van-uploader class="upload-box" :after-read="uploadFile" />
    </div>
    <div class="my-info">
      <div class="clearfix">
        <div class="fl my-img">
          <img :src="userInfo.userImg" alt="" class="auto-img" />
        </div>
        <div class="fl my-info-box">
          <div class="user-name">{{ userInfo.nickName }}</div>
          <div class="user-desc">
            {{
              userInfo.desc == ""
                ? "这家伙很懒，什么都么有留下..."
                : userInfo.desc
            }}
          </div>
        </div>
      </div>

      <div class="list-box">
        <van-cell
          v-for="(item, index) in listData"
          :key="index"
          :title="item.title"
          is-link
          @click="goPage(item.name)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/myself.less";
export default {
  name: "Myself",
  data() {
    return {
      listData: [
        {
          title: "个人资料",
          name: "Account",
        },
        {
          title: "我的订单",
          name: "Order",
        },
        {
          title: "我的收藏",
          name: "Collect",
        },
        {
          title: "地址管理",
          name: "Address",
        },
        {
          title: "安全中心",
          name: "Secure",
        },
      ],
      // 用户信息
      userInfo: {},
    };
  },
  created() {
    this.getUserInfo();
    
  },
  methods: {
 

    getUserInfo() {
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
        url: "/findMy",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((res) => {
          this.$toast.clear();
          

          if (res.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (res.data.code == "A001") {
            this.userInfo = res.data.result[0];
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
    // 上传背景图
    uploadFile(file) {
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
        url: "/updateUserBg",
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
          } else if (res.data.code == "I001") {
            this.userInfo.userBg = res.data.userBg;
          }
          this.$toast(res.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
    goPage(name) {
      // 
      this.$router.push({ name });
    },
  },
};
</script>



