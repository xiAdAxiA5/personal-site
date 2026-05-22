export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
  notes: string;
  category: 'literature' | 'webnovel';
}

export const books: Book[] = [
  {
    id: 'lit-1',
    title: '在轮下',
    author: '赫尔曼·黑塞',
    cover: '/books/在轮下.png',
    rating: 0,
    notes: '',
    category: 'literature',
  },
  {
    id: 'lit-2',
    title: '三体',
    author: '刘慈欣',
    cover: '/books/三体.png',
    rating: 0,
    notes: '',
    category: 'literature',
  },
  {
    id: 'lit-3',
    title: '凯罗斯',
    author: '燕妮·埃彭贝克',
    cover: '/books/凯罗斯.png',
    rating: 0,
    notes: '',
    category: 'literature',
  },
  {
    id: 'lit-4',
    title: '步履不停',
    author: '是枝裕和',
    cover: '/books/步履不停.png',
    rating: 0,
    notes: '',
    category: 'literature',
  },
  {
    id: 'lit-5',
    title: '被讨厌的勇气',
    author: '岸见一郎 / 古贺史健',
    cover: '/books/被讨厌的勇气.png',
    rating: 0,
    notes: '',
    category: 'literature',
  },
  {
    id: 'web-1',
    title: '凡人修仙传',
    author: '忘语',
    cover: '/books/凡人修仙传.png',
    rating: 0,
    notes: '',
    category: 'webnovel',
  },
  {
    id: 'web-2',
    title: '诡秘之主',
    author: '爱潜水的乌贼',
    cover: '/books/诡秘之主.png',
    rating: 0,
    notes: '',
    category: 'webnovel',
  },
  {
    id: 'web-3',
    title: '道诡异仙',
    author: '狐尾的笔',
    cover: '/books/道诡异仙.png',
    rating: 0,
    notes: '',
    category: 'webnovel',
  },
  {
    id: 'web-4',
    title: '蛊真人',
    author: '蛊真人',
    cover: '/books/蛊真人.png',
    rating: 0,
    notes: '',
    category: 'webnovel',
  },
  {
    id: 'web-5',
    title: '神秘复苏',
    author: '佛前献花',
    cover: '/books/神秘复苏.png',
    rating: 0,
    notes: '',
    category: 'webnovel',
  },
];
