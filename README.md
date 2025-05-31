# BestMap

基于 Next.js 和高德地图 API 的地图搜索应用。

## 功能特性

- 🗺️ 集成高德地图
- 🔍 全国范围地址搜索
- 📍 自动定位和标记
- 💻 响应式设计

## 技术栈

- Next.js 14+
- React 18+
- TypeScript
- Ant Design
- 高德地图 JavaScript API

## 开始使用

1. 克隆项目
```bash
git clone https://github.com/jimmysunshine/BestMap.git
cd BestMap
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
创建 `.env.local` 文件并添加以下内容：
```
NEXT_PUBLIC_AMAP_KEY=你的高德地图API Key
NEXT_PUBLIC_AMAP_SECURITY_CODE=你的安全密钥
```

4. 启动开发服务器
```bash
npm run dev
```

## 开发工具

- start-dev.cmd - 开发服务器启动工具，自动清理进程和缓存

## 许可证

MIT
