# Beautiful Earth

自托管的交互式、含地形的地球仪。地图相关资源全部放在本仓库，**不使用** Cesium ion、MapTiler 等地图云服务。

**在线演示：** https://xiangchen-dvi.github.io/beautiful-earth/

## 本地预览

需要本地 HTTP 服务（`importmap` + ES module 不能用 `file://` 直接打开）。

```bash
cd ~/Projects/beautiful-earth
python3 -m http.server 8080
```

浏览器打开：<http://localhost:8080>

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

## 许可与署名

完整第三方许可说明见 **[THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)**。页脚已对 CC BY 贴图做署名。

| 内容 | 许可 | 合规要点 |
|------|------|----------|
| 本仓库代码 | Apache 2.0 | 见根目录 `LICENSE` |
| `assets/earth-day.jpg` | CC BY 4.0 | 需署名 Solar System Scope + 许可证链接（页脚已做） |
| `assets/earth-height.png` | NASA 地形类数据（经 three-globe 示例）；建议见 NOTICES | 灰度高程，非法线推导 |
| Three.js（CDN） | MIT | 仓库内保留 `licenses/threejs-MIT.txt` |
| 星空 | — | 程序生成，无第三方数据 |

光照默认值见 `js/params.js`。地形夸张系数见 `js/main.js` 中的 `TERRAIN_EXAGGERATION`（`0.1`）。
