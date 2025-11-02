# Custom Domain Setup: traderranker.com

Complete guide to connect your GitHub Pages site to your GoDaddy domain.

---

## Overview

You'll be connecting:
- **From:** amuller18.github.io/traderRankerWebsite
- **To:** traderranker.com

**Time needed:** 10 minutes setup + 24-48 hours for DNS propagation

---

## Step 1: Configure DNS on GoDaddy (5 minutes)

### 1.1 Log in to GoDaddy

1. Go to [godaddy.com](https://www.godaddy.com)
2. Sign in to your account
3. Go to **My Products** > **Domains**
4. Click **DNS** next to traderranker.com

### 1.2 Add DNS Records

You need to add **4 A records** and **1 CNAME record**.

#### Delete Existing Records (if any)

- Delete any existing **A records** pointing to parking pages
- Delete any **CNAME record** for `www` if it exists
- Keep other records (MX, TXT, etc.) if you have them

#### Add A Records

Add these **4 A records** (one at a time):

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 185.199.108.153 | 600 |
| A | @ | 185.199.109.153 | 600 |
| A | @ | 185.199.110.153 | 600 |
| A | @ | 185.199.111.153 | 600 |

**How to add:**
1. Click **Add** button
2. Select **Type: A**
3. Name: `@` (this means root domain)
4. Value: Enter IP address
5. TTL: `600` or `1/2 hour`
6. Click **Save**
7. Repeat for all 4 IP addresses

#### Add CNAME Record

Add **1 CNAME record** for `www`:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | www | amuller18.github.io | 600 |

**How to add:**
1. Click **Add** button
2. Select **Type: CNAME**
3. Name: `www`
4. Value: `amuller18.github.io` (NOT the full path!)
5. TTL: `600`
6. Click **Save**

### 1.3 Verify DNS Settings

Your DNS records should look like this:

```
A Records:
@ → 185.199.108.153
@ → 185.199.109.153
@ → 185.199.110.153
@ → 185.199.111.153

CNAME Record:
www → amuller18.github.io
```

**✅ Done with GoDaddy!** DNS changes can take 24-48 hours to fully propagate.

---

## Step 2: Configure GitHub Pages (3 minutes)

### 2.1 Create CNAME File

We need to add a `CNAME` file to your repository.

I'll create it for you now with your domain.

### 2.2 Enable Custom Domain in GitHub

1. Go to your repository: https://github.com/amuller18/traderRankerWebsite
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under **Custom domain**, enter: `traderranker.com`
5. Click **Save**

### 2.3 Wait for DNS Check

GitHub will verify your DNS settings:
- ✅ Green checkmark = DNS configured correctly
- ⚠️ Warning = DNS not yet propagated (wait 1-24 hours)
- ❌ Error = Check your DNS records

### 2.4 Enable HTTPS (Important!)

Once DNS check passes (green checkmark):
1. Check the box: **Enforce HTTPS**
2. Wait ~5 minutes for SSL certificate to provision

**Note:** You might need to wait 24 hours before the HTTPS checkbox appears.

---

## Step 3: Test Your Domain (2 minutes)

### 3.1 Check DNS Propagation

Visit: https://dnschecker.org

1. Enter `traderranker.com`
2. Select **A** record type
3. Click **Search**
4. You should see the 4 GitHub IP addresses

### 3.2 Test Your Site

Try visiting (after DNS propagates):
- http://traderranker.com
- http://www.traderranker.com
- https://traderranker.com
- https://www.traderranker.com

All should redirect to: **https://traderranker.com**

---

## Timeline

**Immediate (0-5 minutes):**
- DNS records saved in GoDaddy ✓
- CNAME file added to GitHub ✓

**10 minutes - 1 hour:**
- DNS starts propagating
- GitHub detects DNS records
- Some regions can access your site

**1-24 hours:**
- DNS fully propagated worldwide
- HTTPS option becomes available
- SSL certificate issued

**24-48 hours:**
- Everything fully working globally

---

## Troubleshooting

### "Domain is improperly configured"

**Check DNS records in GoDaddy:**
```bash
# Run in terminal to check your DNS:
dig traderranker.com
```

Should show the 4 GitHub IPs:
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**Fix:**
- Verify all 4 A records are correct
- Make sure CNAME is `amuller18.github.io` (not the full URL)
- Wait longer (DNS can take 24-48 hours)

### "CNAME already exists"

**Error:** Another repository is using this domain

**Fix:**
1. Go to other repository's Settings > Pages
2. Remove the custom domain
3. Then set it on this repository

### "www.traderranker.com doesn't work"

**Check CNAME record:**
- Name should be `www`
- Value should be `amuller18.github.io`
- NOT `amuller18.github.io/traderRankerWebsite`

### HTTPS checkbox not appearing

**Wait 24-48 hours after:**
- DNS fully propagates
- GitHub verifies DNS
- Then HTTPS option appears

**Don't worry if:**
- Site works on HTTP first
- HTTPS takes a day to activate
- This is normal for custom domains

### DNS not propagating

**Check TTL:**
- If you had old records, old TTL might be cached
- Can take up to 48 hours for old TTL to expire

**Force refresh:**
- Clear browser cache
- Try incognito mode
- Test from different device/network

**Use DNS checkers:**
- https://dnschecker.org
- https://www.whatsmydns.net

---

## Advanced: Subdomain Setup (Optional)

Want `www`, `app`, `beta` subdomains? Add more CNAME records:

| Subdomain | Type | Name | Value |
|-----------|------|------|-------|
| www.traderranker.com | CNAME | www | amuller18.github.io |
| app.traderranker.com | CNAME | app | amuller18.github.io |
| beta.traderranker.com | CNAME | beta | amuller18.github.io |

Then in GitHub Pages, you can only set ONE custom domain at a time.

---

## Email Service Configuration (Important!)

After domain is live, update your email service:

### Brevo / Mailchimp

If you're using Brevo or Mailchimp with client-side API calls, you may need to:

1. **Add your domain to CORS whitelist** in your email service settings
2. **Update API endpoint** if using custom domain

### Better Approach: Serverless Function

For production, use a serverless function:

**Example with Vercel:**
```javascript
// api/subscribe.js
export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'https://traderranker.com');
    res.setHeader('Access-Control-Allow-Methods', 'POST');

    const { email } = req.body;

    // Call Brevo from server-side
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

---

## Security & Best Practices

### 1. Always Use HTTPS

- Never disable HTTPS in production
- GitHub provides free SSL certificates
- Updates automatically

### 2. Add to Google Search Console

Once live:
1. Go to https://search.google.com/search-console
2. Add property: `traderranker.com`
3. Verify ownership (add TXT record to DNS)
4. Submit sitemap

### 3. Update Analytics

Update your analytics to track new domain:
- Google Analytics: Add property for traderranker.com
- Update tracking code if using domain-based tracking

### 4. Redirect Old Domain (Optional)

Want to keep the GitHub Pages URL working?
- Both will work by default
- GitHub automatically redirects github.io to custom domain
- No action needed!

---

## Quick Reference

### GoDaddy DNS Records

```
Type: A
Name: @
Values: 185.199.108.153
        185.199.109.153
        185.199.110.153
        185.199.111.153

Type: CNAME
Name: www
Value: amuller18.github.io
```

### GitHub Settings

```
Repository: amuller18/traderRankerWebsite
Settings > Pages > Custom domain: traderranker.com
✓ Enforce HTTPS
```

### Test Commands

```bash
# Check A records
dig traderranker.com

# Check CNAME
dig www.traderranker.com

# Test HTTPS
curl -I https://traderranker.com
```

---

## Support

**GoDaddy DNS Issues:**
- GoDaddy Support: https://www.godaddy.com/help
- DNS Help: https://www.godaddy.com/help/dns

**GitHub Pages Issues:**
- Docs: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
- Community: https://github.community

**DNS Propagation Checkers:**
- https://dnschecker.org
- https://www.whatsmydns.net
- https://dns.google (Google's DNS checker)

---

## Summary Checklist

- [ ] Log in to GoDaddy
- [ ] Add 4 A records pointing to GitHub IPs
- [ ] Add 1 CNAME record for www
- [ ] Create CNAME file in repository (I'll do this)
- [ ] Set custom domain in GitHub Pages settings
- [ ] Wait for DNS propagation (up to 24 hours)
- [ ] Enable HTTPS in GitHub Pages
- [ ] Test all URLs (http, https, www)
- [ ] Update email service if needed
- [ ] Update analytics tracking

---

**You'll be live at traderranker.com within 24 hours!** 🚀

Most users see their site working within 1-2 hours, but DNS can take up to 48 hours to fully propagate worldwide.
