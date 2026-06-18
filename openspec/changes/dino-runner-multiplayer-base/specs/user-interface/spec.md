## ADDED Requirements

### Requirement: Game page
The system SHALL render a page at / with a Kaplay canvas and a React overlay showing current score.

#### Scenario: Game page loads
- **WHEN** authenticated user visits /
- **THEN** Kaplay initializes on the canvas
- **THEN** menu scene shows "Press Space to Start"
- **THEN** React overlay shows current score and high score

#### Scenario: Game over overlay
- **WHEN** game ends
- **THEN** React overlay shows final score
- **THEN** submit score button is shown
- **THEN** rank position may be shown if available

### Requirement: Ranking page
The system SHALL render a page at /ranking with tabs for current week, historical weeks, and global all-time.

#### Scenario: View ranking tabs
- **WHEN** user visits /ranking
- **THEN** default tab shows current week top 25
- **THEN** user can switch to "All Time" tab
- **THEN** user can browse past weeks from a dropdown

#### Scenario: Ranking table display
- **WHEN** ranking data loads
- **THEN** top 25 entries are shown with position, avatar, displayName, and score
- **THEN** current user's entry is highlighted
- **THEN** loading state is shown while fetching

### Requirement: Profile page
The system SHALL render a page at /profile showing the user's info and score history.

#### Scenario: View profile
- **WHEN** authenticated user visits /profile
- **THEN** shows Google avatar, displayName, email
- **THEN** shows all-time best score
- **THEN** shows weekly score history as a list

### Requirement: Responsive layout
The system SHALL adapt the layout for mobile and desktop screens.

#### Scenario: Mobile viewport
- **WHEN** viewport is less than 768px wide
- **THEN** canvas is full-width
- **THEN** UI panels stack vertically
- **THEN** touch is detected as jump input

#### Scenario: Desktop viewport
- **WHEN** viewport is 768px or wider
- **THEN** game has a max-width centered layout
- **THEN** sidebar panels may appear on right
