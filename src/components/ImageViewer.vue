<template>
  <el-dialog
    :title="'图片 '+imgName"
    :visible.sync="visible"
    width="40%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    center
    :destroy-on-close="true"
  >
  <viewer style="width: fit-content;margin: 0 auto" @click="visible=false;">
    <img :src="imgPath" style="width: 300px;height: 300px">
  </viewer>
  </el-dialog>
</template>

<script>
export default {
  name: "ImageViewer",
  data(){
    return{
      imgPath:'',
      imgName:'',
      visible:false,
    }
  },
  methods:{
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
