// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 加载 element 组件库
import ElementUI, {Message} from 'element-ui'
// 加载 element 组件库的样式
import 'element-ui/lib/theme-chalk/index.css'
// 全局注册 element 组件库
Vue.use(ElementUI,{zIndex:200})
import echarts from 'echarts'
// 引入echart主题
// import  '@/assets/js/echarts-theme-macarons.js'
import 'echarts/theme/macarons.js'
//axios
import axios from "axios";
Vue.prototype.axios = axios;
axios.defaults.withCredentials = true     // 添加代码：允许跨域携带cookie
Vue.prototype.$echarts = echarts
//发post请求用到的qs
import qs from "qs";
Vue.prototype.$qs = qs;

//复制粘贴功能
import VueClipboard from "vue-clipboard2";
Vue.use(VueClipboard);

//font-awesome
import 'font-awesome/css/font-awesome.min.css'

//后端服务器地址
var baseUrl = "http://localhost:8090/onlinecloudstorage/";
Vue.prototype.baseUrl = baseUrl;

//阿里巴巴矢量图标js
import './assets/js/iconfont';

//预览图片插件
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.use(Viewer)
Viewer.setDefaults({
  // 需要配置的属性 注意属性并没有引号
  title: true,
  toolbar: true
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
