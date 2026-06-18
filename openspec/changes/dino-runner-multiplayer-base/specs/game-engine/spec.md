## ADDED Requirements

### Requirement: Game loop
The system SHALL run a continuous game loop using Kaplay that updates at ~60fps with delta-time-corrected physics.

#### Scenario: Game starts
- **WHEN** user presses Space/click/tap on the menu screen
- **THEN** the game loop begins with speed at 400 px/s

#### Scenario: Game loop runs
- **WHEN** the game loop is active
- **THEN** obstacles move left at current speed each frame
- **THEN** gravity is applied to the player each frame
- **THEN** collisions are checked each frame
- **THEN** score increments proportionally to distance traveled

### Requirement: Jump mechanic
The player SHALL jump when Space/click/tap is pressed while grounded. The player SHALL NOT jump while airborne.

#### Scenario: Jump on ground
- **WHEN** player is on the ground and Space is pressed
- **THEN** player velocityY is set to -700 px/s
- **THEN** jump sound plays

#### Scenario: No double jump
- **WHEN** player is airborne and Space is pressed
- **THEN** nothing happens

### Requirement: Collision detection
The game SHALL detect AABB collisions between player and obstacles. On collision without shield, the game SHALL end.

#### Scenario: Collision without shield
- **WHEN** player collides with an obstacle and shield is inactive
- **THEN** game transitions to game-over scene
- **THEN** collision sound plays

#### Scenario: Collision with shield
- **WHEN** player collides with an obstacle and shield is active
- **THEN** obstacle is destroyed
- **THEN** shield is consumed
- **THEN** shield-break sound plays

### Requirement: Progressive difficulty
The game SHALL increase speed over time following a phase-based curve with micro-mesetas.

#### Scenario: Difficulty phases
- **WHEN** score is 0-50
- **THEN** game uses Calm phase: 400-500 px/s, cactus only
- **WHEN** score is 50-200
- **THEN** game uses Rhythm phase: 500-700 px/s, variable gaps
- **WHEN** score is 200-500
- **THEN** game uses Complexity phase: 700-900 px/s, cactus + pteros
- **WHEN** score exceeds 500
- **THEN** game uses Chaos phase: 900-1200 px/s, high density

### Requirement: Procedural obstacle patterns
The game SHALL spawn obstacles using pre-defined pattern pools per phase, not pure random.

#### Scenario: Pattern-based spawning
- **WHEN** spawn distance threshold is reached
- **THEN** a pattern is selected from the current phase's pool
- **THEN** obstacles are created according to the pattern's offsets and types

### Requirement: Ground scrolling
The ground SHALL scroll left at current game speed with parallax effect.

#### Scenario: Ground movement
- **WHEN** game loop runs
- **THEN** ground texture scrolls proportionally to speed
- **THEN** multiple ground segments cycle seamlessly

### Requirement: Game over scene
When the game ends, the SHALL display final score and prompt to restart.

#### Scenario: Game over display
- **WHEN** game ends
- **THEN** final score is shown
- **THEN** "Press Space to restart" is shown
- **THEN** game:over event is emitted with score data
