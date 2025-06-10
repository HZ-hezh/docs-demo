<template>
  <div class="footer-quote">
    <p>{{ currentQuote.text }}</p>
    <p class="author">—— {{ currentQuote.author }}</p>
    <button @click="refreshQuote">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M23 4v6h-6M1 20v-6h6"/>
        <path d="M3.5 9a9 9 0 0 1 14-5M20.5 15a9 9 0 0 1-14 5"/>
      </svg>
      换一句
    </button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const quotes = [
      { text: "代码的世界里，bug是通向完美的阶梯", author: "编程哲学" },
      { text: "不是看到了希望才坚持，而是坚持了才看到希望", author: "技术人箴言" },
      { text: "每个成功的项目，都始于一个勇敢的commit", author: "Git哲学" },
      { text: "调试代码的痛苦终将化为解决问题的喜悦", author: "开发者心语" },
      { text: "代码如诗，既要逻辑严谨又要充满想象力", author: "《编程之美》" },
      { text: "在算法的海洋里，坚持是唯一的航标", author: "ACM箴言" },
      { text: "重构不是重写，而是让代码重获新生", author: "重构之道" }
    ]

    const currentQuote = ref({ text: '', author: '' })

    const refreshQuote = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length)
      currentQuote.value = quotes[randomIndex]
      
      // 存储到localStorage以便刷新页面保持相同语录
      localStorage.setItem('motivationalQuote', JSON.stringify(currentQuote.value))
    }

    onMounted(() => {
      const savedQuote = localStorage.getItem('motivationalQuote')
      savedQuote 
        ? currentQuote.value = JSON.parse(savedQuote)
        : refreshQuote()
    })

    return { currentQuote, refreshQuote }
  }
}
</script>

<style scoped>
.footer-quote {
  text-align: center;
  padding: 12px 0;
  border-top: 1px solid var(--vp-c-divider-light);
  transition: all 0.3s ease;
}

p {
  margin: 0;
  font-size: 15px;
  color: var(--vp-c-text-1);
  line-height: 1.6;
}

.author {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin-bottom: 8px !important;
}

button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--vp-button-alt-bg);
  color: var(--vp-button-alt-text);
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 13px;
  border: 1px solid var(--vp-c-divider);
  cursor: pointer;
  transition: all 0.2s;
}

button:hover {
  background: var(--vp-button-alt-hover-bg);
  border-color: var(--vp-c-divider-light);
}

@media (max-width: 768px) {
  p {
    font-size: 14px;
  }
}
</style>