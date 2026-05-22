export interface Profile {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  avatar: string;
  tags: string[];
}

export const profile: Profile = {
  name: 'Your Name',
  title: 'Full-Stack Developer',
  tagline: '构建优雅、高性能的数字体验',
  bio: '热爱技术、设计和开源的全栈开发者。专注于 React、TypeScript 和 Node.js 生态，喜欢探索前沿技术并将其转化为实用的产品。',
  avatar: '',
  tags: ['开发者', '开源贡献者', '技术博主', '终身学习者'],
};
