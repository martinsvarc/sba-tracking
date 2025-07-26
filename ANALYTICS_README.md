# Analytics Dashboard

## Overview
The Analytics Dashboard provides a comprehensive overview of all submitted questionnaires with advanced filtering, sorting, and tracking capabilities.

## Features

### 📊 Table Display
- **Date Created**: Formatted timestamp of questionnaire submission
- **Name**: Applicant's full name
- **GHL Link**: Clickable button to open GHL (Go High Level) link in new tab
- **Call Booked**: Visual indicator (circle) showing if call is booked
- **Appointment Date & Time**: Scheduled appointment information
- **Closer Name**: Assigned closer for the lead
- **Status**: Current status with color-coded badges

### 🔍 Advanced Filtering
The floating filter bar at the bottom includes:
- **Closer Filter**: Dropdown to filter by specific closer
- **Time Range**: Last 7 days, Last 30 days, This Month, or All Time
- **Call Booked**: Yes/No toggle filter
- **Status**: Multi-select filter for different statuses
- **Clear Filters**: Reset all filters

### 📈 Sorting
- Click any column header to sort by that field
- Toggle between ascending and descending order
- Visual indicators show current sort field and direction

### 📄 Pagination
- 25 rows per page
- Navigation controls for large datasets
- Shows current page and total results

### 🎯 Quick Actions
- Click any row to open the full questionnaire review in a new tab
- GHL links open directly in new tabs
- Status updates sync across all views

## Database Schema Updates

The Prisma schema has been updated to include new analytics fields:

```prisma
model Questionnaire {
  // ... existing fields ...
  status          String?  @default("Untracked")
  ghlLink         String?
  appointmentDateTime DateTime?
  closerName      String?
  callBooked      Boolean  @default(false)
}
```

## API Endpoints

### GET /api/analytics
Fetches all questionnaires for the analytics dashboard with the new fields.

### PATCH /api/questionnaire/[id]
Updates individual questionnaire records with analytics data.

### GET /api/questionnaire/[id]
Fetches a single questionnaire by ID with all fields.

## Installation & Setup

1. **Install Dependencies**:
   ```bash
   npm install date-fns
   ```

2. **Database Migration**:
   ```bash
   npx prisma migrate dev --name add-analytics-fields
   ```

3. **Access Analytics**:
   - Navigate to `/analytics` in your browser
   - Or click the "Analytics Dashboard" button on the home page

## Usage

### Viewing Analytics
1. Visit `/analytics` to see the master overview
2. Use the floating filter bar to narrow down results
3. Click column headers to sort data
4. Use pagination for large datasets

### Updating Records
1. Click any row to open the detailed review page
2. Use the "Analytics & Tracking" section to update fields
3. Click "Edit" to modify values
4. Save changes to update the database

### Status Management
- **Untracked**: Default status for new submissions
- **Qualified Show-Up**: Lead attended the call
- **No Show**: Lead didn't attend the call
- **Disqualified**: Lead doesn't meet criteria

## Technical Details

### Frontend
- Built with React + TypeScript
- Tailwind CSS for styling
- Responsive design for all screen sizes
- Real-time filtering and sorting

### Backend
- Next.js API routes
- Prisma ORM for database operations
- Neon PostgreSQL database
- Type-safe data handling

### Performance
- Client-side filtering and sorting for fast response
- Pagination to handle large datasets
- Optimized database queries
- Efficient state management

## Troubleshooting

### Common Issues

1. **Date-fns Import Error**:
   - Ensure `date-fns` is installed: `npm install date-fns`

2. **Database Migration Errors**:
   - Run `npx prisma generate` before migrations
   - Check your database connection string

3. **Filter Not Working**:
   - Clear all filters and try again
   - Check browser console for errors

4. **Data Not Updating**:
   - Refresh the page to see latest changes
   - Check network tab for API errors

### Support
For issues or questions, check the browser console for error messages and ensure all dependencies are properly installed. 