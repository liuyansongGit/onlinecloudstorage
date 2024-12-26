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
        <span>Current path: </span><el-link style="color: #409EFF" v-for="(p, index) in path" :key="index" v-text="p.dirName"/>
        <el-row style="margin-top: 3%">
          <el-button type="primary" size="mini" @click="moveFile">Move</el-button>
          <el-button size="mini" @click="cancel">Cancel</el-button>
        </el-row>
      </span>
    </el-dialog>
  </div>
  </template>
  
  <script>
  import App from "../App";
  export default {
    inject: ['reload'],
    name: "Explorer",
    components: { App },
    props: ['renewShowFile'],
    data() {
      return {
        targetFile: {}, // Target file to move
        title: '',
        files: [], // File structure
        defaultProps: {
          children: 'file',
          label: 'fname'
        },
        visible: false,
        path: [
          { dirName: 'root/', fid: 0 }
        ],
        parentId: 0, // ID of the parent directory to move to
      }
    },
    methods: {
      // Node click event
      handleNodeClick(data) {
        if (data.isDir === 0) return;
        let d = data;
        let arr = [];
        while (d.fname !== 'root') {
          let p = this.$refs.tree.getNode(d.fid);
          p = p.parent;
          arr.push({ dirName: p.data.fname + "/", fid: p.data.fid });
          d = p.data;
        }
        let a = [];
        for (let i = arr.length - 1; i >= 0; i--) {
           a.push(arr[i]);
        }
        a.push({ dirName: data.fname + "/", fid: data.fid });
        this.path = a;
        this.parentId = data.fid;
      },
      // Folder close event
      handleClose(f, node, component) {
        if (f.fid === 0) {
          this.path = [{ dirName: 'root/', fid: 0 }];
          this.parentId = 0;
        }
      },
      // Get file structure
      async getFileStructure() {
        const res = await this.axios.get(this.baseUrl + "file/getStructure");
        if (!res.data) return null;
        this.files = [res.data];
      },
      // Move file
      moveFile() {
        const parent = this.$refs.tree.getNode(this.targetFile.fid).parent;
        if (parent.data.fid === 0 && this.path.length === 1) {
          this.$message.error("The file is already in this directory");
          return;
        }
        let flag = true; // Check if parentId is valid
        try {
          this.path.forEach(item => {
            if (item.fid === this.targetFile.fid) {
              flag = false;
              throw new Error("error");
            }
          });
        } catch (e) {
          if (e.message !== 'error') throw e;
        }
        if (!flag) {
          this.$message.error("Selected path is invalid");
          return;
        }
        this.axios.put(this.baseUrl + "file/move/" + this.targetFile.fid + "/" + this.parentId)
          .then(res => {
            if (res.data) {
              this.$message.success("Move successful");
              this.renewShowFile();
              this.cancel();
            } else {
              this.$message.error("Move failed");
            }
          });
      },
      // Cancel operation
      cancel() {
        this.visible = false;
        this.targetFile = {};
        this.parentId = 0;
        this.path = [{ dirName: 'root/', fid: 0 }];
      },
      close(done) {
        this.cancel();
      }
    },
    watch: {
      targetFile(newData, oldData) {
        let a = 'file';
        if (newData.isDir === 1) a += ' folder';
        let name = newData.fname;
        if (name.length > 20) {
          name = name.substring(0, 20);
          name += '...';
        }
        this.title = 'Move ' + a + ' ' + name + ' to...';
      }
    },
    mounted() {
      this.getFileStructure();
    }
  }
  </script>
  
  <style scoped>
  
  </style>
  