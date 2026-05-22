# Beautiful Earth

自托管的交互式 3D 地球（GitHub Pages）。地图相关资源全部放在本仓库，**不使用** Cesium ion、MapTiler 等地图云服务。

**在线演示：** https://xiangchen-dvi.github.io/beautiful-earth/

## 当前进度

| 阶段 | 状态 | 说明 |
|------|------|------|
| **1. 可旋转地球** | ✅ | Three.js 球体 + 轨道控制 + 星空背景 |
| **2. 地形高度** | ✅ | 全球高度图 + CPU 顶点位移 |
| **3. 光照与渲染** | ✅ | 物理光照、相机跟随太阳 |

## 本地预览

需要本地 HTTP 服务（`importmap` + ES module 不能用 `file://` 直接打开）。

```bash
cd ~/Projects/beautiful-earth
python3 -m http.server 8080
```

浏览器打开：<http://localhost:8080>

## 部署到 GitHub Pages

站点从 `main` 分支根目录发布（已含 `.nojekyll`）。首次启用见下方「你需要做的」。

## 项目结构

```
beautiful-earth/
├── index.html          # 入口
├── css/style.css
├── js/main.js          # Three.js 场景与交互
├── js/terrain.js       # 高度图读取与顶点位移
├── js/rendering.js     # 光照与材质
├── assets/
│   ├── earth-day.jpg     # SSS 8k 日照贴图（8192×4096，CC BY 4.0）
│   └── earth-height.png  # 灰度高程 bump（8192×4096，由 2k 拓扑图平滑放大）
└── .nojekyll
```

## 技术说明

- **渲染**： [Three.js](https://threejs.org/)（经 jsDelivr CDN 加载库本身；符合「档 A」——仅地图数据自托管）
- **交互**：`OrbitControls` — 拖拽旋转、滚轮缩放（距离限制在「太空 ↔ 国家」尺度）
- **星空**：程序生成的 `Points`，无外部贴图

## 许可与署名

完整第三方许可说明见 **[THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)**。页脚已对 CC BY 贴图做署名。

| 内容 | 许可 | 合规要点 |
|------|------|----------|
| 本仓库代码 | Apache 2.0 | 见根目录 `LICENSE` |
| `assets/earth-day.jpg` | CC BY 4.0 | 需署名 Solar System Scope + 许可证链接（页脚已做） |
| `assets/earth-height.png` | NASA 地形类数据（经 three-globe 示例）；建议见 NOTICES | 灰度高程，非法线推导 |
| Three.js（CDN） | MIT | 仓库内保留 `licenses/threejs-MIT.txt` |
| 星空 | — | 程序生成，无第三方数据 |

**地图审图**：若在中国大陆公开发布带国界线的交互地图，须遵守测绘与审图相关规定；当前贴图为全球卫星风格影像，不含专业审图号。

## 路线图

1. ~~基础 3D 地球与交互~~
2. ~~叠加全球 DEM 高度图（低分辨率即可），`Mesh` 顶点抬高~~
3. ~~完善定向光、环境光与 shader，接近「地形艺术图」的立体感~~

光照默认值见 `js/params.js`。地形夸张系数见 `js/main.js` 中的 `TERRAIN_EXAGGERATION`（`0.1`）。
