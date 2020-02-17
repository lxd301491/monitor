# 前端监控（Monitor）个人练手项目

## 使用方法

```
npm install jerry-monitor --save-dev

main.js
import { lifeCycle, MonitorCenter } from 'jerry-monitor';

lifeCycle.track.before = function(data) {
  console.log("track before", event,data);
}
lifeCycle.consume.before = function(data) {
  console.log("consume before", event,data);
}
var center = new MonitorCenter("test");
center.subscribe("https://localhost:8080");
center.start();
center.hooks.watch("error");
center.hooks.watch("uncaught");
center.hooks.watch("action");
center.hooks.watch("performance");
center.hooks.watch("spa");
```
