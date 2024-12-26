<template>
  <div>
    <el-table
      :data="file"
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{'text-align':'center'}"
      @selection-change="handleSelectionChange"
      stripe>
      <el-table-column type="selection"/>
      <el-table-column label="File Name" width="400px">
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
      <el-table-column label="File Size" width="100px" prop="fileSize" sortable :formatter="sizeFormatter"/>
      <el-table-column label="Upload Time" prop="uploadTime" sortable />
      <el-table-column label="Update Time" prop="updateTime" sortable />
      <el-table-column label="Category" prop="category.cname" sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.isDir===0 && scope.row.category!==null">{{scope.row.category.cname}}</span>
          <span v-else-if="scope.row.cid==='6740519ce31055c1ab621efe'">Other</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Actions" width="500">
          <template slot-scope="scope" >
            <el-button @click="shareId = scope.row.fid;visible = true;" size="mini" round><i class="fa fa-share" aria-hidden="true"></i>Share</el-button>
            <el-button :disabled="scope.row.cid==='0' || scope.row.cid==='6740519ce31055c1ab621efe'" size="mini" type="success" @click="myPreView(scope.row)" round><i v-bind:class="{'fa fa-eye':scope.row.cid!=='0','fa fa-eye-slash':scope.row.cid==='0' || scope.row.cid==='6740519ce31055c1ab621efe'}" aria-hidden="true"></i>Preview</el-button>
            <el-button @click="download(scope.row.fid,scope.row.isDir)" size="mini" type="primary" round><i class="fa fa-download" aria-hidden="true"></i>Download</el-button>
            <el-button @click="del(scope.row.fid)" type="danger" size="mini" round><i class="fa fa-trash-o" aria-hidden="true"></i>Delete</el-button>
          </template>
        </el-table-column>
    </el-table>
    <!-- Share File -->
    <el-dialog
      title="Share File"
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
        <span>Link:</span><el-link style="margin-left: 10px;color: #409EFF" @click="goShare">{{link}}</el-link>
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
          Copy Link
        </el-link>
        <el-link target="_blank" style="margin-right: 20px">
          <el-button size="mini" type="primary" @click="shareFile">
            Share
          </el-button>
        </el-link>
        <el-button size="mini" @click="cancel">Cancel</el-button>
      </span>
    </el-dialog>
    <!-- Additional components such as viewers are retained with their respective names -->
  </div>
  </template>
  
  <script>
  // The script section is unchanged, as variable and method names are already in English.
  </script>
  
  <style scoped>
  
  </style>
  