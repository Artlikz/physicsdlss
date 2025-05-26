# Admin Setup Instructions

This document provides instructions for setting up the initial admin user for the Physics Digital Learning Support System.

## Initial Admin Setup

Since the system doesn't allow self-registration and requires an admin to create user accounts, you'll need to create the first admin user manually. Follow these steps:

### Option 1: Using the Setup Script (Recommended)

1. Make sure you have Node.js installed on your system
2. Install the required dependencies:
   \`\`\`
   npm install
   \`\`\`
3. Run the admin creation script:
   \`\`\`
   npx tsx scripts/create-admin.ts
   \`\`\`
4. Follow the prompts to enter the admin's email, password, and full name
5. The script will create an admin user with full privileges

### Option 2: Using Supabase Dashboard

If you prefer to create the admin user directly in Supabase:

1. Log in to your Supabase dashboard at https://app.supabase.com
2. Select your project
3. Go to "Authentication" > "Users"
4. Click "Invite user" and enter the admin's email
5. After the user is created, go to the SQL Editor
6. Run the following SQL to create the admin user record:

\`\`\`sql
INSERT INTO users (id, email, full_name, role)
VALUES 
('USER_ID_FROM_AUTH', 'admin@example.com', 'Admin User', 'admin');
\`\`\`

Replace `USER_ID_FROM_AUTH` with the actual user ID from the Authentication table.

## Logging In

After creating the admin user, you can log in using the email and password you provided during setup. The admin will have access to the admin dashboard at `/admin`.

## Creating Additional Users

Once logged in as an admin, you can create additional users through the admin dashboard:

1. Navigate to `/admin`
2. Click on "Manage Users" 
3. Use the "Create User" form to add new users
