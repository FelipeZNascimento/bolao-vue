# bolao-vue

## 1.11.2

### Patch Changes

- 76e25ec: Fix:
    - Extras are now properly loading;

## 1.11.1

### Patch Changes

- 8d37596: Features
    - Balance is now added to the user's account (so you know how much you accumulated from winning weeks);
  
  UI/UX Improvements
    - Ranking now has color indication for top 5 season ranking positions, and top 1 weekly ranking position;
    - Number of winners is now displayed in the ranking page;
    - Payments can now be done on MB Way and Paypal too;
    - Other minor UI/UX improvements;
    - Ranking is now visible for guest users;
  
  Fix
    - Rules are now more clear towards prizes;

## 1.11.0

### Minor Changes

- 0c4b11d: Features:
  - Match modal has been vastly improved with a game center layout, including match info, drives, stats and betting;

## 1.10.6

### Patch Changes

- 8fee6cc: Fix:
    Mobile view for fleaflicker integration.

## 1.10.5

### Patch Changes

- c103921: Fix:
    Flow to link fleaflicker account has been trimmed;

## 1.10.4

### Patch Changes

- e1684ea: Feature:
    Fleaflicker integration: You can now connect your Fleaflicker account and see your team's roster, standings and scores.

## 1.10.3

### Patch Changes

- f548bbb: Improvements:
    Websockets now have a reconnect logic so idle users get refreshed state when coming back to the page/app;
    Google Analytics tags included;
  
  UI/UX:
    Repositioned online badge to be closer to the user icon;
    Other minor UI/UX tweaks and fixes;

## 1.10.2

### Patch Changes

- df5b36f: Fix:
  - Horizontal scrollbar on some viewports;

## 1.10.1

### Patch Changes

- 5e0ff70: Fix:
  - Horizontal scrollbar on some viewports;

## 1.10.0

### Minor Changes

- 2476ac8: Fix:
  - Live scores update working again (webscokets were broken);
  
  Features:
  - "Coming Soon" updated with newly implemented features;
  - News now available in both Portuguese and English;
  - Plenty new animations for live matches upon score change;

## 1.9.1

### Patch Changes

- c18d94d: UX/UI improvements:
  - Tables in History page now have a filter for minimum participation percentage;
  - Tables have now striped rows for better readability;
  - Mobile styles for History page;
  - Live games now have a pulsing red dot, and are centralized;
  - Other minor UI tweaks;

## 1.9.0

### Minor Changes

- 8f84c81: Features:
  - History page was added with season records;
  - User modal now has tabs with records, weeks and graph;
  
  Bug fixes:
  - Reset password email link now works;
  
  UX/UI improvements:
  - Rules are now in a single page, separated by sections;
  - Added week selector in the Ranking page;
  - Add mobile styles to admin page stats cards;
  - Admin page now has a refresh button and displays some stats about users;
  - Team logo sizes are now responsive on "Jogos" for grid and lines views;
  - Modals were moved to a new component, to be used as a container for all modals in the app. Triggering a modal is now done by changing a value in the modals store (which was also created for this purpose);
  - Other minor UI tweaks;

## 1.8.0

### Minor Changes

- 190a755: Bug fixes:
  - Reset password email link now works;
  
  UX/UI improvements:
  - Rules are now in a single page, separated by sections;
  - Added week selector in the Ranking page;
  - Add mobile styles to admin page stats cards;
  - Admin page now has a refresh button and displays some stats about users;
  - Team logo sizes are now responsive on "Jogos" for grid and lines views;
  - Modals were moved to a new component, to be used as a container for all modals in the app. Triggering a modal is now done by changing a value in the modals store (which was also created for this purpose);
  - Other minor UI tweaks;

## 1.7.1

### Patch Changes

- a4aa2c6: Hide activation warning when there's no active profile;
  Add admin to mobile menu;

## 1.7.0

### Minor Changes

- 42a6176: Guide users through account activation;
  Retry mechanism on all API requests;
  Revamp error handling;
  Add admin page;

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
