# 🚀 Quick Start Guide - Culture Continuity

## Get Started in 5 Minutes

### For Windows Users

1. **Open Command Prompt** → Navigate to the project:
   ```bash
   cd c:\Users\Pramit\Downloads\culture-continuity
   ```

2. **Run the setup script:**
   ```bash
   setup.bat
   ```

3. **Start the app:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   ```
   http://localhost:3000
   ```

### For macOS/Linux Users

1. **Open Terminal** → Navigate to the project:
   ```bash
   cd ~/Downloads/culture-continuity
   # or wherever you cloned/saved it
   ```

2. **Run the setup script:**
   ```bash
   bash setup.sh
   ```

3. **Start the app:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   ```
   http://localhost:3000
   ```

---

## 🧪 Try the Demo (No API Keys Needed!)

The app works perfectly with **demo data** - no API configuration required!

### Try These Settings:

**Destination:**
- City: `Boston`
- Country: `United States`
- University: `Harvard University` (optional but shows university clubs)

**Cultural Background - Choose some:**
- Languages: `Hindi` (or any language)
- Religion: `Hinduism` (or any religion)
- Food Preferences: Check `vegetarian` or `halal`
- Festivals: Add `Diwali` (or your festival)
- Custom: Add `South Asian diaspora`

**Engagement Level:**
- Choose: `Moderate` (balanced engagement)

**Click:** "Find Cultural Resources"

### What You'll See:
✅ 6 demo resources showing how the app works  
✅ Resources organized in 3 tabs  
✅ Detailed cards with ratings, hours, contact info  
✅ Weekly routine suggestions  
✅ All with realistic data!  

---

## 🔧 Configure Real API Keys (Optional)

To search for **real resources in any city**:

### Step 1: Get Google Places API Key
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create a project
- Enable "Places API"
- Create an API Key
- Copy it

### Step 2: Edit .env.local
```bash
# Open this in any text editor:
.env.local

# Find this line:
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=AIzaSyDemoKeyForDevelopment

# Replace with your actual key:
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=AIzaSy_YOUR_ACTUAL_KEY_HERE
```

### Step 3: Restart the app
```bash
# Stop the server with Ctrl+C, then:
npm run dev
```

### Step 4: Try a real search
- Enter any city/country
- Click "Find Cultural Resources"
- Get real results from Google!

---

## 📚 Understanding the Results

### Communities & Organizations
- Cultural clubs at universities ✓ (Verified)
- Meetup groups ✓ (Real communities)
- Student associations ✓ (Campus organizations)

### Spaces & Resources
- Restaurants serving your cuisine
- Grocery stores with ingredients you need
- Places of worship (temples, mosques, churches, etc.)
- Cultural centers
- Language learning centers

### Events & Gatherings
- Upcoming festivals and celebrations
- Community events
- Cultural performances
- Seasonal celebrations

---

## 🎯 Features to Try

### 1. **Save Resources**
Click the ⭐ icon on any card to bookmark it. (Saved for the session)

### 2. **View on Maps**
Click 📍 to open the location on Google Maps

### 3. **Visit Website**
Click "Visit Website" to see more details

### 4. **Check Credibility Scores**
Green = Highly verified  
Yellow = Moderate verification  
Orange = Limited verification  

### 5. **Suggested Routine**
Check the "📅 Weekly Routine" tab to see personalized activity suggestions based on your engagement level

---

## ⚙️ Troubleshooting

### "Port 3000 in use"
```bash
npm run dev -- -p 3001
```
Then visit: `http://localhost:3001`

### App won't start
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

### No demo data showing
```bash
# Make sure mockData.ts exists
ls lib/mockData.ts

# Restart the server
# Press Ctrl+C, then: npm run dev
```

### Styling looks wrong
```bash
# Rebuild Tailwind
npm run build
npm run dev
```

---

## 📖 Full Documentation

For detailed information, see:
- **[SETUP.md](./SETUP.md)** - Complete setup guide with API configuration
- **[README.md](./README.md)** - Feature overview and architecture

---

## 🎓 What You're Getting

This is a **production-ready** full-stack application with:

✅ **React + TypeScript** frontend  
✅ **Next.js + Node.js** backend  
✅ **Real API integrations** (Google Places, Eventbrite, etc.)  
✅ **Mobile responsive** design  
✅ **Type-safe** code  
✅ **Demo mode** for testing without APIs  
✅ **Professional UI** with Tailwind CSS  
✅ **Comprehensive documentation**  

---

## 🌟 Example Use Cases

### Student Moving Abroad:
1. Enter university name
2. Select cultural background
3. Find student organizations on campus
4. Discover nearby restaurants with your cuisine
5. Join cultural clubs
6. Get suggested weekly routine

### Professional Relocating:
1. Enter new city
2. Find cultural communities
3. Discover places of worship
4. Get restaurant recommendations
5. Learn about local festivals

### Connecting with Diaspora:
1. Find others who share your culture
2. Locate authentic restaurants
3. Attend cultural events
4. Practice your language
5. Join community groups

---

## 💡 Pro Tips

1. **Try multiple cities** - See different community sizes
2. **Experiment with combinations** - Add multiple cultural identifiers
3. **Switch engagement levels** - See different routine suggestions
4. **Check different keywords** - "Hindi" vs "North Indian" may return different results
5. **Save useful contacts** - Mark your favorites for later

---

## 🚀 Next Steps

1. ✅ **Run the app** - `npm run dev`
2. ✅ **Try the demo** - Use the suggested settings above
3. ✅ **Explore UI** - Click around, try different tabs
4. ✅ **Add API keys** - Unlock real global searches
5. ✅ **Customize** - Modify colors, add features
6. ✅ **Deploy** - Share with others!

---

## 🔗 Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
- [Google Places API](https://developers.google.com/maps)
- [Eventbrite API](https://www.eventbrite.com/platform/api)

---

## 💬 FAQ

**Q: Do I need API keys to run this?**
A: No! Demo data works perfectly without any API keys. Configure keys to unlock real global searches.

**Q: What data sources does it use?**
A: Google Places, Eventbrite, Meetup, and university websites. All real, verified data.

**Q: Is my data private?**
A: Yes! The app doesn't store any personal information. All searches are anonymous.

**Q: Can I modify this code?**
A: Yes! It's open source. Feel free to add features, customize styling, or deploy it.

**Q: How do I add more features?**
A: Check `lib/api/` for integration patterns. Add new files following the same structure.

---

## 📞 Need Help?

1. Check [SETUP.md](./SETUP.md) for detailed instructions
2. Read [README.md](./README.md) for architecture details
3. Check browser console (F12) for error messages
4. Verify API keys in `.env.local`
5. Restart the development server

---

**Happy exploring! 🌏✨**

Made to help you stay connected to your cultural heritage anywhere in the world.
