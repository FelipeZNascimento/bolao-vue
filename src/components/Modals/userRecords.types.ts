export interface ISeasonRecord {
  season: { id: number; label: string };
  user: { id: number; name: string; icon: string; color: string };
  percentage: string;
  points: number;
  bullseye: number;
  winner: number;
  totalBets: number;
  totalGames: number;
  position: number;
  totalParticipants: number;
  extras: number;
  totalPossiblePoints: number;
  totalPossibleExtras: number;
}

export interface ISeasonRecordsResponse {
  all: ISeasonRecord[];
  [userId: string]: ISeasonRecord[];
}

export interface IUserRecordSeason {
  percentage: number;
  points: number;
  position: number;
  season: number;
  totalParticipants: number;
  totalPossiblePoints: number;
}

export interface IUserRecordWeek {
  bullseye: number;
  percentage: number;
  points: number;
  season: number;
  seasonLabel: string;
  totalPossiblePoints: number;
  week: number;
}

export interface IUserRecords {
  seasons: IUserRecordSeason[];
  topWeeks: IUserRecordWeek[];
  bottomWeeks: IUserRecordWeek[];
  totalBets: number;
  totalBullseyes: number;
  totalWins: number;
}
