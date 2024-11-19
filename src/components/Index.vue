<template>
<div>
  <el-row>
    <el-button type="primary" @click="$refs.upload.parentId = parentId;$refs.upload.visible = true"><i class="fa fa-upload" aria-hidden="true"></i>上传文件</el-button>
    <el-button type="primary" @click="openNewDir"><i class="fa fa-folder" aria-hidden="true"></i>新建文件夹</el-button>
    <el-button type="primary" @click="packDownload">打包下载</el-button>
    <el-button type="danger" @click="delMulti"><i class="fa fa-trash" aria-hidden="true"></i>批量删除</el-button>
    <div style="float: right;width: 30%">
      <el-input v-model="search" placeholder="你想搜..." style="width: 60%"/>
      <el-button type="primary" @click="searchFile"><i class="fa fa-search" aria-hidden="true"></i>搜索</el-button>
    </div>
  </el-row>
  <el-row style="margin-top: 10px">
    <el-button type="primary" size="mini" @click="goLastPath">返回上一级</el-button>
    <span>当前位置：</span>
    <el-link v-for="(p,index) in path" :key="index" @click="goPath(index)" type="primary">{{p.dirName}}</el-link>
  </el-row>
  <ShowFile ref="showFile" :get-dir="getDir" :renew-show-file="reloadShowFile" :renew-volume="getUserVolume"/>
  <MyUpload ref="upload" :renew-show-file="reloadShowFile" :renew-volume="getUserVolume"/>
  <NewDir ref="newDir" :renew-show-file="reloadShowFile"/>

</div>
</template>

<script>
import MyUpload from "./MyUpload";
import ShowFile from "./ShowFile";
import NewDir from "./NewDir";
export default {
  name: "Index",
  components:{NewDir, MyUpload,ShowFile},
  props:['sendUser','sendVolume'],
  data(){
    return{
      file:[],
      path:[
        {dirName:'root/',fid:0},
      ],
      parentId:0,//当前的父目录id
      cid:0,//种类id
      search:'',//搜索内容
    }
  },
  methods:{
    async getUser(){
      const res = await this.axios.get(this.baseUrl+"user/getUser")
          this.sendUser(res.data);
          if(!res.data){
            await this.$router.replace("/login");
          }
    },
    getUserVolume(){
      this.axios.get(this.baseUrl+"user/getVolume")
        .then(res=>{
          this.sendVolume(res.data);
        })
    },
    //刷新文件信息
    reloadShowFile(){
      // this.$refs.showFile.$refs.explorer.reload();
      this.$refs.showFile.$refs.explorer.files = [];
      this.$refs.showFile.$refs.explorer.getFileStructure();
      this.searchFile();
    },
    //返回上一级
    goLastPath(){
      if(this.path.length<=1)
        return ;
      this.path.pop();
      this.parentId = this.path[this.path.length-1].fid;
      this.searchFile();
    },
    //点击路径
    goPath(index){
      if(this.path.length<=1 || this.parentId === this.path[index].fid)
        return ;
      this.parentId = this.path[index].fid;
      let arr = [];
      for(let i = 0;i<=index;i++){
        arr[i] = this.path[i];
      }
      this.path = arr;
      this.searchFile();
    },
    getDir(fid,fName){
      this.parentId = fid;
      this.path.push({dirName:fName+"/",fid:fid});
      this.searchFile();
    },
    //打开 新建文件夹 dialog
    openNewDir(){
      let path = '';
      this.path.forEach(item=>{
        path+=item.dirName;
      });
      this.$refs.newDir.parentId = this.parentId;
      this.$refs.newDir.currentPath = path;
      this.$refs.newDir.visible = true;
    },
    //获取到要移动的file对象 传递给 Explorer组件
    getMoveFile(file){
      this.$refs.explorer.targetFile = file;
      this.$refs.explorer.visible = true;
    },
    //搜索文件
    searchFile(){
      this.axios.get(this.baseUrl+"file/find/"+this.parentId+"/"+this.cid,{
        params:{
          search:this.search
        }
      }).then(res=>{
        this.file = res.data;
      })
    },
    //打包下载
    packDownload(){
      let selected = this.$refs.showFile.selected;
      if(selected.length===0){
        this.$message.error("您未选中任何文件");
        return ;
      }
      let fids = [];
      selected.forEach(item=>{
        fids.push(item.fid);
      })
      const h = this.$createElement;

      this.$notify({
        title: '提示消息',
        message: h('i', { style: 'color: teal'}, '正在构建压缩包,请稍候...')
      });
      this.axios.get(this.baseUrl+"file/buildZip",{
        params:{
          fids:fids
        },
        paramsSerializer:params => {
          return this.$qs.stringify(params,{indices:false})
        }
      }).then(res=>{
        if(res.data===''){
          this.$message.error("构建压缩包失败");
        }else {
          const h = this.$createElement;

          this.$notify({
            title: '提示消息',
            message: h('i', { style: 'color: teal'}, '构建成功,现在开始下载')
          });
          location.href = this.baseUrl+"download/zip?zipName="+res.data;
        }
      })
    },
    //批量删除文件
    delMulti(){
      if(this.$refs.showFile.selected.length===0){
        this.$message.error("您未选中任何文件");
        return ;
      }
      this.$confirm('文件删除后不可恢复,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const selected = this.$refs.showFile.selected;
        let fids = [];
        selected.forEach(item=>{
          fids.push(item.fid);
        })
        this.axios.delete(this.baseUrl+"file/del",{
          params:{
            fids:fids,
            type:1
          },
          paramsSerializer:params => {
            return this.$qs.stringify(params,{indices:false})
          }
        }).then(res=>{
          if(res.data){
            this.$message.success("删除成功");
            this.reloadShowFile();//告诉父组件 刷新 ShowFile组件
            this.getUserVolume();// 告诉父组件 刷新 用户网盘容量信息
          }else {
            this.$message.error("删除失败");
          }
        })
      })
    }
  },
  watch:{
    cid(newData,oldData){
      this.cid = newData;
      this.searchFile();
    },
    file(newData,oldData){
      this.$nextTick(function () {
        this.$refs.showFile.file = newData;
      })
    }
  },
  mounted() {
    this.getUser();
    this.getUserVolume();
    this.searchFile();
  }
}
</script>

<style scoped>

</style>
