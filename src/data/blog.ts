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
    slug: 'info-asymmetry',
    title: '信息不对等的沟通',
    excerpt: '信息不对等的争论没有丝毫意义，因为信息匮乏者总是倾向于把他独特且可笑的推测强加给另一方。',
    content: `信息不对等的争论没有丝毫意义，因为信息匮乏者总是倾向于把他独特且可笑的推测强加给另一方。`,
    category: '思考',
    tags: ['认知', '沟通'],
    date: '2026-05-26',
    readTime: '1 min',
  },
  {
    slug: 'lie-or-blind',
    title: '',
    excerpt: '是对自己撒谎还是根本没法看清自己',
    content: `是对自己撒谎还是根本没法看清自己`,
    category: '思考',
    tags: ['自我'],
    date: '2026-05-26',
    readTime: '1 min',
  },
  {
    slug: 'generalized',
    title: '被概括',
    excerpt: '我讨厌被"纯爱""文艺"等含义丰富的词形容，因为每个人都会用他们自己的阅历来填充它们。',
    content: `我讨厌被"纯爱""文艺"等含义丰富的词形容，因为每个人都会用他们自己的阅历来填充它们，其中不乏有不成熟的见解，有人会借用这种词汇配合自己不成熟的见解来裹挟我。我讨厌被随意地概括。`,
    category: '思考',
    tags: ['自我', '表达'],
    date: '2026-05-26',
    readTime: '1 min',
  },
  {
    slug: 'not-myself',
    title: '变得越来越不像自己是好事还是坏事？',
    excerpt: '变得越来越不像自己是好事还是坏事？',
    content: '',
    category: '思考',
    tags: ['自我'],
    date: '2026-05-26',
    readTime: '1 min',
  },
];

export const categories: string[] = [];
export const allTags: string[] = [];
