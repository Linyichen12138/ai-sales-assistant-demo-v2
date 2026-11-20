# AI 销售助手 · Demo v2

深色三栏 AI 销售工作台。React 19 + Vite + TypeScript + HashRouter + zustand。数据是确定性示例，不调用后端，也不调用外部 AI。

## 主站入口

本地开发打开后默认是工作台：

- 主工作台：`http://127.0.0.1:5173/#/w01`
- 页面路由：`#/w01` … `#/w07`、`#/w09` … `#/w24`。没有 `#/w08` 完成页。

根入口（GitHub Pages，源目录是本仓 `docs/`）：

- 主工作台：<https://linyichen12138.github.io/ai-sales-assistant-demo-v2/#/w01>
- 历史对照：<https://linyichen12138.github.io/ai-sales-assistant-demo-v2/v2-skeleton/>

`docs/index.html` 就是 Pages 部署文件，由下面的构建命令生成，并与同一提交里的 `src/workbench` 对应。合并到 `main` 后，现有 Pages 设置会发布它。本仓库不自行合并。

`/v2-skeleton/` 是更早的浅色多页骨架，只作对照，不算当前主站完成度。本仓库不修改旧仓 `ai-sales-assistant-demo`。

侧栏里没有终稿的入口（待分配、公海池、交付进度、打款前维护、复盘与管理、组长视角）点击后只说明未展开，不伪装成完成页。

## 开发

```bash
npm install
npm run dev        # http://127.0.0.1:5173/#/w01
npm run build      # dist/index.html（单文件）
npx tsc -p tsconfig.app.json --noEmit
```

## 回归

```bash
node scripts/wb-acceptance.mjs http://127.0.0.1:5173/
```

覆盖路径 A–F、上下文隔离、未确认不写入、审批后态、任务回流、失败重试/转人工，以及 390px / 430px 现场记录。截图和 23 项矩阵在 `docs/acceptance-20261120/`。

## 构建 Pages 产物

```bash
npm ci
npm run build:pages
```

`build:pages` 执行 `npm run build`，再把 `dist/index.html` 和 `dist/favicon.svg` 复制到 `docs/`。`vite.config.ts` 使用 `base: './'` 和 `vite-plugin-singlefile`，页面脚本与样式内联；图标是相对路径 `./favicon.svg`，跟站点目录走，不请求域名根路径。不要覆盖 `docs/v2-skeleton/`。

静态复核：

```bash
python3 -m http.server 4173 --directory docs
node scripts/wb-acceptance.mjs http://127.0.0.1:4173/
```

## 工作台目录

```
src/workbench/          三栏工作台（W01–W07、W09–W24）
src/workbench/fixtures.ts  禾川 / 华粮 / 鲜源示例口径
scripts/wb-acceptance.mjs  主站回归
docs/v2-skeleton/       历史对照，不计入主站
docs/acceptance-20261120/  本次验收截图与覆盖矩阵
```
