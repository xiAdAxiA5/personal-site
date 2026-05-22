export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
  notes: string;
}

export const books: Book[] = [
  {
    id: '1',
    title: '人体解剖学',
    author: '丁文龙',
    cover: 'https://picsum.photos/seed/book1/200/280',
    rating: 5,
    notes: '医学入门基石，系统掌握人体结构。',
  },
  {
    id: '2',
    title: '生理学',
    author: '王庭槐',
    cover: 'https://picsum.photos/seed/book2/200/280',
    rating: 5,
    notes: '理解机体正常功能及其调节机制。',
  },
  {
    id: '3',
    title: '病理学',
    author: '步宏',
    cover: 'https://picsum.photos/seed/book3/200/280',
    rating: 4,
    notes: '疾病的发生发展机制，临床思维的基础。',
  },
  {
    id: '4',
    title: '内科学',
    author: '葛均波',
    cover: 'https://picsum.photos/seed/book4/200/280',
    rating: 5,
    notes: '临床核心课程，常见疾病的诊疗思路。',
  },
  {
    id: '5',
    title: '外科学',
    author: '陈孝平',
    cover: 'https://picsum.photos/seed/book5/200/280',
    rating: 4,
    notes: '无菌术与基本外科操作的系统学习。',
  },
  {
    id: '6',
    title: '诊断学',
    author: '万学红',
    cover: 'https://picsum.photos/seed/book6/200/280',
    rating: 5,
    notes: '问诊与体格检查，临床医生的基本功。',
  },
];
