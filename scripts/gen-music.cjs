const fs = require('fs');

const albumData = [
  { year: 1997, id: 'david-tao', title: 'David Tao', artist: '陶喆', cover: 'https://p2.music.126.net/vcyUJw7mfEzzMCgbJry31w==/109951169507121139.jpg', genre: 'R&B', tracks: ['飞机场的 10:30'] },
  { year: 1998, id: 'faye-sing', title: '唱游', artist: '王菲', cover: 'https://p2.music.126.net/W6MDlem6_FsymbnxKc_BKQ==/109951171530948990.jpg', genre: 'Pop', tracks: ['红豆'] },
  { year: 1999, id: 'david-ok', title: "I'm OK", artist: '陶喆', cover: 'https://p1.music.126.net/tMQXBMTy8pGjGggX1j0YNQ==/109951169389595068.jpg', genre: 'R&B', tracks: ['普通朋友'] },
  { year: 2000, id: 'jay-jay', title: 'Jay', artist: '周杰伦', cover: 'https://p1.music.126.net/Gd-HAk9hKC85L0wNtfRs1g==/7946170535396804.jpg', genre: 'Pop', tracks: ['星晴', '龙卷风', '反方向的钟', '印地安老斑鸠'] },
  { year: 2000, id: 'cheer-lonely', title: '还是会寂寞', artist: '陈绮贞', cover: 'https://p1.music.126.net/tCCrihOJLpMCDs--b0R8Xg==/109951163240612491.jpg', genre: 'Folk', tracks: ['还是会寂寞'] },
  { year: 2001, id: 'jay-fantasy', title: '范特西', artist: '周杰伦', cover: 'https://p1.music.126.net/7R4UhE4MBErGHvI-dB3Rzg==/109951165606034156.jpg', genre: 'Pop', tracks: ['爱在西元前', '简单爱', '忍者', '开不了口', '上海一九四三', '安静'] },
  { year: 2002, id: 'jay-8degree', title: '八度空间', artist: '周杰伦', cover: 'https://p2.music.126.net/eDfuSni9ZWToHdqilVRI_w==/109951166698447900.jpg', genre: 'Pop', tracks: ['半岛铁盒', '暗号', '爷爷泡的茶', '回到过去'] },
  { year: 2002, id: 'cheer-groupies', title: 'Groupies 吉他手', artist: '陈绮贞', cover: 'https://p2.music.126.net/Mvv6oyi8XjVfAIk0Lg76aA==/109951165876268707.jpg', genre: 'Folk', tracks: ['太聪明', '小步舞曲'] },
  { year: 2003, id: 'jay-yeh', title: '叶惠美', artist: '周杰伦', cover: 'https://p2.music.126.net/ZGffiDQZrGj5s_hnR1CNbg==/109951165566379710.jpg', genre: 'Pop', tracks: ['以父之名', '晴天', '东风破', '你听得到', '她的睫毛'] },
  { year: 2004, id: 'jay-jasmine', title: '七里香', artist: '周杰伦', cover: '', genre: 'Pop', tracks: ['七里香', '借口', '搁浅', '园游会', '止战之殇'] },
  { year: 2004, id: 'jj-heaven', title: '第二天堂', artist: '林俊杰', cover: 'https://p2.music.126.net/Gk4t93WwafRZtt9nTS77Iw==/109951171891430447.jpg', genre: 'Pop', tracks: ['江南'] },
  { year: 2004, id: 'cheer-after17', title: 'After 17', artist: '陈绮贞', cover: 'https://p2.music.126.net/YbQVFmtjEORastswVsal0g==/125344325567378.jpg', genre: 'Folk', tracks: ['After 17'] },
  { year: 2005, id: 'jay-chopin', title: '十一月的萧邦', artist: '周杰伦', cover: '', genre: 'Pop', tracks: ['夜曲', '发如雪', '枫', '浪漫手机', '麦芽糖', '珊瑚海', '一路向北'] },
  { year: 2005, id: 'cheer-travel', title: '旅行的意义', artist: '陈绮贞', cover: 'https://p1.music.126.net/NbGB1_vTJ6jX4B2r_I-EvA==/109951172349668373.jpg', genre: 'Folk', tracks: ['旅行的意义'] },
  { year: 2006, id: 'jay-still', title: '依然范特西', artist: '周杰伦', cover: 'https://p2.music.126.net/06Yhj36Qu3ZCQJklc9MNKg==/7980255395852522.jpg', genre: 'Pop', tracks: ['夜的第七章', '听妈妈的话', '退后', '白色风车', '菊花台'] },
  { year: 2006, id: 'khalil-love', title: '爱爱爱', artist: '方大同', cover: 'https://p1.music.126.net/2UjnKgcM1IXxYxhHEXVa4Q==/109951168870794250.jpg', genre: 'R&B', tracks: ['爱爱爱'] },
  { year: 2007, id: 'jay-busy', title: '我很忙', artist: '周杰伦', cover: 'https://p1.music.126.net/STWQpRLgUBOcXQIDPoEL_A==/109951163533011733.jpg', genre: 'Pop', tracks: ['牛仔很忙', '彩虹', '青花瓷', '蒲公英的约定', '我不配', '最长的电影'] },
  { year: 2007, id: 'eason-admit', title: '认了吧', artist: '陈奕迅', cover: 'https://p1.music.126.net/o_OjL_NZNoeog9fIjBXAyw==/18782957139233959.jpg', genre: 'Pop', tracks: ['爱情转移', '好久不见'] },
  { year: 2007, id: 'yanzi-light', title: '逆光', artist: '孙燕姿', cover: 'https://p2.music.126.net/wF25xzePLml5EGUWM2eInw==/109951173219336672.jpg', genre: 'Pop', tracks: ['我怀念的'] },
  { year: 2007, id: 'khalil-future', title: '未来', artist: '方大同', cover: 'https://p1.music.126.net/8fTdTkzJUc4jEcoiV5JNtw==/109951168870789373.jpg', genre: 'R&B', tracks: ['爱在'] },
  { year: 2008, id: 'jay-capricorn', title: '魔杰座', artist: '周杰伦', cover: 'https://p1.music.126.net/HBanuZpt8SD2kf15AFa6Og==/109951163200234839.jpg', genre: 'Pop', tracks: ['花海', '说好的幸福呢', '兰亭序', '稻香'] },
  { year: 2008, id: 'jj-land', title: 'JJ陆', artist: '林俊杰', cover: 'https://p2.music.126.net/m1Jv3k4Yl4kpBv62NPjGHQ==/109951172814148796.jpg', genre: 'Pop', tracks: ['Always Online'] },
  { year: 2009, id: 'cheer-sun', title: '太阳', artist: '陈绮贞', cover: 'https://p2.music.126.net/T6EwKjP4pIVAQiX17prmeQ==/109951163612079871.jpg', genre: 'Folk', tracks: ['鱼'] },
  { year: 2009, id: 'xv-custom', title: '自定义', artist: '许嵩', cover: 'https://p2.music.126.net/Zg4XDfsiRi5vawjSWPP8Ng==/109951172899966259.jpg', genre: 'Pop', tracks: ['有何不可', '如果当时'] },
  { year: 2010, id: 'jay-cross', title: '跨时代', artist: '周杰伦', cover: '', genre: 'Pop', tracks: ['说了再见', '烟花易冷', '好久不见', '雨下一整晚', '我落泪・情绪零碎', '爱的飞行日记'] },
  { year: 2010, id: 'jj-she-said', title: '她说 概念自选辑', artist: '林俊杰', cover: 'https://p2.music.126.net/LI3duoHIZyyLawRJLY51kA==/109951172024569374.jpg', genre: 'Pop', tracks: ['当你', '一生的爱'] },
  { year: 2010, id: 'xv-plain', title: '素颜', artist: '许嵩/何曼婷', cover: 'https://p2.music.126.net/t3ogpTd1bIJpwokhkpBtwQ==/109951169829246225.jpg', genre: 'Pop', tracks: ['素颜'] },
  { year: 2011, id: 'jay-exclaim', title: '惊叹号', artist: '周杰伦', cover: 'https://p1.music.126.net/aRmkU-iV0yt0F6UTdEAN3A==/19123805742099070.jpg', genre: 'Pop', tracks: ['Mine Mine', '疗伤烧肉粽'] },
  { year: 2011, id: 'fish-love', title: '现在开始我爱你', artist: '梁静茹', cover: 'https://p1.music.126.net/QKCkMMW_fPDcczRNb0qZyg==/109951168163257789.jpg', genre: 'Pop', tracks: ['情歌'] },
  { year: 2012, id: 'jay-opus12', title: '十二新作', artist: '周杰伦', cover: 'https://p2.music.126.net/oL_TYdmT9mm_erNZb187_g==/109951163533013578.jpg', genre: 'Pop', tracks: ['红尘客栈', '乌克丽丽'] },
  { year: 2012, id: 'khalil-back', title: '回到未来', artist: '方大同', cover: 'https://p1.music.126.net/8I4zvpNSsj--wGNg-mE2kw==/109951168870428045.jpg', genre: 'R&B', tracks: ['麦恩莉'] },
  { year: 2012, id: 'yoga-size', title: '大小说家', artist: '林宥嘉', cover: 'https://p1.music.126.net/os7qbSSng_yni2ZFouUryw==/109951163167636205.jpg', genre: 'Pop', tracks: ['说谎'] },
  { year: 2013, id: 'jj-dark', title: '黑暗骑士', artist: '林俊杰', cover: 'https://p2.music.126.net/D_hiKMwrdQlqD36LoKLO2w==/109951163187408030.jpg', genre: 'Pop', tracks: ['原来'] },
  { year: 2014, id: 'jay-aah', title: '哎呦，不错哦', artist: '周杰伦', cover: 'https://p2.music.126.net/8qQyR1IArFfftFttSyqEGQ==/109951171855839606.jpg', genre: 'Pop', tracks: ['手写的从前'] },
  { year: 2014, id: 'khalil-danger', title: '危险世界', artist: '方大同', cover: 'https://p2.music.126.net/3Y0A55OzEnqKNiH5ODA54A==/109951172683046522.jpg', genre: 'R&B', tracks: ['特别的人'] },
  { year: 2015, id: 'xzq-gentleman', title: '绅士', artist: '薛之谦', cover: 'https://p2.music.126.net/vu7SHbVlMuszmSuKR2SKAQ==/109951168707343730.jpg', genre: 'Pop', tracks: ['演员'] },
  { year: 2016, id: 'guo-fly', title: '飞行器的执行周期', artist: '郭顶', cover: 'https://p1.music.126.net/wSMfGvFzOAYRU_yVIfquAA==/2946691248081599.jpg', genre: 'Pop', tracks: ['水星记'] },
  { year: 2016, id: 'waa-escape', title: '末路狂花', artist: '魏如萱', cover: 'https://p2.music.126.net/pUVA3A7XBN2WwGNXSPz4Og==/109951165958860830.jpg', genre: 'Pop', tracks: ['你啊你啊'] },
  { year: 2016, id: 'khalil-soulboy', title: 'The Soulboy Collection', artist: '方大同', cover: 'https://p1.music.126.net/-UEqoOLy2P4dWzH3WrBlbA==/109951167164989067.jpg', genre: 'R&B', tracks: ['小小虫', '三人游'] },
  { year: 2016, id: 'yoga-open', title: '今日营业中', artist: '林宥嘉', cover: 'https://p1.music.126.net/oVJmUJ1bPb_9eBOFCKLclQ==/109951163167730852.jpg', genre: 'Pop', tracks: ['天真有邪', '兜圈'] },
  { year: 2016, id: 'renran-grow', title: '从小到大', artist: '任然', cover: 'https://p2.music.126.net/L8SZ53Nf5le4JDvG6qVB6g==/1424967072083597.jpg', genre: 'Pop', tracks: ['疑心病'] },
  { year: 2017, id: 'xzq-crossing', title: '渡', artist: '薛之谦', cover: 'https://p1.music.126.net/fNbj5uDwltSDLbETdnEYYQ==/109951163069265719.jpg', genre: 'Pop', tracks: ['像风一样'] },
  { year: 2017, id: 'cheer-like', title: '我喜欢上你时的内心活动', artist: '陈绮贞', cover: 'https://p2.music.126.net/AyyxC4stCu-Pm5qa8gaqDQ==/18762066418246617.jpg', genre: 'Folk', tracks: ['我喜欢上你时的内心活动'] },
  { year: 2017, id: 'egg-cartoon', title: '卡通人物', artist: '茄子蛋', cover: 'https://p2.music.126.net/T0MxUmfR138wswQxKFuRBg==/109951169303184083.jpg', genre: 'Rock', tracks: ['浪子回头'] },
  { year: 2018, id: 'xzq-freak', title: '怪咖', artist: '薛之谦', cover: 'https://p1.music.126.net/TOkRGd59o3hAOKsnMMmMMA==/109951163755246383.jpg', genre: 'Pop', tracks: ['天份', '哑巴'] },
  { year: 2020, id: 'xzq-alien', title: '天外来物', artist: '薛之谦', cover: 'https://p1.music.126.net/MgH6SepYHboKPr6FR8yg-w==/109951167040040692.jpg', genre: 'Pop', tracks: ['天外来物'] },
  { year: 2020, id: 'renran-love', title: '没有发生的爱情', artist: '任然', cover: 'https://p1.music.126.net/mIUtHBPTJ52H78_FhHzcWg==/19188676928210304.jpg', genre: 'Pop', tracks: ['无人之岛'] },
  { year: 2020, id: 'renran-cicada', title: '飞鸟和蝉', artist: '任然', cover: 'https://p2.music.126.net/FgYDnoq4SghGICjtWE1tfA==/109951165915191681.jpg', genre: 'Pop', tracks: ['飞鸟和蝉'] },
  { year: 2021, id: 'jude-award', title: '颁奖的时候我要缺席', artist: '裘德', cover: 'https://p2.music.126.net/RKPyDWCG43iUFjM7WfzruA==/109951164567769090.jpg', genre: 'Pop', tracks: ['颁奖的时候我要缺席', '老古董', '瑞贝卡', 'K 先生', '莫比乌斯号的船医', '弟弟', '黑乌鸦和少女', '北海道恋人'] },
  { year: 2022, id: 'jude-aquarium', title: '最后的水族馆', artist: '裘德', cover: '/music/最后的水族馆.jpg', genre: 'Pop', tracks: [
    '游览指南|1:40|/music/最后的水族馆/01_游览指南.mp3|/music/最后的水族馆/01_游览指南.lrc',
    '浓缩蓝鲸|4:37|/music/最后的水族馆/02_浓缩蓝鲸.mp3|/music/最后的水族馆/02_浓缩蓝鲸.lrc',
    '水母银河|4:06|/music/最后的水族馆/03_水母银河.mp3|/music/最后的水族馆/03_水母银河.lrc',
    '浮动的岛|5:04|/music/最后的水族馆/04_浮动的岛.mp3|/music/最后的水族馆/04_浮动的岛.lrc',
    '气温差|4:13|/music/最后的水族馆/05_气温差.mp3|/music/最后的水族馆/05_气温差.lrc',
    'B级鲨鱼|3:52|/music/最后的水族馆/06_B级鲨鱼.mp3|/music/最后的水族馆/06_B级鲨鱼.lrc',
    '火之涂写|4:49|/music/最后的水族馆/07_火之涂写.mp3|/music/最后的水族馆/07_火之涂写.lrc',
    '仿生海龟|3:14|/music/最后的水族馆/08_仿生海龟.mp3|/music/最后的水族馆/08_仿生海龟.lrc',
    '昨晚我梦见我学会了游泳|5:26|/music/最后的水族馆/09_昨晚我梦见我学会了游泳.mp3|/music/最后的水族馆/09_昨晚我梦见我学会了游泳.lrc',
    '磁悬浮列车|5:12|/music/最后的水族馆/10_磁悬浮列车.mp3|/music/最后的水族馆/10_磁悬浮列车.lrc',
    '最后的水族馆|4:44|/music/最后的水族馆/11_最后的水族馆.mp3|/music/最后的水族馆/11_最后的水族馆.lrc',
  ]},
  { year: 2023, id: 'ayue-hibernate', title: '冬眠·2023', artist: '阿YueYue', cover: 'https://p2.music.126.net/nB_ehXFvd7l7eNg1urWj5A==/109951169622127406.jpg', genre: 'Pop', tracks: ['冬眠'] },
  { year: 2023, id: 'jude-tree', title: '一棵树所创造的', artist: '裘德', cover: 'https://p1.music.126.net/o7BUSqgJTjvMDgkIDoC2Vg==/109951169598043440.jpg', genre: 'Pop', tracks: ['荔枝', '椰子船', '薛定谔果'] },
  { year: 2024, id: 'jude-self', title: '裘德', artist: '裘德', cover: 'https://p1.music.126.net/EjyEKuuM_xoag8Jg-2AewQ==/109951169188739215.jpg', genre: 'Pop', tracks: ['伊始', '胚胎', '练声曲', '色盲', '今天吃点什么好', '斯德哥尔摩难题', '体无完肤', '麻烦删掉狮子座', '饥饿女士', '瘸子之舞', '缺氧', '骨骼谢幕'] },
  { year: 2024, id: 'khalil-dreamer', title: '梦想家 The Dreamer', artist: '方大同', cover: 'https://p1.music.126.net/dlsDdLopwJrE8JlWgWbaOA==/109951170031584299.jpg', genre: 'R&B', tracks: ['才二十三', 'BB88'] },
  { year: 2025, id: 'jude-silver', title: '离开银色荒原', artist: '裘德', cover: 'https://p1.music.126.net/r1AKMenByofI7Qqj3E5EqQ==/109951172091080013.jpg', genre: 'Pop', tracks: ['银色荒原', '火山灰', '春天的临终', '飞鸟在风暴中', '奇卡奇卡', '变色龙 (feat. 吴青峰)', '没有羊的牧羊人', '请求迷失在七月森林 (feat. 孙盛希)', '我们不要躲雨了', '寻找一片青草地'] },
  { year: 2025, id: 'teen-cool', title: '我其实一点都不酷', artist: '公馆青少年', cover: 'https://p2.music.126.net/vhhqD6EjGkvwpfwqDSlEuA==/109951170223320914.jpg', genre: 'Pop', tracks: ['一个人默默的酷', '要不要跟我出去走一走'] },
  { year: 3000, id: 'singles-rest', title: '散曲', artist: 'Various', cover: '', genre: 'Various', type: 'playlist', tracks: [
    '香格里拉', '新手', 'Simon', '大年夜怪奇物语', 'Let Me Go', 'Simon (Live)', '拆穿 (Live)',
    '第三人称', '爱错', '我在纽约打电话给你', '后知后觉',
    '你是我的风景', '想自由', '刻在我心底的名字', '那个女孩', '几分之几',
    '留香', '飞鸽', '半空', '颜色', '用背脊唱情歌', '国际孤独等级', '关于爱的定义', '低空鸟人',
  ]},
];

