# Hello Minecraft Sever Launcher

## 简介

HMSL 是一款 Minecraft 服务器启动器, 支持 Mod 管理, 参数自定义, 游戏自动安装 (Forge, Fabric), 安装插件, 界面自定义等功能.
目前只支持Windows系统，以后会支持其他平台.

## 插件

您可以通过安装插件实现对整个软件的自定义。<br>
[API文档](https://www.hxgfk.com/hmsl/plugins/apidoc)

## 下载

请暂时从Github下载项目源代码自己构建或者下载正式版，作者后续会制作官网.

## 开源协议

该程序在 [GPLv3](https://www.gnu.org/licenses/gpl-3.0.html) 开源协议下发布.

## 贡献

如果您想提交一个 Pull Request, 必须遵守如下要求:

* IDE: 任意
* **不要**修改 `package.json和forge.config.js` 相关文件

### 构建
**要安装[NodeJS](https://nodejs.org/zh-cn)环境**<br>
于项目根目录执行以下命令:<br>
```bash
./download_deps.bat
./npm run make
```