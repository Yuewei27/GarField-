<template>
  <div class="login">
    <van-nav-bar
      left-text="返回"
      right-text="逛一逛"
      @click-right="goState('Home')"
    >
      <template #left>
        <div class="nav-left">
          <div class="logo"></div>
          <div class="logo-text">GarField加菲</div>
        </div>
      </template>
    </van-nav-bar>

    <div class="user-box">
      <div class="user-title">
        <div class="welcome">欢迎回来！</div>
        <div class="sub-title">Please login to your accounts</div>
      </div>

      <!-- 登录 -->
      <van-form>
        <van-field
          v-model="userInfo.phone"
          name="手机号"
          label="手机号"
          placeholder="手机号"
          autocomplete="off"
        />

        <van-field
          v-model="userInfo.password"
          :type="isRegisterPassword ? 'password' : 'text'"
          name="密码"
          label="密码"
          placeholder="密码"
          :right-icon="isRegisterPassword ? 'closed-eye' : 'eye-o'"
          autocomplete="off"
          @click-right-icon="toggleRegsiterPasswordType"
        />
        <div class="forgotpass">
          <span @click="goState('RetrievePassword')">忘记密码?</span>
        </div>

        <div class="commit-btn">
          <van-button round block color="rgba(0,0,0,0.9)" @click="login">
            登录
          </van-button>
        </div>
        <div class="commit-btn">
          <van-button round block type="default" @click="toggleRegisterBox">
            注册
          </van-button>
        </div>
      </van-form>
    </div>

    <!-- 注册 -->
    <van-popup
      class="register-box"
      position="bottom"
      v-model="isShow"
      closeable
    >
      <div class="register-title">注册</div>
      <van-form>
        <van-field
          v-model="userRegisterInfo.phone"
          name="手机号"
          label="手机号"
          placeholder="请输入手机号"
          autocomplete="off"
        />
        <van-field
          v-model="userRegisterInfo.password"
          :type="isRegisterPassword ? 'password' : 'text'"
          name="密码"
          label="密码"
          placeholder="字母数字_组合且字母开头(6-16位)"
          :right-icon="isRegisterPassword ? 'closed-eye' : 'eye-o'"
          autocomplete="off"
          @click-right-icon="toggleRegsiterPasswordType"
        />
        <van-field
          v-model="userRegisterInfo.nickName"
          name="昵称"
          label="昵称"
          placeholder="字母数字_汉字组合(1-10位)"
          autocomplete="off"
        />
        <div class="commit-btn register-btn">
          <van-button round block color="#e7e4e4" @click="register">
            注册
          </van-button>
        </div>
      </van-form>
    </van-popup>
  </div>
</template>

<script>
import "../assets/less/login.less";

import { validForm } from "../assets/js/validForm";

export default {
  name: "Login",
  data() {
    return {
      //   用户信息
      userInfo: {
        phone: "",
        password: "",
      },
      //   注册用户信息
      userRegisterInfo: {
        phone: "",
        password: "",
        nickName: "",
      },
      //   是否显示注册框
      isShow: false,
      // 切换注册密码显示方式
      isRegisterPassword: true,
    };
  },

  created(){
  
  },
  methods: {
    

    
    //   切换注册框
    toggleRegisterBox() {
      this.isShow = true;
    },
    // 切换注册密码显示方式
    toggleRegsiterPasswordType() {
      this.isRegisterPassword = !this.isRegisterPassword;
    },
    //注册
    register() {
      //构造表单验证信息
      let obj = {
        phone: {
          value: this.userRegisterInfo.phone,
          errorMsg: "手机号格式不正确",
          reg: /^1[3-9]\d{9}$/,
        },
        password: {
          value: this.userRegisterInfo.password,
          errorMsg: "密码由数字字母下划线组合(6-16字符)",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
        nickName: {
          value: this.userRegisterInfo.nickName,
          errorMsg: "昵称由字母数字下划线汉字组合(1-10字符)",
          reg: /^[\w\u4e00-\u9fa5]{1,10}$/,
        },
      };
      // 注册信息
      let isPass = validForm.valid(obj);

      if (isPass) {
        //
        // 复制用户注册信息
        let userInfo = Object.assign({}, this.userRegisterInfo);
        userInfo.appkey = this.appkey;
        // localStorage  储存数据
        sessionStorage.setItem("phone", userInfo.phone);
        //

        this.$toast.loading({
          message: "加载中...",
          // 禁止穿透点击
          forbidclick: true,
          // 提示时间 0： 没有时间限制
          duration: 0,
        });

        this.axios({
          method: "POST",

          url: "/register",

          data: userInfo,
        })
          .then((res) => {
            // 关闭提示
            this.$toast.clear();

            if (res.data.code == 100) {
              //注册成功关闭注册框
              this.isShow = false;
            } else {
              this.$toast(res.data.msg);
            }
          })
          .catch((err) => {
            this.$toast.clear();
          });

        this.userInfo.phone = sessionStorage.getItem("phone");
        // 清除输入框内容
        this.userRegisterInfo.phone = "";
        this.userRegisterInfo.password = "";
        this.userRegisterInfo.nickName = "";
      }
    },

    // 登录
    login() {
      //构造表单验证信息
      let obj = {
        phone: {
          value: this.userInfo.phone,
          errMsg: "手机号格式不正确",
          reg: /^1[3-9]\d{9}$/,
        },
        password: {
          value: this.userInfo.password,
          errMsg: "密码格式不正确",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
      };
      // 注册信息
      let isPass = validForm.valid(obj);

      if (isPass) {
        //
        // 复制用户注册信息
        let userInfo = Object.assign({}, this.userInfo);
        userInfo.appkey = this.appkey;
        // localStorage  储存手机号码数据
        sessionStorage.setItem("phone", userInfo.phone);
        //

        this.$toast.loading({
          message: "加载中...",
          // 禁止穿透点击
          forbidclick: true,
          // 提示时间 0： 没有时间限制
          duration: 0,
        });

        this.axios({
          method: "POST",

          url: "/login",

          data: userInfo,
        })
          .then((res) => {
            if (res.data.code == 200) {
              //登录成功
              //保存token, 以便验证登录
              localStorage.setItem("tokenStr", res.data.token);

              setTimeout(() => {
                // 关闭提示
                this.$toast.clear();
                this.$router.push({ name: "Home" });
              }, 800);
            } else {
              this.$toast(res.data.msg);
            }
          })
          .catch((err) => {
            this.$toast.clear();
          });

        // 清除输入框内容
        this.userRegisterInfo.phone = "";
        this.userRegisterInfo.password = "";
      }
    },
    // 跳转
    goState(name) {
      this.$toast.loading({
        message: "加载中...",
        // 禁止穿透点击
        forbidclick: true,
        // 提示时间 0： 没有时间限制
        duration: 0,
      });
      setTimeout(() => {
        this.$toast.clear();
        this.$router.push({ name });
      }, 1500);
    },
  },
};
</script>
