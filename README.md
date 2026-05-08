# 劲酒业务系统

面向配送与商户管理的 Web 前端 + Node API，本地 LowDB 存储，可在局域网或本机使用。

## 功能概要

- 商户档案、片区管理
- 送货状态、欠款与回款登记
- 按日快照与简单查询（月度总结等依赖快照）
- 首页入口与各列表页；配送场景主推 `peisong.html`
- 部分列表页缓存约 90 天内的查询条件（`localStorage`）

## 安装为桌面常用（PWA）

1. 先启动后端，用浏览器打开 **`http://你的电脑IP:3000/`**（同一 WiFi 下手机填电脑局域网 IP）。
2. **Android（Chrome）**：菜单中选择「添加到主屏幕」或「安装应用」。
3. **iPhone（Safari）**：分享 → 「添加到主屏幕」。
4. **建议从首页进入 `peisong.html` 再安装**，以便 manifest 中 `display: standalone` 等信息一致。

生产环境请使用 **HTTPS**；开发阶段 **localhost** 即可满足 PWA 安装条件。图标等资源见项目根目录 `icon.png`，可按需替换。

## 技术栈

- **前端**：HTML、JavaScript、Tailwind CSS、Font Awesome、PWA（`manifest.json` + `service-worker.js`）
- **后端**：Node.js、Express、lowdb（数据文件 `backend/db.json`，默认勿提交到公开仓库）

## 本地运行

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 启动服务

```bash
cd backend
npm start
```

浏览器访问 **`http://localhost:3000`**；静态页与 `/api` 由同一服务提供。

### 3. 部署到其他域名时

若从 **`index.html`** 或 **`peisong.html`** 通过 **`js/mian1-shared.js`** 访问 HTTP API，需保证脚本里的 API 基地址指向 **`/api`**。不要用 `file://` 直接打开 HTML；线上可在页面中覆盖基地址，例如：

```html
<script>window.MIAN1_API_BASE = 'https://你的域名/api';</script>
<script src="js/mian1-shared.js"></script>
```

## 目录结构（节选）

```
.
├── backend/
│   ├── server.js
│   ├── db.json          # 本地生成，默认 gitignore
│   └── package.json
├── css/
├── js/
│   ├── mian1-shared.js
│   └── pwa-bootstrap.js
├── manifest.json
├── service-worker.js
├── peisong.html
├── index.html
├── today-delivery.html / not-delivered.html / delivered-list.html
├── owing-list.html / transfer-list.html / received-amount.html
├── store-list.html
├── simple-query.html
├── api.js
└── README.md
```

## API 一览

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/merchants` | 商户列表；查询参数 `area`、`search` |
| GET | `/api/merchants/:id` | 单个商户 |
| POST | `/api/merchants` | 新建 |
| PUT | `/api/merchants/:id` | 更新 |
| DELETE | `/api/merchants/:id` | 删除 |
| GET | `/api/areas` | 片区列表 |
| POST | `/api/areas` | 新增片区 |
| DELETE | `/api/areas/:name` | 删除片区 |
| GET | `/api/deliveries` | 送货流水列表 |
| POST | `/api/deliveries` | 新增送货流水 |
| GET | `/api/snapshots/:date` | 某日快照 `{ date, data }` |
| PUT | `/api/snapshots/:date` | 写入某日快照 |
| GET | `/api/health` | 健康检查 |

## 许可

MIT License
