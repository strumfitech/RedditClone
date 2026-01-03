# Reddit Clone - Project Overview

## 📊 Project Statistics

- **Total JavaScript Files**: 13 files
- **Total Lines of Code**: ~1,750 lines
- **Total CSS Files**: 12 files
- **Components**: 3 main components
- **Pages**: 7 page components
- **React Version**: 18.2.0
- **UI Framework**: Bootstrap 5.3.2

## 🎨 Design Philosophy

This Reddit clone faithfully recreates the Reddit experience with:
- **Authentic Color Scheme**: Orange (#FF4500), Blue (#0079D3), Gray tones
- **Familiar Layout**: Three-column layout with navigation, content, and sidebar
- **Responsive Design**: Mobile-first approach that works on all devices
- **User-Friendly**: Intuitive navigation and interactions

## 🏗️ Architecture

### Component Hierarchy

```
App.js (Root)
├── Navbar (Global Navigation)
├── Routes
│   ├── Home
│   │   ├── Post (Multiple)
│   │   └── Sidebar
│   ├── Login
│   ├── Register
│   ├── CreatePost
│   ├── PostDetail
│   │   ├── Post
│   │   ├── Comments Section
│   │   └── Sidebar
│   ├── Community
│   │   ├── Post (Multiple)
│   │   └── Community Sidebar
│   ├── Profile
│   │   ├── Post (Multiple)
│   │   └── Profile Sidebar
│   └── CreateCommunity
```

## 📁 File Structure

```
reddit-clone/
├── 📄 package.json                    # Dependencies and scripts
├── 📄 README.md                       # Full documentation
├── 📄 QUICKSTART.md                   # Quick start guide
├── 📄 PROJECT_OVERVIEW.md             # This file
├── 📄 .gitignore                      # Git ignore rules
│
├── 📁 public/
│   └── 📄 index.html                  # HTML template
│
└── 📁 src/
    ├── 📄 index.js                    # React entry point
    ├── 📄 index.css                   # Global styles
    ├── 📄 App.js                      # Main app component (205 lines)
    ├── 📄 App.css                     # App-level styles
    │
    ├── 📁 components/                 # Reusable components
    │   ├── 📁 Navbar/
    │   │   ├── 📄 Navbar.js          # (105 lines) - Top navigation bar
    │   │   └── 📄 Navbar.css         # Navigation styles
    │   ├── 📁 Sidebar/
    │   │   ├── 📄 Sidebar.js         # (89 lines) - Right sidebar
    │   │   └── 📄 Sidebar.css        # Sidebar styles
    │   └── 📁 Post/
    │       ├── 📄 Post.js            # (117 lines) - Post card component
    │       └── 📄 Post.css           # Post styles
    │
    └── 📁 pages/                      # Page components
        ├── 📁 Auth/
        │   ├── 📄 Login.js           # (74 lines) - Login page
        │   ├── 📄 Register.js        # (113 lines) - Registration page
        │   └── 📄 Auth.css           # Auth pages styles
        ├── 📁 Home/
        │   ├── 📄 Home.js            # (115 lines) - Main feed
        │   └── 📄 Home.css           # Home page styles
        ├── 📁 CreatePost/
        │   ├── 📄 CreatePost.js      # (189 lines) - Post creation
        │   └── 📄 CreatePost.css     # Create post styles
        ├── 📁 PostDetail/
        │   ├── 📄 PostDetail.js      # (201 lines) - Single post view
        │   └── 📄 PostDetail.css     # Post detail styles
        ├── 📁 Community/
        │   ├── 📄 Community.js       # (189 lines) - Community page
        │   └── 📄 Community.css      # Community styles
        ├── 📁 CreateCommunity/
        │   ├── 📄 CreateCommunity.js # (176 lines) - Create community
        │   └── 📄 CreateCommunity.css# Create community styles
        └── 📁 Profile/
            ├── 📄 Profile.js         # (165 lines) - User profile
            └── 📄 Profile.css        # Profile styles
```

## 🎯 Key Features Implementation

### 1. Authentication System
**Files**: `Login.js`, `Register.js`, `Auth.css`
- User registration with validation
- Login with username/password
- Session persistence via localStorage
- Protected routes for authenticated users

### 2. Post Management
**Files**: `Post.js`, `CreatePost.js`, `PostDetail.js`
- Create text and link posts
- View posts in feed or detail view
- Upvote/downvote functionality
- Real-time score calculation
- Post sorting algorithms (Hot, New, Top, Rising)

### 3. Comments System
**Files**: `PostDetail.js`
- Add comments to posts
- Comment voting
- Sort comments (Best, Top, New, Old)
- Display author and timestamps

### 4. Communities (Subreddits)
**Files**: `Community.js`, `CreateCommunity.js`
- Create custom communities
- View community-specific feeds
- Community information sidebar
- Member counts and stats

### 5. User Profiles
**Files**: `Profile.js`
- View user post history
- Display karma (post + comment)
- Show account creation date
- Profile tabs (Posts, Comments, Saved, Upvoted)

### 6. Navigation & Layout
**Files**: `Navbar.js`, `Sidebar.js`
- Global navigation with search
- User dropdown menu
- Community listings
- Responsive mobile menu

## 🎨 Styling Approach

### CSS Variables
```css
--reddit-orange: #FF4500
--reddit-blue: #0079D3
--reddit-gray: #878A8C
--reddit-light-gray: #EDEFF1
--reddit-dark: #1A1A1B
--reddit-border: #CCCCCC
```

### Design Patterns
- **Card-based Layout**: All content in white cards with borders
- **Rounded Buttons**: 20px border-radius for primary actions
- **Icon Integration**: Bootstrap Icons throughout
- **Hover States**: Subtle feedback on all interactive elements
- **Responsive Breakpoints**: 768px (mobile), 992px (tablet)

## 📱 Responsive Design

### Desktop (>992px)
- Three-column layout: navigation, content, sidebar
- Full feature set visible
- 640px max width for post feed

### Tablet (768px - 992px)
- Two-column layout: navigation + content
- Sidebar moves below content
- Collapsible navigation menu

### Mobile (<768px)
- Single column layout
- Hamburger menu for navigation
- Simplified post cards
- Touch-optimized buttons

## 🔄 Data Flow

### State Management
```javascript
App.js (Root State)
├── user (Current logged-in user)
├── posts (All posts array)
├── communities (All communities array)
└── Methods
    ├── login()
    ├── register()
    ├── logout()
    ├── addPost()
    ├── updatePost()
    ├── addComment()
    └── addCommunity()
```

### Data Persistence
- **localStorage Keys**:
  - `user`: Current user session
  - `users`: All registered users
  - `posts`: All posts with comments
  - `communities`: All communities

## 🚀 Routing Structure

```
/ (Home)                    → Home feed with all posts
/login                      → Login page
/register                   → Registration page
/submit                     → Create new post (protected)
/post/:id                   → View single post with comments
/r/:community               → Community-specific feed
/user/:username             → User profile page
/create-community           → Create new community (protected)
```

## 💡 Advanced Features

### Voting Algorithm
- **Hot**: Score / (age_hours + 2)^1.5
- **Rising**: Recent posts (< 24h) with high velocity
- **Top**: Simple score (upvotes - downvotes)
- **New**: Chronological by timestamp

### Time Display
- < 1 min: "just now"
- < 60 min: "Xm ago"
- < 24 hours: "Xh ago"
- 24+ hours: "Xd ago"

### Form Validations
- Username: 3-21 characters, alphanumeric + underscore
- Password: Minimum 6 characters
- Email: Basic email format validation
- Post Title: Maximum 300 characters
- Community Name: 3-21 characters, unique

## 🎓 Learning Resources

This project demonstrates:
- **React Hooks**: useState, useEffect, useNavigate, useParams
- **React Router**: Routes, navigation, protected routes
- **Component Composition**: Reusable components with props
- **State Management**: Lifting state, prop drilling
- **Form Handling**: Controlled components, validation
- **Local Storage**: Data persistence
- **CSS-in-JS**: Component-scoped styling
- **Bootstrap Integration**: React Bootstrap components
- **Responsive Design**: Mobile-first approach

## 🔧 Customization Guide

### Change Colors
Edit CSS variables in `src/index.css`:
```css
:root {
  --reddit-orange: #YOUR_COLOR;
  --reddit-blue: #YOUR_COLOR;
}
```

### Add New Features
1. Create component in `src/components/` or `src/pages/`
2. Add route in `App.js`
3. Update navigation in `Navbar.js`
4. Implement state management as needed

### Modify Sample Data
Edit initial data in `App.js` `useEffect`:
```javascript
const samplePosts = [...];
const sampleCommunities = [...];
```

## 📈 Performance Considerations

- **Virtual DOM**: React's efficient rendering
- **Lazy Loading**: Route-based code splitting (can be added)
- **Local Storage**: Fast client-side data access
- **CSS**: Minimal, scoped styles for fast loading
- **No External APIs**: No network latency

## 🔮 Future Enhancements

### Phase 1: Core Features
- [ ] Image upload for posts
- [ ] Nested comment replies
- [ ] Rich text editor (Markdown)
- [ ] User avatars
- [ ] Search functionality

### Phase 2: Social Features
- [ ] Direct messaging
- [ ] Notifications system
- [ ] Follow users
- [ ] Awards/badges
- [ ] User flairs

### Phase 3: Moderation
- [ ] Report system
- [ ] Moderator tools
- [ ] Content filtering
- [ ] User blocking
- [ ] Community rules enforcement

### Phase 4: Backend Integration
- [ ] REST API or GraphQL
- [ ] Database (PostgreSQL/MongoDB)
- [ ] Authentication (JWT)
- [ ] File storage (AWS S3)
- [ ] Real-time updates (WebSocket)

## 🎯 Use Cases

- **Learning Project**: Study React and modern web development
- **Portfolio**: Demonstrate full-stack capabilities
- **Prototype**: Base for social media applications
- **Testing**: UI/UX experimentation
- **Teaching**: Educational resource for courses

## 📞 Support

For questions or issues:
1. Check the README.md for detailed documentation
2. Review QUICKSTART.md for setup instructions
3. Inspect component code for implementation details
4. Test in browser developer console for debugging

---

**Built with React, Bootstrap, and ❤️**
