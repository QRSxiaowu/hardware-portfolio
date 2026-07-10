# 吴学纯 · 嵌入式硬件工程师 · 个人作品集网站

## 简介

专为面试打造的硬件工程师个人作品展示网站，展示原理图设计、PCB Layout、3D预览图及个人简历。

## 功能

- **个人简历**：完整展示工作经历、项目经验、专业技能、联系方式
- **项目展示**：21个硬件项目的3D预览图、原理图、PCB图纸分类浏览
- **分类筛选**：按 `JKD_2026_04_XX` / `WXC_my_work` / `ZHBD_2025_11-2026_03` 筛选
- **图片灯箱**：大图预览，键盘← →切换
- **详情弹窗**：每个项目独立展示所有设计文件

## 网站结构

```
website/
├── index.html              # 主页面（含完整简历）
├── css/style.css           # 暗色科技风样式
├── js/
│   ├── app.js              # 交互逻辑
│   └── projects-data.js    # 自动生成的项目数据
├── server.js               # 本地预览服务器
├── update-projects.js      # 项目数据更新脚本
└── README.md               # 使用说明
preview.bat                 # 一键启动预览
```

## 使用方式

### 预览
- **双击 `preview.bat`** 自动启动并打开浏览器
- 或命令行：`node website/server.js`，访问 `http://localhost:3000`

### 添加新项目
1. 将项目文件夹放入 `个人项目合集/` 下对应分类目录中
2. 运行 `node website/update-projects.js`
3. 刷新浏览器

### 目录分类
- `JKD_2026_04_XX/` - 2026年项目
- `WXC_my_work/` - 工作项目
- `ZHBD_2025_11-2026_03/` - 2025-2026年项目

### 部署到面试
推荐部署到 GitHub Pages：推送到 GitHub → Settings → Pages → 选 `website/` 目录
