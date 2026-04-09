# 🌏 Culture Continuity - Setup & Installation Guide

## Quick Overview

Culture Continuity is a **full-stack Next.js web application** designed to help international students and professionals maintain their cultural identity in new cities. It aggregates real, verified data from multiple sources to help users find cultural communities, restaurants, places of worship, and events.

### What's Included
✅ Complete React + Node.js full-stack application  
✅ Real API integrations (Google Places, Eventbrite, Meetup, University APIs)  
✅ Credibility verification system  
✅ Zero fake/generated data - everything is from real sources  
✅ Responsive, production-ready UI with Tailwind CSS  
✅ Comprehensive TypeScript codebase with full type safety  

---

## ⚡ Quick Start (No API Keys Required)

You can run the application and explore the UI without configuring API keys! It will show demo data.

### Windows
```bash
cd culture-continuity
setup.bat
npm run dev
```

Then visit: `http://localhost:3000`

### macOS/Linux
```bash
cd culture-continuity
bash setup.sh
npm run dev
```

Then visit: `http://localhost:3000`

### Manual Setup
```bash
cd culture-continuity
npm install
npm run dev
```

---

## 🔑 Setting Up API Keys (For Real Data)

To enable real resource searches, you'll need to configure API keys from three main services:

### 1. **Google Places API** ⭐ REQUIRED
Required for finding restaurants, shops, places of worship, and cultural centers.

**Steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - Places API
   - Maps JavaScript API
   - Geocoding API
4. Create an API key (Credentials → Create Credentials → API Key)
5. Restrict key to HTTP referrers if desired
6. Copy the API key

**Add to `.env.local`:**
```
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_key_here
```

### 2. **Eventbrite API** (Optional)
For finding cultural events and festivals.

