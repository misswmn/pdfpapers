这是一份为您量身定制的 **`pdfpapers.com`** 项目全案设计文档（PRD & Technical Specification）。文档结构清晰，分为业务定位、架构选型、视觉布局、技术核心以及程序化 SEO 模块，可直接作为开发基准。

---

# pdfpapers.com 项目全案设计文档

## 1. 项目概述与核心定位

`pdfpapers.com` 是一个面向全球（以欧美为主）的**高颜值、可打印生产力工具与纸张模板平台（Premium Printable Papers & Planners）**。

* **商业模式：** Freemium（免费增值）。
* **免费（工具引流）**：提供完全自定义尺寸、间距、颜色的标准纸张在线生成器（横线、方格、点阵、康奈尔等），无限制下载。
* **付费（设计变现）**：售卖系统化、高颜值的全套日程计划表（Planners）、效率工具包（Kits）以及支持 iPad 跳转的数字手账内页。


* **核心优势：** 域名自带强搜索意图、零版权风险、高复购、零边际成本。

---

## 2. 技术栈选型 (Tech Stack)

考虑到极致的 SEO 性能、首屏加载速度（PageSpeed）以及轻资产运营（降低服务器成本），采用以下架构：

| 层次 | 技术选型 | 选用理由 |
| --- | --- | --- |
| **前端框架** | **Next.js (App Router)** | 全球顶级的 React 框架，支持 SSR/SSG，确保几万个程序化 SEO 页面秒被 Google 收录。 |
| **样式/UI** | **Tailwind CSS + shadcn/ui** | 保证响应式设计、现代化极简 UI 风格，极大地缩短前端 UI 开发周期。 |
| **PDF 生成引擎** | **pdf-lib / jsPDF (Client-Side)** | **核心技术点**：完全在浏览器客户端渲染并导出 PDF，**零服务器算力消耗**，下载速度极快。 |
| **数据层** | **Supabase (PostgreSQL)** | 托管数据库，用于存储付费产品元数据、用户邮箱数据及程序化建站模板。 |
| **文件存储** | **Cloudflare R2** | 存放付费的高清大体积 PDF 包，免流量费（Zero Egress Fees），全球 CDN 加速。 |
| **支付与交付** | **Lemon Squeezy** | 处理海外多币种信用卡及 Apple Pay，自带 Merchant of Record（代缴税），提供开箱即用的弹出式收银台。 |

---

## 3. 站点地图与 UI/UX 布局规划

### 3.1 首页 (Homepage)

* **Hero 屏：**
* 主标题：`Design Your Perfect Page. Print. Write.`
* 副标题：`100% Free customizable grid, lined, and Cornell paper generators. Upgrade to elite aesthetic planning systems.`
* 双 CTA：`[Launch Free Generator]` (锚点定位至免费区) / `[Explore Premium Bundles]`


* **免费工具网格（3x2 Layout）：** 横线、方格、点阵、康奈尔、周计划、习惯追踪。
* **高级套装橱窗（Bento Grid 瀑布流）：** 展示高颜值 Mockup 图（如：莫兰迪色系学术包、暗黑模式 iPad 手账），标价 $4.99 - $9.99。
* **底部：** 常见问题（FAQ），针对 `How to print PDF papers?` 等长尾词做 SEO 文本埋点。

### 3.2 动态生成器工作台 (Generator Workspace)

采用**双栏分屏响应式布局**：

* **左侧/顶部（控制面板 - Floating Control Panel）：**
* *Paper Settings*：下拉框选择 A4 / A5 / Letter / B5。
* *Grid/Line Settings*：滑块调整间距（5mm / 7mm / 10mm），线条粗细。
* *Aesthetics*：色块选择（经典黑灰、薄荷绿、莫兰迪粉、天蓝色）。
* *CTA 按钮*：`[Download Free PDF]` (触发邮箱捕获或直接下载)。


* **右侧/中央（实时预览区）：**
* 利用 HTML5 Canvas 或 SVG 实时同步左侧参数，用户调整滑块时，右侧纸张纹理实时无缝渲染。


* **配置栏下方（交叉销售 Upsell Banner）：**
* *“Tired of basic sheets? Grab the matching Pastel Productivity Kit (50+ Pages) for only $4.99.”* 附带精美缩略图与一键购买按钮。



---

## 4. 核心功能：客户端 PDF 实时生成方案

为了做到极致的运行效率，我们不使用后端 Python 生成 PDF，而是使用前端的 Canvas 结合 `pdf-lib` 进行像素级绘制：

### 技术实现逻辑流：

