export interface Skill {
  name: string;
  level: number;
  category: 'frontend' | 'backend' | 'devops' | 'tools';
  icon: string;
}

export const skills: Skill[] = [
  { name: 'React', level: 95, category: 'frontend', icon: 'react' },
  { name: 'TypeScript', level: 90, category: 'frontend', icon: 'typescript' },
  { name: 'Vue.js', level: 80, category: 'frontend', icon: 'vue' },
  { name: 'Next.js', level: 85, category: 'frontend', icon: 'next' },
  { name: 'Node.js', level: 88, category: 'backend', icon: 'node' },
  { name: 'Python', level: 75, category: 'backend', icon: 'python' },
  { name: 'Go', level: 65, category: 'backend', icon: 'go' },
  { name: 'PostgreSQL', level: 80, category: 'backend', icon: 'database' },
  { name: 'Docker', level: 78, category: 'devops', icon: 'docker' },
  { name: 'AWS', level: 70, category: 'devops', icon: 'cloud' },
  { name: 'CI/CD', level: 82, category: 'devops', icon: 'pipeline' },
  { name: 'Figma', level: 72, category: 'tools', icon: 'figma' },
  { name: 'Git', level: 90, category: 'tools', icon: 'git' },
  { name: 'VS Code', level: 92, category: 'tools', icon: 'vscode' },
];
