<template>
<div>
  <el-dialog
    title="新建文件夹"
    :visible.sync="visible"
    width="40%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    center
  >
    <el-input v-model="dirName" placeholder="文件夹名称..."/>

    <span slot="footer" class="dialog-footer">
      <el-tag style="float: left" v-text="'当前位置: '+currentPath"></el-tag>
        <el-link target="_blank" style="margin-right: 20px">
          <el-button size="mini" type="primary" @click="createDir">
            提交
          </el-button>
        </el-link>
        <el-button size="mini" @click="cancel">取 消</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
export default {
  name: "NewDir",
  props:['renewShowFile',],
  data(){
    return{
      parentId:0,
      currentPath:'',
      visible:false,
      dirName:''
    }
  },
  methods:{
    createDir(){
      this.axios.post(this.baseUrl+"file/upload/"+this.parentId,this.$qs.stringify({
        dirName:this.dirName
      })).then(res=>{
        if(res.data){
          this.$message.success("创建成功!");
          this.renewShowFile();//告诉父组件 刷新 ShowFile组件
          this.cancel();
        }else {
          this.$message.error("创建失败!");
        }
      })
    },
    cancel(){
      this.visible = false;
      this.dirName = '';
    }
  }
}
</script>

<style scoped>

</style>
