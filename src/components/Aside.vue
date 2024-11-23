<template>
<div style="height: 100%">
  <el-menu
    background-color="#09c8db"
    text-color="#fff"
    default-active="0"
    class="el-menu-vertical-demo el-menu-container"
    :collapse="isCollapse"
    style="height: 100%"
    @select="handleSelect">
    <el-menu-item index="0">
      <i class="fa fa-th" aria-hidden="true"></i>
      <span slot="title">全部</span>
    </el-menu-item>
    <el-menu-item index="1">
      <i class="fa fa-picture-o" aria-hidden="true"></i>
      <span slot="title">图片</span>
    </el-menu-item>
    <el-menu-item index="2">
      <i class="fa fa-file-text-o" aria-hidden="true"></i>
      <span slot="title">文档</span>
    </el-menu-item>
    <el-menu-item index="3">
      <i class="fa fa-video-camera" aria-hidden="true"></i>
      <span slot="title">视频</span>
    </el-menu-item>
    <el-menu-item index="4">
      <i class="fa fa-headphones" aria-hidden="true"></i>
      <span slot="title">音乐</span>
    </el-menu-item>
    <el-menu-item index="5">
      <i class="fa fa-shopping-bag" aria-hidden="true"></i>
      <span slot="title">其他</span>
    </el-menu-item>
    <!-- <el-progress :text-inside="true" :stroke-width="26" :percentage="percentage" status="success"/>
    <el-progress v-if="percentage<=25" :text-inside="true" :stroke-width="26" :percentage="percentage" :status="'success'"></el-progress>
    <el-progress v-if="percentage>25&&percentage<=50" :text-inside="true" :stroke-width="26" :percentage="percentage"></el-progress>
    <el-progress v-if="percentage>50&&percentage<=75" :text-inside="true" :stroke-width="26" :percentage="percentage" :status="'warning'"></el-progress>
    <el-progress v-if="percentage>75" :text-inside="true" :stroke-width="26" :percentage="percentage" :status="'exception'"></el-progress>
    <el-row>
        <span style="color: #FFFFFF">网盘容量:<span style="float: right;margin-right: 2%">{{already}}G / {{user.total}}G</span></span>
      <el-col :span="24">
        <div :lazy = "true" id="chartPie" style="width:100%; height:400px;"></div>
      </el-col>  
     
    </el-row> -->
  </el-menu>
</div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: "Aside",
  props:['sendCategory'],
  data(){
    return{
      chartPie: null,
      isCollapse:false,
      percentage:0,//百分比
      already:0.05,//已用容量
      user:{
        total:1,
        remain:0.5
      },
    }
  },
  mounted() {
   // this.drawPieChart();
   /// window.addEventListener('beforeunload', this.refreshChart);
  },
  methods:{ 
    refreshChart() {
    if (this.$refs.chartContainer) {
      this.$nextTick(() => {
        this.drawPieChart();
      });
    }
    },
    drawPieChart() {
                this.chartPie = echarts.init(document.getElementById('chartPie'),'light');
                this.chartPie.setOption({
                    title: {
                        text: '网盘容量',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['总容量', '已用容量']
                    },
                    series: [
                        {
                            name: '网盘容量',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: [
                                { value: this.user.total, name: '总容量' },
                                { value: this.already, name: '已用容量' }
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                }, true);
            },
    handleSelect(key,keyPath){
      this.sendCategory(key);
    }
  },
  watch:{
    user(newData,oldData){
      if(newData==='' || newData===null)return ;
      this.already = (newData.total-newData.remain).toFixed(2);
      this.percentage = ((newData.total-newData.remain)/newData.total).toFixed(2)*100;
    }
  }
}
</script>

<style scoped>

</style>
