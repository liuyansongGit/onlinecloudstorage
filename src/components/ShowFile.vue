<template>
<div>
  <el-table
    :data="file"
    :header-cell-style="{'text-align':'center'}"
    :cell-style="{'text-align':'center'}"
    @selection-change="handleSelectionChange"
    stripe>
    <el-table-column type="selection"/>
    <el-table-column label="文件名" width="400px">
      <template slot-scope="scope">
        <span v-if="scope.row.isDir===0">
          <svg class="icon" aria-hidden="true">
            <use v-if="scope.row.cid===1" xlink:href="#icon-jpg"></use>
            <use v-if="scope.row.cid===2 && scope.row.formatId===6" xlink:href="#icon-txt"></use>
            <use v-if="scope.row.cid===2 && (scope.row.formatId===7 || scope.row.formatId===8)" xlink:href="#icon-docx"></use>
            <use v-if="scope.row.cid===2 && (scope.row.formatId===9 || scope.row.formatId===10)" xlink:href="#icon-xlsx"></use>
            <use v-if="scope.row.cid===2 && (scope.row.formatId===11 || scope.row.formatId===12)" xlink:href="#icon-pptx"></use>
            <use v-if="scope.row.cid===2 && scope.row.formatId===13" xlink:href="#icon-PDF"></use>
            <use v-if="scope.row.cid===3" xlink:href="#icon-mp1"></use>
            <use v-if="scope.row.cid===4" xlink:href="#icon-mp"></use>
            <use v-if="scope.row.cid===5 && scope.row.formatId===19" xlink:href="#icon-zip"></use>
          </svg>
          <span style="margin-left: 3%;line-height: 30px">{{scope.row.fname}}</span>
        </span>
        <div v-if="scope.row.isDir===1">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-folder"></use>
          </svg>
          <el-link style="color: #66b1ff;margin-top: 2%;margin-left: 2%" @click="sendDir(scope.row.fid,scope.row.fname)">
            {{scope.row.fname}}
          </el-link>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="文件大小" width="100px" prop="fileSize" sortable :formatter="sizeFormatter"/>
    <el-table-column label="上传时间" prop="uploadTime" sortable :formatter="uploadTimeFormatter"/>
    <el-table-column label="修改时间" prop="updateTime" sortable :formatter="updateTimeFormatter"/>
    <el-table-column label="分类" prop="category.cname" sortable>
      <template slot-scope="scope">
        <span v-if="scope.row.isDir===0 && scope.row.category!==null">{{scope.row.category.cname}}</span>
        <span v-else-if="scope.row.cid===5">其他</span>
        <span v-else>-</span>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="500">
        <template slot-scope="scope">
          <!-- <el-button @click="shareId = scope.row.fid;visible = true;"   size="mini"  round><i class="fa fa-share" aria-hidden="true"></i>分享</el-button> -->
          <el-button :disabled="scope.row.cid===0 || scope.row.cid===5"   size="mini" type="success" @click="myPreView(scope.row)" round><i v-bind:class="{'fa fa-eye':scope.row.cid!==0,'fa fa-eye-slash':scope.row.cid===0 || scope.row.cid===5}" aria-hidden="true"></i>预览</el-button>
          <el-button @click="download(scope.row.fid,scope.row.isDir)" size="mini"  type="primary" round><i class="fa fa-download" aria-hidden="true"></i>下载</el-button>
          <!-- <el-button @click="getFile(scope.row)" type="warning" size="mini" round><i class="fa fa-truck" aria-hidden="true"></i>移动</el-button> -->
          <el-button @click="del(scope.row.fid)" type="danger" size="mini" round><i class="fa fa-trash-o" aria-hidden="true"></i>删除</el-button>
        </template>
      </el-table-column>





    <!-- <el-table-column label="操作">
      <template slot-scope="scope">
        <el-dropdown>
          <div @click="shareId = scope.row.fid;visible = true;"><i class="fa fa-share" aria-hidden="true"></i>分享</div>
          <el-button type="primary" size="mini">列表</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><div @click="shareId = scope.row.fid;visible = true;"><i class="fa fa-share" aria-hidden="true"></i>分享</div></el-dropdown-item>
            <el-dropdown-item :disabled="scope.row.cid===0 || scope.row.cid===5"><div @click="myPreView(scope.row)"><i v-bind:class="{'fa fa-eye':scope.row.cid!==0,'fa fa-eye-slash':scope.row.cid===0 || scope.row.cid===5}" aria-hidden="true"></i>预览</div></el-dropdown-item>
            <el-dropdown-item><div @click="download(scope.row.fid,scope.row.isDir)"><i class="fa fa-download" aria-hidden="true"></i>下载</div></el-dropdown-item>
            <el-dropdown-item><div @click="getFile(scope.row)"><i class="fa fa-truck" aria-hidden="true"></i>移动</div></el-dropdown-item>
            <el-dropdown-item style="color: red"><div @click="del(scope.row.fid)"><i class="fa fa-trash-o" aria-hidden="true"></i>删除</div></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </el-table-column> -->
  </el-table>
  <!--分享文件-->
  <el-dialog
    title="分享文件"
    :visible.sync="visible"
    width="50%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    :before-close="handleShareClose"
    center
  >
    <div style="width: fit-content;margin: 0 auto">
      <el-radio v-for="(item,index) in timeArray"
                :key="index"
                v-model="shareTime"
                :label="item.label">
        {{item.time}}
      </el-radio>
    </div>
    <div style="margin: 15px auto;width: fit-content" v-show="link">
      <span>链接:</span><el-link style="margin-left: 10px;color: #409EFF" @click="goShare">{{link}}</el-link>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-link
        type="primary"
        size="mini"
        v-show="link"
        v-clipboard:copy="link"
        v-clipboard:success="handleCopySuccess"
        v-clipboard:error="handleCopyError"
      >
        复制链接
      </el-link>
      <el-link target="_blank" style="margin-right: 20px">
        <el-button size="mini" type="primary" @click="shareFile">
          分享
        </el-button>
      </el-link>
      <el-button size="mini" @click="cancel">取 消</el-button>
    </span>
  </el-dialog>
  <!--移动文件-->
  <Explorer ref="explorer" :renew-show-file="renewExplorer"/>
  <!--预览图片-->
  <ImageViewer ref="image"/>
  <!--预览word-->
  <WordViewer ref="word"/>
  <!--预览excel-->
  <ExcelViewer ref="excel"/>
  <!--预览pdf-->
  <PdfViewer ref="pdf"/>
  <!--预览视频-->
  <VideoViewer ref="video"/>
  <!--预览音乐-->
  <MusicViewer ref="music"/>
