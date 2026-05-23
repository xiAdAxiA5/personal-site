export interface TravelPlace {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
}

export const travelPlaces: TravelPlace[] = [
  { id: '1', name: '北京', lat: 39.9042, lng: 116.4074, description: '故宫、长城、胡同' },
  { id: '2', name: '温州', lat: 28.0006, lng: 120.6994, description: '' },
  { id: '3', name: '天津', lat: 39.3434, lng: 117.3616, description: '' },
  { id: '4', name: '易县', lat: 39.3489, lng: 115.4981, description: '' },
  { id: '5', name: '唐山', lat: 39.6305, lng: 118.1802, description: '' },
  { id: '6', name: '石家庄', lat: 38.0423, lng: 114.5149, description: '' },
];
