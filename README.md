# StyleMate 前端

AI 穿搭助手的 Web 前端 —— 基于 React + Vite，提供登录、推荐、衣柜、风格、搭配等页面。

## 🔗 线上体验

https://stylemate-frontend.vercel.app

## 🔗 相关仓库

- 后端仓库：https://github.com/xuedi-cn/stylemate
- API 文档：https://stylemate-production.up.railway.app/docs

## 🏗️ 技术栈

| 层 | 技术 |
|---|---|
| 框架 | React 18 |
| 构建工具 | Vite |
| 路由 | React Router |
| 样式 | 原生 CSS（莫兰迪配色） |
| 部署 | Vercel |

## ✨ 页面结构

| 页面 | 功能 |
|---|---|
| 登录 / 注册 | 邮箱注册、JWT 登录 |
| 场景推荐 | 输入场景 → AI 生成 3 套搭配 |
| 我的衣柜 | 按品类分组展示单品 |
| 我的风格 | 上传喜欢的穿搭图 |
| 我的搭配 | 查看 / 删除收藏的搭配 |

## 📁 项目结构

- `src/App.jsx` —— 路由配置
- `src/App.css` —— 全局样式
- `src/api.js` —— API 封装 + 401 拦截
- `src/Login.jsx` —— 登录 / 注册
- `src/Recommend.jsx` —— 场景推荐
- `src/Wardrobe.jsx` —— 我的衣柜
- `src/Styles.jsx` —— 我的风格
- `src/Saved.jsx` —— 我的搭配

## 🚀 本地运行

1. `npm install`
2. `npm run dev`
3. 浏览器打开 http://localhost:5173

## 🔗 后端接口

前端默认调用线上后端：
```
https://stylemate-production.up.railway.app
```
本地开发时，改 `src/api.js` 第一行为：
```
http://127.0.0.1:8000
```

## 🎨 设计风格

- 配色：莫兰迪色系（雾霾蓝 + 藕粉灰）
- 拼贴：推荐结果用手账式拼贴，hover 时卡片滑开

## 🔐 认证处理

- 登录后 JWT 存 `localStorage`
- 所有请求带 `x-token` header
- `api.js` 统一拦截 401 → 清 token → 跳登录页

## 📄 License

MIT