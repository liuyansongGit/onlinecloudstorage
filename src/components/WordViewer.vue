<template>
  <div>
    <el-dialog
      :title="'Document '+wordName"
      :visible.sync="visible"
      width="70%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      center
      :destroy-on-close="true"
    >
    <div id="wordView" v-html="vHtml"></div>
    </el-dialog>
  </div>
  </template>
  
  <script>
  // Word file preview plugin
  import mammoth from 'mammoth';
  export default {
    name: "WordViewer",
    data(){
      return{
        wordName:'', // Document name
        visible:false,
        vHtml: '', // HTML content of the document
        wordURL:''  // File URL, assign based on how you retrieve the file
      }
    },
    methods:{
      // View Word file online
      readExcelFromRemoteFile: function (url) {
        var vm = this;
        var xhr = new XMLHttpRequest();
        xhr.open("get", url, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = function () {
          if (xhr.status === 200) {
            mammoth
              .convertToHtml({ arrayBuffer: new Uint8Array(xhr.response) })
              .then(function (resultObject) {
                vm.$nextTick(() => {
                  vm.vHtml = resultObject.value;
                });
              });
          }
        };
        xhr.send();
      },
    },
    watch: {
      wordURL(newData, oldData){
        this.readExcelFromRemoteFile(newData);
      }
    }
  }
  </script>
  
  <style scoped>
  
  </style>
  