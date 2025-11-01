// TraderRanker - Phantom Wallet Integration and Email Service

// =============================================================================
// EMAIL SERVICE CONFIGURATION
// =============================================================================
// Choose your email service provider and add your API key/endpoint

const EMAIL_CONFIG = {
    // Option 1: Brevo (formerly SendinBlue) - FREE TIER: 300 emails/day
    // Get API key from: https://app.brevo.com/settings/keys/api
    provider: 'brevo',  // Options: 'brevo', 'mailchimp', 'custom'
    brevo: {
        apiKey: 'YOUR_BREVO_API_KEY_HERE',  // Replace with your Brevo API key
        listId: 2,  // Your contact list ID in Brevo
        endpoint: 'https://api.brevo.com/v3/contacts'
    },

    // Option 2: Mailchimp - FREE TIER: 500 contacts, 1000 emails/month
    // Get API key from: https://mailchimp.com/help/about-api-keys/
    mailchimp: {
        apiKey: 'YOUR_MAILCHIMP_API_KEY_HERE',
        audienceId: 'YOUR_AUDIENCE_ID_HERE',
        datacenter: 'us1',  // Found in your API key (e.g., 'us1', 'us19')
        endpoint: 'https://YOUR_DC.api.mailchimp.com/3.0/lists/YOUR_AUDIENCE_ID/members'
    },

    // Option 3: Custom backend endpoint
    custom: {
        endpoint: 'https://your-backend.com/api/subscribe',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }
};

// =============================================================================
// TRADER RANKER APPLICATION
// =============================================================================

class TraderRankerApp {
    constructor() {
        this.walletAddress = null;
        this.provider = null;
        this.init();
    }

    init() {
        // Initialize Phantom wallet connection
        this.initWallet();

        // Initialize email forms (both top and bottom)
        this.initEmailForms();

        // Check if wallet was previously connected
        this.checkWalletConnection();
    }

    // =========================================================================
    // PHANTOM WALLET FUNCTIONS
    // =========================================================================

    initWallet() {
        const walletButton = document.getElementById('walletButton');
        const disconnectBtn = document.getElementById('disconnectBtn');

        if (walletButton) {
            walletButton.addEventListener('click', () => this.handleWalletClick());
        }

        if (disconnectBtn) {
            disconnectBtn.addEventListener('click', () => this.disconnectWallet());
        }
    }

    async handleWalletClick() {
        if (this.walletAddress) {
            // Already connected
            return;
        }

        await this.connectWallet();
    }

    async connectWallet() {
        try {
            // Check if Phantom is installed
            const isPhantomInstalled = window.solana && window.solana.isPhantom;

            if (!isPhantomInstalled) {
                alert('Phantom wallet not detected!\n\nPlease install Phantom from phantom.app');
                window.open('https://phantom.app/', '_blank');
                return;
            }

            // Request connection to Phantom
            const resp = await window.solana.connect();
            this.walletAddress = resp.publicKey.toString();
            this.provider = window.solana;

            // Update UI
            this.updateWalletUI(true);

            console.log('✅ Wallet connected:', this.formatAddress(this.walletAddress));

            // Listen for account changes
            window.solana.on('accountChanged', (publicKey) => {
                if (publicKey) {
                    this.walletAddress = publicKey.toString();
                    this.updateWalletUI(true);
                } else {
                    this.disconnectWallet();
                }
            });

            // Listen for disconnect
            window.solana.on('disconnect', () => {
                this.disconnectWallet();
            });

        } catch (err) {
            console.error('Wallet connection error:', err);
            if (err.code === 4001) {
                alert('Connection rejected. Please try again.');
            } else {
                alert('Failed to connect wallet. Please try again.');
            }
        }
    }

    async disconnectWallet() {
        try {
            if (this.provider) {
                await this.provider.disconnect();
            }

            this.walletAddress = null;
            this.provider = null;
            this.updateWalletUI(false);
            console.log('👋 Wallet disconnected');
        } catch (err) {
            console.error('Disconnect error:', err);
        }
    }

