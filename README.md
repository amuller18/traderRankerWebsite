# TraderRanker - Find Out Which Telegram Callers Actually Win

A professional, data-driven landing page for TraderRanker — the platform that analyzes public Telegram KOLs and trading callers, tracking their calls to reveal which ones actually perform well.

## 🎯 What This Site Does

TraderRanker provides transparency and accountability in Telegram trading calls:
- **Tracks** every crypto call made by top Telegram KOLs
- **Analyzes** performance with real on-chain data
- **Ranks** callers by ROI, accuracy, and consistency
- **Reveals** who's truly profitable vs. who just posts screenshots

## ✨ Features

### 🔐 Phantom Wallet Integration
- One-click Solana wallet connection
- Auto-reconnection for returning users
- Wallet address capture for beta access
- Secure disconnect functionality
- Account change detection

### 📧 Professional Email Signup System
- **Dual signup forms** (hero and CTA sections)
- **Email validation** with error handling
- **Multiple provider support:**
  - Brevo (SendinBlue) - 300 emails/day FREE
  - Mailchimp - 500 contacts FREE
  - Custom backend integration
- **Demo mode** with localStorage for testing
- **Wallet linking** - captures user's wallet with email
- See **EMAIL_SETUP.md** for integration guide

### 🎨 Modern Trading UI/UX
- Professional dark trading aesthetic (DexTools/Nansen style)
- Grid background with subtle animations
- Fully responsive design (mobile to desktop)
- Smooth hover effects and transitions
- Live stats bar with key metrics
- Interactive ranking leaderboard preview
- Feature cards with "Live" and "Coming Soon" badges

### 📊 Landing Page Sections
1. **Hero** - Powerful headline about transparency
2. **Live Stats** - KOLs tracked, calls analyzed, win rates
3. **How It Works** - 4-step process explanation
4. **Key Features** - Detailed feature breakdown
5. **Why It Matters** - Problem/solution with live rankings
6. **Roadmap** - Q2-Q4 2025 vision
7. **CTA** - Final call-to-action with signup form
8. **Footer** - Links and resources

## 🚀 Quick Start

### 1. View the Site

**Option A: Open locally**
```bash
# Clone and open
cd traderRankerWebsite
open index.html
```

**Option B: Run local server**
```bash
# Python
python3 -m http.server 8000

# Node
npx http-server

# Then visit: http://localhost:8000
```

**Option C: Visit live site**
```
https://amuller18.github.io/traderRankerWebsite/
```

### 2. Set Up Email Collection

The site works immediately in **demo mode** (emails saved to browser localStorage).

To collect emails with a real service:

1. Open `app.js`
2. Find `EMAIL_CONFIG` at the top
3. Choose a provider (Brevo recommended)
4. Add your API key
5. Done!

**📖 Full setup guide:** See [EMAIL_SETUP.md](./EMAIL_SETUP.md)

### 3. Optional: Install Phantom Wallet

For wallet connection testing:
- Install Phantom from [phantom.app](https://phantom.app/)
- Create or import a wallet
- Click "Connect Wallet" on the site

## 📁 File Structure

```
traderRankerWebsite/
├── index.html          # Landing page HTML
├── styles.css          # Professional trading UI styles
├── app.js              # Wallet + email integration
├── EMAIL_SETUP.md      # Email service setup guide
└── README.md           # This file
```

## 🎨 Customization

### Update Copy/Content

Edit `index.html` to change:
- Hero headline and tagline
- Feature descriptions
- Stats and metrics
- Roadmap timeline
- Footer links

### Customize Colors

Edit CSS variables in `styles.css` (lines 8-33):
```css
:root {
    --primary: #00C9A7;      /* Teal green */
    --secondary: #845EC2;    /* Purple */
    --accent: #00D2FF;       /* Cyan */
    --success: #00C9A7;      /* Success state */
    --danger: #FF6F91;       /* Error state */

    --dark: #0a0e1a;         /* Page background */
    --dark-lighter: #1a1f2e; /* Card background */
    --border: #2a2f3e;       /* Border color */
}
```

### Update Stats & Metrics

Edit the live stats bar in `index.html` (lines 86-104):
```html
<span class="stat-value-inline">50+</span>  <!-- Change numbers -->
```

### Modify Ranking Leaderboard

Edit demo rankings in `index.html` (lines 249-288):
```html
<div class="rank-name">YourKOL</div>
<div class="rank-roi positive">+200%</div>
```

## 🔒 Security Best Practices

- ✅ Never request or store private keys
- ✅ All wallet connections are non-custodial
- ✅ Email validation on client and server
- ✅ Use HTTPS in production (GitHub Pages provides this)
- ✅ API keys should never be committed to Git
- ✅ See EMAIL_SETUP.md for production deployment guide

## 🌐 Browser Support

- ✅ Chrome/Edge (recommended for Phantom)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ✅ Brave

Mobile browsers supported for browsing, wallet connection requires desktop.

## 🛠️ Troubleshooting

### Phantom Wallet Issues

**Phantom not detected:**
- Install from [phantom.app](https://phantom.app/)
- Refresh the page after installation
- Ensure Phantom extension is enabled

**Connection failed:**
- Check if Phantom wallet is unlocked
- Verify you're on Solana network (not Ethereum)
- Try refreshing and reconnecting

### Email Form Issues

**Form not submitting:**
- Check browser console (F12) for errors
- Verify email format is valid
- Check network tab for API errors

**"Failed to submit" error:**
- If using real email service: verify API key in app.js
- Check EMAIL_SETUP.md for configuration
- Test in demo mode first (default)

**View collected emails (Demo Mode):**
```javascript
// Open browser console and run:
viewStoredEmails()
```

### Styling Issues

**Fonts look wrong:**
- Check internet connection for web fonts
- Clear browser cache

**Layout broken:**
- Ensure all files (HTML, CSS, JS) are in same directory
- Check browser console for 404 errors

## 📊 Analytics Integration

Add your analytics:

```html
<!-- Add to index.html before </head> -->

<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>

<!-- Plausible Analytics (privacy-friendly) -->
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

## 🚀 Deployment

Deployed on **GitHub Pages**: https://amuller18.github.io/traderRankerWebsite/

### Deploy to Other Platforms

**Vercel:**
```bash
npm i -g vercel
vercel
```

**Netlify:**
- Drag & drop folder to netlify.com
- Or connect GitHub repo for auto-deploy

**Custom Domain:**
- See GitHub Pages docs for custom domain setup
- Update email service CORS settings if needed

## 🗺️ Next Steps

**Phase 1: Launch** ✅
- [x] Professional landing page
- [x] Email collection
- [x] Wallet integration

**Phase 2: Beta Access**
- [ ] Real KOL data integration
- [ ] Backend API for rankings
- [ ] User dashboard

**Phase 3: Platform Launch**
- [ ] Live leaderboards
- [ ] Historical data analysis
- [ ] Strategy backtester

## 📄 License

MIT License - Free to use for any project

## 💬 Support

**General Questions:**
- Open an issue on GitHub
- Check EMAIL_SETUP.md for email service help

**Technical Issues:**
- Check browser console for errors
- Review troubleshooting section above
- Ensure all files are present

**Email Service Help:**
- Brevo: [help.brevo.com](https://help.brevo.com)
- Mailchimp: [mailchimp.com/help](https://mailchimp.com/help)

---

**Built for transparency in crypto trading** 📊
*Helping traders separate signal from noise*
