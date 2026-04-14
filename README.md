# Gomoku Pro - 五子棋 / Five in a Row

Gomoku Pro 是一个基于 **React 19**、**TypeScript** 和 **Tailwind CSS 4** 构建的现代五子棋网页游戏。它支持本地双人对战、人机对战、三档 AI 难度、悔棋、音效和响应式棋盘界面。

Gomoku Pro is a modern browser-based Gomoku game built with **React 19**, **TypeScript**, and **Tailwind CSS 4**. It supports local two-player matches, Player vs AI, three AI difficulty levels, undo, sound cues, and a responsive board UI.

## 功能 / Features

**核心玩法 / Core Gameplay**
- 15 x 15 经典五子棋棋盘。 / Classic 15 x 15 Gomoku board.
- 本地双人对战：黑棋对白棋。 / Local two-player mode: Black vs White.
- 人机对战：简单、中等、困难三档 AI。 / Player vs AI mode with Easy, Medium, and Hard difficulties.
- 可选择执黑先手或执白后手；执白时 AI 自动先下。 / Choose to play Black first or White second; when playing White, the AI opens automatically.
- 自动胜负检测：横、竖、双斜线任意五连获胜。 / Automatic win detection across horizontal, vertical, and both diagonal directions.
- 走棋历史、最后一步标记和 AI 最近一步标记。 / Move history, last-move markers, and AI move markers.
- PvP 悔一步，PvE 悔玩家和 AI 最近一轮。 / PvP undo removes one move; PvE undo removes the latest player/AI turn pair.
- 新局保留当前模式、难度和执棋方设置。 / New Game keeps the current mode, difficulty, and side settings.

**体验设计 / User Experience**
- 淡黄木纹棋盘和暖棕色格线，棋子对比清晰。 / Pale-yellow wood grain board with warm brown grid lines and clear stone contrast.
- 桌面与移动端自适应布局。 / Responsive layout for desktop and mobile screens.
- 落子动画、悬停预览、最后一步脉冲提示。 / Stone placement animation, hover previews, and last-move pulse indicators.
- 商务风短音效：落子、获胜、失败，并支持静音。 / Understated business-style sound cues for move, win, and loss, with a mute toggle.
- 统计脚本按需加载：只有配置环境变量时才注入 Umami。 / Analytics loads on demand: Umami is injected only when environment variables are configured.

**技术特点 / Technical Notes**
- React 19 + TypeScript，逻辑类型安全。 / React 19 + TypeScript for type-safe UI and game logic.
- Tailwind CSS 4 管理响应式样式和设计变量。 / Tailwind CSS 4 for responsive styling and design tokens.
- 游戏规则与 AI 逻辑完全在前端运行，无需后端引擎。 / Game rules and AI run fully in the browser, with no backend engine.
- Vite 提供本地开发和生产构建。 / Vite powers local development and production builds.
- Vitest 覆盖核心规则、人机行为和悔棋逻辑。 / Vitest covers core rules, AI behavior, and undo logic.

## 快速开始 / Getting Started

**环境要求 / Prerequisites**
- Node.js 22+
- pnpm 10+

**安装与启动 / Install and Run**
```bash
git clone https://github.com/neoleegm/gomoku-pro.git
cd gomoku-pro
pnpm install
pnpm dev
```

开发服务器默认运行在 `http://localhost:3000/`。

The development server is available at `http://localhost:3000/`.

**生产构建 / Production Build**
```bash
pnpm build
pnpm preview
```

**检查与测试 / Check and Test**
```bash
pnpm check
pnpm test
```

## 玩法 / How to Play

1. 选择模式：本地双人或人机对战。 / Choose a mode: local two-player or Player vs AI.
2. 设置 AI：选择 Easy、Medium 或 Hard，并选择执黑或执白。 / Set AI options: choose Easy, Medium, or Hard, then choose Black or White.
3. 开局：黑棋永远先手；如果玩家执白，AI 会先落黑棋。 / Start: Black always moves first; if the player chooses White, the AI makes the opening move.
4. 落子：点击任意空位放置棋子。 / Place stones: click any empty cell.
5. 获胜：率先形成连续五子的一方获胜。 / Win: the first player to form an unbroken line of five stones wins.
6. 悔棋：PvP 撤销最后一步；PvE 撤销最近一轮玩家和 AI 的走子。 / Undo: PvP removes the last move; PvE removes the latest player and AI moves.
7. 音效：使用 Sound 开关控制落子和结果提示音。 / Sound: use the Sound toggle for move and result cues.
8. 新局：点击 New Game 使用当前设置重新开始。 / New Game: restart with the current settings.

## AI 难度 / AI Difficulty

- 简单：优先选择已有棋子附近的合法空位，保留随机性。 / Easy: chooses legal empty cells near existing stones, with randomness.
- 中等：优先立即获胜，其次阻挡对手立即五连，再用启发式评分选点。 / Medium: wins immediately when possible, blocks immediate opponent wins, then uses heuristic scoring.
- 困难：使用候选点裁剪、启发式评分和 minimax/alpha-beta，在浏览器内保持响应。 / Hard: uses candidate pruning, heuristic scoring, and minimax/alpha-beta while staying responsive in the browser.

