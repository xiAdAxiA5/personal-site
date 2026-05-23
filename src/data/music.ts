export interface Track {
  title: string;
  duration: string;
  description: string;
  src?: string;
  lrc?: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  cover: string;
  genre: string;
  tracks: Track[];
}

export const albums: Album[] = [
  {
    id: '1',
    title: '最后的水族馆',
    artist: '裘德',
    cover: '/music/最后的水族馆.jpg',
    genre: 'Pop',
    tracks: [
      { title: '游览指南', duration: '1:40', description: '', src: '/music/最后的水族馆/01_游览指南.mp3', lrc: '/music/最后的水族馆/01_游览指南.lrc' },
      { title: '浓缩蓝鲸', duration: '4:37', description: '', src: '/music/最后的水族馆/02_浓缩蓝鲸.mp3', lrc: '/music/最后的水族馆/02_浓缩蓝鲸.lrc' },
      { title: '水母银河', duration: '4:06', description: '', src: '/music/最后的水族馆/03_水母银河.mp3', lrc: '/music/最后的水族馆/03_水母银河.lrc' },
      { title: '浮动的岛', duration: '5:04', description: '', src: '/music/最后的水族馆/04_浮动的岛.mp3', lrc: '/music/最后的水族馆/04_浮动的岛.lrc' },
      { title: '气温差', duration: '4:13', description: '', src: '/music/最后的水族馆/05_气温差.mp3', lrc: '/music/最后的水族馆/05_气温差.lrc' },
      { title: 'B级鲨鱼', duration: '3:52', description: '', src: '/music/最后的水族馆/06_B级鲨鱼.mp3', lrc: '/music/最后的水族馆/06_B级鲨鱼.lrc' },
      { title: '火之涂写', duration: '4:49', description: '', src: '/music/最后的水族馆/07_火之涂写.mp3', lrc: '/music/最后的水族馆/07_火之涂写.lrc' },
      { title: '仿生海龟', duration: '3:14', description: '', src: '/music/最后的水族馆/08_仿生海龟.mp3', lrc: '/music/最后的水族馆/08_仿生海龟.lrc' },
      { title: '昨晚我梦见我学会了游泳', duration: '5:26', description: '', src: '/music/最后的水族馆/09_昨晚我梦见我学会了游泳.mp3', lrc: '/music/最后的水族馆/09_昨晚我梦见我学会了游泳.lrc' },
      { title: '磁悬浮列车', duration: '5:12', description: '', src: '/music/最后的水族馆/10_磁悬浮列车.mp3', lrc: '/music/最后的水族馆/10_磁悬浮列车.lrc' },
      { title: '最后的水族馆', duration: '4:44', description: '', src: '/music/最后的水族馆/11_最后的水族馆.mp3', lrc: '/music/最后的水族馆/11_最后的水族馆.lrc' },
    ],
  },
];
