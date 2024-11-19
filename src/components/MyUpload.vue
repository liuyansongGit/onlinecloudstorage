<template>
<div>
  <el-dialog
    title="文件上传(每次上传不超过1G)"
    :visible.sync="visible"
    width="40%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    center
  >
    <el-upload
      ref="upload"
      style="text-align: center"
      :on-change="handleChange"
      :before-remove="handleRemove"
      :auto-upload="false"
      :file-list="fileList"
      class="upload-demo"
      drag
      action=""
    >
    </el-upload>

    <div v-show="progressFlag">
      <el-progress
        :text-inside="true"
        :stroke-width="14"
        :percentage="progressPercent"
      ></el-progress>
    </div>

    <span slot="footer" class="dialog-footer">
        <el-link target="_blank" style="margin-right: 20px">
          <el-button size="mini" type="primary" @click="uploadSectionFile">
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
  name: "Upload",
  props:['renewShowFile','renewVolume'],
  data(){
    return{
      visible: false,
      progressPercent: 0,
      progressFlag: false,
      fileList:[],
      fileSize:0,//当前上传文件总大小
      source:null,
      parentId:0,//上传文件到哪个父目录中
    }
  },
  methods:{
    //获取当前用户网盘剩余容量(G)
    async getUserRemain(){
      const res = await this.axios.get(this.baseUrl+"user/getVolume");
      if(res.data){
        return res.data.remain;
      }
    },
    async handleChange(file, fileList) {
      let remain = await this.getUserRemain();//获取网盘剩余容量
      const fileSize = (this.fileSize + file.size) / 1024 / 1024 / 1024;
      if (fileSize > 1 || fileSize > remain) {
        this.$message.error("上传文件大小超出限制");
        fileList.pop();
        this.fileList = fileList;
        return;
      }
      let existFile = fileList
        .slice(0, fileList.length - 1)
        .find((f) => f.name === file.name);
      if (existFile) {
          this.$message.error("当前文件已经存在!");
          console.log("111");
          fileList.pop();
      } else {
        this.fileSize += file.size;
      }
      this.fileList = fileList;
    },
    handleRemove(file,fileList){
      this.fileSize-=file.size;
      this.fileList = fileList;
    },
    uploadSectionFile() {
      if(this.fileList.length===0 || this.fileSize===0){
        this.$message.error("您还未选择文件");
        return ;
      }
      this.source = this.axios.CancelToken.source();
      const config = {
        onUploadProgress: (progressEvent) => {
          // progressEvent.loaded:已上传文件大小
          // progressEvent.total:被上传文件的总大小
          this.progressPercent = Number(
            ((progressEvent.loaded / progressEvent.total) * 90).toFixed(2)
          );
        },
        cancelToken: this.source.token,
      };
      this.progressFlag = true;
      let form = new FormData();
      this.fileList.forEach(item=>{
        form.append("files", item.raw);
      })
      this.axios
        .post( this.baseUrl+"file/upload/"+this.parentId, form,config ).then((res) => {
          if(res.data){
            this.progressPercent = 100;
            this.$message.success("上传成功!");
            this.renewShowFile();//告诉父组件 刷新 ShowFile 组件
            this.renewVolume();//告诉父组件 刷新 用户容量 信息
            this.cancel();
          }
          else {
            this.$message.error("上传失败!");
            this.source.cancel("Operation canceled by the user.");
            this.progressFlag = false;
            this.progressPercent = 0;
            this.fileSize = 0;
            this.fileList = [];
            this.$refs.upload.clearFiles();
          }
      })
    },
    cancel(){
      if(this.source!=null)
        this.source.cancel("Operation canceled by the user.");
      this.progressFlag = false;
      this.progressPercent = 0;
      this.$refs.upload.clearFiles();
      this.fileList = [];
      this.fileSize = 0;
      this.visible = false;
    }
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>