1. **Canvas 预览：** 前端 React 状态绑定左侧控制面板参数（如 `spacing = 5`），通过 `<canvas>` 实时绘制线段、圆点或康奈尔框架。
2. **PDF 导出函数 (伪代码参考)：**
```javascript
import { PDFDocument, rgb } from 'pdf-lib';

async function generateCustomPaper(config) {
  // 创建 PDF 文档，设置页面大小 (如 A4: 595.28 x 841.89 pt)
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([config.width, config.height]);

  // 根据用户选择的间距和颜色计算循环参数
  const { spacing, colorHex, lineWidth } = config;

  // 循环在 PDF 页面上绘制高精度矢量线段（保证打印不糊）
  for (let y = margin; y < config.height - margin; y += spacing) {
    page.drawLine({
      start: { x: margin, y: y },
      end: { x: config.width - margin, y: y },
      thickness: lineWidth,
      color: rgb(r, g, b), // 将 Hex 转换为 0-1 RGB
    });
  }

  // 导出 Blob 并触发浏览器下载
  const pdfBytes = await pdfDoc.save();
  download(pdfBytes, "custom-paper.pdf", "application/pdf");
}

```



---

## 5. 程序化 SEO (PSEO) 数据模型

利用 Next.js 的动态路由 `app/printables/[slug]/page.tsx`，批量生成成千上万个高排名长尾词页面。

### 5.1 URL 路由树设计

* `[pdfpapers.com/printables/free-printable-graph-paper-a4](https://pdfpapers.com/printables/free-printable-graph-paper-a4)`
* `[pdfpapers.com/printables/custom-cornell-notes-pdf-pink](https://pdfpapers.com/printables/custom-cornell-notes-pdf-pink)`
* `[pdfpapers.com/printables/weekly-planner-template-minimalist](https://pdfpapers.com/printables/weekly-planner-template-minimalist)`

### 5.2 数据库 Schema (Supabase / PostgreSQL)

每一个自动生成的页面由以下数据驱动，避免被 Google 判定为低质量重复内容：

```sql
CREATE TABLE seo_pages (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,      -- URL标识
    meta_title VARCHAR(255) NOT NULL,       -- SEO 标题
    meta_description TEXT NOT NULL,          -- SEO 描述
    h1_title VARCHAR(255) NOT NULL,         -- 页面主标题
    paper_type VARCHAR(50) NOT NULL,        -- 纸张类型 (grid, lined, cornell)
    default_config JSONB NOT NULL,          -- 对应的默认生成器配置 (尺寸、颜色)
    ai_guide_content TEXT NOT NULL,         -- AI自动生成的300字"使用与高效排版指南"
    related_premium_bundle_id INT           -- 该页面绑定的付费产品包ID
);

```

---

## 6. 商业化变现与交付流程

采用 **Lemon Squeezy Overlay（弹出式收银台）**，将购买摩擦降到最低。

### 自动化销售流水线：

1. **触发购买**：用户在首页或生成器页点击高级包的 `[Buy Now - $4.99]`。
2. **弹出收银**：页面不跳转，直接触发 Lemon Squeezy 的 JS 脚本，弹出带有 Apple Pay / 信用卡的精美覆盖层。
3. **Webhook 监听**：用户付款成功后，Lemon Squeezy 向我们的 Supabase 后端发送一个 `order_created` Webhook。
4. **权益交付与留存**：
* 自动将该用户的 Email 归档到 `customers` 表（作为日后邮件营销的私域资产）。
* Lemon Squeezy 官方自动将 Cloudflare R2 上的高清 PDF 压缩包（如 `2026_planner_set.zip`）安全交付至用户邮箱。



---

## 7. MVP（最小可行性产品）一期开发里程碑

为了快速验证市场，项目分为以下三个轻量级冲刺（Sprints）：

* **Sprint 1: 核心工具开发 (第 1 周)**
* 完成 Next.js 项目脚手架与 Tailwind UI 配置。
* 编写并在前端打通“方格纸”与“康奈尔笔记”的 `pdf-lib` 客户端生成逻辑，确保可自由调节间距并成功下载。


* **Sprint 2: 页面上线与付费打通 (第 2 周)**
* 在 Canva 中制作或购买商业授权的 3 款核心付费包（莫兰迪色系周计划、iPad 电子手账、学霸笔记纸包）。
* 在 Lemon Squeezy 配置产品，打通前端购买弹窗。
* 上线首页、工具工作台页。


* **Sprint 3: 种子流量注入 (第 3 周)**
* 将生成的免费工具包 Mockup 渲染成多尺寸精美图片，发布到 **Pinterest** 进行第一波视觉引流。
* 批量上线首批 50 个高频长尾词的 PSEO 动态页面，向 Google 站长工具提交 Sitemap。