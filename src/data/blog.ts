export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  date: string;
  readTime: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'react-server-components',
    title: 'React Server Components 深入理解',
    excerpt: '深入探讨 RSC 的工作原理、渲染流程和最佳实践。',
    content: `# React Server Components 深入理解

React Server Components (RSC) 是 React 18 引入的一种新的组件类型，它允许组件在服务器端渲染。

## 什么是 Server Components？

Server Components 是在服务器端执行的 React 组件。它们可以：
- 直接访问后端数据源
- 减少客户端打包体积
- 自动代码分割

## 与 Client Components 的区别

\`\`\`tsx
// Server Component (默认)
async function PostList() {
  const posts = await db.post.findMany();
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}

// Client Component
'use client';
function LikeButton() {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(!liked)}>{liked ? '❤️' : '🤍'}</button>;
}
\`\`\`

## 最佳实践

1. 默认使用 Server Components
2. 只在需要交互时使用 Client Components
3. 将 Client Components 尽可能推到叶子节点
`,
    category: '前端开发',
    tags: ['React', 'SSR', '性能优化'],
    date: '2025-06-15',
    readTime: '8 min',
  },
  {
    slug: 'typescript-advanced-patterns',
    title: 'TypeScript 高级类型模式',
    excerpt: '探索 TypeScript 中模板字面量类型、条件类型等高级用法。',
    content: `# TypeScript 高级类型模式

## 模板字面量类型

TypeScript 4.1+ 支持模板字面量类型，可以用来构建复杂的字符串类型。

\`\`\`ts
type EventName<T extends string> = \`on\${Capitalize<T>}\`;
type ClickEvent = EventName<'click'>; // 'onClick'
\`\`\`

## 条件类型

\`\`\`ts
type IsString<T> = T extends string ? true : false;
type A = IsString<'hello'>; // true
type B = IsString<42>;      // false
\`\`\`
`,
    category: '前端开发',
    tags: ['TypeScript', '类型系统'],
    date: '2025-05-20',
    readTime: '12 min',
  },
  {
    slug: 'docker-compose-guide',
    title: 'Docker Compose 实战指南',
    excerpt: '从零搭建完整的 Docker Compose 开发环境。',
    content: `# Docker Compose 实战指南

## 为什么使用 Docker Compose?

Docker Compose 可以让你在一个文件中定义和运行多容器 Docker 应用。

\`\`\`yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: myapp
\`\`\`
`,
    category: 'DevOps',
    tags: ['Docker', 'DevOps', '部署'],
    date: '2025-04-10',
    readTime: '10 min',
  },
];

export const categories = [...new Set(blogPosts.map((p) => p.category))];
export const allTags = [...new Set(blogPosts.flatMap((p) => p.tags))];