// Sort by year descending (newest first)
albumData.sort((a, b) => b.year - a.year);

// Pin 最后的水族馆 to the top
const aquariumIdx = albumData.findIndex(a => a.id === 'jude-aquarium');
if (aquariumIdx > 0) {
  const [aquarium] = albumData.splice(aquariumIdx, 1);
  albumData.unshift(aquarium);
}

function esc(s) { return s.replace(/'/g, "\\'").replace(/・/g, '・'); }

let output = `export interface Track {
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
  type?: 'album' | 'playlist';
  tracks: Track[];
}

export const albums: Album[] = [
`;

for (let i = 0; i < albumData.length; i++) {
  const a = albumData[i];
  output += '  {\n';
  output += '    id: \'' + esc(a.id) + '\',\n';
  output += '    title: \'' + esc(a.title) + '\',\n';
  output += '    artist: \'' + esc(a.artist) + '\',\n';
  output += '    cover: \'' + esc(a.cover) + '\',\n';
  output += '    genre: \'' + esc(a.genre) + '\',\n';
  if (a.type) output += '    type: \'' + esc(a.type) + '\',\n';
  output += '    tracks: [\n';
  for (const t of a.tracks) {
    const parts = t.split('|');
    if (parts.length === 4) {
      output += '      { title: \'' + esc(parts[0]) + '\', duration: \'' + parts[1] + '\', description: \'\', src: \'' + parts[2] + '\', lrc: \'' + parts[3] + '\' },\n';
    } else {
      output += '      { title: \'' + esc(t) + '\', duration: \'\', description: \'暂无版权\' },\n';
    }
  }
  output += '    ],\n';
  output += '  },\n';
}

output += '];\n';

fs.writeFileSync('src/data/music.ts', output);
console.log('Done. Written ' + albumData.length + ' albums.');
