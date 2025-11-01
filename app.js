// Phantom Wallet Integration and Email Form Handler

class TraderRankerApp {
    constructor() {
        this.walletAddress = null;
        this.provider = null;
        this.init();
    }

    init() {
        // Initialize Phantom wallet connection
        this.initWallet();

        // Initialize email form
        this.initEmailForm();

        // Check if wallet was previously connected
        this.checkWalletConnection();
    }

    // Phantom Wallet Functions
    initWallet() {
        const walletButton = document.getElementById('walletButton');
        const disconnectBtn = document.getElementById('disconnectBtn');

        walletButton.addEventListener('click', () => this.handleWalletClick());
        disconnectBtn.addEventListener('click', () => this.disconnectWallet());
    }

    async handleWalletClick() {
        if (this.walletAddress) {
            // Already connected, do nothing or show dashboard
            return;
        }

        await this.connectWallet();
    }

    async connectWallet() {
        try {
            // Check if Phantom is installed
            const isPhantomInstalled = window.solana && window.solana.isPhantom;

            if (!isPhantomInstalled) {
                this.showWalletError('Phantom wallet not detected. Please install it from phantom.app');
                window.open('https://phantom.app/', '_blank');
                return;
            }

            // Request connection to Phantom
            const resp = await window.solana.connect();
            this.walletAddress = resp.publicKey.toString();
            this.provider = window.solana;

            // Update UI
            this.updateWalletUI(true);

            // Show success message
            this.showNotification('Wallet connected successfully!', 'success');

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
            this.showWalletError('Failed to connect wallet. Please try again.');
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
            this.showNotification('Wallet disconnected', 'info');
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
            walletStatus.classList.remove('hidden');
            walletAddress.textContent = this.formatAddress(this.walletAddress, 8);
        } else {
            // Reset button
            walletButton.classList.remove('connected');
            walletText.textContent = 'Connect Phantom';

            // Hide wallet status card
            walletStatus.classList.add('hidden');
        }
    }

    formatAddress(address, length = 4) {
        if (!address) return '';
        return `${address.slice(0, length)}...${address.slice(-length)}`;
    }

    showWalletError(message) {
        this.showNotification(message, 'error');
    }

    // Email Form Functions
    initEmailForm() {
        const form = document.getElementById('emailForm');
        form.addEventListener('submit', (e) => this.handleEmailSubmit(e));
    }

    async handleEmailSubmit(e) {
        e.preventDefault();

        const emailInput = document.getElementById('emailInput');
        const submitBtn = e.target.querySelector('.submit-btn');
        const formMessage = document.getElementById('formMessage');
        const email = emailInput.value.trim();

        // Validate email
        if (!this.validateEmail(email)) {
            this.showFormMessage('Please enter a valid email address', 'error');
            return;
        }

        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading"></span>';

        try {
            // Simulate API call (replace with your actual backend endpoint)
            await this.submitEmail(email);

            // Success
            this.showFormMessage('🎉 Successfully joined the waitlist!', 'success');
            emailInput.value = '';

            // Re-enable button
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Join Waitlist';
            }, 2000);

        } catch (err) {
            console.error('Email submission error:', err);
            this.showFormMessage('Failed to submit. Please try again.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Join Waitlist';
        }
    }

    async submitEmail(email) {
        // Simulate API call - replace with your actual endpoint
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // For now, just store in localStorage as a demo
                const emails = JSON.parse(localStorage.getItem('traderRankerEmails') || '[]');

                if (emails.includes(email)) {
                    reject(new Error('Email already registered'));
                    return;
                }

                emails.push(email);
                localStorage.setItem('traderRankerEmails', JSON.stringify(emails));

                console.log('Email submitted:', email);
                console.log('Total emails:', emails.length);

                resolve();
            }, 1500);
        });
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    showFormMessage(message, type) {
        const formMessage = document.getElementById('formMessage');
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;

        // Clear message after 5 seconds
        setTimeout(() => {
            formMessage.textContent = '';
            formMessage.className = 'form-message';
        }, 5000);
    }

    // General notification system
    showNotification(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);

        // You can implement a toast notification here if desired
        // For now, we'll use console logging and the form message system
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.traderRankerApp = new TraderRankerApp();
});

// Handle page visibility for wallet connection
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && window.traderRankerApp) {
        window.traderRankerApp.checkWalletConnection();
    }
});
