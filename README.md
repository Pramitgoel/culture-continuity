# Culture Continuity

🌏 A web application that helps students and professionals preserve and practice their cultural identity when moving to a new city or university.

## Features

### Core Functionality
- **User Input Form**: Collect destination, cultural background, and engagement level preferences
- **Multi-Source Data Aggregation**: Real-time data from Google Places, Eventbrite, Meetup, and university directories
- **Categorized Results**: Communities & Organizations, Spaces & Resources, Events & Gatherings
- **Credibility Scoring**: Verification layer to ensure authentic, reliable resources
- **Suggested Weekly Routine**: AI-generated routines based on engagement level

### Data Sources
- 🗺️ **Google Places API**: Restaurants, grocery stores, places of worship, cultural centers
- 🎫 **Eventbrite API**: Cultural festivals, celebrations, and community events
- 👥 **Meetup API**: Cultural groups, language clubs, community meetups
- 🎓 **University Websites**: Student organizations, cultural clubs, affinity groups

### UI/UX
- Clean, minimal interface with card-based design
- Tabbed results view for easy navigation
- Bookmark/save functionality
- Integrated Google Maps view
- Responsive design (mobile-friendly)

## Project Structure

```
culture-continuity/
├── app/
│   ├── api/
│   │   └── resources/
│   │       └── route.ts          # Main API endpoint
│   ├── page.tsx                  # Main page
│   └── globals.css               # Global styles
├── components/
│   ├── InputForm.tsx             # User input collection
│   ├── ResultsDisplay.tsx        # Results view with tabs
│   └── ResourceCard.tsx          # Individual resource card
├── lib/
│   ├── types/
│   │   └── index.ts              # TypeScript type definitions
│   └── api/
│       ├── googlePlaces.ts       # Google Places integration
│       ├── eventbrite.ts         # Eventbrite integration
│       ├── meetup.ts             # Meetup integration
│       ├── university.ts         # University resources
│       └── resourceAggregator.ts # Combines all sources
├── public/                       # Static assets
├── styles/
│   └── globals.css               # Stylesheet
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind CSS config
└── next.config.js                # Next.js config
```

## Setup & Installation

### Prerequisites
- Node.js 18+ and npm/pnpm
- API Keys:
  - [Google Places API](https://developers.google.com/maps/documentation/places/web-service/overview)
  - [Eventbrite API](https://www.eventbrite.com/platform/api)
  - [Meetup API](https://www.meetup.com/api/) (optional)

### Installation Steps

1. **Clone/Create the project**
   ```bash
   cd culture-continuity
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Keys**
   - Copy `.env.example` to `.env.local`
   - Add your API keys to `.env.local`:
     ```
     NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_key_here
     EVENTBRITE_API_KEY=your_key_here
     MEETUP_API_KEY=your_key_here
     ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## Usage Flow

### Step 1: User Input
- Enter destination (city, country, optional university)
- Select cultural background (languages, religion, food preferences, festivals)
- Choose engagement level (Casual, Moderate, Deep)

### Step 2: Search
- Click "Find Cultural Resources"
- System queries multiple APIs in parallel
- Results are filtered, ranked, and verified

### Step 3: Results
- View resources in three categories:
  - **Communities & Organizations**: Clubs, groups, associations
  - **Spaces & Resources**: Restaurants, stores, places of worship
  - **Events & Gatherings**: Upcoming festivals and events
- Each resource shows:
  - Credibility score (0-100)
  - Distance, address, phone, website
  - Rating and reviews
  - Source and verification status
  - Tags for easy filtering

### Step 4: Weekly Routine
- Get personalized routine suggestions based on engagement level
- Recommendations for:
  - Community meetings
  - Dining experiences
  - Spiritual practices
  - Language learning

## API Endpoints

### POST /api/resources
Accepts a user profile and returns verified cultural resources.

**Request Body:**
```json
{
  "destination": {
    "city": "Boston",
    "country": "United States",
    "university": "Harvard University"
  },
  "culturalBackground": {
    "languages": ["Hindi", "English"],
    "religion": "Hinduism",
    "foodPreferences": ["vegetarian"],
    "festivals": ["Diwali"],
    "customIdentifiers": ["South Asian diaspora"]
  },
  "engagementLevel": "moderate"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "communities": [...],
    "spaces": [...],
    "events": [...],
    "averageCredibilityScore": 85,
    "totalResultsFound": 42,
    "limitedResultsWarning": null
  },
  "suggestedRoutines": [...]
}
```

## Credibility Scoring

Resources are scored 0-100 based on:
- **Verification**: Google/Eventbrite verified sources (+20-40)
- **Completeness**: Has valid contact info, website, hours (+30)
- **Ratings**: Higher ratings increase score (+15-40)
- **Member Count**: For groups, active membership matters (+10-30)
- **Source Reliability**: Official sources score higher (+20)

Threshold: Only resources with score ≥60 are shown by default.

## Development Notes

### Adding New Data Sources
1. Create a new file in `lib/api/` (e.g., `airbnb.ts`)
2. Implement a function that returns `CulturalResource[]`
3. Import and add to `resourceAggregator.ts`
4. Update type definitions if needed

### Customizing UI
- Tailwind CSS classes in components
- Colors in `tailwind.config.ts`
- Responsive design utilities included

### Performance Optimization
- Parallel API calls reduce load time
- Caching opportunities: cache university directories
- Consider debouncing location search
- Implement pagination for large results

## Known Limitations & Future Improvements

### Current Limitations
- Meetup & university APIs require manual setup
- Geolocation not automatically detected
- No persistent user profile storage
- No real-time subscription to events

### Planned Features
- User accounts with saved profiles
- Bookmarking/favoriting resources
- Real-time event notifications
- Integration with more APIs (Yelp, Google Calendar)
- Language-specific content recommendations
- Community reviews and ratings
- Newsletter with weekly cultural events
- Mobile app version

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` | ✅ Yes | Google Places API key |
| `EVENTBRITE_API_KEY` | ⚠️ Optional | Eventbrite API key |
| `MEETUP_API_KEY` | ⚠️ Optional | Meetup API key |
| `NEXT_PUBLIC_APP_URL` | ✅ Yes | App URL (default: http://localhost:3000) |
| `NODE_ENV` | ✅ Yes | Environment (development/production) |

## Security Considerations

✅ **What We Do**
- Never expose API keys in frontend code
- Validate all user inputs
- Use environment variables for secrets
- Filter results to verified sources only

⚠️ **What Users Should Know**
- API usage is counted against your quotas
- Some APIs have rate limits
- Store API keys securely
- Don't share `.env.local` publicly

## Testing

To test without real API keys:
- Endpoints return mock data gracefully
- Error handling shows user-friendly messages
- Validation prevents invalid searches
- Explore UI with demo data by modifying the form

## Troubleshooting

### "Limited verified resources found"
- Check city/country spelling
- Try a larger city first
- Ensure API keys are configured

### No restaurants showing up
- Verify Google Places API key is correct
- Check that geolocation is enabled (if using coordinates)
- Try searching in a larger city

### Events not loading
- Ensure Eventbrite API key is set
- Check Eventbrite service status
- Try different cultural keywords

## Contributing

To improve this project:
1. Add new data sources
2. Improve credibility scoring algorithm
3. Add more cultural categories
4. Enhance UI/UX
5. Add tests and documentation

## License

This project is open source and available under the MIT License.

## Contact & Support

For questions or issues, please check the documentation or reach out to the development team.

---

**Made with ❤️ for cultural communities worldwide.**
