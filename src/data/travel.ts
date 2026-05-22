export interface TravelPlace {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
}

export const travelPlaces: TravelPlace[] = [
  { id: '1', name: '北京', lat: 39.9042, lng: 116.4074, description: '故宫、长城、胡同' },
  { id: '2', name: '上海', lat: 31.2304, lng: 121.4737, description: '外滩、弄堂、新天地' },
  { id: '3', name: '东京', lat: 35.6762, lng: 139.6503, description: '秋叶原、涩谷、浅草寺' },
  { id: '4', name: '新加坡', lat: 1.3521, lng: 103.8198, description: '滨海湾、圣淘沙' },
  { id: '5', name: '巴黎', lat: 48.8566, lng: 2.3522, description: '卢浮宫、埃菲尔铁塔' },
  { id: '6', name: '纽约', lat: 40.7128, lng: -74.006, description: '时代广场、中央公园' },
];