</div>
</template>

<script>
import App from "../App";
import Explorer from "./Explorer";
import ImageViewer from "./ImageViewer";
import WordViewer from "./WordViewer";
import ExcelViewer from "./ExcelViewer";
import PdfViewer from "./PdfViewer";
import MusicViewer from "./MusicViewer";
import VideoViewer from "./VideoViewer";
export default {
  inject:['reload'],
  name: "ShowFile",
  components:{VideoViewer, MusicViewer, PdfViewer, ExcelViewer, WordViewer, ImageViewer, Explorer, App},
  props:['getDir','renewShowFile','renewVolume'],
  data(){
    return{
      file:[
        // {fid:1,fName:'1.txt',fileSize:0,isDir:0,uploadTime:'2022-07-09 13:55:03',updateTime:'2022-08-24 14:22:33',category:{cname:'文档'}},
        // {fid:2,fName:'dir',fileSize:0,isDir:1,uploadTime:'2022-07-09 13:55:03',updateTime:'2022-08-24 14:22:33'},
      ],
      selected:[],//当前选中的
      visible:false,
      shareId:0,//
      shareTime:1,//
      timeArray:[
        {time: '3天',label: 1},
        {time: '7天',label: 2},
        {time: '永久',label: 3},
      ],
      link:'',//文件分享链接
    }
  },
  methods:{
    handleSelectionChange(val){
      this.selected = val;
    },
    //转换单位
    changeUnit(size){
      if (!size) return ''
      if (size < Math.pow(1024,1)) return size + ' B'
      if (size < Math.pow(1024,2)) return (size / Math.pow(1024,1)).toFixed(2) + ' KB'
      if (size < Math.pow(1024,3)) return (size / Math.pow(1024,2)).toFixed(2) + ' MB'
      if (size < Math.pow(1024,4)) return (size / Math.pow(1024,3)).toFixed(2) + ' GB'
      return (size / Math.pow(1024,4)).toFixed(2) + ' TB'
    },
    uploadTimeFormatter(row,column){
      let r = row.uploadTime;
      r = r.substring(0,r.lastIndexOf("."));
      return r;
    },
    updateTimeFormatter(row,column){
      let r = row.updateTime;
      r = r.substring(0,r.lastIndexOf("."));
      return r;
    },
    sizeFormatter(row,column){
      let r = row.fileSize;
      if(r===0)return '-';
      r = this.changeUnit(row.fileSize);
      return r;
    },
    //点击文件夹向父组件发送id和文件夹名
    sendDir(fid,fName){
      this.getDir(fid,fName);
    },
    download(fid,isDir){
      location.href = this.baseUrl+"download/f/"+fid;
      if(isDir===1){
        this.$message.info("下载将在压缩包构建完毕后开始");
      }
    },
    del(fid){
      this.$confirm('文件删除后不可恢复,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete(this.baseUrl+"file/del",{
          params:{
            fids:[fid],
            type:1
          },
          paramsSerializer:params => {
            return this.$qs.stringify(params,{indices:false})
          }
        }).then(res=>{
              if(res.data){
                this.$message.success("删除成功");
                this.renewVolume();// 告诉父组件 刷新 用户网盘容量信息
                this.renewShowFile();//告诉父组件 刷新 ShowFile组件
              }else {
                this.$message.error("删除失败");
              }
            })
      })
    },
    shareFile(){
      if(this.shareId===0)return;
      let time = 3600*1000*24;
      switch (this.shareTime){
        case 1:time = time*3;break;
        case 2:time = time*7;break;
        case 3:time = 0;break;
      }
      this.axios.put(this.baseUrl+"file/share/"+this.shareId,this.$qs.stringify({
        time:time
      })).then(res=>{
        if(!res.data.status){
          this.$message.error("分享失败");
        }else {
          this.link = "http://localhost:8080/#/share?code="+res.data.msg;
        }
      })
    },
    handleShareClose(done){
      this.cancel();
      done();
    },
    cancel(){
      this.visible = false;
      this.link = '';
      this.shareId = 0;
      this.shareTime = 1;
    },
    //复制成功事件
    handleCopySuccess(value,e){
      this.$message.success("复制成功");
    },
    //复制失败事件
    handleCopyError(value,e){
      this.$message.error("复制失败");
    },
    //去分页页面
    goShare(){
      window.open(this.link);
    },
    getFile(file){
      this.$refs.explorer.targetFile = file;
      this.$refs.explorer.visible = true;
    },
    //刷新Explorer组件
    renewExplorer(){
      this.$refs.explorer.files.pop();
      this.$refs.explorer.getFileStructure();
      this.renewShowFile();
    },
    //预览按钮点击事件
    myPreView(file){
      const url = this.baseUrl+"view/"+file.user.uname+"/"+file.path;
      switch (file.cid){
        case 1:
          //图片
          this.$refs.image.imgPath = url;
          this.$refs.image.imgName = file.fname;
          this.$refs.image.visible = true;
          break;
        case 2:
          //docx格式
          if(file.formatId===8){
            //不支持doc
            this.$refs.word.wordName = file.fname;
            this.$refs.word.wordURL = url;
            this.$refs.word.visible = true;
          }
          // //xls,xlsx格式
          // else if(file.formatId===9 || file.formatId===10){
          //   this.$refs.excel.excelName = file.fname;
          //   this.$refs.excel.excelURL = url;
          //   this.$refs.excel.visible = true;
          // }
          else if(file.formatId===13){
            this.$refs.pdf.pdfUrl = url;
            this.$refs.pdf.pdfName = file.fname;
            this.$refs.pdf.visible = true;
          }
          else {
            const h = this.$createElement;

            this.$notify({
              title: '提示消息',
              message: h('i', { style: 'color: teal'}, '目前文档预览只支持 .docx和.pdf 格式')
            });
          }
          break;
        case 3:
          //视频
          if(file.formatId===14){
            this.$refs.video.playerOptions.sources[0].src = url;
            this.$refs.video.videoName = file.fname;
            this.$refs.video.visible = true;
          }else {
            const h = this.$createElement;

            this.$notify({
              title: '提示消息',
              message: h('i', { style: 'color: teal'}, '目前视频预览只支持 .mp4 格式')
            });
          }

          break;
        case 4:
          //音乐
          this.$refs.music.musicUrl = url;
          this.$refs.music.musicName = file.fname;
          this.$refs.music.visible = true;
          break;
      }
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
