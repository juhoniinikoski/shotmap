export type Venue = {
  venueId: number;
  providerId: number;
  name: string;
  abbrv: string;
  city: string;
  streetAddress: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  createdTime: Date;
  modifiedTime: Date;
};

export type Period = {
  periodId: number;
  gameId: number;
  periodNumber: number;
  periodCategory: string;
  startTime: number;
  endTime: number;
  createdTime: Date;
  modifiedTime: Date;
};

export type Serie = {
  serieId: number;
  providerId: number;
  levelId: number;
  serieName: string;
  levelName: string;
  serieAbbrv: string;
  levelAbbrv: string;
  category: string;
  onlyStandings: number;
  onlySchedule: number;
  createdTime: Date;
  modifiedTime: Date;
};

export type SubSerie = {
  subSerieId: number;
  providerId: number;
  serieId: number;
  name: string;
  abbreviation: string;
  statGroupId: number;
  season: number;
  deleted: number;
  playoffs: number;
  createdTime: Date;
  modifiedTime: Date;
};

export type Game = {
  gameId: number;
  subSerieId: number;
  providerId: number;
  season: number;
  date: Date;
  deleted: number;
  startTime: string;
  endTime: string;
  venueId: number;
  rinkNumber: number;
  clockTime: number;
  currentPeriod?: number;
  finished: number;
  overtime: number;
  shootout: number;
  homeTeamId: number;
  awayTeamId: number;
  overrideHomeTeam?: number;
  overrideAwayTeam?: number;
  homeScore: number;
  awayScore: number;
  playoffPair?: number;
  playoffPhase?: number;
  playoffPhaseName?: string;
  playoffReqWins?: number;
  homeTeamTimeout: number;
  awayTeamTimeout: number;
  spectators?: number;
  hasExtraPeriod: number;
  hasOvertime: number;
  hasShootout: number;
  totalPeriods: number;
  createdTime: Date;
  modifiedTime: Date;
  statGroupId: number;
  serieId: number;
  subSerie?: SubSerie;
  serie: Serie;
  periods: Period[];
  homeTeam: Team;
  awayTeam: Team;
  venue: Venue;
};

export type Player = {
  playerId: number;
  providerId: number;
  firstName: string;
  lastName: string;
  dateOfBirth: number;
  placeOfBirth: string;
  countryOfBirth: string;
  nationality: string;
  height: number;
  weight: number;
  handed: string;
  position: string;
  lastTeamId: number;
  lastTeamDate: Date;
  createdTime: Date;
  modifiedTime: Date;
};

export type Team = {
  id: string;
  teamId: number;
  providerId: number;
  name: string;
  officialName: string;
  createdTime: Date;
  modifiedTime: Date;
};

export type Shot = {
  providerId: number;
  gameProviderId: number;
  playerProviderId: number;
  teamProviderId: number;
  opponentProviderId: number;
  opponentTeamProviderId: number;
  type: string;
  gametime: number;
  originalX: number;
  originalY: number;
  translatedX: number;
  translatedY: number;
  goalX: number;
  goalY: number;
  gameId: number;
  teamId: number;
  opponent?: Player;
  opponentTeamId: number;
  opponentTeam?: Team;
  team?: Team;
  player?: Player;
  playerNumber: number;
  opponentNumber: number;
};
