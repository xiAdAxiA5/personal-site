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
    url: 'https://github.com/xiAdAxiA5',
    icon: 'github',
    followerCount: 0,
    color: '#6e5494',
    videoThumbnails: [],
  },
  {
    id: 'bilibili',
    name: 'Bilibili',
    url: 'https://space.bilibili.com/507685526',
    icon: 'video',
    followerCount: 0,
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
    url: 'https://www.youtube.com/@xiAdAxiA5',
    icon: 'youtube',
    followerCount: 0,
    color: '#ff0000',
    videoThumbnails: [
      'https://picsum.photos/seed/v4/320/180',
      'https://picsum.photos/seed/v5/320/180',
    ],
  },
  {
    id: 'douyin',
    name: '抖音',
    url: 'https://v.douyin.com/HY-1bhG_0y0/',
    icon: 'music',
    followerCount: 0,
    color: '#111111',
    videoThumbnails: [],
  },
];
