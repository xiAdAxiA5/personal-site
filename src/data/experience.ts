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
    title: '临床医学 本科',
    organization: '河北医科大学',
    location: '',
    startDate: '2021-09',
    endDate: '2026-06',
    description: '',
    highlights: [],
  },
  {
    id: '2',
    type: 'work',
    title: '临床实习',
    organization: '唐山工人医院',
    location: '',
    startDate: '2024-06',
    endDate: '2026-06',
    description: '',
    highlights: [],
  },
  {
    id: '3',
    type: 'education',
    title: '特种医学 硕士',
    organization: '温州医科大学',
    location: '',
    startDate: '2026-09',
    endDate: '2029-06',
    description: '',
    highlights: [],
  },
];