## 项目结构 / Project Structure

```text
gomoku-pro/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BoardCell.tsx       # 棋盘格 / Individual board cell
│   │   │   ├── GomokuBoard.tsx     # 主棋盘 / Main board
│   │   │   └── GamePanel.tsx       # 控制面板 / Control panel
│   │   ├── hooks/
│   │   │   └── useGameAudio.ts     # 游戏音效 / Game audio cues
│   │   ├── lib/
│   │   │   ├── analytics.ts        # 按需统计脚本 / On-demand analytics
│   │   │   ├── gomokuAI.ts         # 本地 AI / Local AI
│   │   │   ├── gomokuLogic.ts      # 规则逻辑 / Core game rules
│   │   │   └── gomokuLogic.test.ts # 逻辑测试 / Logic tests
│   │   ├── pages/
│   │   │   └── Home.tsx            # 主页面 / Main game page
│   │   ├── App.tsx                 # 应用入口 / App shell
│   │   ├── main.tsx                # React 入口 / React entry point
│   │   └── index.css               # 全局样式 / Global styles
│   └── index.html                  # HTML 模板 / HTML template
├── server/
│   └── index.ts                    # 生产静态服务 / Production static server
├── shared/
│   └── const.ts                    # 共享常量 / Shared constants
├── package.json
└── README.md
```

## 设计说明 / Design Notes

**布局 / Layout**
- 棋盘是第一屏核心体验，侧边栏放置模式、难度、执棋方、音效、状态、历史和操作按钮。 / The board is the primary first-screen experience; the side panel contains mode, difficulty, side selection, sound, status, history, and actions.

**配色 / Color Palette**
- 棋盘：淡黄木纹和暖棕格线。 / Board: pale yellow wood grain with warm brown grid lines.
- 黑棋：深黑色并带轻微立体阴影。 / Black stones: deep black with subtle depth.
- 白棋：柔和白色并带抗锯齿边缘感。 / White stones: soft off-white with smooth visual edges.
- 标记：珊瑚色和蓝色区分当前动作与 AI 最近一步。 / Markers: coral and blue separate current actions and recent AI moves.

**交互 / Interaction**
- 落子使用 150ms 缩放动画。 / Stones use a 150ms scale-in animation.
- 最后一步和 AI 最近一步会持续可见。 / Last move and AI move indicators remain visible.
- 空位悬停会显示预览棋子。 / Empty cells show a hover preview.
- 音效由 Web Audio 合成，不额外加载音频素材。 / Sound cues are synthesized with Web Audio, with no extra audio assets.

## 环境变量 / Environment Variables

统计功能是可选的。只有同时设置下面两个变量时，应用才会加载 Umami 脚本：

Analytics is optional. The app loads the Umami script only when both variables are configured:

```bash
VITE_ANALYTICS_ENDPOINT=https://your-umami-domain.example
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

未设置时不会加载统计脚本，也不会产生占位符构建警告。

If they are not set, no analytics script is loaded and no placeholder build warnings are produced.

## 技术栈 / Tech Stack

| 技术 / Technology | 用途 / Purpose |
|---|---|
| React 19 | UI 框架和组件管理 / UI framework and component management |
| TypeScript | 类型安全开发 / Type-safe development |
| Tailwind CSS 4 | 工具类样式和响应式设计 / Utility-first styling and responsive design |
| Vite | 开发服务器和构建工具 / Dev server and build tool |
| shadcn/ui | 可访问 UI 组件 / Accessible UI components |
| Lucide React | 图标 / Icons |
| Wouter | 轻量客户端路由 / Lightweight client-side routing |
| Vitest | 逻辑测试 / Logic tests |

## 规则 / Game Rules

1. 双方轮流在 15 x 15 棋盘空位落子。 / Players alternate placing stones on empty cells of a 15 x 15 board.
2. 黑棋永远先手。 / Black always moves first.
3. 横、竖或斜向形成连续五子即获胜。 / Five contiguous stones horizontally, vertically, or diagonally wins.
4. 棋子落下后不能移动或移除，除非使用悔棋。 / Stones cannot be moved or removed except through undo.
5. 当前实现采用经典五子棋规则，不加入 Renju 禁手或长连限制。 / This implementation uses classic Gomoku rules and does not enforce Renju forbidden moves or overline restrictions.

## 浏览器支持 / Browser Support

- Chrome / Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 和 Chrome Mobile / iOS Safari and Chrome Mobile

## 贡献 / Contributing

欢迎提交 issue、建议和 pull request。

Issues, suggestions, and pull requests are welcome.

## 许可证 / License

本项目使用 MIT License。

This project is available under the MIT License.

## 致谢 / Credits

灵感来自经典五子棋和现代网页游戏界面设计。

Inspired by classic Gomoku and modern web game interface design.

**仓库 / Repository**: [https://github.com/neoleegm/gomoku-pro](https://github.com/neoleegm/gomoku-pro)
