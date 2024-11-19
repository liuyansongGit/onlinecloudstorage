<template>
  <div>
    <el-dialog
      :title="'文档 '+excelName"
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
      excelName:'',
      excelURL: "", //文件地址，看你对应怎末获取、赋值
      visible:false
    }
  },
  methods:{
    view(url){
      // 加载 excel 文件
      LuckyExcel.transformExcelToLuckyByUrl(url, this.excelName, (exportJson, luckysheetfile) => {
        console.log(exportJson);
        console.log(luckysheetfile);
        if(exportJson.sheets==null || exportJson.sheets.length===0){
          alert("文件读取失败!");
          return;
        }
        // 销毁原来的表格
        window.luckysheet.destroy();
        // 重新创建新表格
        window.luckysheet.create({
          container: 'mysheet', // 设定DOM容器的id
          showtoolbar: false, // 是否显示工具栏
          showinfobar: false, // 是否显示顶部信息栏
          showstatisticBar: false, // 是否显示底部计数栏
          sheetBottomConfig: false, // sheet页下方的添加行按钮和回到顶部按钮配置
          allowEdit: false, // 是否允许前台编辑
          enableAddRow: false, // 是否允许增加行
          enableAddCol: false, // 是否允许增加列
          sheetFormulaBar: false, // 是否显示公式栏
          enableAddBackTop: false,//返回头部按钮
          data:exportJson.sheets, //表格内容
          title:exportJson.info.name  //表格标题
        });
      });
    },
    handleClose(done){
      this.excelURL = '';
      done();
    }
  },
  watch:{
    excelURL(newData,oldData){
      this.view(newData);
    }
  },
}
</script>

<style scoped>

</style>
