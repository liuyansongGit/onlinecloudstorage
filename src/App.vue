<template>
  <div id="app" v-show="user || (!user&& ($route.path==='/login'||$route.path.includes('/register')||$route.path.includes('/share')||$route.path.includes('/download')))" v-bind:class="{'bg':$route.path==='/login' || $route.path ==='/register'}">
      <el-container>
        <el-header v-show="headVisible" style="padding: 0"><Header ref="header" style="position: fixed;width: 100%;z-index: 200"/></el-header>
        <el-container style="height: 100%">
          <el-aside v-show="asideVisible" style="width: 15%;height: 100%;"><Aside ref="aside" :send-category="getCategory" style="width: 15%;height: 100%;position: fixed"/></el-aside>
          <el-container>
            <el-main style="width: 99%" v-bind:class="{'bg-main':$route.path==='/index' || $route.path==='/share'}"><router-view ref="route" :send-user="updateUser" :send-volume="updateVolume" :renewHead="renewHead" v-if="isRouterAlive"/></el-main>
          </el-container>
        </el-container>
      </el-container>
  </div>
</template>

<script>
import Aside from "./components/Aside";
import Header from "./components/Header";

export default {
  name: 'App',
  components: {Aside,Header},
  data(){
    return{
      isRouterAlive:true,
      asideVisible:true,
      headVisible:true,
      appVisible:true,
      user:''
    }
  },
  methods:{
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    getCategory(cid){
      this.$refs.route.cid = cid;
    },
    //更新用户信息
    updateUser(user){
      this.$refs.header.user = user;
      this.user = user;
    },
    //更新用户网盘容量信息
    updateVolume(user){
      this.$refs.aside.user = user;
      this.user = user;
    },
    renewHead(){
      this.$refs.header.getUserInfo();
    }
  },
  provide(){
    return{
      reload:this.reload
    }
  },
  watch:{
    $route(newData,oldData){
      if(newData.fullPath === '/share' || newData.fullPath === '/login' || newData.fullPath === '/register'){
        this.asideVisible = false;
        this.headVisible = false;
      }else {
        this.asideVisible = true;
        this.headVisible = true;
      }
    }
  },
  mounted() {
    if(this.$route.path === '/share' || this.$route.path === '/login' || this.$route.path === '/register'){
      this.asideVisible = false;
      this.headVisible = false;
    }
  }
}
</script>

<style>
.bg{
  margin:0;
  padding:0;
  background:url("./assets/images/bg_all.jpg") no-repeat;
  background-size: cover;
}
.bg-main{
  background: #FFFFFF;
}
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  font-size: 30px;
  float: left;
}
.el-main{
  overflow: visible;
}
#app{
  height: 100%;
}
.el-container{
  height: 100%;
}
</style>
