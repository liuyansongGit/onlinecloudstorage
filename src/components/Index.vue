<template>
  <div>
    <el-row>
      <el-button type="primary" @click="$refs.upload.parentId = parentId; $refs.upload.visible = true"><i class="fa fa-upload" aria-hidden="true"></i>Upload File</el-button>
      <el-button type="primary" @click="openNewDir"><i class="fa fa-folder" aria-hidden="true"></i>Create Folder</el-button>
      <el-button type="primary" @click="packDownload">Download as ZIP</el-button>
      <!-- <el-button type="danger" @click="delMulti"><i class="fa fa-trash" aria-hidden="true"></i>Delete Selected</el-button> -->
      <div style="float: right; width: 30%">
        <el-input v-model="search" placeholder="Search..." style="width: 60%"/>
        <el-button type="primary" @click="searchFile"><i class="fa fa-search" aria-hidden="true"></i>Search</el-button>
      </div>
    </el-row>
    <el-row style="margin-top: 10px">
      <el-button type="primary" size="mini" @click="goLastPath">Go Back</el-button>
      <span>Current Path:</span>
      <el-link v-for="(p, index) in path" :key="index" @click="goPath(index)" type="primary">{{p.dirName}}</el-link>
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
    components: { NewDir, MyUpload, ShowFile },
    props: ['sendUser', 'sendVolume'],
    data() {
      return {
        file: [],
        path: [
          { dirName: 'root/', fid: 0 },
        ],
        parentId: '0', // Current parent directory ID
        cid: '0', // Category ID
        search: '', // Search content
      };
    },
    methods: {
      async getUser() {
        const res = await this.axios.get(this.baseUrl + "user/getUser");
        console.log(res.data);
        this.sendUser(res.data);
        if (!res.data) {
          await this.$router.replace("/login");
        }
      },
      getUserVolume() {
        this.axios.get(this.baseUrl + "user/getVolume")
          .then(res => {
            this.sendVolume(res.data);
          });
      },
      // Refresh file information
      reloadShowFile() {
        this.$refs.showFile.$refs.explorer.files = [];
        this.$refs.showFile.$refs.explorer.getFileStructure();
        this.searchFile();
      },
      // Go back to the previous level
      goLastPath() {
        if (this.path.length <= 1) return;
        this.path.pop();
        this.parentId = this.path[this.path.length - 1].fid;
        this.searchFile();
      },
      // Navigate to the selected path
      goPath(index) {
        if (this.path.length <= 1 || this.parentId === this.path[index].fid) return;
        this.parentId = this.path[index].fid;
        let arr = [];
        for (let i = 0; i <= index; i++) {
          arr[i] = this.path[i];
        }
        this.path = arr;
        this.searchFile();
      },
      getDir(fid, fName) {
        this.parentId = fid;
        this.path.push({ dirName: fName + "/", fid: fid });
        this.searchFile();
      },
      // Open the create folder dialog
      openNewDir() {
        let path = '';
        this.path.forEach(item => {
          path += item.dirName;
        });
        this.$refs.newDir.parentId = this.parentId;
        this.$refs.newDir.currentPath = path;
        this.$refs.newDir.visible = true;
      },
      // Pass the file object to the Explorer component for movement
      getMoveFile(file) {
        this.$refs.explorer.targetFile = file;
        this.$refs.explorer.visible = true;
      },
      // Search files
      searchFile() {
        this.axios.get(this.baseUrl + "file/find/" + this.parentId + "/" + this.cid, {
          params: {
            search: this.search,
          },
        }).then(res => {
          this.file = res.data;
        });
      },
      // Download selected files as a ZIP archive
      packDownload() {
        let selected = this.$refs.showFile.selected;
        if (selected.length === 0) {
          this.$message.error("No files selected.");
          return;
        }
        let fids = [];
        selected.forEach(item => {
          fids.push(item.fid);
        });
        const h = this.$createElement;
  
        this.$notify({
          title: 'Notification',
          message: h('i', { style: 'color: teal' }, 'Building ZIP archive, please wait...')
        });
        this.axios.get(this.baseUrl + "file/buildZip", {
          params: {
            fids: fids,
          },
          paramsSerializer: params => {
            return this.$qs.stringify(params, { indices: false });
          },
        }).then(res => {
          if (res.data === '') {
            this.$message.error("Failed to build ZIP archive.");
          } else {
            const h = this.$createElement;
  
            this.$notify({
              title: 'Notification',
              message: h('i', { style: 'color: teal' }, 'ZIP archive built successfully. Starting download...')
            });
            location.href = this.baseUrl + "download/zip?zipName=" + res.data;
          }
        });
      },
      // Delete selected files
      delMulti() {
        if (this.$refs.showFile.selected.length === 0) {
          this.$message.error("No files selected.");
          return;
        }
        this.$confirm('Files cannot be recovered after deletion. Do you want to proceed?', 'Warning', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }).then(() => {
          const selected = this.$refs.showFile.selected;
          let fids = [];
          selected.forEach(item => {
            fids.push(item.fid);
          });
          this.axios.delete(this.baseUrl + "file/del", {
            params: {
              fids: fids,
              type: 1,
            },
            paramsSerializer: params => {
              return this.$qs.stringify(params, { indices: false });
            },
          }).then(res => {
            if (res.data) {
              this.$message.success("Files deleted successfully.");
              this.reloadShowFile(); // Notify parent component to refresh ShowFile
              this.getUserVolume(); // Notify parent component to refresh user volume info
            } else {
              this.$message.error("Failed to delete files.");
            }
          });
        });
      },
    },
    watch: {
      cid(newData, oldData) {
        this.cid = newData;
        this.searchFile();
      },
      file(newData, oldData) {
        this.$nextTick(function () {
          this.$refs.showFile.file = newData;
        });
      },
    },
    mounted() {
      this.getUser();
      this.getUserVolume();
      this.searchFile();
    },
  };
  </script>
  
  <style scoped>
  </style>
  