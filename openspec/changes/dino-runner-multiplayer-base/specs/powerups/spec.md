## ADDED Requirements

### Requirement: Shield power-up
The game SHALL spawn shield pickups that absorb one collision. Shield SHALL have a 70% spawn probability when a power-up is rolled.

#### Scenario: Shield spawns
- **WHEN** power-up spawn is triggered
- **THEN** 70% chance shield pickup appears floating above ground

#### Scenario: Shield picked up
- **WHEN** player collides with shield pickup
- **THEN** shield activates for 5 seconds
- **THEN** player is visually surrounded by blue aura
- **THEN** power-up sound plays

#### Scenario: Shield blocks collision
- **WHEN** player collides with obstacle while shield is active
- **THEN** obstacle is destroyed
- **THEN** shield deactivates
- **THEN** shield-break sound plays

#### Scenario: Shield expires
- **WHEN** 5 seconds pass without collision
- **THEN** shield deactivates
- **THEN** blue aura disappears

### Requirement: Slow-mo power-up
The game SHALL spawn slow-mo pickups that reduce game speed by 60% for 3 seconds. Slow-mo SHALL have a 30% spawn probability when a power-up is rolled.

#### Scenario: Slow-mo spawns
- **WHEN** power-up spawn is triggered
- **THEN** 30% chance slow-mo pickup appears floating above ground

#### Scenario: Slow-mo picked up
- **WHEN** player collides with slow-mo pickup
- **THEN** game speed is multiplied by 0.4
- **THEN** canvas gets purple tint
- **THEN** slow-mo timer starts at 3 seconds

#### Scenario: Slow-mo in effect
- **WHEN** slow-mo is active
- **THEN** obstacles, ground, and scoring all run at 40% speed

#### Scenario: Slow-mo expires
- **WHEN** 3 seconds pass
- **THEN** game speed returns to normal
- **THEN** purple tint fades out
