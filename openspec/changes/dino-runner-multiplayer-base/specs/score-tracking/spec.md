## ADDED Requirements

### Requirement: Score submission
The authenticated user SHALL submit their score to POST /api/scores.

#### Scenario: Submit score
- **WHEN** user completes a game and submits score
- **THEN** request includes value and weekId
- **THEN** server upserts score for that userId + weekId

### Requirement: Per-week deduplication (best score)
The system SHALL keep only the best score per user per ISO week.

#### Scenario: First score of the week
- **WHEN** user submits a score for a week with no prior entry
- **THEN** new Score record is created

#### Scenario: Beating personal best
- **WHEN** user submits a score higher than existing entry for same week
- **THEN** existing Score.value is updated to the new higher value

#### Scenario: Lower score already submitted
- **WHEN** user submits a score lower than existing entry for same week
- **THEN** existing Score record is not modified

### Requirement: Personal score history
The authenticated user SHALL retrieve their own score history from GET /api/scores/me.

#### Scenario: View history
- **WHEN** authenticated user requests GET /api/scores/me
- **THEN** returns all user scores sorted by weekId descending
