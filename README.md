# Slider Captcha Simulator

一个基于 `Node.js + HTML5 Canvas + Vanilla JavaScript` 的本地滑动拼图验证码仿真系统，用于本地调试、交互演示和仿真环境集成。

项目当前实现了：

- 本地静态服务，默认运行在 `http://localhost:4173`
- 五边形拼块抠图与 Canvas 渲染
- 真实槽位 + 迷惑槽位的双目标题面
- 每次生成时随机位置与随机倾斜角度
- `±5px` 容差校验
- 验证失败后的回弹动画
- 始终可点击的“刷新验证码”按钮
- 背景图加载失败时自动回退到本地占位图
- 使用 `node:test` 的自动化测试

## Demo Behavior

页面中会出现：

- 1 个可拖动的五边形拼块
- 1 个真实目标槽位
- 1 个迷惑槽位

只有拼块对齐真实槽位时才算验证成功。  
如果用户拖到迷惑槽位附近，视觉上会很像成功，但实际仍会失败并回弹。

点击“刷新验证码”后会重新生成整题，包括：

- 真实槽位位置
- 迷惑槽位位置
- 拼块/真实槽位角度
- 迷惑槽位角度
- 滑块状态与提示文案

## Tech Stack

- Node.js 内置 `http` 静态服务
- HTML5 Canvas
- Vanilla JavaScript ES Modules
- Node 原生测试框架 `node:test`

## Quick Start

### 1. 安装环境

确保本机已安装 Node.js 20+。

### 2. 启动项目

在项目根目录执行：

```powershell
npm run dev
```

然后打开：

[http://localhost:4173](http://localhost:4173)

### 3. 运行测试

```powershell
npm test
```

## Port Configuration

默认端口是 `4173`。如果端口被占用，可以临时覆盖：

```powershell
$env:PORT=4300
npm run dev
```

然后访问：

[http://localhost:4300](http://localhost:4300)

## Config

运行时配置位于 [public/js/config.js](G:/Test/public/js/config.js)。

当前主要配置项：

- `backgroundImageUrl`: 主背景图路径
- `fallbackBackgroundImageUrl`: 主图加载失败后的回退图
- `tolerancePx`: 验证通过容差，当前为 `5`
- `canvasWidth`: 画布宽度
- `canvasHeight`: 画布高度
- `sliderStartX`: 拼块起始 X 坐标
- `pieceRadius`: 五边形基础尺寸
- `padding`: 安全边距

## Project Structure

```text
G:\Test
├─ public
│  ├─ assets
│  ├─ js
│  │  ├─ captcha-interactions.js
│  │  ├─ captcha-logic.js
│  │  ├─ captcha-renderer.js
│  │  └─ config.js
│  ├─ app.js
│  ├─ index.html
│  └─ styles.css
├─ test
│  ├─ captcha-challenge-updates.test.js
│  ├─ captcha-logic.test.js
│  └─ server.test.js
├─ docs
├─ AGENTS.md
├─ package.json
└─ server.js
```

## Core Modules

- [server.js](G:/Test/server.js)
  - 提供本地静态资源服务
  - 支持 `PORT` 环境变量覆盖

- [public/js/captcha-logic.js](G:/Test/public/js/captcha-logic.js)
  - 负责几何生成、随机位置、随机角度、真假槽位数据
  - 负责拖动坐标换算和命中判定

- [public/js/captcha-renderer.js](G:/Test/public/js/captcha-renderer.js)
  - 负责 Canvas 绘制
  - 负责真实槽位、迷惑槽位和拼块的旋转渲染

- [public/js/captcha-interactions.js](G:/Test/public/js/captcha-interactions.js)
  - 负责滑块交互事件绑定
  - 负责拖动释放与刷新时的指针状态清理

- [public/app.js](G:/Test/public/app.js)
  - 负责挑战生成生命周期
  - 负责刷新按钮、状态提示、回弹动画与页面联动

## Validation Rules

- 比较的是拼块当前位置与真实槽位的 `X` 坐标差值
- 当前容差是 `±5px`
- 判定条件是 `delta <= tolerancePx`
- 失败时会回弹到起点
- 成功后滑块锁定，但仍可点击“刷新验证码”重新出题

## Notes

- 项目内置了示例背景图与占位背景图，无需额外资源即可运行
- 如果你后续要接入正式背景图，只需要改 [public/js/config.js](G:/Test/public/js/config.js)
- 当前仓库适合做本地 demo、测试桩、行为仿真和验证码交互研究

