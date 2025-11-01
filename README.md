# Trader Ranker - Crypto Landing Page

A modern, sleek landing page for Trader Ranker with Phantom wallet integration and email signup functionality.

## Features

### 🔐 Phantom Wallet Integration
- One-click connection to Phantom wallet
- Auto-reconnection support
- Wallet address display
- Secure disconnect functionality
- Account change detection

### 📧 Email Signup Form
- Email validation
- Waitlist registration
- Success/error messaging
- Loading states

### 🎨 Modern Design
- Gradient animations
- Responsive layout
- Dark theme optimized for crypto
- Animated background stars
- Hover effects and transitions

## Getting Started

### Prerequisites
- Phantom Wallet browser extension ([Install here](https://phantom.app/))
- Modern web browser
- Local web server (optional, but recommended)

### Running Locally

1. **Simple method** - Open directly in browser:
   ```bash
   # Navigate to the project directory
   cd traderRankerWebsite

   # Open index.html in your browser
   open index.html  # macOS
   # or
   start index.html  # Windows
   # or
   xdg-open index.html  # Linux
   ```

2. **Recommended method** - Use a local server:
   ```bash
   # Using Python 3
   python3 -m http.server 8000

   # Or using Node.js
   npx http-server

   # Then open http://localhost:8000 in your browser
   ```

## File Structure

```
traderRankerWebsite/
├── index.html      # Main HTML structure
├── styles.css      # All styling and animations
├── app.js          # Wallet integration and form logic
└── README.md       # This file
```

## Usage

### Connecting Phantom Wallet

1. Click the "Connect Phantom" button in the navigation bar
2. Approve the connection in the Phantom popup
3. Your wallet address will be displayed
4. The wallet status card shows your connected address
5. Click "Disconnect" to disconnect your wallet

### Joining the Waitlist

1. Enter your email address in the signup form
2. Click "Join Waitlist"
3. Wait for the success confirmation
4. Your email is stored locally (for demo purposes)

## Customization

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary: #9945FF;      /* Phantom purple */
    --secondary: #14F195;    /* Solana green */
    --accent: #00D4FF;       /* Accent blue */
    --dark: #0a0a0a;        /* Background */
}
```

### Backend Integration

The email form currently stores emails in localStorage. To connect to your backend:

1. Open `app.js`
2. Find the `submitEmail()` method
3. Replace the simulated API call with your actual endpoint:

```javascript
async submitEmail(email) {
    const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
    });

    if (!response.ok) {
        throw new Error('Submission failed');
    }

    return response.json();
}
```

## Security Notes

- Never request or store private keys
- Only connect to trusted wallet providers
- Validate all user inputs
- Use HTTPS in production
- Implement rate limiting on your backend

## Browser Support

- Chrome/Edge (recommended for Phantom)
- Firefox
- Safari
- Opera

## Troubleshooting

**Phantom not detected:**
- Install Phantom wallet extension
- Refresh the page
- Ensure Phantom is unlocked

**Wallet won't connect:**
- Check if Phantom is on the Solana network
- Try disconnecting and reconnecting
- Clear browser cache

**Form not submitting:**
- Check console for errors
- Verify email format
- Ensure JavaScript is enabled

## Future Enhancements

- [ ] Backend API integration
- [ ] Real-time leaderboard
- [ ] Trading analytics dashboard
- [ ] Multi-wallet support (Solflare, Glow)
- [ ] Dark/light theme toggle
- [ ] Social media integration

## License

MIT License - feel free to use for your project!

## Support

For issues or questions:
- Check browser console for error messages
- Ensure all files are in the same directory
- Verify Phantom wallet is properly installed

Built with ❤️ for the Solana ecosystem
