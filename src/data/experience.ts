export interface Experience {
  id: string;
  type: 'education' | 'work';
  title: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  highlights: string[];
}

export const experiences: Experience[] = [
  {
    id: '1',
    type: 'education',
    title: '计算机科学与技术 本科',
    organization: '某某大学',
    location: '北京',
    startDate: '2018-09',
    endDate: '2022-06',
    description: '主修计算机科学与技术，辅修数据科学。',
    highlights: ['GPA 3.8/4.0', '校级优秀毕业生', 'ACM 竞赛银奖'],
  },
  {
    id: '2',
    type: 'work',
    title: '高级前端工程师',
    organization: '某科技公司',
    location: '上海',
    startDate: '2022-07',
    endDate: '至今',
    description: '负责核心产品前端架构设计与开发。',
    highlights: [
      '主导前端微服务架构迁移',
      '开发内部组件库，覆盖 50+ 组件',
      '页面性能优化，LCP 降低 60%',
    ],
  },
  {
    id: '3',
    type: 'work',
    title: '前端开发实习生',
    organization: '某互联网公司',
    location: '深圳',
    startDate: '2021-06',
    endDate: '2021-09',
    description: '参与电商平台前端开发。',
    highlights: ['参与营销活动页面开发', '优化图片加载策略'],
  },
];
