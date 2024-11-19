<template>
<div>
  <el-dialog
    :title="'文档 '+wordName"
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
//预览word插件
import mammoth from 'mammoth';
export default {
  name: "WordViewer",
  data(){
    return{
      wordName:'',
      visible:false,
      vHtml: '',
      wordURL:''  //文件地址，看你对应怎末获取、赋值
    }
  },
  methods:{
    // 在线查看word文件
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
                // document.querySelector("#wordView").innerHTML =
                //   resultObject.value;
                vm.vHtml = resultObject.value;
              });
            });
        }
      };
      xhr.send();
    },
  },
  watch: {
    wordURL(newData,oldData){
      this.readExcelFromRemoteFile(newData);
    }
  }
}
</script>

<style scoped>

</style>
