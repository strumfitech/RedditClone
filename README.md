# Reddit Clone

A fully functional Reddit-like social media platform built with React, HTML, CSS, and Bootstrap.

## Features

### Authentication
- **User Registration**: Create new accounts with username, email, and password
- **User Login**: Secure login system with validation
- **Session Management**: Persistent login using localStorage

### Posts
- **Create Posts**: Submit text posts and link posts to communities
- **View Posts**: Browse posts with multiple sorting options (Hot, New, Top, Rising)
- **Vote System**: Upvote and downvote posts with real-time score updates
- **Post Details**: View individual posts with full content

### Comments
- **Add Comments**: Comment on any post when logged in
- **Comment Sorting**: Sort comments by Best, Top, New, or Old
- **Comment Voting**: Upvote and downvote comments
- **Nested Display**: View comment threads with author and timestamp

### Communities (Subreddits)
- **Browse Communities**: Explore different communities with member counts
- **Create Communities**: Start your own community with custom name and description
- **Community Pages**: View community-specific posts and information
- **Join Communities**: Join communities to see their content in your feed

### User Profiles
- **View Profiles**: See any user's profile with their posts and karma
- **User Stats**: View post karma, comment karma, and account creation date
- **Profile Tabs**: Browse user's posts, comments, saved items, and upvoted content

### Navigation & UI
- **Responsive Navbar**: Full-featured navigation with search, user menu, and create post button
- **Sidebar**: Quick access to top communities and home feed
- **Filters**: Sort content by Hot, New, Top, or Rising
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technologies Used

- **React 18**: Component-based UI framework
- **React Router DOM**: Client-side routing
- **Bootstrap 5**: CSS framework for responsive design
- **React Bootstrap**: Bootstrap components as React components
- **Bootstrap Icons**: Icon library
- **LocalStorage**: Client-side data persistence

## Project Structure

```
reddit-clone/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar/
│   │   │   ├── Navbar.js
│   │   │   └── Navbar.css
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.js
│   │   │   └── Sidebar.css
│   │   └── Post/
│   │       ├── Post.js
│   │       └── Post.css
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── Auth.css
│   │   ├── Home/
│   │   │   ├── Home.js
│   │   │   └── Home.css
│   │   ├── CreatePost/
│   │   │   ├── CreatePost.js
│   │   │   └── CreatePost.css
│   │   ├── PostDetail/
│   │   │   ├── PostDetail.js
│   │   │   └── PostDetail.css
│   │   ├── Community/
│   │   │   ├── Community.js
│   │   │   └── Community.css
│   │   ├── CreateCommunity/
│   │   │   ├── CreateCommunity.js
│   │   │   └── CreateCommunity.css
│   │   └── Profile/
│   │       ├── Profile.js
│   │       └── Profile.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Usage

### Creating an Account
1. Click "Sign Up" in the navigation bar
2. Enter a username (minimum 3 characters)
3. Enter a valid email address
4. Create a password (minimum 6 characters)
5. Click "Sign Up"

### Creating a Post
1. Log in to your account
2. Click "Create Post" button in the navbar
3. Select a community from the dropdown
4. Choose post type (Text, Link, or Image)
5. Enter a title and content
6. Click "Post"

### Creating a Community
1. Log in to your account
2. Click on your username dropdown
3. Select "Create Community"
4. Enter a unique community name (3-21 characters)
5. Add a description
6. Choose community type (Public, Restricted, or Private)
7. Click "Create Community"

### Voting
- Click the up arrow to upvote a post or comment
- Click the down arrow to downvote
- Click again to remove your vote

### Commenting
1. Open a post by clicking on it
2. Type your comment in the text area
3. Click "Comment" to submit

## Data Persistence

This application uses browser's localStorage to persist:
- User accounts and authentication
- Posts and comments
- Communities
- Voting data

**Note**: Data is stored locally in your browser. Clearing browser data will reset the application.

## Future Enhancements

- Image upload functionality
- User avatars and profile customization
- Search functionality
- Direct messaging
- Notifications
- Moderation tools
- Rich text editor for posts
- Multi-level comment replies
- Backend API integration
- Real-time updates with WebSockets

## License

This project is open source and available for educational purposes.

## Credits

Built with ❤️ using React and Bootstrap
Inspired by Reddit's design and functionality
