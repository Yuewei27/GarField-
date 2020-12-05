<template>
  <div class="secure">
    <van-nav-bar
      title="安全中心"
      left-text="返回"
      left-arrow
      fixed
      @click-left="goPack"
    />
    <AddRessList>
      <div class="secure-box">
        <div class="cell-box">
          <van-cell
            title="修改密码"
            is-link
            :center="true"
            @click="modifyPasswordBox"
          />
          <van-cell
            title="注销账号"
            is-link
            :center="true"
            @click="destroyAccount"
          />
        </div>
      </div>
    </AddRessList>
    <div class="logout-box">
      <div class="logout-con">
        <van-button color="#333" block round @click="logout"
          >退出登录</van-button
        >
      </div>
    </div>

    <van-popup is-link position="bottom" closeable v-model="isModify">
      <div class="form-box">
        <div class="form-title">修改密码</div>
        <van-form>
          <van-field
            v-model="password.oldPassword"
            :type="isModifyPass ? 'password' : 'text'"
            name="旧密码"
            label="旧密码"
            placeholder="旧密码(首字符必须为字母)"
            :right-icon="isModifyPass ? 'closed-eye' : 'eye-o'"
            autocomplete="off"
            @click-right-icon="toggleType"
          />

          <van-field
            v-model="password.newPassword"
            :type="isModifyPass ? 'password' : 'text'"
            name="新密码"
            label="新密码"
            placeholder="新密码(首字符必须为字母)"
            :right-icon="isModifyPass ? 'closed-eye' : 'eye-o'"
            autocomplete="off"
            @click-right-icon="toggleType"
          />

          <div class="commit-btn">
            <van-button round block color="#333" @click="commit"
              >提交</van-button
            >
          </div>
        </van-form>
      </div>
    </van-popup>
  </div>
</template>

<script>
import "../assets/less/secure.less";
import AddRessList from "../components/AddRessList.vue";
// 表单验证
import { validForm } from "../assets/js/validForm";

export default {
  name: "Secure",
  data() {
    return {
      isModify: false,
      isModifyPass: true,
      password: {
        oldPassword: "",
        newPassword: "",
      },
    };
  },
  components: {
    AddRessList,
  },
  methods: {
    goPack() {
      this.$router.go(-1);
    },
    toggleType() {
      this.isModifyPass = !this.isModifyPass;
    },
    modifyPasswordBox() {
      this.isModify = true;
    },
    //退出登录
    logout() {
      this.$dialog
        .confirm({
          title: "退出登录",
          message: "是否确定退出登录！",
          confirmButtonColor: "#0C34BA",
        })
        .then(() => {
          //执行退出登录
          //清除登录状态
          this.$toast.loading({
            message: "加载中...",
            forbidClick: true,
            duration: 0,
          });

          setTimeout(() => {
            this.$toast.clear();
            localStorage.removeItem("tokenStr");
            this.$router.push({ name: "Login" });
          }, 800);
        })
        .catch((err) => {
          
        });
    },
    // 注销账号
    destroyAccount() {
      this.$dialog
        .confirm({
          title: "注销账号",
          message: "是否确定注销账号，一旦注销无法恢复！",
          confirmButtonColor: "#0C34BA",
        })
        .then(() => {
          //执行账号注销
          

          //发起修改密码请求
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
            url: "/destroyAccount",
            data: {
              appkey: this.appkey,
              tokenString,
            },
          })
            .then((res) => {
              this.$toast.clear();
              
              if (res.data.code == 700) {
                //token检验无效,则跳到登录页面
                this.$router.push({ name: "Login" });
              } else if (res.data.code == "G001") {
                setTimeout(() => {
                  //清除登录状态
                  localStorage.removeItem("tokenStr");
                  this.$router.push({ name: "Login" });
                }, 800);
              }

              this.$toast(res.data.msg);
            })
            .catch((err) => {
              this.$toast.clear();
              
            });
        })
        .catch((err) => {
          
        });
    },
    //提交修改密码
    commit() {
      //构造表单验证信息
      let obj = {
        oldPassword: {
          value: this.password.oldPassword,
          errorMsg: "旧密码由数字字母下划线组合(6-16字符)",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
        newPassword: {
          value: this.password.newPassword,
          errorMsg: "新密码由数字字母下划线组合(6-16字符)",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
      };

      let isPass = validForm.valid(obj);

      //如果表单验证通过
      if (isPass) {
        if (this.password.newPassword == this.password.oldPassword) {
          this.$toast("新密码和旧密码不能相同");
          return;
        }

        //发起修改密码请求
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
          url: "/updatePassword",
          data: {
            appkey: this.appkey,
            tokenString,
            password: this.password.newPassword,
            oldPassword: this.password.oldPassword,
          },
        })
          .then((res) => {
            this.$toast.clear();
            
            if (res.data.code == 700) {
              //token检验无效,则跳到登录页面
              this.$router.push({ name: "Login" });
            } else if (res.data.code == "E001") {
              setTimeout(() => {
                //清除登录状态
                localStorage.removeItem("__tk");
                this.$router.push({ name: "Login" });
              }, 800);
            }

            this.$toast(res.data.msg);
          })
          .catch((err) => {
            this.$toast.clear();
            
          });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.secure {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  /deep/ .van-nav-bar {
    width: 100%;
    height: 50px;
    background-color: #a68679;
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
}
</style>