    async checkWalletConnection() {
        try {
            const isPhantomInstalled = window.solana && window.solana.isPhantom;

            if (isPhantomInstalled && window.solana.isConnected) {
                const resp = await window.solana.connect({ onlyIfTrusted: true });
                this.walletAddress = resp.publicKey.toString();
                this.provider = window.solana;
                this.updateWalletUI(true);
            }
        } catch (err) {
            // User hasn't approved automatic connection
            console.log('No automatic connection');
        }
    }

    updateWalletUI(connected) {
        const walletButton = document.getElementById('walletButton');
        const walletText = document.getElementById('walletText');
        const walletStatus = document.getElementById('walletStatus');
        const walletAddress = document.getElementById('walletAddress');

        if (connected && this.walletAddress) {
            // Update button
            walletButton.classList.add('connected');
            walletText.textContent = this.formatAddress(this.walletAddress);

            // Show wallet status card
            if (walletStatus) {
                walletStatus.classList.remove('hidden');
            }
            if (walletAddress) {
                walletAddress.textContent = this.formatAddress(this.walletAddress, 8);
            }
        } else {
            // Reset button
            walletButton.classList.remove('connected');
            walletText.textContent = 'Connect Wallet';

            // Hide wallet status card
            if (walletStatus) {
                walletStatus.classList.add('hidden');
            }
        }
    }

    formatAddress(address, length = 4) {
        if (!address) return '';
        return `${address.slice(0, length)}...${address.slice(-length)}`;
    }

    // =========================================================================
    // EMAIL FORM FUNCTIONS
    // =========================================================================

    initEmailForms() {
        // Top form
        const topForm = document.getElementById('emailForm');
        if (topForm) {
            topForm.addEventListener('submit', (e) => this.handleEmailSubmit(e, 'top'));
        }

        // Bottom form
        const bottomForm = document.getElementById('emailFormBottom');
        if (bottomForm) {
            bottomForm.addEventListener('submit', (e) => this.handleEmailSubmit(e, 'bottom'));
        }
    }

