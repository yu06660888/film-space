# 技术架构规范 V2.0

## 1. API 配置 (请同步写入 .env)
- TMDB_API_KEY: d594d662a8df0ba7caa499883107852a
- TMDB_ACCESS_TOKEN: eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNTk0ZDY2MmE4ZGYwYmE3Y2FhNDk5ODgzMTA3ODUyYSIsIm5iZiI6MTc3NDkzNjcyMy40MjU5OTk5LCJzdWIiOiI2OWNiNjI5M2RlYWUwZmY1ZjJhYmJiMjkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.adIzkdxcD__9f00Sz8pHOAFt6lT6e5Hewj59d4e7YGU

## 2. 核心架构
- Next.js (App Router) + Framer Motion + Prisma (SQLite).

## 3. 重构任务
- 清理旧代码，实现 1:N 数据模型，构建 3D 卷轴与 TMDB 搜索。
