<template>
  <div class="collect">
    <van-nav-bar
      title="我的收藏"
      left-text="返回"
      left-arrow
      fixed
      @click-left="back"
    />
    <AddRessList>
      <div class="clearfix collect-box" v-if="collectProduct.length > 0">
        <div class="fl like-item" v-for="(item, index) in collectProduct" :key="index" @click="goDetail(item.pid)">
          <div>
            <img
              class="auto-img"
              :src="item.smallImg"
              alt=""
            />
          </div>
          <div class="pro-name one-text">{{item.name}}</div>
          <div class="pro-enname one-text">{{item.enname}}</div>
          <div class="clearfix">
            <div class="fl pro-price">￥{{item.price}}</div>
            <div class="fr delete" @click.stop="removeCollectProduct(item.pid, index)">
              <van-icon name="delete" />
            </div>
          </div>
        </div>
      </div>
      <div class="collect-empty" v-else>
        <van-empty description="没有收藏商品" />
      </div>
    </AddRessList>
  </div>
</template>

<script>
import "../assets/less/collect.less";
import AddRessList from "../components/AddRessList.vue";
export default {
  name: "Collect",
  components: {
    AddRessList,
  },

  data() {
    return {
      collectProduct: []
    }
  },

  created() {
    //获取收藏商品
    this.getLikeProduct();
  },
  methods: {
    back() {
      this.$router.go(-1);
    },

    //获取收藏商品
    getLikeProduct() {
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
        url: "/findAllLike",
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
          } else if (res.data.code == 2000) {
            this.collectProduct = res.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //查看商品详情
    goDetail(pid) {
      this.$router.push({name: 'Detail', params: {pid}});
    },

    //删除收藏商品
    removeCollectProduct(pid, index) {
      //获取token
        let tokenString = localStorage.getItem('tokenStr');
        // 
        if (!tokenString) {
          //跳回登录页面
          this.$toast('请先登录');
          return this.$router.push({name: 'Login'});
        }

        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0
        });

        //发起收藏商品请求
        this.axios({
          method: 'POST',
          url: '/notlike',
          data: {
            appkey: this.appkey,
            pid,
            tokenString
          }
        }).then(res => {
          this.$toast.clear();
          
          if (res.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({name: 'Login'});
          } else if (res.data.code == 900) {
             this.$toast('删除成功');
             this.collectProduct.splice(index, 1);
          } else {
            this.$toast('删除失败');
          }

         
        }).catch(err => {
          this.$toast.clear();
          
        })
    }
  },
};
</script>