<template>
  <div v-if="showPlayer" class="custom-music-player">
    <!-- 全屏遮罩层，点击收缩播放器 -->
    <div 
      v-if="isExpanded" 
      class="overlay"
      @click="closePlayer"
    ></div>
    
    <div class="player-container" :class="{ 'expanded': isExpanded, 'playing': isPlaying }">
      <!-- 主控制球 -->
      <div class="music-ball">
        <!-- 圆形进度条 -->
        <div class="circular-progress" @click.stop>
          <svg class="progress-ring" width="50" height="50">
            <circle class="progress-ring-track" cx="25" cy="25" r="20"></circle>
            <circle class="progress-ring-bar" cx="25" cy="25" r="20" 
                    :stroke-dasharray="circumference" 
                    :stroke-dashoffset="progressOffset"></circle>
          </svg>
        </div>
        
        <!-- 播放按钮 -->
        <div class="play-button" @click.stop="togglePlay">
          <svg v-if="!isPlaying" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
        </div>
        
        <!-- 点击区域用于展开 -->
        <div class="expand-area" @click="toggleExpansion"></div>
        
        <!-- 悬浮控制按钮组 -->
        <div class="floating-controls" v-if="!isExpanded">
          <!-- 迷你进度条 -->
          <div class="mini-progress">
            <div class="mini-progress-bar" @click.stop="seekToMini">
              <div class="mini-progress-fill" :style="{ width: progress + '%' }"></div>
            </div>
          </div>
          
          <!-- 控制按钮组 -->
          <div class="control-buttons">
            <button @click.stop="previousSong" class="floating-btn" title="上一首">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>
            
            <button @click.stop="togglePlay" class="floating-btn play-pause-btn" title="播放/暂停">
              <svg v-if="!isPlaying" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            </button>
            
            <button @click.stop="nextSong" class="floating-btn" title="下一首">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
              </svg>
            </button>
            
            <button @click.stop="toggleExpansion" class="floating-btn" title="显示全貌">
              <svg viewBox="0 0 24 24" width="50" height="50" fill="currentColor">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="wave-animation">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <!-- 扩展面板 -->
      <div v-if="isExpanded" class="player-panel" @click.stop>
        <div class="current-song">
          <div class="song-info">
            <div class="song-name">{{ currentSong && currentSong.name || '暂无歌曲' }}</div>
            <div class="song-progress">
              <div class="progress-bar" @click="seekTo">
                <div class="progress-fill" :style="{ width: progress + '%' }"></div>
              </div>
              <div class="time-info">
                <span>{{ formatTime(currentTime) }}</span>
                <span>{{ formatTime(duration) }}</span>
              </div>
            </div>
          </div>
          
          <!-- 控制按钮组 -->
          <div class="controls">
            <button @click="previousSong" title="上一首" class="control-btn">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>
            
            <button @click="togglePlay" title="播放/暂停" class="control-btn play-pause">
              <svg v-if="!isPlaying" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            </button>
            
            <button @click="nextSong" title="下一首" class="control-btn">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
              </svg>
            </button>
            
            <!-- 下载按钮 -->
            <button @click="downloadCurrentSong" title="下载当前歌曲" class="control-btn download-btn">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </svg>
            </button>
            
            <!-- 音量控制 -->
            <div class="volume-control">
              <button @click="toggleMute" title="静音" class="control-btn">
                <svg v-if="!isMuted && volume > 0" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                </svg>
              </button>
              <input 
                type="range" 
                min="0" 
                max="100" 
                v-model="volume" 
                @input="updateVolume"
                class="volume-slider"
              />
            </div>
          </div>
        </div>

        <!-- 播放列表 -->
        <div v-if="playlist.length > 1" class="playlist">
          <div class="playlist-header">
            <span>播放列表 ({{ playlist.length }})</span>
            <button @click="downloadAll" title="下载全部" class="download-all-btn">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </svg>
              全部下载
            </button>
          </div>
          <div class="playlist-items">
            <div 
              v-for="(song, index) in playlist" 
              :key="index"
              :class="['playlist-item', { active: currentIndex === index }]"
              @click="playSong(index)"
            >
              <div class="song-item-info">
                <span class="song-name">{{ song.name }}</span>
                <span v-if="currentIndex === index && isPlaying" class="playing-indicator">♪</span>
              </div>
              <button 
                @click.stop="downloadSong(song)" 
                title="下载" 
                class="download-item-btn"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 音频元素 -->
    <audio 
      ref="audioRef" 
      @timeupdate="updateProgress"
      @loadedmetadata="updateDuration"
      @ended="nextSong"
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
const isExpanded = ref(false)
const currentIndex = ref(0)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(100)
const isMuted = ref(false)

