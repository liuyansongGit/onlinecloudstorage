<template>
  <div>
    <el-dialog
      title="File Upload (Each upload must not exceed 1GB)"
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
    name: "Upload",
    props:['renewShowFile','renewVolume'],
    data(){
      return{
        visible: false,
        progressPercent: 0,
        progressFlag: false,
        fileList:[],
        fileSize:0, // Current total size of uploaded files
        source:null,
        parentId:0, // Parent directory for file upload
      }
    },
    methods:{
      // Get the remaining storage space for the current user (GB)
      async getUserRemain(){
        const res = await this.axios.get(this.baseUrl+"user/getVolume");
        if(res.data){
          return res.data.remain;
        }
      },
      async handleChange(file, fileList) {
        let remain = await this.getUserRemain(); // Get remaining storage space
        const fileSize = (this.fileSize + file.size) / 1024 / 1024 / 1024;
        if (fileSize > 1 || fileSize > remain) {
          this.$message.error("File size exceeds limit");
          fileList.pop();
          this.fileList = fileList;
          return;
        }
        let existFile = fileList
          .slice(0, fileList.length - 1)
          .find((f) => f.name === file.name);
        if (existFile) {
            this.$message.error("File already exists!");
            console.log("111");
            fileList.pop();
        } else {
          this.fileSize += file.size;
        }
        this.fileList = fileList;
      },
      handleRemove(file, fileList){
        this.fileSize -= file.size;
        this.fileList = fileList;
      },
      uploadSectionFile() {
        if(this.fileList.length === 0 || this.fileSize === 0){
          this.$message.error("You haven't selected any files");
          return;
        }
        this.source = this.axios.CancelToken.source();
        const config = {
          onUploadProgress: (progressEvent) => {
            // progressEvent.loaded: Size of uploaded file
            // progressEvent.total: Total size of file to be uploaded
            this.progressPercent = Number(
              ((progressEvent.loaded / progressEvent.total) * 90).toFixed(2)
            );
          },
          cancelToken: this.source.token,
        };
        this.progressFlag = true;
        let form = new FormData();
        this.fileList.forEach(item => {
          form.append("files", item.raw);
        });
        this.axios
          .post(this.baseUrl+"file/upload/"+this.parentId, form, config)
          .then((res) => {
            if(res.data){
              this.progressPercent = 100;
              this.$message.success("Upload successful!");
              this.renewShowFile(); // Notify parent component to refresh ShowFile component
              this.renewVolume(); // Notify parent component to refresh user storage information
              this.cancel();
            } else {
              this.$message.error("Upload failed!");
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
        if(this.source != null)
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
  