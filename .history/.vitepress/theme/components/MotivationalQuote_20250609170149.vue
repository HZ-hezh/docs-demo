<template>
  <div class="motivational-quote">
    <div class="quote-container">
      <div class="quote-icon">
        <svg t="1749122200000" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
          <path d="M853.333333 853.333333H170.666667c-46.933333 0-85.333333-38.4-85.333334-85.333333V256c0-46.933333 38.4-85.333333 85.333334-85.333333h682.666666c46.933333 0 85.333333 38.4 85.333334 85.333333v512c0 46.933333-38.4 85.333333-85.333334 85.333333zM170.666667 256v512h682.666666V256H170.666667z" fill="#1296db"></path>
          <path d="M341.333333 426.666667c-23.466667 0-42.666667-19.2-42.666666-42.666667s19.2-42.666667 42.666666-42.666667c70.4 0 128-57.6 128-128 0-23.466667 19.2-42.666667 42.666667-42.666666s42.666667 19.2 42.666667 42.666666c0 117.333333-95.466667 213.333333-213.333334 213.333334z" fill="#1296db"></path>
          <path d="M597.333333 426.666667c-23.466667 0-42.666667-19.2-42.666666-42.666667s19.2-42.666667 42.666666-42.666667c70.4 0 128-57.6 128-128 0-23.466667 19.2-42.666667 42.666667-42.666666s42.666667 19.2 42.666667 42.666666c0 117.333333-95.466667 213.333333-213.333334 213.333334z" fill="#1296db"></path>
        </svg>
      </div>
      <blockquote class="quote-text">{{ currentQuote.text }}</blockquote>
      <cite class="quote-author">—— {{ currentQuote.author }}</cite>
      <button @click="refreshQuote" class="refresh-btn" title="刷新语录">
        <svg t="1749122300000" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
          <path d="M512 85.333333C276.266667 85.333333 85.333333 276.266667 85.333333 512s190.933333 426.666667 426.666667 426.666667c177.066667 0 330.666667-108.8 394.666667-256 10.666667-21.333333 2.133333-46.933333-19.2-57.6-21.333333-10.666667-46.933333-2.133333-57.6 19.2C774.4 746.666667 651.733333 853.333333 512 853.333333c-187.733333 0-341.333333-153.6-341.333333-341.333333s153.6-341.333333 341.333333-341.333333c85.333333 0 164.266667 32 224 85.333333L661.333333 341.333333c-17.066667 17.066667-17.066667 42.666667 0 59.733334 17.066667 17.066667 42.666667 17.066667 59.733334 0l128-128c8.533333-8.533333 12.8-19.2 12.8-29.866667s-4.266667-21.333333-12.8-29.866667l-128-128c-17.066667-17.066667-42.666667-17.066667-59.733334 0-17.066667 17.066667-17.066667 42.666667 0 59.733334l74.666667 74.666666C662.4 149.333333 590.933333 85.333333 512 85.333333z" fill="#666"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const quotes = [
  { text: "成功不是终点，失败不是致命的：继续前进的勇气才是最重要的。", author: "温斯顿·丘吉尔" },
  { text: "生活中最重要的事情不是你所处的位置，而是你所朝着的方向。", author: "奥利弗·温德尔·霍姆斯" },
  { text: "不要等待机会，而要创造机会。", author: "乔治·萧伯纳" },
  { text: "唯一不可能的旅程是你从未开始的那一个。", author: "托尼·罗宾斯" },
  { text: "成功是从失败走向失败而热情不减的能力。", author: "温斯顿·丘吉尔" },
  { text: "你的时间有限，不要浪费时间活在别人的生活里。", author: "史蒂夫·乔布斯" },
  { text: "相信你能做到，你就已经成功了一半。", author: "西奥多·罗斯福" },
  { text: "困难不是阻止你的理由，它们是你成长的机会。", author: "约翰·F·肯尼迪" },
  { text: "做你害怕的事，恐惧就会死去。", author: "拉尔夫·沃尔多·爱默生" },
  { text: "不是因为事情困难我们不敢做，而是因为我们不敢做事情才变得困难。", author: "塞内卡" },
  { text: "每天都要做一些让未来的你感谢今天的你的事情。", author: "西恩·韦斯" },
  { text: "失败是成功之母，但低潮期是成功之父。", author: "迈克尔·乔丹" },
  { text: "学习永远不晚。", author: "索福克勒斯" },
  { text: "今天的努力，就是明天的奇迹。", author: "佚名" },
  { text: "路虽远行则必至，事虽难做则必成。", author: "荀子" }
]

const currentQuote = ref({})

const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * quotes.length)
  return quotes[randomIndex]
}

const refreshQuote = () => {
  currentQuote.value = getRandomQuote()
}

onMounted(() => {
  currentQuote.value = getRandomQuote()
})
</script>

<style scoped>
.motivational-quote {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.motivational-quote::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><polygon fill="%23ffffff08" points="0,1000 1000,0 1000,1000"/></svg>') no-repeat center center;
  background-size: cover;
}

.quote-container {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
}

.quote-icon {
  margin-bottom: 20px;
  opacity: 0.8;
}

.quote-text {
  font-size: 1.4rem;
  line-height: 1.6;
  margin: 0 0 20px 0;
  font-style: italic;
  font-weight: 300;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.quote-author {
  display: block;
  font-size: 1rem;
  opacity: 0.9;
  font-style: normal;
  margin-bottom: 30px;
}

.refresh-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
}

.refresh-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.refresh-btn:active {
  transform: translateY(0);
}

.refresh-btn svg {
  transition: transform 0.3s ease;
}

.refresh-btn:hover svg {
  transform: rotate(180deg);
}

@media (max-width: 768px) {
  .motivational-quote {
    padding: 30px 15px;
  }
  
  .quote-text {
    font-size: 1.2rem;
  }
  
  .quote-author {
    font-size: 0.9rem;
  }
}
</style> 