    async handleEmailSubmit(e, location = 'top') {
        e.preventDefault();

        const inputId = location === 'top' ? 'emailInput' : 'emailInputBottom';
        const messageId = location === 'top' ? 'formMessage' : 'formMessageBottom';

        const emailInput = document.getElementById(inputId);
        const submitBtn = e.target.querySelector('.submit-btn');
        const formMessage = document.getElementById(messageId);
        const email = emailInput.value.trim();

        // Validate email
        if (!this.validateEmail(email)) {
            this.showFormMessage('Please enter a valid email address', 'error', messageId);
            return;
        }

        // Disable button and show loading
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading"></span>';

        try {
            // Submit email to configured service
            await this.submitEmail(email);

            // Success
            this.showFormMessage('✓ Successfully joined the waitlist!', 'success', messageId);
            emailInput.value = '';

            // Track signup
            this.trackSignup(email);

            // Re-enable button
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }, 2000);

        } catch (err) {
            console.error('Email submission error:', err);

            let errorMsg = 'Failed to submit. Please try again.';
            if (err.message.includes('already')) {
                errorMsg = 'This email is already registered!';
            }

            this.showFormMessage(errorMsg, 'error', messageId);
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    async submitEmail(email) {
        const provider = EMAIL_CONFIG.provider;

        // Check if using demo mode (no API key configured)
        if (this.isDemoMode()) {
            return this.submitEmailDemo(email);
        }

        // Submit to configured provider
        switch (provider) {
            case 'brevo':
                return this.submitToBrevo(email);
            case 'mailchimp':
                return this.submitToMailchimp(email);
            case 'custom':
                return this.submitToCustomEndpoint(email);
            default:
                return this.submitEmailDemo(email);
        }
    }

    isDemoMode() {
        const provider = EMAIL_CONFIG.provider;
        const config = EMAIL_CONFIG[provider];

        if (!config) return true;

        // Check if API key is the default placeholder
        if (provider === 'brevo' && config.apiKey.includes('YOUR_')) return true;
        if (provider === 'mailchimp' && config.apiKey.includes('YOUR_')) return true;
        if (provider === 'custom' && config.endpoint.includes('your-backend')) return true;

        return false;
    }

    async submitEmailDemo(email) {
        // Demo mode - store in localStorage
        console.log('📧 Demo Mode: Storing email locally');

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const emails = JSON.parse(localStorage.getItem('traderRankerEmails') || '[]');

                if (emails.includes(email)) {
                    reject(new Error('Email already registered'));
                    return;
                }

                emails.push({
                    email,
                    timestamp: new Date().toISOString(),
                    walletAddress: this.walletAddress || null
                });

                localStorage.setItem('traderRankerEmails', JSON.stringify(emails));

                console.log('✅ Email stored:', email);
                console.log('📊 Total signups:', emails.length);

                resolve();
            }, 800);
        });
    }

    async submitToBrevo(email) {
        const config = EMAIL_CONFIG.brevo;

        const response = await fetch(config.endpoint, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': config.apiKey,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                listIds: [config.listId],
                attributes: {
                    WALLET_ADDRESS: this.walletAddress || 'Not connected',
                    SIGNUP_DATE: new Date().toISOString()
                },
                updateEnabled: false
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to subscribe');
        }

        console.log('✅ Subscribed to Brevo:', email);
        return response.json();
    }

    async submitToMailchimp(email) {
        const config = EMAIL_CONFIG.mailchimp;
        const endpoint = config.endpoint
            .replace('YOUR_DC', config.datacenter)
            .replace('YOUR_AUDIENCE_ID', config.audienceId);

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${btoa(`anystring:${config.apiKey}`)}`
            },
            body: JSON.stringify({
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    WALLET: this.walletAddress || 'Not connected'
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.title || 'Failed to subscribe');
        }

        console.log('✅ Subscribed to Mailchimp:', email);
        return response.json();
    }

    async submitToCustomEndpoint(email) {
        const config = EMAIL_CONFIG.custom;

        const response = await fetch(config.endpoint, {
            method: config.method,
            headers: config.headers,
            body: JSON.stringify({
                email: email,
                walletAddress: this.walletAddress,
                timestamp: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error('Failed to subscribe');
        }

        console.log('✅ Subscribed via custom endpoint:', email);
        return response.json();
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    showFormMessage(message, type, messageId = 'formMessage') {
        const formMessage = document.getElementById(messageId);
        if (!formMessage) return;

        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;

        // Clear message after 5 seconds
        setTimeout(() => {
            formMessage.textContent = '';
            formMessage.className = 'form-message';
        }, 5000);
    }

    trackSignup(email) {
        // Track signup in console for now
        console.log('🎉 New Signup!');
        console.log('Email:', email);
        if (this.walletAddress) {
            console.log('Wallet:', this.formatAddress(this.walletAddress, 6));
        }
        console.log('Time:', new Date().toLocaleString());
    }
}

// =============================================================================
// INITIALIZE APPLICATION
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 TraderRanker initialized');

    // Log demo mode status
    const config = EMAIL_CONFIG;
    const isDemoMode = config.provider === 'brevo' && config.brevo.apiKey.includes('YOUR_');

    if (isDemoMode) {
        console.log('📧 Running in DEMO MODE - emails stored locally');
        console.log('💡 Configure EMAIL_CONFIG in app.js to enable real email service');
    } else {
        console.log(`📧 Email service: ${config.provider}`);
    }

    window.traderRankerApp = new TraderRankerApp();
});

// Handle page visibility for wallet connection
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && window.traderRankerApp) {
        window.traderRankerApp.checkWalletConnection();
    }
});

// =============================================================================
// UTILITY: View stored emails (Demo Mode)
// =============================================================================

// Run this in browser console to see stored emails:
// viewStoredEmails()

window.viewStoredEmails = function() {
    const emails = JSON.parse(localStorage.getItem('traderRankerEmails') || '[]');
    console.log('📧 Stored Emails:', emails.length);
    console.table(emails);
    return emails;
};
