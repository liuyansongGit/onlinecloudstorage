<template>
  <div>
    <el-dialog
      title="Create New Folder"
      :visible.sync="visible"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      center
    >
      <el-input v-model="dirName" placeholder="Folder name..."/>
  
      <span slot="footer" class="dialog-footer">
        <el-tag style="float: left" v-text="'Current location: '+currentPath"></el-tag>
          <el-link target="_blank" style="margin-right: 20px">
            <el-button size="mini" type="primary" @click="createDir">
              Submit
            </el-button>
          </el-link>
          <el-button size="mini" @click="cancel">Cancel</el-button>
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
            this.$message.success("Creation successful!");
            this.renewShowFile(); // Notify parent component to refresh ShowFile component
            this.cancel();
          } else {
            this.$message.error("Creation failed!");
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
  