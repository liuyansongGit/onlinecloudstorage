<template>
  <div>
    <el-dialog
      :title="'Video '+videoName"
      :visible.sync="visible"
      width="60%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      center
      :destroy-on-close="true"
    >
    <video-player
      class="video-player vjs-custom-skin"
      ref="videoPlayer"
      :playsinline="true"
      :options="playerOptions"></video-player>
    </el-dialog>
  </div>
  </template>
  
  <script>
  import { videoPlayer } from 'vue-video-player'
  import 'video.js/dist/video-js.css'
  import 'vue-video-player/src/custom-theme.css'
  export default {
    name: "VideoViewer",
    components:{videoPlayer},
    data(){
      return{
        videoName:'',
        visible:false,
        playerOptions: {
          playbackRates: [0.7, 1.0, 1.25, 1.5, 2.0], // Playback speed
          autoplay: false, // If true, playback starts as soon as the browser is ready.
          muted: false, // Mutes audio by default.
          loop: false, // Loops the video when it finishes.
          preload: 'auto', // Suggests to the browser whether it should start downloading video data after the <video> element is loaded. 'auto' lets the browser decide.
          language: 'en', // Language
          aspectRatio: '16:9', // Sets the aspect ratio for the player. It should be in a format like "16:9" or "4:3"
          fluid: true, // When true, the player will scale proportionally to fit its container.
          sources: [
            {
              type: 'video/mp4', // Type
              src: 'http://localhost:8090/netdisk/view/hapehape/25.MarxistPrinciples-ValueLawAndTheBasicContradictionOfSimpleCommodityEconomy-2.mp4', // URL address
            },
          ],
          poster: '', // Poster image URL
          notSupportedMessage: 'This video cannot be played at the moment, please try again later', // Custom message displayed when Video.js cannot play the media source.
          controlBar: {
            timeDivider: true, // Divider between current time and duration
            durationDisplay: true, // Show duration
            remainingTimeDisplay: false, // Whether to show remaining time
            fullscreenToggle: true, // Fullscreen button
          },
        },
      }
    }
  }
  </script>
  
  <style scoped>
  
  </style>
  