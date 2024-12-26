<template>
  <div>
    <el-dialog
      :title="'Document ' + pdfName"
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
            <div>Current page / Total pages: {{pageNum}} / {{pageTotalNum}}</div>
          </div>
          <div class="operate">
            <el-button type="primary" @click.stop="prePage">Previous Page</el-button>
            <el-button type="primary" @click.stop="nextPage">Next Page</el-button>
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
  components: { pdf },
  data() {
    return {
      pdfUrl: '',
      visible: false,
      pdfName: '',
      // Total number of pages
      pageTotalNum: 1,
      // Current page number
      pageNum: 1,
      // Zoom scale, default 100%
      scale: 0,
      // Rotation angle (only multiples of 90 are valid)
      pageRotate: 0,
      // Triggered when a link inside is clicked (currently no use case)
      page: 0,
    }
  },
  methods: {
    // Switch to previous page
    prePage() {
      var p = this.pageNum;
      p = p > 1 ? p - 1 : this.pageTotalNum;
      this.pageNum = p;
    },
    // Switch to next page
    nextPage() {
      var p = this.pageNum;
      p = p < this.pageTotalNum ? p + 1 : 1;
      this.pageNum = p;
    },
    handleClose(done) {
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
