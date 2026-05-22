export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
  review: string;
}

export const books: Book[] = [
  {
    id: '1',
    title: '代码整洁之道',
    author: 'Robert C. Martin',
    cover: 'https://picsum.photos/seed/book1/200/280',
    rating: 5,
    review: '每个程序员都应该读的经典之作。',
  },
  {
    id: '2',
    title: '设计模式',
    author: 'GoF',
    cover: 'https://picsum.photos/seed/book2/200/280',
    rating: 4,
    review: '面向对象设计的基石，常读常新。',
  },
  {
    id: '3',
    title: '深入理解计算机系统',
    author: 'Randal E. Bryant',
    cover: 'https://picsum.photos/seed/book3/200/280',
    rating: 5,
    review: '帮助建立完整的计算机系统知识体系。',
  },
  {
    id: '4',
    title: 'JavaScript高级程序设计',
    author: 'Matt Frisbie',
    cover: 'https://picsum.photos/seed/book4/200/280',
    rating: 4,
    review: '前端工程师的红宝书，JS 进阶必读。',
  },
  {
    id: '5',
    title: '重构',
    author: 'Martin Fowler',
    cover: 'https://picsum.photos/seed/book5/200/280',
    rating: 5,
    review: '改善既有代码的设计，提升代码质量的实践指南。',
  },
];
