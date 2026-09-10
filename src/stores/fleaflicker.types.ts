export interface IFleaflickerInjury {
  typeAbbreviaition: string;
  severity: string;
  typeFull: string;
  description: string;
}

export interface IFleaflickerProPlayer {
  id: number;
  nameFull: string;
  nameShort: string;
  proTeamAbbreviation: string;
  position: string;
  headshotUrl: string;
  nflByeWeek?: number;
  injury?: IFleaflickerInjury;
  news?: IFleaflickerNews[];
}

export interface IFleaflickerOwner {
  id: number;
  name: string;
  logoUrl: string;
  initials: string;
}

export interface IFleaflickerNews {
  timeEpochMilli: string;
  title: string;
  url: string;
  contents: string;
}

export interface IFleaflickerTeam {
  abbreviation: string;
  name: string;
  location: string;
}
export interface IFleaflickerRequestedGame {
  game: {
    id: number;
    away: IFleaflickerTeam;
    home: IFleaflickerTeam;
  };
  participant: 'HOME' | 'AWAY';
  stats: IFleaflickerStats[];
  statsProjected?: IFleaflickerStats[];
  pointsActual?: IFleaflickerPoints;
  pointsProjected?: IFleaflickerPoints;
  isProjectedStarter?: boolean;
  inScoringPosition?: boolean;
  hasPossession: boolean;
}

export interface IFleaflickerPoints {
  value: number;
  formatted: string;
}
export interface IFleaflickerStats {
  category: { abbreviation: string; namePlural: string };
  value: { formatted: string };
}
export interface IFleaflickerLeaguePlayer {
  proPlayer: IFleaflickerProPlayer;
  requestedGames: IFleaflickerRequestedGame[];
  viewingActualPoints?: IFleaflickerPoints;
  viewingProjectedPoints?: IFleaflickerPoints;
  viewingActualStats?: IFleaflickerStats[];
  viewingProjectedStats?: IFleaflickerStats[];
  owner?: IFleaflickerOwner;
}

export interface IFleaflickerSlotPosition {
  label: string;
  group: string;
  eligibility?: string[];
}

export interface IFleaflickerSlot {
  position: IFleaflickerSlotPosition;
  leaguePlayer?: IFleaflickerLeaguePlayer;
}

export type TFleaflickerGroup = 'START' | 'INJURED' | 'TAXI';

export interface IFleaflickerGroup {
  group: TFleaflickerGroup;
  slots: IFleaflickerSlot[];
}

export interface IFleaflickerRoster {
  groups: IFleaflickerGroup[];
}

// ── Standings ──
export interface IFleaflickerStandingsOwner {
  id: number;
  displayName: string;
  initials: string;
  lastSeen?: string;
  lastSeenIso?: string;
}

export interface IFleaflickerRecord {
  wins?: number;
  losses?: number;
  ties?: number;
  winPercentage?: { formatted: string };
  formatted: string;
}

export interface IFleaflickerStandingsTeam {
  id: number;
  name: string;
  initials?: string;
  logoUrl?: string;
  owners: IFleaflickerStandingsOwner[];
  recordOverall: IFleaflickerRecord;
  recordPostseason?: IFleaflickerRecord;
  pointsFor: { value?: number; formatted: string };
  pointsAgainst: { value?: number; formatted: string };
  streak?: { formatted: string };
  waiverAcquisitionBudget?: { value: number; formatted: string };
}

export interface IFleaflickerStandingsDivision {
  id: number;
  name?: string;
  teams: IFleaflickerStandingsTeam[];
}

export interface IFleaflickerStandingsLeague {
  id: number;
  name: string;
}

export interface IFleaflickerStandings {
  season: number;
  league: IFleaflickerStandingsLeague;
  divisions: IFleaflickerStandingsDivision[];
}

// ── Scoreboard ──
export interface IFleaflickerScoreboardTeam {
  id: number;
  name: string;
  initials?: string;
  logoUrl?: string;
  recordOverall?: { formatted: string };
}

export interface IFleaflickerScoreboardScore {
  score: { formatted: string };
  projected?: { value: number; formatted: string };
  yetToPlay?: number;
  yetToPlayPositions?: string[];
}

export interface IFleaflickerScoreboardGame {
  id: string;
  away: IFleaflickerScoreboardTeam;
  home: IFleaflickerScoreboardTeam;
  awayScore: IFleaflickerScoreboardScore;
  homeScore: IFleaflickerScoreboardScore;
  isDivisional?: boolean;
}

export interface IFleaflickerScoreboardPeriod {
  ordinal: number;
  value: number;
}

export interface IFleaflickerScoreboard {
  schedulePeriod: IFleaflickerScoreboardPeriod;
  eligibleSchedulePeriods: IFleaflickerScoreboardPeriod[];
  games: IFleaflickerScoreboardGame[];
}

export interface IFleaflickerFlatSlot extends IFleaflickerSlot {
  slotLabel: string;
  groupLabel: string;
  positionOrder: number;
  slotOrder: number;
}
