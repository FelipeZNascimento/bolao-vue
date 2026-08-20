# bolao-vue

## 1.6.0

### Minor Changes

- 5b8f5c2: Add teams view;
  Improve logged in home with new sections (extras, news);
  Started working with Pinia's storeToRefs;
  Mobile UI/UX improvements;

## 1.5.0

### Minor Changes

- 05535e8: Fix reset password flow;
- 05535e8: Add favorites;
- 9021aca: Home now has two versions: for logged in users and for guests;
  Logged in Home now has a News section;
  New ranking page;

## 1.4.0

### Minor Changes

- cc497ef: Home page was added;
  Extensive adjustments to light and dark themes;

## 1.3.0

### Minor Changes

- cb9bab6: Fix match modal UI;

## 1.2.0

### Minor Changes

- c68333b: Clock can be clicked for more details on a match that hasn't started;
  Added a footer to track version and source code;

## 1.1.0

### Minor Changes

- 2a5b103: Results and Bets are now one merged section called Games;
  Betting component now uses PrimeVue's SelectButton instead of RadioButton;
  Indicators for correct margin and user bet are now being displayed below the match in line mode, and to the right of the match in grid mode;
  Bullseye now is represented with gold instead of green;
  Odds are now displayed with the clock (for mobile and desktop) instead of at a team's score;
  Grid and lines display was greatly improved for mobile users;

## 1.0.0

### Major Changes

- 5485afd: Results and bets pages are converging into a single page;
  Versioning is now part of the process;
  Readme, Contributing and Versioning files were added to the project to improve the understanding of the project;
  The CI/CD pipeline was improved to deploy snapshots automatically and promote them to production manually;
  The project is now using pnpm instead of npm;
  Linting and formatting are now made by oxlint and oxfmt instead of eslint and prettier;
  Colors now have 3 lighter and darker variations;
