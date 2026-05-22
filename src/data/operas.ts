export interface Opera {
  id: string;
  title: string;
  composer: string;
  cover: string;
  notes: string;
  category: 'opera' | 'musical' | 'ballet';
}

export const operas: Opera[] = [];
