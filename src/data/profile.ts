export interface Profile {
  name: string;
  nameEn: string;
  title: string;
  tagline: string;
  bio: string;
  avatar: string;
  tags: string[];
}

export const profile: Profile = {
  name: '侠大虾',
  nameEn: 'KieranXia',
  title: 'Digital Settler',
  tagline: '论迹也论心',
  bio: '临床医学背景的数字游民，在代码与生活的边界探索可能。',
  avatar: './avatar.png',
  tags: ['健身爱好者', '音乐爱好者', '游戏爱好者', '极简主义者', '*NTJ/双子座'],
};