// 计算属性
const playlist = computed(() => {
  if (config.src) {
    return [{ name: '音频播放', src: config.src }]
  }
  return config.list || []
})

const currentSong = computed(() => playlist.value[currentIndex.value])
const showPlayer = computed(() => config.enable && playlist.value.length > 0)
const progress = computed(() => duration.value ? (currentTime.value / duration.value) * 100 : 0)

// 圆形进度条计算
const circumference = computed(() => 2 * Math.PI * 20) // 半径20的圆周长
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

const toggleExpansion = () => {
  isExpanded.value = !isExpanded.value
}

const closePlayer = () => {
  isExpanded.value = false
}

const playSong = (index) => {
  if (index === currentIndex.value && isPlaying.value) {
    togglePlay()
    return
  }
  
  currentIndex.value = index
  if (audioRef.value && currentSong.value) {
    // 先暂停当前播放
    audioRef.value.pause()
    isPlaying.value = false
    
    // 设置新的音源
    audioRef.value.src = currentSong.value.src
    
    // 监听音频加载完成事件
    const handleCanPlay = () => {
      audioRef.value.removeEventListener('canplay', handleCanPlay)
      // 音频加载完成后自动播放
      const playPromise = audioRef.value.play()
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isPlaying.value = true
          console.log('播放列表歌曲自动播放成功')
        }).catch(error => {
          console.error('播放列表歌曲自动播放失败:', error)
          isPlaying.value = false
        })
      }
    }
    
    audioRef.value.addEventListener('canplay', handleCanPlay)
    audioRef.value.load()
  }
}

const nextSong = () => {
  console.log('当前索引:', currentIndex.value, '播放列表长度:', playlist.value.length)
  
  const nextIndex = (currentIndex.value + 1) % playlist.value.length
  console.log('计算的下一首索引:', nextIndex)
  
  currentIndex.value = nextIndex
  
  if (audioRef.value && currentSong.value) {
    console.log('切换到下一首:', currentSong.value.name)
    
    // 先暂停当前播放
    audioRef.value.pause()
    isPlaying.value = false
    
    // 设置新的音源
    audioRef.value.src = currentSong.value.src
    
    // 监听音频加载完成事件
    const handleCanPlay = () => {
      audioRef.value.removeEventListener('canplay', handleCanPlay)
      // 音频加载完成后自动播放
      const playPromise = audioRef.value.play()
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isPlaying.value = true
          console.log('下一首自动播放成功:', currentSong.value.name)
        }).catch(error => {
          console.error('下一首自动播放失败:', error)
          isPlaying.value = false
        })
      }
    }
    
    audioRef.value.addEventListener('canplay', handleCanPlay)
    audioRef.value.load()
  }
}

const previousSong = () => {
  console.log('当前索引:', currentIndex.value, '播放列表长度:', playlist.value.length)
  
  const prevIndex = currentIndex.value === 0 ? playlist.value.length - 1 : currentIndex.value - 1
  console.log('计算的上一首索引:', prevIndex)
  
  // 获取上一首歌曲信息
  const prevSong = playlist.value[prevIndex]
  console.log('上一首歌曲信息:', prevSong ? prevSong.name : '未找到')
  
  if (!prevSong) {
    console.error('无法找到上一首歌曲')
    return
  }
  
  // 更新索引
  currentIndex.value = prevIndex
  
  if (audioRef.value) {
    console.log('切换到上一首:', prevSong.name)
    
    // 先暂停当前播放
    audioRef.value.pause()
    isPlaying.value = false
    
    // 设置新的音源
    audioRef.value.src = prevSong.src
    
    // 监听音频加载完成事件
    const handleCanPlay = () => {
      audioRef.value.removeEventListener('canplay', handleCanPlay)
      // 音频加载完成后自动播放
      const playPromise = audioRef.value.play()
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isPlaying.value = true
          console.log('上一首自动播放成功:', prevSong.name)
        }).catch(error => {
          console.error('上一首自动播放失败:', error)
          isPlaying.value = false
        })
      }
    }
    
    audioRef.value.addEventListener('canplay', handleCanPlay)
    audioRef.value.load()
  }
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

