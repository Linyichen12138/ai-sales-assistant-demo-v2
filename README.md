# AI 销售助手 · 前端交互 Demo（v1）

纯前端可交互演示：React 19 + Vite + TypeScript + react-router（HashRouter）+ zustand。
所有数据为 Mock（`src/mock/data.ts`），不连任何后端。

## 快速打开（无需安装）
直接双击 / 浏览器打开 `dist/index.html`（单文件，已内联 JS/CSS/图片，file:// 可用）。
建议 Chrome / Edge，窗口 ≥ 1280 宽；PC 端页面按 1920×1080 画布等比缩放。

## 开发
```bash
npm install
npm run dev        # http://localhost:5173/
npm run build      # 产物 dist/index.html（vite-plugin-singlefile，base './'）
npx tsc -p tsconfig.app.json --noEmit   # 类型检查
```

## 自测脚本（需 playwright chromium）
```bash
node scripts/e2e.mjs                                   # 对 dev 服务跑 16 步主链路 + 导览
node scripts/e2e.mjs "file://$PWD/dist/index.html"     # 对打包产物跑
node scripts/shot.mjs <name> <hashPath> [phone|pc]     # 单页截图
```
截图输出到 `screenshots/`。

## 演示方式
- 顶部 **角色栏**：切换「销售顾问 / 张顾问」（手机端 375×812）与「销售经理 / 陈经理」（PC 深色）。两端共享状态：
  手机端标记卡点 → 作战室高亮；PC 发送远程指导 → 手机端弹出；回写反馈后意向 82→85、风险 待核查→已回应。
- 右下 **演示导览**：16 步列表，可跳到任意一步（自动补齐前置状态），「重置演示」恢复初始。
- 状态保存在 localStorage（`ai-sales-demo-v1`），刷新不丢；重置即清空。

## 16 步主链路
| # | 页面 | 动作 |
|---|---|---|
| 1 | C-01 工作台 | 今日到访 林女士 |
| 2 | C-02 签到授权 | 同意授权 → 签到 → 预测生成 |
| 3 | C-02 预测结果（含 /screen/c02 大屏） | 置信度 82% → 生成接待准备 |
| 4 | C-03 接待准备（首访） | 查看产品知识 |
| 5 | C-10 查信息 / 学方法 / 用金句 | AI 改写 → 开始接待 |
| 6 | C-04 接待中 | 标记卡点 → 切换经理 |
| 7 | M-02 AI 作战室 | 林女士高亮 → 详情 |
| 8 | M-03 实时详情 | 风险证据 → 发送远程指导 |
| 9 | C-04 收到指导 | 查看资料 → 结束接待（摘要） |
| 10 | C-06 AI 名片 / AI 分身 | 手机号授权 → 轨迹 |
| 11 | C-05 智能盘客 | 采纳 → 成员意见 → 纪要 → 生成跟进任务 |
| 12 | S-01 客户详情 | 跟进任务（工作台 +2） |
| 13 | S-01 回写反馈 | 重新计算意向 82→85 → C-03 复访准备 |
| 14 | M-04 接待分析报告 | 服务分 88、风险已回应、生成改进任务 |
| 15 | M-05 销售四象限 | 张顾问 → 创建辅导计划 |
| 16 | M-01 经营驾驶舱 | 四盘一控 / 本周经营建议 / 意向 A |

## 目录
```
src/mock/data.ts        全部 Mock 数据（客户 CUST-001 林女士、张顾问、陈经理）
src/store/demo.ts       zustand 演示状态 + 导览步骤前置状态
src/pages/phone/*       C-01/02/03/04/05/06/10、我的
src/pages/pc/*          M-01~05、预测大屏
src/pages/shared/S01    客户详情（手机 / PC 两种外观）
src/components/*        外框、角色栏、导览、图表（SVG 手绘，无图表库）
scripts/e2e.mjs         16 步自动化自测
```
