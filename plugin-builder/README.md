# 插件指南
* 也可以当文档

## 需要包含的文件
* manifest.json -- 清单文件 **必须**

## manifest.json的格式

相关键的作用：
* css -- 添加自己的css文件
* js -- js文件相关
* js.main -- 作用在主线程的代码，包含你自己的初始化逻辑
* js.renderer -- 作用在渲染器线程的逻辑，包含你的作用在渲染器线程的逻辑，可以添加多个文件，此项是一个数组，加载顺序由你的数组顺序而定

### js.renderer的元素格式
相关键的作用：
* path -- 你的js文件路径
* loadin -- 应该在什么时候加载，值有"before": 在内容加载前加载脚本，"after": 内容加载后加载脚本。渲染器脚本应该在内容加载后进行加载也就是"after"

```json
{
  "js": {
    "renderers": [
      {
        "path": "my_renderer1.js",
        "loadin": "after"
      }
    ]
  }
}
```

示例：
```json
{
  "name": "HelloWorld",
  "version": "1.0",
  "description": "Hello World Plugin",
  "css": ["plugin.css"],
  "js": {
    "main": "main.js",
    "renderers": [
      {
        "path": "my_data1.js",
        "loadin": "before"
      },
      {
        "path": "my_renderer1.js",
        "loadin": "after"
      }
    ]
  }
}
```

## main.js的API
* 在作用在主线程的js文件中
> 使用`registryEventListener()`函数注册在主线程的事件监听器
>> 可事件有AppInit, AppExit<br>
> **AppInit** -- 在App初始化的时候开始触发<br>
> **AppExit** -- 在App退出的时候触发

代码示例：
```js
registryEventListener("AppInit", function (e) {
    logger.info("Plugin","app init");
});

registryEventListener("AppExit", function (e) {
    logger.info("Plugin", "app exit");
});
```