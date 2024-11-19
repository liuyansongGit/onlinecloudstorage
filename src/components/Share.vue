<template>
<div>
  <div v-if="code.file!==undefined">
    <div style="width: fit-content;margin: 0 auto">此文件由 {{code.file.user.uname}} 于{{code.shareTime}}分享:</div>
    <el-row style="width: fit-content;margin: 2% auto">
      <el-button type="primary" size="mini" :disabled="!code" @click="downloadBycode">下载</el-button>
      <el-button size="mini" @click="$router.replace('/')">返回网盘首页</el-button>
    </el-row>
  </div>
  <div v-else style="width: fit-content;margin: 0 auto">
    <h2 style="width: fit-content;margin: 0">分享已被取消或文件被删除</h2>
    <el-button size="mini" @click="$router.replace('/')">返回网盘首页</el-button>
  </div>
</div>
</template>

<script>
export default {
  name: "Share",
  data(){
    return{
      code:{
        // shareTime:'2022-08-10 14:22:30',
        // activeCode:'',
        // file:{
        //   fid:1,
        //   fName:'1.jpg',
        //   user:{
        //     uname:'hapehape'
        //   }
        // }
      }
    }
  },
  methods:{
    getCode(){
      this.axios.get(this.baseUrl+"file/getCode",{
        params:{
          code:this.$route.query.code
        }
      }).then(res=>{
        res.data.shareTime = res.data.shareTime.substring(0,res.data.shareTime.lastIndexOf("."));
        this.code = res.data;
      })
    },
    downloadBycode(){
      location.href = this.baseUrl+"download/code/"+this.$route.query.code;
      if(this.code.file.isDir===1){
        this.$message.info("下载将在压缩包构建完毕后开始");
      }
    }
  },
  mounted() {
    this.getCode();
  }
}
</script>

<style scoped>

</style>