**Steps:**
1. Go to [Eventbrite Developer Portal](https://www.eventbrite.com/platform/api)
2. Sign up for a free account or log in
3. Create a new app
4. Generate Personal Access Token in Settings → App Management
5. Copy your API key

**Add to `.env.local`:**
```
EVENTBRITE_API_KEY=your_key_here
```

### 3. **Meetup API** (Optional)
For finding community groups and meetups.

**Steps:**
1. Go to [Meetup.com/API](https://www.meetup.com/api/)
2. Sign in/create account
3. Go to API Settings
4. Create new app
5. Copy the API key

**Add to `.env.local`:**
```
MEETUP_API_KEY=your_key_here
```

---

## 📝 Configuration Files

### `.env.local` (Your Secret Keys)
```bash
# Copy .env.example and fill in your actual keys
cp .env.example .env.local
```

**File contents:**
```env
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=AIzaSyDemoKeyForDevelopment
EVENTBRITE_API_KEY=your_eventbrite_key_here
MEETUP_API_KEY=your_meetup_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Important Notes:
- ⚠️ **NEVER commit `.env.local` to version control**
- ⚠️ **NEVER share API keys publicly**
- ✅ `.env.local` is already in `.gitignore`
- ✅ See `.env.example` for template

---

## 🚀 Installation & Running

### Prerequisites
- **Node.js 18+** - Download from [nodejs.org](https://nodejs.org/)
- **npm** comes with Node.js

### Step 1: Navigate to Project Directory
```bash
cd c:\Users\Pramit\Downloads\culture-continuity
# On Mac/Linux, adjust path accordingly
```

### Step 2: Install Dependencies
```bash
npm install
```
This will install:
- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Axios
- Leaflet (optional, for maps)

### Step 3: Configure Environment
```bash
# Option A: If running without API keys
# Just use: npm run dev

# Option B: With API keys
cp .env.example .env.local
# Edit .env.local and add your API keys
nano .env.local  # or use your favorite editor
```

### Step 4: Start Development Server
```bash
npm run dev
```

**Output should show:**
```
> next dev

  ▲ Next.js 15.0.0
  - Local:        http://localhost:3000
```

### Step 5: Open in Browser
```
http://localhost:3000
```

---

## 🧪 Testing Without API Keys

The application includes **mock data** for testing. Try these test inputs:

**Destination:**
- City: `Boston`
- Country: `United States`
- University: `Harvard University`

**Cultural Background:**
- Select: Hindi, Hinduism, Diwali, Vegetarian

**Engagement Level:**
- Select: Moderate

Click "Find Cultural Resources" to see how the UI works!

---

## 📂 Project Structure Explained

```
culture-continuity/
│
├── app/                          # Next.js app directory (React)
│   ├── api/
│   │   └── resources/
│   │       └── route.ts          # Backend API endpoint
│   ├── page.tsx                  # Main frontend page
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
│
├── components/                    # React components
│   ├── InputForm.tsx             # User input form
│   ├── ResultsDisplay.tsx        # Results view
│   └── ResourceCard.tsx          # Individual resource card
│
├── lib/                          # Utilities & helpers
│   ├── types/
│   │   └── index.ts              # TypeScript definitions
│   ├── api/
│   │   ├── googlePlaces.ts       # Google Places integration
│   │   ├── eventbrite.ts         # Eventbrite integration
│   │   ├── meetup.ts             # Meetup integration
│   │   ├── university.ts         # University resources
│   │   └── resourceAggregator.ts # Combines all sources
│   └── mockData.ts               # Demo data
│
├── public/                        # Static files
├── styles/
│   └── globals.css               # Additional styles
├── .env.example                  # Environment template
├── .env.local                    # Your secret keys (gitignored)
├── .gitignore                    # Git ignore patterns
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind config
├── next.config.ts                # Next.js config
├── eslintrc.json                 # ESLint config
└── README.md                      # Main documentation
```

---

## 🔄 How the Application Works

### User Flow:
1. **User fills form** → Destination + Cultural background
2. **Form submitted** → Data sent to `/api/resources`
3. **Backend aggregates** → Queries Google Places, Eventbrite, etc. in parallel
4. **Results filtered** → Credibility scoring, distance filtering
5. **Results displayed** → Organized by category (Communities, Spaces, Events)
6. **User explores** → Can save resources, view on maps

### Data Flow:
```
Frontend (React)
    ↓
User Form (/app/page.tsx)
    ↓
API Endpoint (/app/api/resources/route.ts)
    ↓
Resource Aggregator (lib/api/resourceAggregator.ts)
    ├→ Google Places
    ├→ Eventbrite
    ├→ Meetup
    └→ University APIs
    ↓
Credibility Scoring + Filtering
    ↓
Results Display (React Components)
```

---

## ⚙️ Commands Reference

```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm build

# Start production server
npm start

# Run linter
npm run lint

# Install dependencies
npm install

# Update dependencies
npm update
```

---

## 🐛 Troubleshooting

### "Module not found: Can't resolve 'axios'"
```bash
npm install axios
```

### "Port 3000 already in use"
```bash
# Use a different port
npm run dev -- -p 3001
```

### API returning no results
1. **Check API Keys:** Verify keys in `.env.local`
2. **Check Internet:** Ensure internet connection works
3. **Check City Name:** Try major cities like "Boston", "New York", "London"
4. **Check Quotas:** Some APIs have monthly rate limits
5. **Check Logs:** Look at browser console (F12) for errors

### "NEXT_PUBLIC_GOOGLE_PLACES_API_KEY is not configured"
- Copy `.env.example` to `.env.local`
- Add your actual Google Places API key
- Restart development server (Ctrl+C, then npm run dev)

### CSS/Styling not loading
```bash
# Rebuild Tailwind CSS
npm run build
npm run dev
```

### TypeScript errors
```bash
# Type checking
npx tsc --noEmit

# Fix common errors
npm install --save-dev typescript @types/node @types/react
```

---

## 📊 Environment Setup Verification

Run this checklist:
- ✅ Node.js installed? → `node -v`
- ✅ npm installed? → `npm -v`
- ✅ Navigated to project? → `pwd` shows `.../culture-continuity`
- ✅ Dependencies installed? → `ls node_modules` shows many folders
- ✅ .env.local exists? → `cat .env.local` or check file explorer
- ✅ Dev server starts? → `npm run dev` shows local URL
- ✅ Browser loads? → `http://localhost:3000` opens

---

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Other Platforms
- Netlify
- Heroku
- AWS Amplify
- Google Cloud Run
- DigitalOcean

**Remember:** Add `.env` variables to your platform's environment settings!

---

## 🔒 Security Best Practices

✅ **DO:**
- Use `.env.local` for secrets
- Restrict API keys in Google Cloud console
- Use HTTPS in production
- Validate all inputs
- Never log sensitive data

❌ **DON'T:**
- Commit `.env.local` to git
- Share API keys in chat/email
- Use frontend-only API key restrictions
- Expose API responses without filtering
- Trust user input directly

---

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Google Places API](https://developers.google.com/maps/documentation/places)

---

## 🤝 Contributing

To improve this project:
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Read the README.md
3. Check browser console (F12 → Console tab)
4. Check terminal for error messages
5. Verify API keys are set correctly

---

## 🎯 Next Steps

1. **Run the app** → `npm run dev`
2. **Explore the UI** → Try the form with test data
3. **Add API keys** → Update `.env.local` with your keys
4. **Test features** → Search for real resources
5. **Customize** → Modify components, add more categories
6. **Deploy** → Push to production

---

**Happy coding! 🌏✨**

Made with ❤️ to help students stay connected to their cultural heritage.
