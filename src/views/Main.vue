<template>
  <div class="main">
    <div>
      <router-view></router-view>
    </div>
    <van-tabbar v-model="activeName" inactive-color="#333" active-color="#a68679"  route>
      <van-tabbar-item :icon="item.icon" v-for="(item,index) in tabarData" 
      :key="index" :name="item.name" replace :to="item.path" >
     <span> {{item.title}}</span>

     <!-- 插槽作用域的插槽 -->
        <template #icon="props">
          <img :src="props.active ? item.activeImg : item.inactiveImg" />
        </template>

      </van-tabbar-item>
     
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "Main",
  data(){
      return {
          activeName:'Home',

          tabarData:[
              {
                  title:'首页',
                  icon:'home-o',
                  name:'Home',
                  path:'/main/home',
                  inactiveImg: require('../assets/image/shouye.png'),
                  activeImg: require('../assets/image/shouye1.png')
              },
               {
                  title:'菜单',
                  icon:'search',
                  name:'Menu',
                  path:'/main/menu',
                  inactiveImg: require('../assets/image/menu.png'),
                  activeImg: require('../assets/image/menu_active.png')
              },
               {
                  title:'购物袋',
                  icon:'friends-o',
                  name:'Shopbag',
                  path:'/main/shopbag',
                  inactiveImg: require('../assets/image/shopbag.png'),
                  activeImg: require('../assets/image/shopbag_active.png')
              },
               {
                  title:'我的',
                  icon:'setting-o',
                  name:'Myself',
                  path:'/main/myself',
                  inactiveImg: require('../assets/image/wode1.png'),
                  activeImg: require('../assets/image/wode-1.png')
              }
          ]
      };
  }
};
</script>

<style lang="less" scoped>

/deep/ .van-tabbar{
  background-color: #a68679;
}
</style>