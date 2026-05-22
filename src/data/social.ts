export interface SocialPlatform {
  id: string;
  name: string;
  url: string;
  icon: string;
  followerCount: number;
  color: string;
  videoThumbnails: string[];
}

export const socialPlatforms: SocialPlatform[] = [
  {
    id: 'github',
    name: 'GitHub',
    url: 'https://github.com/yourname',
    icon: 'github',
    followerCount: 1280,
    color: '#6e5494',
    videoThumbnails: [],
  },
  {
    id: 'bilibili',
    name: 'Bilibili',
    url: 'https://space.bilibili.com/yourid',
    icon: 'video',
    followerCount: 5600,
    color: '#fb7299',
    videoThumbnails: [
      'https://picsum.photos/seed/v1/320/180',
      'https://picsum.photos/seed/v2/320/180',
      'https://picsum.photos/seed/v3/320/180',
    ],
  },
  {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://youtube.com/@yourname',
    icon: 'youtube',
    followerCount: 3200,
    color: '#ff0000',
    videoThumbnails: [
      'https://picsum.photos/seed/v4/320/180',
      'https://picsum.photos/seed/v5/320/180',
    ],
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    url: 'https://x.com/yourname',
    icon: 'twitter',
    followerCount: 890,
    color: '#1da1f2',
    videoThumbnails: [],
  },
  {
    id: 'zhihu',
    name: '知乎',
    url: 'https://zhihu.com/people/yourid',
    icon: 'edit',
    followerCount: 2100,
    color: '#0066ff',
    videoThumbnails: [],
  },
];

export const getTotalFollowers = (): number =>
  socialPlatforms.reduce((sum, p) => sum + p.followerCount, 0);
