<template>
<div>
  <el-dialog
    :title="'音乐 '+musicName"
    :visible.sync="visible"
    width="40%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    center
    :destroy-on-close="true"
  >
  <audio
    :src="musicUrl"
    controls="controls"
    ref="audio"
  >Your browser does not support the audio element.</audio>
  </el-dialog>
</div>
</template>

<script>
export default {
  name: "MusicViewer",
  data(){
    return{
      musicUrl:'http://localhost:8090/netdisk/view/hapehape/battle9.mp3',
      musicName:'',
      visible:false
    }
  }
}
</script>

<style scoped>

</style>
