# Fleet Risk Score Calculator

An interactive lead generation tool for SambaSafety that helps fleet managers assess their risk exposure.

## Features

- 10-question assessment covering fleet profile, data visibility, and risk management
- Instant personalised risk score with three component scores (Visibility, Management, Exposure)
- Email capture before results
- Actionable insights based on responses
- CTA to book a SambaSafety demo

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repo
5. Click Deploy

That's it - Vercel auto-detects Next.js and configures everything.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Customisation

- **Questions & Scoring**: Edit the `questions` array in `app/page.js`
- **Scoring weights**: Adjust the `risk` values and max scores in `calculateScores()`
- **Branding**: Update colours and logos in the styles object
- **CTA link**: Change the demo URL in the results section
