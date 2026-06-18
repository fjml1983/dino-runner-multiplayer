## ADDED Requirements

### Requirement: Current week leaderboard
The system SHALL return the top 25 scores for the current ISO week from GET /api/ranking/current.

#### Scenario: View current week
- **WHEN** any user (authenticated or not) requests GET /api/ranking/current
- **THEN** returns top 25 scores ordered by value descending
- **THEN** each entry includes displayName and avatar

### Requirement: Historical week leaderboard
The system SHALL return the top 25 scores for any past ISO week from GET /api/ranking/week/:weekId.

#### Scenario: View past week
- **WHEN** user requests GET /api/ranking/week/2026-W24
- **THEN** returns top 25 scores for ISO week 2026-W24
- **THEN** returns empty array if no scores exist for that week

### Requirement: All-time global leaderboard
The system SHALL return the top 25 best scores across all time from GET /api/ranking/all.

#### Scenario: View global
- **WHEN** user requests GET /api/ranking/all
- **THEN** returns top 25 distinct users with their single best score ever
- **THEN** each entry includes displayName and avatar

### Requirement: List available weeks
The system SHALL return all weeks that have at least one score from GET /api/ranking/weeks.

#### Scenario: Browse weeks
- **WHEN** user requests GET /api/ranking/weeks
- **THEN** returns list of weekId strings sorted descending
