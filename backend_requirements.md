# Backend Requirements for Scouter App

## Authentication System

### User Model
- `id` (Primary Key)
- `firstName` (String)
- `lastName` (String)
- `email` (String, unique)
- `password` (Hashed String)
- `role` (String: 'coach' or 'analyst')
- `team` (Reference to Team model, optional)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user with role selection
- `POST /api/auth/login` - Login user and return JWT token with role information
- `GET /api/auth/me` - Get current user information
- `PUT /api/auth/profile` - Update user profile information

## Teams

### Team Model
- `id` (Primary Key)
- `name` (String)
- `logo` (String, URL)
- `color` (String, hex color)
- `leagueId` (Reference to League model)

### Team Endpoints
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get specific team details

## Scouting Reports

### Report Model
- `id` (Primary Key)
- `teamId` (Reference to Team model)
- `authorId` (Reference to User model)
- `status` (String: 'not-started', 'in-progress', 'completed')
- `keyPlayers` (Array of objects):
  - `id` (Number)
  - `name` (String)
  - `position` (String)
  - `rating` (Number)
  - `strengths` (String)
- `matchStats` (Object):
  - `possession` (Number)
  - `shots` (Number)
  - `shotsOnTarget` (Number)
  - `passes` (Number)
  - `passAccuracy` (Number)
  - `corners` (Number)
  - `fouls` (Number)
- `tacticalSummary` (Object):
  - `formation` (String)
  - `overview` (String)
  - `strengths` (String)
  - `weaknesses` (String)
- `performanceInsights` (String)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Report Endpoints
- `GET /api/reports` - Get all reports (filtered by user role)
- `GET /api/reports/team/:teamId` - Get reports for a specific team
- `GET /api/reports/:id` - Get specific report details
- `POST /api/reports` - Create a new report
- `PUT /api/reports/:id` - Update an existing report
- `DELETE /api/reports/:id` - Delete a report (admin/author only)
- `PUT /api/reports/:id/status` - Update report status (e.g., mark as complete)

## User Activity

### Activity Model
- `id` (Primary Key)
- `userId` (Reference to User model)
- `action` (String: 'created', 'updated', 'viewed', etc.)
- `resourceType` (String: 'report', 'team', etc.)
- `resourceId` (ID of the resource)
- `details` (String)
- `timestamp` (Timestamp)

### Activity Endpoints
- `GET /api/activities` - Get recent activities for current user
- `GET /api/activities/team/:teamId` - Get activities related to a specific team

## Role-Based Access Control

### Middleware
- `authMiddleware` - Verify JWT token
- `roleMiddleware` - Check user role for access control:
  - Coaches: Can view all reports but cannot create/edit
  - Analysts: Can create, edit, and view reports

## Data Persistence
- Reports should be saved automatically every few minutes while editing
- Reports should maintain their status ('in-progress', 'completed')
- Reports should be associated with the analyst who created them

## Database Schema
- Implement proper relationships between models
- Ensure efficient queries for report filtering
- Add indexes on frequently queried fields

## API Response Format
- Consistent error handling and status codes
- Proper validation of incoming requests
- Pagination for list endpoints 