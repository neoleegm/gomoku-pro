# 新人上手指南（Gomoku Pro）

## 1. 项目是做什么的

Gomoku Pro 是一个基于 React + TypeScript + Vite 的前端五子棋项目，支持：

- 本地双人（PVP）
- 人机对战（PVE）
- 三档 AI 难度（easy / medium / hard）
- 悔棋、音效、响应式界面

## 2. 整体架构

- `client/`：前端应用（主要代码都在这里）
  - `src/pages/Home.tsx`：游戏主页面与核心状态流转
  - `src/lib/gomokuLogic.ts`：规则引擎（落子、判胜、悔棋、重置）
  - `src/lib/gomokuAI.ts`：AI 决策（启发式 + negamax/alpha-beta）
  - `src/components/`：棋盘与控制面板等界面组件
  - `src/hooks/useGameAudio.ts`：Web Audio 音效
  - `src/lib/analytics.ts`：按环境变量注入 Umami 脚本
- `server/index.ts`：生产环境静态资源服务 + SPA 路由回退
- `shared/`：预留共享常量

## 3. 关键调用链（建议先理解）

1. `Home.tsx` 持有 `GameState`。
2. 用户点击棋盘 -> `handleCellClick` -> `makeMove(...)`。
3. 若是 PVE 且轮到 AI：`useEffect` 触发 `getAIMove(...)`，再调用 `makeMove(...)`。
4. `GomokuBoard` 根据 `gameState.board` 渲染 15x15 网格。
5. `GamePanel` 管理模式、难度、执子方、悔棋、新局、音效开关。

## 4. 代码阅读优先级

1. `client/src/lib/gomokuLogic.ts`
   - 理解数据结构：`GameState` / `GameMove`
   - 理解纯函数：`initializeGame`、`makeMove`、`undoMove`、`checkWin`
2. `client/src/pages/Home.tsx`
   - 理解状态驱动 UI + AI 回合调度
3. `client/src/lib/gomokuAI.ts`
   - 先看 easy/medium，再看 hard 的搜索与剪枝
4. `client/src/components/GomokuBoard.tsx` + `GamePanel.tsx`
   - 把规则层映射到 UI 交互
5. `client/src/lib/gomokuLogic.test.ts`
   - 用测试反向理解行为边界

## 5. 后续学习建议

- 第 1 周：只改 UI（样式、文案、布局），不动规则层。
- 第 2 周：给规则层增加测试，再做小功能（如状态提示优化）。
- 第 3 周：尝试 AI 参数微调（候选点数量、深度、评分权重），并记录性能变化。

建议遵循：

- 规则逻辑优先写成纯函数，并补 Vitest。
- 组件只做展示和交互转发，避免在组件里夹杂复杂规则。
- 任何影响回合流转的改动，必须覆盖 `pvp`、`pve(人先手)`、`pve(AI先手)` 三种场景。
