export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  tags: string[];
  demoUrl: string;
  repoUrl: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: '1',
    title: 'OpenSource UI Library',
    description: '一套面向现代 Web 应用的 React 组件库，支持主题定制和暗黑模式。',
    longDescription:
      '这是一套完整的 React UI 组件库，包含 50+ 个组件，支持 Tree Shaking、TypeScript、主题定制、暗黑模式。已在 npm 上发布，周下载量 1000+。',
    image: 'https://picsum.photos/seed/project1/800/400',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Storybook'],
    demoUrl: 'https://example.com/demo1',
    repoUrl: 'https://github.com/yourname/ui-lib',
    featured: true,
  },
  {
    id: '2',
    title: 'AI Chat Application',
    description: '基于大语言模型的智能对话应用，支持多轮对话和上下文理解。',
    longDescription:
      '使用 OpenAI API 构建的智能聊天应用，支持 Markdown 渲染、对话历史管理、多主题切换，以及流式输出响应。',
    image: 'https://picsum.photos/seed/project2/800/400',
    tags: ['Next.js', 'OpenAI', 'WebSocket', 'Prisma'],
    demoUrl: 'https://example.com/demo2',
    repoUrl: 'https://github.com/yourname/ai-chat',
    featured: true,
  },
  {
    id: '3',
    title: 'DevTools Extension',
    description: '浏览器开发者工具扩展，用于调试和分析前端性能。',
    longDescription:
      '一款 Chrome/Firefox 浏览器扩展，帮助开发者分析页面性能、检测内存泄漏、查看网络请求瀑布图。',
    image: 'https://picsum.photos/seed/project3/800/400',
    tags: ['Chrome Extension', 'React', 'D3.js'],
    demoUrl: 'https://example.com/demo3',
    repoUrl: 'https://github.com/yourname/devtools',
    featured: false,
  },
  {
    id: '4',
    title: 'Blog Platform',
    description: '基于 Markdown 的静态博客平台，支持自定义主题和插件系统。',
    longDescription:
      '轻量级静态博客生成器，支持 Markdown/MDX 写作、全文搜索、RSS 订阅、评论系统和丰富的插件生态。',
    image: 'https://picsum.photos/seed/project4/800/400',
    tags: ['Astro', 'MDX', 'Tailwind CSS'],
    demoUrl: 'https://example.com/demo4',
    repoUrl: 'https://github.com/yourname/blog',
    featured: false,
  },
];
