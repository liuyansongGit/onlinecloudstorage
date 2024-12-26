<template>
  <div>
    <el-dialog
      :title="'Document ' + excelName"
      :visible.sync="visible"
      width="80%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      center
      :before-close="handleClose"
      :destroy-on-close="true"
    >
    <div id="mysheet" style="margin:0px;padding:0px;width:100%;height:500px;"></div>
    </el-dialog>
  </div>
</template>

<script>
import LuckyExcel from 'luckyexcel'
export default {
  name: "ExcelViewer",
  data(){
    return{
      excelName: '',
      excelURL: "", // File URL, depends on how you retrieve and assign it
      visible: false
    }
  },
  methods:{
    view(url){
      // Load the Excel file
      LuckyExcel.transformExcelToLuckyByUrl(url, this.excelName, (exportJson, luckysheetfile) => {
        console.log(exportJson);
        console.log(luckysheetfile);
        if(exportJson.sheets == null || exportJson.sheets.length === 0){
          alert("Failed to read the file!");
          return;
        }
        // Destroy the existing sheet
        window.luckysheet.destroy();
        // Create a new sheet
        window.luckysheet.create({
          container: 'mysheet', // Set the DOM container ID
          showtoolbar: false, // Show toolbar
          showinfobar: false, // Show top info bar
          showstatisticBar: false, // Show bottom statistics bar
          sheetBottomConfig: false, // Bottom configuration for add row button and back to top button
          allowEdit: false, // Allow frontend editing
          enableAddRow: false, // Allow adding rows
          enableAddCol: false, // Allow adding columns
          sheetFormulaBar: false, // Show formula bar
          enableAddBackTop: false, // Back to top button
          data: exportJson.sheets, // Sheet content
          title: exportJson.info.name  // Sheet title
        });
      });
    },
    handleClose(done){
      this.excelURL = '';
      done();
    }
  },
  watch:{
    excelURL(newData, oldData){
      this.view(newData);
    }
  },
}
</script>

<style scoped>

</style>
