import { getTotalFollowers } from '../data/social';

export function useFollowerCount() {
  return getTotalFollowers();
}
