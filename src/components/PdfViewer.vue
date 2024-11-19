<template>
  <div>
    <el-dialog
      :title="'文档 '+ pdfName"
      :visible.sync="visible"
      width="80%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      center
      :destroy-on-close="true"
      :before-close="handleClose"
    >
      <div class="pdf">
        <div class="show">
          <pdf ref="pdf"
               :src="pdfUrl"
               :page="pageNum"
               :rotate="pageRotate"
               @num-pages="pageTotalNum = $event"
               @link-clicked="page = $event">
          </pdf>
        </div>
        <div class="pdf_footer">
          <div class="info">
            <div>当前页数/总页数：{{pageNum}}/{{pageTotalNum}}</div>
          </div>
          <div class="operate">
            <el-button type="primary" @click.stop="prePage">上一页</el-button>
            <el-button type="primary" @click.stop="nextPage">下一页</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pdf from 'vue-pdf'
export default {
  name: "PdfViewer",
  components:{pdf},
  data(){
    return{
      pdfUrl:'',
      visible:false,
      pdfName:'',
      // 总页数
      pageTotalNum: 1,
      // 当前页数
      pageNum: 1,
      // 放大系数 默认百分百
      scale: 0,
      // 旋转角度 ‘90’的倍数才有效
      pageRotate: 0,
      // 单击内部链接时触发 (目前我没有遇到使用场景)
      page: 0,
      }
    },
  methods: {
    // 切换上一页
    prePage() {
      var p = this.pageNum;
      p = p > 1 ? p - 1 : this.pageTotalNum;
      this.pageNum = p;
    },
    // 切换下一页
    nextPage() {
      var p = this.pageNum;
      p = p < this.pageTotalNum ? p + 1 : 1;
      this.pageNum = p;
    },
    handleClose(done){
      this.pageTotalNum = 1;
      this.pageNum = 1;
      this.scale = 0;
      this.pageRotate = 0;
      this.page = 0;
      done();
    }
  },

}
</script>

<style>
.cpdf {
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, .5);
  width: 100%;
  height: 100%;
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.center {
  text-align: center;
  height: 100%;
  overflow: auto;
  padding-top: 20px;
}
.contor {
  margin-bottom: 10px;
}
</style>