const updateVolume = () => {
  if (audioRef.value) {
    audioRef.value.volume = volume.value / 100
    isMuted.value = volume.value === 0
  }
}

const toggleMute = () => {
  if (audioRef.value) {
    if (isMuted.value) {
      volume.value = 50
      audioRef.value.volume = 0.5
    } else {
      volume.value = 0
      audioRef.value.volume = 0
    }
    isMuted.value = !isMuted.value
  }
}

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const handleError = (e) => {
  console.error('音频播放错误:', e)
  nextSong()
}

// 进度条拖动功能
const isDragging = ref(false)

const seekTo = (event) => {
  if (!audioRef.value || !duration.value) return
  
  const progressBar = event.currentTarget
  const rect = progressBar.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = clickX / rect.width
  const newTime = percentage * duration.value
  
  audioRef.value.currentTime = newTime
  currentTime.value = newTime
}

// 迷你进度条拖动功能
const seekToMini = (event) => {
  if (!audioRef.value || !duration.value) return
  
  const progressBar = event.currentTarget
  const rect = progressBar.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = clickX / rect.width
  const newTime = percentage * duration.value
  
  audioRef.value.currentTime = newTime
  currentTime.value = newTime
}

// 优化的下载功能
const downloadSong = (song) => {
  console.log('立即开始下载:', song.name, song.src)
  
  // 立即创建下载链接，减少延迟
  const link = document.createElement('a')
  link.href = song.src
  link.download = `${song.name}.${getFileExtension(song.src)}`
  link.target = '_blank'
  link.style.display = 'none'
  
  document.body.appendChild(link)
  
  // 立即触发下载
  setTimeout(() => {
    link.click()
    document.body.removeChild(link)
    console.log('下载已触发')
  }, 100) // 减少延迟到100ms
}

const downloadCurrentSong = () => {
  if (currentSong.value) {
    console.log('下载当前歌曲:', currentSong.value)
    downloadSong(currentSong.value)
  } else {
    console.log('没有当前歌曲')
    alert('没有正在播放的歌曲')
  }
}

const downloadAll = async () => {
  console.log('开始批量下载，共', playlist.value.length, '首歌曲')
  
  if (playlist.value.length === 0) {
    alert('播放列表为空')
    return
  }
  
  if (!confirm(`确定要下载全部 ${playlist.value.length} 首歌曲吗？`)) {
    return
  }
  
  for (let i = 0; i < playlist.value.length; i++) {
    const song = playlist.value[i]
    console.log(`下载第 ${i + 1} 首:`, song.name)
    
    downloadSong(song)
    // 添加延迟避免服务器压力
    await new Promise(resolve => setTimeout(resolve, 1500))
  }
  
  console.log('批量下载完成')
}

const getFileExtension = (url) => {
  const extension = url.split('.').pop().split('?')[0]
  return extension || 'mp3'
}

