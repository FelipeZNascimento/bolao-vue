export interface IUser {
  active: boolean;
  balance: number;
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
  fleaflicker: {
    leagueId: number;
    teamId: number;
  } | null;
}
