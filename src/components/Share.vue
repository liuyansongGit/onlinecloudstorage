<template>
  <div>
    <div v-if="code.file!==undefined">
      <div style="width: fit-content;margin: 0 auto">This file was shared by {{code.file.user.uname}} at {{code.shareTime}}:</div>
      <el-row style="width: fit-content;margin: 2% auto">
        <el-button type="primary" size="mini" :disabled="!code" @click="downloadBycode">Download</el-button>
        <el-button size="mini" @click="$router.replace('/')">Back to Cloud Disk Homepage</el-button>
      </el-row>
    </div>
    <div v-else style="width: fit-content;margin: 0 auto">
      <h2 style="width: fit-content;margin: 0">The share has been canceled or the file has been deleted</h2>
      <el-button size="mini" @click="$router.replace('/')">Back to Cloud Disk Homepage</el-button>
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
          this.$message.info("Download will start once the compressed package is complete");
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
  