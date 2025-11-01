# Email Service Integration Guide

TraderRanker supports multiple email service providers to collect waitlist signups. This guide shows you how to set up each option.

## Current Status

**Demo Mode Active** - Emails are currently stored in browser localStorage. Follow the steps below to connect a real email service.

## Quick Start

1. Open `app.js`
2. Find the `EMAIL_CONFIG` object at the top (lines 8-35)
3. Choose your provider and add your API key
4. That's it! The site will automatically use your email service

---

## Option 1: Brevo (Recommended - FREE)

**Best for:** Small projects, startups
**Free Tier:** 300 emails/day, unlimited contacts

### Setup Steps

1. **Create Account**
   - Go to [brevo.com](https://www.brevo.com/)
   - Sign up for free account

2. **Get API Key**
   - Log in to Brevo
   - Go to Settings > API Keys
   - Click "Create new API key"
   - Copy your API key

3. **Create Contact List**
   - Go to Contacts > Lists
   - Create a new list called "TraderRanker Waitlist"
   - Note the list ID (usually 2 or 3)

4. **Configure app.js**
   ```javascript
   const EMAIL_CONFIG = {
       provider: 'brevo',
       brevo: {
           apiKey: 'xkeysib-xxx...', // Your actual API key
           listId: 2,  // Your list ID
           endpoint: 'https://api.brevo.com/v3/contacts'
       },
       // ... other providers
   };
   ```

5. **Test It**
   - Open your site
   - Submit a test email
   - Check your Brevo dashboard under Contacts

### Brevo Features
- ✅ 300 emails/day free
- ✅ Unlimited contacts
- ✅ Email marketing campaigns
- ✅ Easy-to-use dashboard
- ✅ GDPR compliant

---

## Option 2: Mailchimp (Popular Choice)

**Best for:** Established businesses
**Free Tier:** 500 contacts, 1,000 emails/month

### Setup Steps

1. **Create Account**
   - Go to [mailchimp.com](https://mailchimp.com/)
   - Sign up for free account

2. **Get API Key**
   - Log in to Mailchimp
   - Go to Account > Extras > API keys
   - Create new API key
   - Copy your API key (looks like: `abc123def456-us19`)
   - Note the datacenter (e.g., `us19` from the end of API key)

3. **Create Audience**
   - Go to Audience > Audience dashboard
   - Click "Create Audience"
   - Fill in details
   - Get Audience ID: Settings > Audience name and defaults > Audience ID

4. **Configure app.js**
   ```javascript
   const EMAIL_CONFIG = {
       provider: 'mailchimp',
       mailchimp: {
           apiKey: 'abc123def456-us19',  // Your actual API key
           audienceId: 'abc123def4',  // Your audience ID
           datacenter: 'us19',  // From your API key
           endpoint: 'https://YOUR_DC.api.mailchimp.com/3.0/lists/YOUR_AUDIENCE_ID/members'
       },
       // ... other providers
   };
   ```

5. **Test It**
   - Open your site
   - Submit a test email
   - Check Mailchimp > Audience > All contacts

### Note on CORS
Mailchimp API requires server-side calls due to CORS. For client-side only, you'll need to:
- Use their embedded forms, OR
- Set up a simple serverless function (Vercel/Netlify), OR
- Use Brevo instead (no CORS issues)

### Mailchimp Features
- ✅ 500 free contacts
- ✅ Advanced segmentation
- ✅ A/B testing
- ✅ Marketing automation
- ✅ Professional templates

---

## Option 3: Custom Backend

**Best for:** Developers with existing infrastructure

### Setup Steps

1. **Create Your Endpoint**
   - Build an API endpoint that accepts POST requests
   - Example: `POST https://api.yoursite.com/subscribe`
   - Accept JSON: `{ email, walletAddress, timestamp }`

2. **Example Backend (Node.js/Express)**
   ```javascript
   app.post('/api/subscribe', async (req, res) => {
       const { email, walletAddress, timestamp } = req.body;

       // Validate email
       if (!email || !isValidEmail(email)) {
           return res.status(400).json({ error: 'Invalid email' });
       }

       // Store in your database
       await db.collection('waitlist').insertOne({
           email,
           walletAddress,
           timestamp,
           createdAt: new Date()
       });

       res.json({ success: true });
   });
   ```

3. **Configure app.js**
   ```javascript
   const EMAIL_CONFIG = {
       provider: 'custom',
       custom: {
           endpoint: 'https://api.yoursite.com/subscribe',
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
               'Authorization': 'Bearer YOUR_TOKEN'  // Optional
           }
       }
   };
   ```

### Custom Backend Features
- ✅ Full control over data
- ✅ Custom logic/validation
- ✅ Integration with your database
- ✅ No third-party dependencies

---

## Testing Your Integration

### 1. Check Console Logs
Open browser console (F12) and look for:
```
🚀 TraderRanker initialized
📧 Email service: brevo  (or your chosen provider)
```

### 2. Submit Test Email
- Enter a test email
- Click submit
- Check console for success message:
```
✅ Subscribed to Brevo: test@example.com
🎉 New Signup!
```

### 3. Verify in Dashboard
- Check your email service dashboard
- Look for the new contact/subscriber
- Verify wallet address was captured (if connected)

### 4. Test Error Handling
- Try submitting same email twice
- Should show: "This email is already registered!"

---

## Troubleshooting

### "Failed to submit" Error

**Brevo:**
- ✓ Check API key is correct
- ✓ Verify list ID exists
- ✓ Check API key has contacts permission

**Mailchimp:**
- ✓ Check for CORS errors in console
- ✓ Verify audience ID is correct
- ✓ Confirm datacenter matches API key
- ✓ Consider using serverless function

**Custom:**
- ✓ Check endpoint URL is accessible
- ✓ Verify CORS headers are set
- ✓ Check request format matches your API

### Emails Not Showing Up

1. **Check Console**
   - Look for error messages
   - Verify API calls are being made

2. **Verify API Key**
   - Test API key in Postman
   - Check permissions

3. **Check List/Audience**
   - Confirm list ID is correct
   - Verify list isn't archived

4. **Demo Mode Still Active?**
   - If API key still has `YOUR_`, it's in demo mode
   - Replace with real API key

---

## Data Captured

When users sign up, we capture:
- **Email address** (required)
- **Wallet address** (if connected)
- **Signup timestamp**
- **Source** (which form: top or bottom)

Example data sent to your email service:
```json
{
  "email": "trader@example.com",
  "listIds": [2],
  "attributes": {
    "WALLET_ADDRESS": "5Xj8...9kLm",
    "SIGNUP_DATE": "2025-01-15T10:30:00Z"
  }
}
```

---

## Advanced Configuration

### Add Custom Fields (Brevo)

```javascript
attributes: {
    WALLET_ADDRESS: this.walletAddress || 'Not connected',
    SIGNUP_DATE: new Date().toISOString(),
    SOURCE: 'Landing Page',
    REFERRER: document.referrer,
    USER_AGENT: navigator.userAgent
}
```

### Track UTM Parameters

```javascript
// Get UTM params from URL
const urlParams = new URLSearchParams(window.location.search);
const utmSource = urlParams.get('utm_source');
const utmCampaign = urlParams.get('utm_campaign');

// Add to attributes
attributes: {
    UTM_SOURCE: utmSource,
    UTM_CAMPAIGN: utmCampaign
}
```

### Rate Limiting

Add rate limiting to prevent spam:

```javascript
// In handleEmailSubmit, before validation
const lastSubmit = localStorage.getItem('lastEmailSubmit');
if (lastSubmit && Date.now() - parseInt(lastSubmit) < 60000) {
    this.showFormMessage('Please wait before submitting again', 'error', messageId);
    return;
}
localStorage.setItem('lastEmailSubmit', Date.now().toString());
```

---

## Security Best Practices

1. **Never commit API keys**
   - Add `app.js` to `.gitignore` if it contains keys
   - Use environment variables in production

2. **Use HTTPS**
   - Always deploy on HTTPS (GitHub Pages does this automatically)

3. **Validate on Backend**
   - Always validate emails on your backend too
   - Don't trust client-side validation alone

4. **Rate Limiting**
   - Implement rate limiting to prevent abuse
   - Most email services have built-in limits

5. **GDPR Compliance**
   - Add privacy policy
   - Include unsubscribe link in emails
   - Store consent timestamp

---

## Production Deployment

### Using Environment Variables (Recommended)

**For Vercel/Netlify:**

1. Don't hardcode API keys in `app.js`
2. Create a serverless function:

```javascript
// api/subscribe.js (Vercel)
export default async function handler(req, res) {
    const { email } = req.body;

    const response = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
            'api-key': process.env.BREVO_API_KEY,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            email,
            listIds: [2]
        })
    });

    res.json(await response.json());
}
```

3. Update `app.js` to call your function:
```javascript
custom: {
    endpoint: '/api/subscribe',
    method: 'POST'
}
```

4. Add env var in Vercel dashboard:
   - `BREVO_API_KEY=xkeysib-xxx...`

---

## Support

**Email Service Issues:**
- Brevo: [help.brevo.com](https://help.brevo.com)
- Mailchimp: [mailchimp.com/help](https://mailchimp.com/help)

**TraderRanker Code Issues:**
- Check browser console for errors
- Review this guide
- Test with demo mode first

---

## Demo Mode

Demo mode stores emails in browser localStorage for testing.

**View stored emails in console:**
```javascript
viewStoredEmails()
```

**Clear stored emails:**
```javascript
localStorage.removeItem('traderRankerEmails')
```

Demo mode is active when:
- API key contains `YOUR_`
- Provider is not configured
- Errors connecting to email service

---

**🎉 You're all set! Your email signups will now be captured professionally.**
