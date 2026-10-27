/**
 * [AI 完成说明]
 * 功能：提供可复用的倒计时能力。
 * 关键内容：AI 修复重复启动会创建多个计时器的问题，
 * 并保证倒计时归零后停止、组件卸载时释放计时器。
 * 完成者：AI（Codex）
 */
import { computed,onUnmounted,ref } from "vue";
import dayjs from "dayjs";

export const useCountDown = () => {
  // 响应式的数据
  let timer = null
  const time = ref(0)
  // 格式化时间 为 xx分xx秒
  const formatTime = computed(() => dayjs.unix(time.value).format('mm分ss秒'))

  // [AI] 统一停止计时器，避免登录页和支付页出现多个 interval
  const stop = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  // 开启倒计时的函数
  const start = (currentTime) => {
    // 开始倒计时的逻辑
    // 核心逻辑：每s减1
    stop()
    time.value = currentTime
    timer = setInterval(() => {
      time.value = Math.max(0, time.value - 1)
      if (time.value === 0) {
        stop()
      }
    }, 1000)
  }

  // 组件销毁时，清除定时器
  onUnmounted(stop)

  return {
    time,
    formatTime,
    start,
    stop
  }
}


