# Second Order

Second Order is a mobile-first briefing product for people who care about second-order effects, not headline sludge.

## What this build includes

- Personalized Today feed ranked by role, interests, and watchlist
- Story detail pages with winners, losers, next-order implications, and uncertainty
- Saved desk for stories worth revisiting
- Theme overview ranked by relevance
- Watchlist management for companies, policy threads, and market topics
- Profile controls to tune the feed lens
- Password gate for private preview builds

## Local development

```bash
npm install
npm run web
```

## Deploy

```bash
npm run build:web
vercel --prod
```

Set this env var in Vercel for the preview gate:

- `EXPO_PUBLIC_APP_PASSWORD=zxcQWE123`
