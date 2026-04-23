# Admin Dashboard

The admin dashboard allows you to manage all contact submissions from your portfolio.

## Access the Admin Dashboard

**URL:** `http://localhost:3000/admin` (local) or `https://yourdomain.com/admin` (production)

## Login

1. Navigate to the admin dashboard
2. Enter the admin password
3. Click "Login"

**Default password:** `admin123`

To change the password, update the `VITE_ADMIN_PASSWORD` environment variable in your `.env` file.

## Features

### View Contacts
- See all submitted contact forms in a table
- View: Name, Email, Message, and Submission Timestamp

### Edit Contacts
1. Click "Edit" on any contact row
2. Update the Name, Email, or Message fields
3. Click "Save" to persist changes

### Delete Contacts
1. Click "Delete" on any contact row
2. Confirm the deletion
3. The contact will be permanently removed

### Download Data
- **Download JSON:** Export all contacts as a JSON file for backup or integration
- **Download CSV:** Export all contacts as CSV for spreadsheet applications

### Statistics
- View total number of contacts at the top of the toolbar

## Security

⚠️ **Important:** 
- The admin dashboard is protected by password, but it's exposed on the `/admin` route
- For production, consider:
  - Changing the default password
  - Using environment variables for secure password management
  - Adding additional authentication layers (API keys, OAuth, etc.)
  - Restricting admin access by IP address or VPN

## File Storage

Contacts are stored in `contacts.json` in the root directory. Each contact record includes:
- **id:** Unique identifier (timestamp-based)
- **name:** Contact's name
- **email:** Contact's email address
- **message:** Contact's message
- **timestamp:** When the contact was submitted (ISO 8601 format)

Example:
```json
[
  {
    "id": "1682064000000",
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Interested in your services",
    "timestamp": "2023-04-21T10:00:00.000Z"
  }
]
```
