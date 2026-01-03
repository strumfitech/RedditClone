# Installation Instructions

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 14.0 or higher)
- **npm** (comes with Node.js)

Check your versions:
```bash
node --version
npm --version
```

## Step-by-Step Installation

### 1. Navigate to Project Directory
```bash
cd reddit-clone
```

### 2. Install Dependencies
```bash
npm install
```

This will install:
- `react` (^18.2.0)
- `react-dom` (^18.2.0)
- `react-router-dom` (^6.20.0)
- `bootstrap` (^5.3.2)
- `react-bootstrap` (^2.9.1)
- `bootstrap-icons` (^1.11.2)
- `react-scripts` (5.0.1)

Expected installation time: 1-3 minutes depending on your internet connection.

### 3. Start the Development Server
```bash
npm start
```

The application will:
- Compile the React application
- Start a development server
- Automatically open your browser to `http://localhost:3000`

If the browser doesn't open automatically, manually navigate to:
```
http://localhost:3000
```

### 4. Verify Installation

You should see:
- ✅ A navbar with "reddit" logo and search bar
- ✅ Login/Sign Up buttons (if not logged in)
- ✅ Two sample posts in the feed
- ✅ A sidebar with "Top Communities"
- ✅ Filter tabs (Hot, New, Top, Rising)

## Build for Production

To create an optimized production build:

```bash
npm run build
```

This creates a `build/` folder with optimized static files ready for deployment.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## Troubleshooting

### Issue: Port 3000 already in use

**Solution 1**: Kill the process using port 3000
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill
```

**Solution 2**: Use a different port
```bash
# Windows
set PORT=3001 && npm start

# Mac/Linux
PORT=3001 npm start
```

### Issue: Module not found errors

**Solution**: Clear cache and reinstall
```bash
# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Or on Windows
rmdir /s /q node_modules
del package-lock.json

# Reinstall
npm install
```

### Issue: React version conflicts

**Solution**: Ensure compatible versions
```bash
npm install react@18.2.0 react-dom@18.2.0
```

### Issue: Bootstrap styles not loading

**Solution**: Verify imports in `src/index.js`:
```javascript
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
```

### Issue: Blank page after npm start

**Solution**: Check browser console for errors
1. Press F12 to open developer tools
2. Check the Console tab
3. Look for error messages
4. Verify all files were created correctly

## Browser Compatibility

This application works best on:
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

Minimum browser versions:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development Tips

### Hot Reload
The development server supports hot module replacement. Changes to your code will automatically reload the browser.

### Environment Variables
Create a `.env` file in the root directory:
```
PORT=3000
BROWSER=chrome
```

### VS Code Extensions (Recommended)
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Path Intellisense

## Next Steps

After successful installation:

1. **Read the QUICKSTART.md** - Learn how to use the app
2. **Create your first account** - Sign up and explore
3. **Make your first post** - Test the posting functionality
4. **Check PROJECT_OVERVIEW.md** - Understand the architecture
5. **Review README.md** - Full feature documentation

## System Requirements

### Minimum
- **RAM**: 4GB
- **Disk Space**: 500MB (for node_modules)
- **OS**: Windows 10, macOS 10.14, or Linux

### Recommended
- **RAM**: 8GB or more
- **Disk Space**: 1GB free space
- **OS**: Latest version of Windows, macOS, or Linux

## Performance Notes

- **Initial Build**: 30-60 seconds
- **Hot Reload**: 1-3 seconds
- **Production Build**: 1-2 minutes
- **Bundle Size**: ~500KB (gzipped)

## Getting Help

If you encounter issues:

1. **Check this guide** - Most common issues are covered
2. **Review error messages** - They often point to the solution
3. **Check browser console** - F12 for developer tools
4. **Verify Node version** - Must be 14.0 or higher
5. **Try a fresh install** - Delete node_modules and reinstall

## Success Checklist

- [ ] Node.js and npm installed
- [ ] Dependencies installed successfully
- [ ] Development server starts without errors
- [ ] Browser opens to localhost:3000
- [ ] Sample posts visible
- [ ] Can navigate between pages
- [ ] Can create an account
- [ ] Can create a post

Once all items are checked, you're ready to use your Reddit Clone! 🎉

---

**Need more help?** Check README.md for full documentation.
