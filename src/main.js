import Vue from 'vue'
import App from './App.vue'
import router from './router'


import axios from 'axios'
import VueAxios from 'vue-axios'

import 'lib-flexible/flexible'


import { VueJsonp } from 'vue-jsonp'
Vue.use(VueJsonp)

import {
  Button,
  NavBar,
  Form,
  Field,
  Popup,
  Toast,
  Tabbar,
  TabbarItem,
  Search,
  Swipe,
  SwipeItem,
  Stepper,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  Empty,
  SwipeCell,
  Checkbox,
  SubmitBar,
  List,
  AddressList,
  AddressEdit,
  Area,
  ShareSheet,
  DropdownMenu,
  DropdownItem,
  Cell,
  Switch,
  Icon,
  Dialog,
  Tab,
  Tabs,
  Uploader
} from 'vant';


Vue
  .use(Button)
  .use(NavBar)
  .use(Form)
  .use(Field)
  .use(Popup)
  .use(Toast)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Search)
  .use(Swipe)
  .use(SwipeItem)
  .use(Stepper)
  .use(GoodsAction)
  .use(GoodsActionButton)
  .use(GoodsActionIcon)
  .use(Empty)
  .use(SwipeCell)
  .use(Checkbox)
  .use(SubmitBar)
  .use(List)
  .use(AddressList)
  .use(AddressEdit)
  .use(Area)
  .use(ShareSheet)
  .use(DropdownMenu)
  .use(DropdownItem)
  .use(Cell)
  .use(Switch)
  .use(Icon)
  .use(Dialog)
  .use(Tab)
  .use(Tabs)
  .use(Uploader)
  ;


// 设原型属性
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=';

// 设置请求基础路径
axios.defaults.baseURL = 'http://api.kele8.cn/agent/http://www.kangliuyong.com:10002';
// 拦截器
axios.interceptors.request.use(config => {
  if (config.method == "post") {
    // 序列化参数
    let paramsString = '';

    for (let key in config.data) {
      paramsString += `${key}=${config.data[key]}&`
    }
    config.data = paramsString.slice(0, -1);

  }

  return config;

})

// 注册axios
Vue.use(VueAxios, axios)

Vue.config.productionTip = false


// 过滤器
Vue.filter('filtration', (v, n = 2) => {
  return v.toFixed(n)
})

Vue.filter('formatDate', (v, format) => {
  // 创建日期对象
  let date = new Date(v);
  let year = date.getFullYear().toString();

  if (/(y+)/.test(format)) {
    let content = RegExp.$1;//匹配内容
    format = format.replace(content, year.slice(year.length - content.length));

  }
  //格式化月份、日份、时、分、秒
  let obj = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  };

  for (let key in obj) {
    let reg = new RegExp(`(${key}+)`) //动态正则表达

    if (reg.test(format)) {
      let groupContent = RegExp.$1;
      format = format.replace(groupContent, obj[key] >= 10 ? obj[key] : groupContent.length == 2 ? '0' + obj[key] : obj[key])
    }
  }
  return format
})




new Vue({
  router,
  render: h => h(App)
}).$mount('#app')