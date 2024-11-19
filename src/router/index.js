import Vue from 'vue'
import Router from 'vue-router'
import Index from "../components/Index";
import Share from "../components/Share";
import Login from "../components/Login";
import Register from "../components/Register";
import VideoViewer from "../components/VideoViewer";

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/',redirect:'/index'},
    {path: '/index',component:Index},
    {path:'/share',component: Share},
    {path: '/login',component: Login},
    {path: '/register',component: Register},
    {path: '/videoViewer',component: VideoViewer}
  ]
})
