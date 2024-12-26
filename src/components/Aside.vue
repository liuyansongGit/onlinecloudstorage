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
        <span slot="title">All</span>
      </el-menu-item>
      <el-menu-item index="1">
        <i class="fa fa-picture-o" aria-hidden="true"></i>
        <span slot="title">Images</span>
      </el-menu-item>
      <el-menu-item index="2">
        <i class="fa fa-file-text-o" aria-hidden="true"></i>
        <span slot="title">Documents</span>
      </el-menu-item>
      <el-menu-item index="3">
        <i class="fa fa-video-camera" aria-hidden="true"></i>
        <span slot="title">Videos</span>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="fa fa-headphones" aria-hidden="true"></i>
        <span slot="title">Music</span>
      </el-menu-item>
      <el-menu-item index="5">
        <i class="fa fa-shopping-bag" aria-hidden="true"></i>
        <span slot="title">Others</span>
      </el-menu-item>
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
        percentage:0,// percentage
        already:0.05,// used space
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
                          text: 'Cloud Drive Capacity',
                          x: 'center'
                      },
                      tooltip: {
                          trigger: 'item',
                          formatter: "{a} <br/>{b} : {c} ({d}%)"
                      },
                      legend: {
                          orient: 'vertical',
                          left: 'left',
                          data: ['Total Capacity', 'Used Capacity']
                      },
                      series: [
                          {
                              name: 'Cloud Drive Capacity',
                              type: 'pie',
                              radius: '55%',
                              center: ['50%', '60%'],
                              data: [
                                  { value: this.user.total, name: 'Total Capacity' },
                                  { value: this.already, name: 'Used Capacity' }
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
  