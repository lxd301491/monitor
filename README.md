# 前端监控（Monitor）个人练手项目

## 使用方法

```
npm install pa-monitor --save-dev

main.js
import * as PAMonitor from 'pa-monitor';

var center = new PAMonitor.MonitorCenter();

var globalErrorHook = center.launchHook(
  PAMonitor.HOOK_TYPE.GlobalErrorHook,
  [center, "http://www.baidu.com"]
);
```
