export interface IUser {
  active: boolean;
  admin: boolean;
  color: string;
  email: string;
  extraBetsCount?: number;
  fullName: string;
  icon: string;
  id: number;
  seasonId: number;
  isOnline: boolean;
  name: string;
  favorites: string[];
}
