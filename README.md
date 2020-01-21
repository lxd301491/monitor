# 前端监控（Monitor）个人练手项目

## 使用方法

```
npm install jerry-monitor --save-dev

import { lifeCycle, MonitorCenter } from 'jerry-monitor';

lifeCycle.Monitor.lifeCycle.track.before = function(data) {
  console.log("track before", data);
}
lifeCycle.Monitor.lifeCycle.consume.before = function(data) {
  console.log("consume before", data);
}
var center = new lifeCycle.Monitor.MonitorCenter("test");
center.start({
  period:10000,
  size: 30,
  zip: true
})
center.subscribe("https://www.baidu.com", "images");
center.subscribe("https://www.youku.com", "xhr");
center.watch("error");
center.watch("uncaught");
center.watch("action");
center.watch("performance");
center.watch("spa");
```

```
<script src="../dist/monitor.cjc.min.js"></script>

Monitor.lifeCycle.track.before = function(data) {
  console.log("track before", data);
}
Monitor.lifeCycle.consume.before = function(data) {
  console.log("consume before", data);
}
var center = new Monitor.MonitorCenter("test");
center.start({
  period:10000,
  size: 30,
  zip: true
})
center.subscribe("https://www.baidu.com", "images");
center.subscribe("https://www.youku.com", "xhr");
center.watch("error");
center.watch("uncaught");
center.watch("action");
center.watch("performance");
center.watch("spa");
```
