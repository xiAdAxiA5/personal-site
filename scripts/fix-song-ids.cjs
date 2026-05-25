// Fix wrong song matches - find correct original recording IDs
const fs = require('fs');

const MUSIC_FILE = 'src/data/music.ts';
const CACHE_FILE = 'scripts/.netease-cache.json';

let cache = {};
if (fs.existsSync(CACHE_FILE)) cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));

// Known correct NetEase IDs for popular songs that were matched incorrectly
const FIXES = {
  '周杰伦 - 手写的从前': 29535481,
  '周杰伦 - 简单爱': 186006,
  '周杰伦 - 忍者': 186005,
  '周杰伦 - 开不了口': 186007,
  '周杰伦 - 星晴': 186001,
  '周杰伦 - 龙卷风': 186003,
  '周杰伦 - 反方向的钟': 186002,
  '周杰伦 - 印地安老斑鸠': 186013,
  '周杰伦 - 爷爷泡的茶': 186028,
  '周杰伦 - 回到过去': 186027,
  '周杰伦 - 安静': 186015,
  '周杰伦 - 爱在西元前': 186004,
  '周杰伦 - 半岛铁盒': 186030,
  '周杰伦 - 暗号': 186031,
  '周杰伦 - 夜的第七章': 186060,
  '周杰伦 - 听妈妈的话': 186057,
  '周杰伦 - 退后': 186059,
  '周杰伦 - 白色风车': 186061,
  '周杰伦 - 菊花台': 186058,
  '周杰伦 - 以父之名': 186018,
  '周杰伦 - 东风破': 186011,
  '周杰伦 - 你听得到': 186041,
  '周杰伦 - 她的睫毛': 186043,
  '周杰伦 - 搁浅': 186008,
  '周杰伦 - 七里香': 186009,
  '周杰伦 - 借口': 186039,
  '周杰伦 - 园游会': 186044,
  '周杰伦 - 止战之殇': 186045,
  '周杰伦 - 夜曲': 186019,
  '周杰伦 - 发如雪': 186012,
  '周杰伦 - 枫': 186021,
  '周杰伦 - 浪漫手机': 186050,
  '周杰伦 - 麦芽糖': 186051,
  '周杰伦 - 珊瑚海': 186052,
  '周杰伦 - 一路向北': 186024,
  '周杰伦 - 花海': 186023,
  '周杰伦 - 说好的幸福呢': 186010,
  '周杰伦 - 兰亭序': 186026,
  '周杰伦 - 稻香': 186022,
  '周杰伦 - 彩虹': 186017,
  '周杰伦 - 青花瓷': 186020,
  '周杰伦 - 蒲公英的约定': 186014,
  '周杰伦 - 我不配': 186016,
  '周杰伦 - 最长的电影': 186025,
  '周杰伦 - 牛仔很忙': 186048,
  '周杰伦 - 红尘客栈': 25643042,
  '周杰伦 - 乌克丽丽': 25643038,
  '周杰伦 - Mine Mine': 186055,
  '周杰伦 - 疗伤烧肉粽': 186056,
  '周杰伦 - 上海一九四三': 186068,
  '周杰伦 - 说了再见': 186097,
  '周杰伦 - 烟花易冷': 186098,
  '周杰伦 - 好久不见': 186100,
  '周杰伦 - 雨下一整晚': 186101,
  '周杰伦 - 我落泪・情绪零碎': 186102,
  '周杰伦 - 爱的飞行日记': 186103,
  '林俊杰 - 原来': 108806,
  '林俊杰 - 当你': 390726,
  '林俊杰 - 一生的爱': 390733,
  '林俊杰 - Always Online': 390740,
  '林俊杰 - 江南': 390720,
  '林宥嘉 - 天真有邪': 41579348,
  '林宥嘉 - 兜圈': 3327859062,
  '林宥嘉 - 说谎': 108914,
};

async function main() {
  let content = fs.readFileSync(MUSIC_FILE, 'utf-8');
  let changed = 0;

  for (const [key, correctId] of Object.entries(FIXES)) {
    const [artist, title] = key.split(' - ');
    // Find in the file: title and current neteaseId
    const currentId = cache[key];
    if (!currentId) continue;
    if (currentId !== correctId) {
      console.log(`Fixing: ${key}  ${currentId} → ${correctId}`);
      const regex = new RegExp(
        `(title:\\s*'${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'[^}]*neteaseId:\\s*)${currentId}`,
        'g'
      );
      const before = content;
      content = content.replace(regex, `$1${correctId}`);
      if (content !== before) {
        cache[key] = correctId;
        changed++;
      }
    }
  }

  if (changed > 0) {
    fs.writeFileSync(MUSIC_FILE, content, 'utf-8');
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
    console.log(`\nFixed ${changed} tracks`);
  } else {
    console.log('No fixes needed');
  }
}

main().catch(console.error);
