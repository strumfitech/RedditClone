# Quick Start Guide

## Installation & Setup

### Step 1: Install Dependencies
```bash
npm install
```

This will install:
- React 18.2.0
- React Router DOM 6.20.0
- Bootstrap 5.3.2
- React Bootstrap 2.9.1
- Bootstrap Icons 1.11.2

### Step 2: Start Development Server
```bash
npm start
```

The application will open automatically at [http://localhost:3000](http://localhost:3000)

## First Time Setup

### 1. Create Your First Account
- Click **"Sign Up"** in the top right corner
- Username: `testuser` (or any name you prefer)
- Email: `test@example.com`
- Password: `password123`
- Click **"Sign Up"**

### 2. Explore Sample Communities
The app comes with 5 pre-loaded communities:
- **r/announcements** - Official announcements
- **r/programming** - Programming discussions
- **r/funny** - Funny content
- **r/technology** - Technology news
- **r/gaming** - Gaming community

### 3. Create Your First Post
1. Click **"Create Post"** button in the navbar
2. Select a community (e.g., r/programming)
3. Choose **"Post"** tab for text content
4. Enter a title: "Hello Reddit Clone!"
5. Add some content in the text area
6. Click **"Post"**

### 4. Interact with Posts
- **Upvote/Downvote**: Click the arrows on the left side of any post
- **Comment**: Click on a post to open it, then add your comment
- **Browse Communities**: Click on any community name (e.g., r/programming)

### 5. Create Your Own Community
1. Click on your username dropdown in the navbar
2. Select **"Create Community"**
3. Enter a name: `mycommunity` (letters, numbers, underscores only)
4. Add a description
5. Choose **"Public"** type
6. Click **"Create Community"**

## Features to Try

### Navigation & Sorting
- **Home Feed Filters**: Hot, New, Top, Rising
- **Search Bar**: Located in the top navbar (UI ready)
- **User Menu**: Access your profile, create community, settings

### Post Types
1. **Text Posts**: Standard posts with title and text content
2. **Link Posts**: Share URLs with the community
3. **Image Posts**: UI ready (upload functionality coming soon)

### Community Features
- View community pages with member counts
- Join communities (button available)
- See community rules and moderators
- Browse community-specific posts

### User Profiles
- View your profile: Click username → "My Profile"
- See post history and karma
- View cake day (account creation date)
- Tabs: Posts, Comments, Saved, Upvoted

### Comments System
- Add comments to any post
- Sort comments: Best, Top, New, Old
- Vote on comments
- Reply to comments (UI ready)

## Default Accounts

You can create any account you want, but here are some suggestions for testing:

```
Username: alice
Email: alice@example.com
Password: password

Username: bob
Email: bob@example.com
Password: password
```

## Sample Data

The app comes with 2 sample posts to get you started:
1. "Welcome to Reddit Clone!" in r/announcements
2. "Check out this amazing React tutorial!" in r/programming

## Tips

- **Data Persistence**: All data is stored in browser localStorage
- **Multiple Users**: Open incognito windows to test with multiple accounts
- **Reset Data**: Clear browser localStorage to start fresh
- **Mobile Responsive**: Try the app on different screen sizes

## Common Tasks

### How to Logout
1. Click on your username in the navbar
2. Select "Log Out" from the dropdown

### How to View a Specific Community
- Method 1: Click community name in a post (e.g., "r/programming")
- Method 2: Select from Top Communities in the sidebar
- Method 3: Navigate to `/r/communityname` in the URL

### How to View a User Profile
- Click on any username (e.g., "u/testuser")
- Or navigate to `/user/username` in the URL

### How to Sort Posts
- Use the filter tabs: Hot, New, Top, Rising
- Different sorting algorithms apply:
  - **Hot**: Balance of votes and recency
  - **New**: Most recent posts first
  - **Top**: Highest score (upvotes - downvotes)
  - **Rising**: Fast-growing recent posts

## Troubleshooting

### Port Already in Use
If port 3000 is already in use:
```bash
# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or set a different port
set PORT=3001 && npm start
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Data Not Persisting
- Check browser localStorage is enabled
- Try a different browser
- Check for private browsing mode

## Next Steps

1. Create multiple accounts and test interactions
2. Build up communities with posts
3. Test voting and commenting features
4. Explore responsive design on mobile
5. Try creating different types of content

Enjoy your Reddit Clone! 🚀
