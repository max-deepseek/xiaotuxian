import httpInstance from "@/utils/http"
 
export function getCategoryAPI() {
  // 这里的getCategory方法，得和main.js中的方法名一致
  return httpInstance({
    // 完整的URL是 http://pcapi-xiaotuxian-front-devtest.itheima.net/home/category/head
    // 这里的url是相对路径，会自动拼接到baseURL后面
    url: 'home/category/head'
  })
}