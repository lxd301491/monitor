# 前端监控（Monitor）个人练手项目

## 使用方法

```
npm install jerry-monitor --save-dev

main.js
import * as PAMonitor from 'jerry-monitor';

PAMonitor.lifeCycle.track.before = function(data) {
  console.log("track before", event,data);
}
PAMonitor.lifeCycle.consume.before = function(data) {
  console.log("consume before", event,data);
}
var center = new PAMonitor.MonitorCenter("test");
center.subscribe("https://www.baidu.com").start(10000, {
  size: 30,
  zip: true
});
center.getHooks().watch("error");
center.getHooks().watch("uncaught");
center.getHooks().watch("action");
center.getHooks().watch("performance");
center.getHooks().watch("spa");
```