// 生命周期
onMounted(() => {
  if (showPlayer.value && currentSong.value) {
    audioRef.value.src = currentSong.value.src
    audioRef.value.volume = volume.value / 100
    
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

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 999;
  backdrop-filter: blur(2px);
}

.player-container {
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1001;
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
  overflow: visible;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.expand-area {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  z-index: 1;
}

.music-ball:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 20px rgba(100, 108, 255, 0.4);
}

.music-ball:hover .floating-controls {
  opacity: 1;
  visibility: visible;
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

.player-panel {
  position: absolute;
  bottom: 60px;
  left: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  padding: 16px;
  min-width: 300px;
  max-width: 380px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(60, 60, 60, 0.12);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.current-song {
  margin-bottom: 12px;
}

.song-info {
  margin-bottom: 12px;
}

.song-name {
  font-weight: 600;
  color: #213547;
  font-size: 15px;
  margin-bottom: 8px;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-progress {
  margin-bottom: 8px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(60, 60, 60, 0.12);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
  position: relative;
  cursor: pointer;
}

.progress-fill {
  height: 100%;
  background: #646cff;
  transition: width 0.1s ease;
  pointer-events: none;
  border-radius: 3px;
}

.time-info {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #476582;
}

.controls {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
}

.control-btn {
  background: rgba(100, 108, 255, 0.1);
  border: none;
  border-radius: 6px;
  padding: 6px;
  cursor: pointer;
  color: #646cff;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn:hover {
  background: rgba(100, 108, 255, 0.15);
  transform: scale(1.05);
}

.play-pause {
  background: #646cff;
  color: white;
}

.play-pause:hover {
  background: #4f46e5;
}

.download-btn {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.download-btn:hover {
  background: rgba(34, 197, 94, 0.2);
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}

.volume-slider {
  width: 50px;
  height: 3px;
  background: rgba(60, 60, 60, 0.12);
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 10px;
  height: 10px;
  background: #646cff;
  border-radius: 50%;
  cursor: pointer;
}

.playlist {
  border-top: 1px solid rgba(60, 60, 60, 0.12);
  padding-top: 12px;
}

.playlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-weight: 600;
  color: #213547;
  font-size: 13px;
}

.download-all-btn {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  border: none;
  border-radius: 4px;
  padding: 3px 6px;
  cursor: pointer;
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 3px;
  transition: all 0.2s ease;
}

.download-all-btn:hover {
  background: rgba(34, 197, 94, 0.2);
}

.playlist-items {
  max-height: 180px;
  overflow-y: auto;
}

.playlist-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 2px;
}

.playlist-item:hover {
  background: rgba(100, 108, 255, 0.1);
}

.playlist-item.active {
  background: rgba(100, 108, 255, 0.15);
  color: #646cff;
}

.song-item-info {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.song-item-info .song-name {
  font-size: 13px;
  font-weight: normal;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.playing-indicator {
  color: #646cff;
  font-size: 12px;
  animation: pulse 1s infinite;
  flex-shrink: 0;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.download-item-btn {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  border: none;
  border-radius: 4px;
  padding: 3px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.download-item-btn:hover {
  background: rgba(34, 197, 94, 0.2);
  transform: scale(1.1);
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .music-ball {
    background: #1B1B1F;
    border: 2px solid rgba(255, 255, 255, 0.1);
  }
  
  .floating-controls {
    background: rgba(27, 27, 31, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.15);
  }
  
  .mini-progress-bar {
    background: rgba(255, 255, 255, 0.15);
  }
  
  .player-panel {
    background: rgba(30, 30, 30, 0.95);
    border: 1px solid rgba(229, 229, 229, 0.12);
  }
  
  .song-name {
    color: #f6f6f7;
  }
  
  .playlist-header {
    color: #f6f6f7;
  }
  
  .time-info {
    color: #a1a1aa;
  }
  
  .progress-bar {
    background: rgba(229, 229, 229, 0.12);
  }
  
  .volume-slider {
    background: rgba(229, 229, 229, 0.12);
  }
  
  .playlist {
    border-top: 1px solid rgba(229, 229, 229, 0.12);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .custom-music-player {
    bottom: 15px;
    left: 15px;
  }
  
  .player-panel {
    min-width: 260px;
    max-width: 280px;
    padding: 12px;
  }
  
  .music-ball {
    width: 45px;
    height: 45px;
  }
  
  .controls {
    gap: 4px;
  }
  
  .control-btn {
    padding: 5px;
  }
}

.floating-controls {
  position: absolute;
  left: 60px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  pointer-events: auto;
  background: rgba(27, 27, 31, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.mini-progress {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 120px;
}

.mini-progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
}

.mini-progress-fill {
  height: 100%;
  background: #646cff;
  transition: width 0.1s ease;
  pointer-events: none;
  border-radius: 3px;
}

.control-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.floating-btn {
  position: relative;
  width: 20px;
  height: 28px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  flex-shrink: 0;
}

.floating-btn:hover {
  color: #646cff;
}
</style> 