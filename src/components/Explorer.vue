<template>
<div>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="40%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="cancel"
    :destroy-on-close="true"
    center
  >
    <el-tree
      ref="tree"
      node-key="fid"
      :data="files"
      :props="defaultProps"
      :highlight-current="true"
      :accordion="true"
      @node-click="handleNodeClick"
          @node-collapse="handleClose"
    />
<!--      @node-expand="handleOpen"-->


    <span slot="footer" class="dialog-footer">
      <span>当前路径: </span><el-link style="color: #409EFF" v-for="(p,index) in path" :key="index" v-text="p.dirName"/>
      <el-row style="margin-top: 3%">
        <el-button type="primary" size="mini" @click="moveFile">移动</el-button>
        <el-button size="mini" @click="cancel">取消</el-button>
      </el-row>
    </span>
  </el-dialog>
</div>
</template>

<script>
import App from "../App";
export default {
  inject:['reload'],
  name: "Explorer",
  components:{App},
  props:['renewShowFile'],
  data() {
    return {
      targetFile:{},//要移动的目标文件对象
      title:'',
      files:[],//文件结构
      defaultProps: {
        children: 'file',
        label: 'fname'
      },
      visible:false,
      path:[
        {dirName:'root/',fid:0}
      ],
      parentId:0,//要移动到的父目录id
    }
  },
  methods:{
    //点击结点事件
    handleNodeClick(data){
      if(data.isDir===0 )return;
      let d = data;
      let arr = [];
      while(d.fname!=='root'){
        let p = this.$refs.tree.getNode(d.fid);
        p = p.parent;
        arr.push({dirName:p.data.fname+"/",fid:p.data.fid});
        d = p.data;
      }
      let a = [];
      for (let i = arr.length-1; i >= 0; i--) {
         a.push(arr[i]);
      }
      a.push({dirName:data.fname+"/",fid:data.fid});
      this.path = a;
      this.parentId = data.fid;
    },
    // findBroByNodeInPath(node){
    //   const parent = this.$refs.tree.getNode(node).parent;
    //   const sons = parent.childNodes;
    //   try{
    //     sons.forEach(item=>{
    //       for (let i = 0; i < this.path.length; i++) {
    //         if(item.data.fid===this.path[i].fid){
    //
    //         }
    //       }
    //     })
    //   }catch (e){
    //     if(e.message!=='error')throw e;
    //   }
    // },
    // //文件夹展开事件
    // handleOpen(f,node,component){
    //   if(f.fid===0 || f.fid===this.path[this.path.length-1].fid || f.isDir===0)return ;
    //   this.path.push({dirName:f.fname+"/",fid:f.fid});
    //   this.parentId = f.fid;
    // },
    //文件夹关闭事件
    handleClose(f,node,component){
      if(f.fid===0){
        this.path = [{dirName: 'root/',fid:0}];
        this.parentId = 0;
      }
      // let arr = [];
      // try{
      //   this.path.forEach(item=>{
      //     arr.push({dirName:item.dirName,fid:item.fid});
      //     if(item.fid===f.fid){
      //       this.path = arr;
      //       throw new Error("LoopInterrupt");
      //     }
      //   })
      // }catch (e){
      //   if(e.message!=='LoopInterrupt')throw e
      // }
      // this.closeChildrenNode(node.childNodes);
      // this.parentId = arr[arr.length-1].fid;
    },
    // //关闭给定结点的所有子节点
    // closeChildrenNode(nodes){
    //   if(nodes.length===0)return ;
    //   nodes.forEach(item=>{
    //     if(item.data.isDir===0)return ;
    //     item.expanded = false;
    //     if(item.childNodes.length!==0)this.closeChildrenNode(item.childNodes);
    //   })
    // },
    //获取文件目录结构
    async getFileStructure(){
      const res = await this.axios.get(this.baseUrl+"file/getStructure");
      if(!res.data)return null;
      // this.files.push(res.data);
      this.files = [res.data];
    },
    //移动文件
    moveFile(){
	  const parent = this.$refs.tree.getNode(this.targetFile.fid).parent;
	  if(parent.data.fid===0 && this.path.length===1){
	  this.$message.error("此文件已在该目录");
		return;
	  }
      let flag = true;//判断parentId是否合法
      try{
        this.path.forEach(item=>{
          if(item.fid===this.targetFile.fid){
            flag = false;
            throw new Error("error");
          }
        })
      }catch(e){
        if(e.message!=='error')throw e;
      }
      if(!flag){
        this.$message.error("选中的路径错误");
        return ;
      }
      this.axios.put(this.baseUrl+"file/move/"+this.targetFile.fid+"/"+this.parentId)
        .then(res=>{
            if(res.data) {
              this.$message.success("移动成功");
              this.renewShowFile();
              this.cancel();
            }else
              this.$message.error("移动失败");
        })
    },
    //取消
    cancel(){
      this.visible = false;
      this.targetFile = {};
      this.parentId = 0;
      this.path = [{dirName:'root/',fid:0}];
    },
    close(done){
      this.cancel();
    }
  },
  watch:{
    targetFile(newData,oldData){
      let a = '文件';
      if(newData.isDir===1)a+= '夹';
	  let name = newData.fname;
	  if(name.length>20){
		name = name.substring(0,20);
		name+='...';
	  }
      this.title = '移动'+a+' '+name+' 至...';
    }
  },
  mounted() {
    this.getFileStructure();
  }
}
</script>

<style scoped>

</style>
