export enum ROUTE_ID {
  HOME,
  BET,
  RESULTS,
  EXTRAS,
  RECORDS,
  RANKING,
  RULES,
}

export const ROUTES = [
  {
    id: ROUTE_ID.HOME,
    display: 'Home',
    url: '/home',
    needCredentials: false,
  },
  {
    id: ROUTE_ID.RESULTS,
    display: 'Resultados',
    url: '/resultados',
    needCredentials: false,
  },
  {
    id: ROUTE_ID.BET,
    display: 'Apostar',
    url: '/apostar',
    needCredentials: true,
  },
  { id: ROUTE_ID.EXTRAS, display: 'Extras', url: '/extras', needCredentials: true },
  { id: ROUTE_ID.RECORDS, display: 'Records', url: '/records', needCredentials: false },
  { id: ROUTE_ID.RANKING, display: 'Ranking', url: '/ranking', needCredentials: false },
  { id: ROUTE_ID.RULES, display: 'Regras', url: '/regras', needCredentials: false },
];

// export const ROUTES = {
//   HOME: {
//     display: 'Home',
//     url: '/home',
//   },
//   BETS: {
//     display: 'Apostar',
//     url: '/apostar',
//     urlWithParams: (week: number) => `${ROUTES.BETS.url}/${week}`,
//     withCredentials: true,
//   },
//   RESULTS: {
//     display: 'Resultados',
//     url: '/resultados',
//     urlWithParams: (week: number) => `${ROUTES.RESULTS.url}/${week}`,
//   },
//   EXTRAS: {
//     display: 'Extras',
//     url: '/extras',
//     withCredentials: true,
//   },
//   RECORDS: {
//     display: 'Records',
//     url: '/records',
//     urlWithParams: (recordsParam: string, weekParam?: string) => {
//       if (weekParam !== undefined) {
//         return `${ROUTES.RECORDS.url}/${recordsParam}/${weekParam}`;
//       }

//       return `${ROUTES.RECORDS.url}/${recordsParam}/`;
//     },
//   },
//   RANKING: {
//     display: 'Ranking',
//     url: '/ranking',
//     urlWithParams: (week: number) => {
//       return `${ROUTES.RANKING.url}/${week}/`;
//     },
//   },
//   RULES: {
//     display: 'Regras',
//     url: '/regras',
//   },
//   USERS: {
//     display: 'Usuários',
//     url: '/usuarios',
//     urlWithParams: (userId: string | undefined, weekParam?: number) => {
//       if (weekParam !== undefined && userId !== undefined) {
//         return `${ROUTES.USERS.url}/${userId}/${weekParam}`;
//       }

//       return `${ROUTES.USERS.url}/${userId}/`;
//     },
//   },
// };
