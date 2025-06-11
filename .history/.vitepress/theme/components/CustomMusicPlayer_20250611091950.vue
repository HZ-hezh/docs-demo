<template>
  <div v-if="showPlayer" class="custom-music-player">
    <div class="player-container" :class="{ 'playing': isPlaying }">
      <!-- 主控制球 -->
      <div class="music-ball">
        <!-- 圆形进度条 -->
        <div class="circular-progress">
          <svg class="progress-ring" width="50" height="50">
            <circle class="progress-ring-track" cx="25" cy="25" r="20"></circle>
            <circle class="progress-ring-bar" cx="25" cy="25" r="20" 
                    :stroke-dasharray="circumference" 
                    :stroke-dashoffset="progressOffset"></circle>
          </svg>
        </div>
        
        <!-- 播放按钮 -->
        <div class="play-button" @click="togglePlay">
          <svg v-if="!isPlaying" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
        </div>
        
        <div class="wave-animation">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>

    <!-- 音频元素 -->
    <audio 
      ref="audioRef" 
      @timeupdate="updateProgress"
      @loadedmetadata="updateDuration"
      @error="handleError"
      preload="metadata"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useData } from 'vitepress'

const { site } = useData()
const config = site.value.themeConfig.customMusicPlayer || {}

// 响应式数据
const audioRef = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)

// 计算属性
const playlist = computed(() => {
  if (config.src) {
    return [{ name: '音频播放', src: config.src }]
  }
  return config.list || []
})

const currentSong = computed(() => playlist.value[0])
const showPlayer = computed(() => config.enable && playlist.value.length > 0)
const progress = computed(() => duration.value ? (currentTime.value / duration.value) * 100 : 0)

// 圆形进度条计算
const circumference = computed(() => 2 * Math.PI * 20)
const progressOffset = computed(() => circumference.value - (progress.value / 100) * circumference.value)

// 方法
const togglePlay = () => {
  if (!audioRef.value || !currentSong.value) return
  
  if (isPlaying.value) {
    audioRef.value.pause()
  } else {
    audioRef.value.play()
  }
  isPlaying.value = !isPlaying.value
}

const updateProgress = () => {
  if (audioRef.value) {
    currentTime.value = audioRef.value.currentTime
  }
}

const updateDuration = () => {
  if (audioRef.value) {
    duration.value = audioRef.value.duration
  }
}

const handleError = (e) => {
  console.error('音频播放错误:', e)
}

// 生命周期
onMounted(() => {
  if (showPlayer.value && currentSong.value) {
    audioRef.value.src = currentSong.value.src
    
    if (config.autoplay) {
      togglePlay()
    }
  }
})

// 监听当前歌曲变化
watch(currentSong, (newSong) => {
  if (newSong && audioRef.value) {
    audioRef.value.src = newSong.src
  }
})
</script>

<style scoped>
.custom-music-player {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.player-container {
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.music-ball {
  width: 50px;
  height: 50px;
  background: #1B1B1F;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  position: relative;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.music-ball:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 20px rgba(100, 108, 255, 0.4);
}

.circular-progress {
  position: absolute;
  top: -2px;
  left: -2px;
  width: 54px;
  height: 54px;
  pointer-events: none;
  z-index: 2;
}

.progress-ring {
  transform: rotate(-90deg);
}

.progress-ring-track {
  fill: transparent;
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 2;
}

.progress-ring-bar {
  fill: transparent;
  stroke: #646cff;
  stroke-width: 2;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.3s ease;
}

.play-button {
  color: white;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wave-animation {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.playing .wave-animation {
  opacity: 1;
}

.wave-animation span {
  width: 2px;
  height: 16px;
  background: rgba(255, 255, 255, 0.4);
  display: block;
  animation: none;
}

.playing .wave-animation span {
  animation: wave 0.8s infinite ease-in-out;
}

.playing .wave-animation span:nth-child(1) {
  animation-delay: 0s;
}

.playing .wave-animation span:nth-child(2) {
  animation-delay: 0.15s;
}

.playing .wave-animation span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes wave {
  0%, 100% {
    transform: scaleY(0.3);
    opacity: 0.6;
  }
  50% {
    transform: scaleY(1);
    opacity: 1;
  }
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .music-ball {
    background: #1B1B1F;
    border: 2px solid rgba(255, 255, 255, 0.1);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .custom-music-player {
    bottom: 15px;
    left: 15px;
  }
  
  .music-ball {
    width: 45px;
    height: 45px;
  }
}
</style> 