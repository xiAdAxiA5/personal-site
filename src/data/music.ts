export interface Album {
  id: string;
  title: string;
  artist: string;
  cover: string;
  genre: string;
}

export const albums: Album[] = [
  {
    id: '1',
    title: 'OK Computer',
    artist: 'Radiohead',
    cover: 'https://picsum.photos/seed/album1/300/300',
    genre: 'Alternative Rock',
  },
  {
    id: '2',
    title: 'Random Access Memories',
    artist: 'Daft Punk',
    cover: 'https://picsum.photos/seed/album2/300/300',
    genre: 'Electronic',
  },
  {
    id: '3',
    title: 'Kind of Blue',
    artist: 'Miles Davis',
    cover: 'https://picsum.photos/seed/album3/300/300',
    genre: 'Jazz',
  },
  {
    id: '4',
    title: 'Abbey Road',
    artist: 'The Beatles',
    cover: 'https://picsum.photos/seed/album4/300/300',
    genre: 'Rock',
  },
  {
    id: '5',
    title: 'Blonde',
    artist: 'Frank Ocean',
    cover: 'https://picsum.photos/seed/album5/300/300',
    genre: 'R&B',
  },
  {
    id: '6',
    title: 'In Rainbows',
    artist: 'Radiohead',
    cover: 'https://picsum.photos/seed/album6/300/300',
    genre: 'Alternative Rock',
  },
];
