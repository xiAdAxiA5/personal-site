export interface Skill {
  name: string;
  level: number;
  category: 'frontend' | 'backend' | 'devops' | 'tools';
  icon: string;
}

export const skills: Skill[] = [
  { name: 'Python', level: 15, category: 'backend', icon: 'python' },
];
