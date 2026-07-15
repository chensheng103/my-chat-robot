import { runJavaScript } from "./index.js"
// 执行普通打印代码
const res = runJavaScript("console.log('测试123');console.warn('警告信息')")
console.log("打印日志结果：",res.logs)
console.log("报错：",res.error)