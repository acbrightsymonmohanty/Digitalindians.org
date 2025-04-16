// Move getCurrentTime function to global scope
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Add these constants at the top level of the file
const STOCK_API_KEY = 'cvn1quhr01ql90q0vjsgcvn1quhr01ql90q0vjt0';
const STOCK_API_URL = 'https://finnhub.io/api/v1';

// Check if we're on the search page
if (window.isSearchPage) {
    console.log('Search page detected, setting up page');
    
    // Add loaded class after a short delay
    window.addEventListener('load', function() {
        setTimeout(() => {
            document.body.classList.add('loaded');
            const loadingOverlay = document.querySelector('.loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.classList.add('hidden');
            }
        }, 800);
    });
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded successfully');

    // Handle authentication state
    const authToken = localStorage.getItem('authToken');
    const userEmail = localStorage.getItem('userEmail');
    const profileContainer = document.getElementById('profile-container');
    const loginLink = document.getElementById('login-link');

    if (authToken && userEmail && profileContainer) {
        // User is logged in, show profile
        loginLink.style.display = 'none';
        
        // Create profile button
        profileContainer.innerHTML = `
            <button class="btn-profile">
                <div class="profile-avatar-small">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(userEmail.split('@')[0])}&background=157a9d&color=fff" alt="Profile">
                </div>
                <!--<span class="btn-text">${userEmail.split('@')[0]}</span>-->
                <!--<i class="fas fa-chevron-down profile-chevron"></i>-->
            </button>
            <div class="profile-card">
                <div class="profile-header">
                    <div class="profile-avatar-large">
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(userEmail.split('@')[0])}&background=157a9d&color=fff&size=128" alt="Profile">
                    </div>
                    <div class="profile-info">
                        <h3>${userEmail.split('@')[0]}</h3>
                        <p>${userEmail}</p>
                    </div>
                </div>
                <div class="profile-actions">
                    <a href="account.html" class="profile-action-btn">
                        <i class="fas fa-user-cog"></i>
                        <span>Account Settings</span>
                    </a>
                    <a href="#notifications" class="profile-action-btn">
                        <i class="fas fa-bell"></i>
                        <span style="pointer-events: none; cursor: not-allowed;">Notifications</span>
                    </a>
                    <a href="#" class="profile-action-btn logout-btn">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </a>
                </div>
            </div>
        `;

        // Add event listeners for profile interactions
        const profileBtn = profileContainer.querySelector('.btn-profile');
        const profileCard = profileContainer.querySelector('.profile-card');
        const logoutBtn = profileContainer.querySelector('.logout-btn');

        // Toggle profile card
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            profileCard.classList.toggle('active');
            profileBtn.classList.toggle('active');
        });

        // Close profile card when clicking outside
        document.addEventListener('click', (e) => {
            if (!profileCard.contains(e.target) && !profileBtn.contains(e.target)) {
                profileCard.classList.remove('active');
                profileBtn.classList.remove('active');
            }
        });

        // Handle logout
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to log out?')) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userEmail');
                window.location.reload();
            }
        });
    } else {
        // User is not logged in, show login link
        if (profileContainer) profileContainer.style.display = 'none';
        if (loginLink) loginLink.style.display = 'flex';
    }

    // Always set light mode as default
    localStorage.setItem('selectedTheme', 'light');
    const savedTheme = 'light';
    console.log('Setting default light theme for all pages');
    
    // Force add the light theme class
    document.body.classList.remove('theme-dark');
    document.body.classList.add('theme-light');
    
    // Apply light theme settings
    applyTheme(savedTheme);
    
    // Apply saved language
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    if (savedLanguage !== 'en') {
        translatePage(savedLanguage);
    }

    // Initialize sidebar
    initializeSidebar();
    
    // Add authentication check for restricted pages (outside sidebar)
    const allRestrictedLinks = document.querySelectorAll('a[href="youtube.html"], a[href="spaces.html"], a[href="library.html"]');
    allRestrictedLinks.forEach(link => {
        // Skip links that are already handled in the sidebar
        if (!link.closest('.sidebar')) {
            link.addEventListener('click', function(e) {
                if (!checkAuthAndRedirect()) {
                    e.preventDefault();
                }
            });
        }
    });
    
    // Initialize centered search suggestions if on chat page
    if (document.querySelector('.centered-search-input')) {
        console.log("Chat page detected, initializing centered search suggestions");
        initializeCenteredSearchSuggestions();
    }
    
    // Check for pending query on page load
    console.log("DOM content loaded, checking for pending query");
    
    // Check URL parameters for query
    const urlParams = new URLSearchParams(window.location.search);
    const urlQuery = urlParams.get('q');
    
    // Check localStorage for pending query
    const pendingQuery = localStorage.getItem('pendingQuery');
    
    // Process query if found
    if (urlQuery || pendingQuery) {
        const query = urlQuery || pendingQuery;
        console.log("Found pending query:", query);
        
        // Clear pending query from localStorage
        localStorage.removeItem('pendingQuery');
        
        // Wait for page to fully load before processing
        setTimeout(() => {
            // Create chat interface if needed
            if (!document.querySelector('.chat-history')) {
                createChatInterface();
            }
            
            // Process the query
            processQuery(query);
        }, 500);
    }
    
    // Handle Home button specifically
    const homeButton = document.querySelector('.nav-item[href="index.html"]');
    if (homeButton) {
        homeButton.addEventListener('click', function(e) {
            // We'll allow normal navigation for this link
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            this.classList.add('active');
        });
    }
    
    // Handle new thread button
    const newThreadBtn = document.querySelector('.btn-new-thread');
    if (newThreadBtn) {
        newThreadBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
            console.log('Navigating to new chat page');
        });
    }
    
    // New Chat Page Elements
    const centeredSearchInput = document.querySelector('.centered-search-input');
    const sendButton = document.querySelector('.send-button');
    
    // Handle centered search input
    if (centeredSearchInput && sendButton) {
        sendButton.addEventListener('click', function() {
            handleCenteredSearch();
        });
        
        centeredSearchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleCenteredSearch();
            }
        });
        
        // Focus the input when the page loads
        setTimeout(() => {
            centeredSearchInput.focus();
        }, 500);
    }
    
    // Handle auto-detect
    const autoDetect = document.querySelector('.auto-detect');
    if (autoDetect) {
        autoDetect.addEventListener('click', function() {
            // Simulate language detection based on browser language
            const browserLang = navigator.language || navigator.userLanguage;
            console.log('Browser language:', browserLang);
            
            let detectedLang = 'en'; // Default to English
            
            // Simple mapping of browser language codes to our supported languages
            if (browserLang.startsWith('hi')) {
                detectedLang = 'hi'; // Hindi
            } else if (browserLang.startsWith('bn')) {
                detectedLang = 'bn'; // Bengali
            } else if (browserLang.startsWith('or')) {
                detectedLang = 'or'; // Odia
            }
            
            // Find and click the corresponding language option
            const langOption = document.querySelector(`.language-option[data-lang="${detectedLang}"]`);
            if (langOption) {
                langOption.click();
                
                // Show notification
                const notification = document.createElement('div');
                notification.className = 'translation-notification';
                notification.innerHTML = '<i class="fas fa-magic"></i>' +
                    '<span>Language auto-detected as ' + langOption.textContent.split(' ')[0] + '</span>' +
                    '<button class="close-notification"><i class="fas fa-times"></i></button>';
                
                document.body.appendChild(notification);
                
                // Show notification with animation
                setTimeout(() => {
                    notification.classList.add('show');
                }, 100);
                
                // Add event listener to close button
                notification.querySelector('.close-notification').addEventListener('click', () => {
                    notification.classList.remove('show');
                    setTimeout(() => {
                        notification.remove();
                    }, 300);
                });
                
                // Auto-hide after 5 seconds
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        notification.classList.remove('show');
                        setTimeout(() => {
                            if (document.body.contains(notification)) {
                                notification.remove();
                            }
                        }, 300);
                    }
                }, 5000);
            }
        });
    }
    
    // Handle highlights search
    const highlightsSearchBtn = document.querySelector('.highlights-search-btn');
    const highlightsInput = document.querySelector('.highlights-input');
    
    if (highlightsSearchBtn && highlightsInput) {
        highlightsSearchBtn.addEventListener('click', function() {
            const searchTerm = highlightsInput.value.trim();
            if (searchTerm) {
                alert(`Searching for: ${searchTerm}`);
                highlightsInput.value = '';
            }
        });
        
        highlightsInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.trim();
                if (searchTerm) {
                    alert(`Searching for: ${searchTerm}`);
                    this.value = '';
                }
            }
        });
    }
    
    // Handle footer language selector
    const footerLanguage = document.querySelector('.footer-language');
    if (footerLanguage) {
        footerLanguage.addEventListener('click', function() {
            // The language selection is now implemented in initializeLanguageSelectors()
            // No need for an alert message
        });
    }
    
    // Handle search input
    const searchInput = document.querySelector('.search-input');
    const submitBtn = document.querySelector('.btn-submit');
    
    if (searchInput) {
        // Auto-resize input
        searchInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
        
        // Submit on Enter (without Shift)
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSearch();
            }
        });
    }
    
    // Submit on button click
    if (submitBtn) {
        submitBtn.addEventListener('click', handleSearch);
    }
    
    // Keyboard shortcut for new thread (Ctrl + I)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'i') {
            e.preventDefault();
            const newThreadBtn = document.querySelector('.btn-new-thread');
            if (newThreadBtn) {
                newThreadBtn.click();
            }
        }
    });

    // Handle navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Allow normal navigation for these items
            document.querySelectorAll('.nav-item').forEach(i => {
                i.classList.remove('active');
            });
            this.classList.add('active');
            
            // No need to prevent default - let the browser handle the navigation
        });
    });

    // Handle option buttons
    const optionButtons = document.querySelectorAll('.btn-option');
    if (optionButtons.length > 0) {
    optionButtons.forEach(button => {
            button.addEventListener('click', function() {
                optionButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
    
    // Handle login button
    const loginButton = document.querySelector('.btn-log-in');
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            alert('Login functionality will be implemented soon!');
            console.log('Log in clicked');
        });
    }
    
    // Handle attachment button
    const attachButton = document.querySelector('.btn-attach');
    if (attachButton) {
        attachButton.addEventListener('click', function() {
            alert('Attachment functionality will be implemented soon!');
            console.log('Attach clicked');
        });
    }
    
    // Scroll to bottom of chat on page load
    const chatHistory = document.querySelector('.chat-history');
    if (chatHistory) {
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function handleCenteredSearch() {
        const centeredSearchInput = document.querySelector('.centered-search-input');
        if (!centeredSearchInput) return;
        
        const query = centeredSearchInput.value.trim();
        if (query) {
            // Store the query for processing after page load
            localStorage.setItem('pendingQuery', query);
            
            // Check if user is logged in
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            console.log("User not logged in, redirecting to login page");
            
            // Show a notification that login is required
            const notification = document.createElement('div');
            notification.className = 'translation-notification';
            notification.innerHTML = '<i class="fas fa-lock"></i>' +
                    '<span>Login required to search</span>' +
                '<button class="close-notification"><i class="fas fa-times"></i></button>';
            
            document.body.appendChild(notification);
            
            // Show notification with animation
            setTimeout(() => {
                notification.classList.add('show');
                
                // Redirect to login page after a short delay
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            }, 100);
            
            return;
        }
        
        // Redirect to search.html with the query as a parameter
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
    }

    function handleSearch() {
        const searchInput = document.querySelector('.search-input');
        if (!searchInput) return;
        
        const query = searchInput.value.trim();
        if (query) {
            // Check if we're already on the search page
            if (window.isSearchPage) {
                console.log("Already on search page, handling as follow-up question");
                
                // Set the followup input value if available
                const followupInput = document.getElementById('followup-input');
                if (followupInput) {
                    followupInput.value = query;
                    handleFollowUp();
                } else {
                    console.error("Follow-up input not found on search page");
                    
                    // Fallback: reload the page with the new query
                    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
                }
            } else {
                // Not on the search page, navigate to search.html
            // Check if user is logged in
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                console.log("User not logged in, redirecting to login page");
                
                // Save the query to localStorage so we can use it after login
                localStorage.setItem('pendingQuery', query);
                
                // Show a notification that login is required
                const notification = document.createElement('div');
                notification.className = 'translation-notification';
                notification.innerHTML = '<i class="fas fa-lock"></i>' +
                    '<span>Login required to ask questions</span>' +
                    '<button class="close-notification"><i class="fas fa-times"></i></button>';
                
                
                document.body.appendChild(notification);
                
                // Show notification with animation
                setTimeout(() => {
                    notification.classList.add('show');
                    
                    // Redirect to login page after a short delay
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1500);
                }, 100);
                
                return;
            }
            
                // Navigate to search page with the query
                window.location.href = `search.html?q=${encodeURIComponent(query)}`;
            }
        }
    }

    // Handle suggestion cards
    const suggestionCards = document.querySelectorAll('.suggestion-card');
    suggestionCards.forEach(card => {
        card.addEventListener('click', () => {
            const searchInput = document.querySelector('.search-input');
            searchInput.value = card.querySelector('p').textContent;
            searchInput.focus();
        });
    });

    // Update stock prices periodically (mock data)
    async function updateStockPrices() {
        const stockContainer = document.getElementById('stock-name');
        if (!stockContainer) return;

        try {
            // Popular Indian stocks to track
            const stocks = ['RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'ICICIBANK.NS'];
            const currentStock = stocks[Math.floor(Math.random() * stocks.length)];

            // Add loading state
            stockContainer.innerHTML = `
                <div class="loading-indicator">
                    <i class="fas fa-sync-alt fa-spin"></i> Loading stock data...
                </div>
            `;

            // Fetch stock data
            const response = await fetch(`${STOCK_API_URL}/quote?symbol=${currentStock}&token=${STOCK_API_KEY}`);
            const data = await response.json();

            if (data.c) { // Current price exists
                const priceChange = data.c - data.pc; // Current price - Previous close
                const percentChange = ((priceChange / data.pc) * 100).toFixed(2);
                const isProfit = priceChange >= 0;

                stockContainer.innerHTML = `
                    <div class="stock-info">
                        <div class="stock-header">
                            <h3>${currentStock.replace('.NS', '')}</h3>
                            <span class="stock-indicator ${isProfit ? 'profit' : 'loss'}">
                                <i class="fas fa-${isProfit ? 'arrow-up' : 'arrow-down'}"></i>
                            </span>
                        </div>
                        <div class="stock-details">
                            <p class="stock-price">₹${data.c.toFixed(2)}</p>
                            <p class="stock-change ${isProfit ? 'profit' : 'loss'}">
                                ${isProfit ? '+' : ''}${percentChange}%
                            </p>
                        </div>
                        <div class="stock-metrics">
                            <div class="metric">
                                <span class="label">High</span>
                                <span class="value">₹${data.h.toFixed(2)}</span>
                            </div>
                            <div class="metric">
                                <span class="label">Low</span>
                                <span class="value">₹${data.l.toFixed(2)}</span>
                            </div>
                            <div class="metric">
                                <span class="label">Open</span>
                                <span class="value">₹${data.o.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                `;

                // Add hover effect for more details
                const stockInfo = stockContainer.querySelector('.stock-info');
                if (stockInfo) {
                    stockInfo.addEventListener('click', () => {
                        showStockDetails(currentStock, data);
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching stock data:', error);
            stockContainer.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    Unable to load stock data
                </div>
            `;
        }
    }

    // Add this new function for showing detailed stock information
    function showStockDetails(symbol, data) {
        const modal = document.createElement('div');
        modal.className = 'stock-modal';
        modal.innerHTML = `
            <div class="stock-modal-content">
                <div class="stock-modal-header">
                    <h2>${symbol.replace('.NS', '')} Stock Details</h2>
                    <button class="close-modal"><i class="fas fa-times"></i></button>
                </div>
                <div class="stock-modal-body">
                    <div class="stock-detail-grid">
                        <div class="detail-item">
                            <span class="label">Current Price</span>
                            <span class="value">₹${data.c.toFixed(2)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Previous Close</span>
                            <span class="value">₹${data.pc.toFixed(2)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Day High</span>
                            <span class="value">₹${data.h.toFixed(2)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Day Low</span>
                            <span class="value">₹${data.l.toFixed(2)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Open Price</span>
                            <span class="value">₹${data.o.toFixed(2)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Change</span>
                            <span class="value ${data.c >= data.pc ? 'profit' : 'loss'}">
                                ${((data.c - data.pc) / data.pc * 100).toFixed(2)}%
                            </span>
                        </div>
                    </div>
                    <div class="stock-disclaimer">
                        <p>* Data delayed by 15 minutes</p>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add close functionality
        const closeBtn = modal.querySelector('.close-modal');
        const modalContent = modal.querySelector('.stock-modal-content');

        closeBtn.addEventListener('click', () => {
            modal.classList.add('closing');
            setTimeout(() => modal.remove(), 300);
        });

        modal.addEventListener('click', (e) => {
            if (!modalContent.contains(e.target)) {
                modal.classList.add('closing');
                setTimeout(() => modal.remove(), 300);
            }
        });

        // Show modal with animation
        setTimeout(() => modal.classList.add('show'), 10);
    }

    // Update the interval call to refresh stock data every 30 seconds
    setInterval(updateStockPrices, 30000);

    // Initialize language selectors
    initializeLanguageSelectors();

    // Handle help button
    const helpButton = document.querySelector('.floating-button.help-button');
    if (helpButton) {
        const helpCard = helpButton.querySelector('.help-card');
        
        helpButton.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            if (helpCard) {
                helpCard.style.display = helpCard.style.display === 'block' ? 'none' : 'block';
            }
        });
        
        // Close help card when clicking outside
        document.addEventListener('click', function(e) {
            if (!helpButton.contains(e.target)) {
                helpButton.classList.remove('active');
                if (helpCard) {
                    helpCard.style.display = 'none';
                }
            }
        });
    }

    // Initialize library page if on library.html
    initializeLibrary();

    // Initialize notification close buttons
    initializeNotificationCloseButtons();
});

// Function to fetch real-time stock data
async function updateStockData() {
    const stockName = document.getElementById('stock-name');
    const stockPrice = document.getElementById('stock-price');
    const stockIndicator = document.getElementById('stock-indicator');

    // List of NSE stock symbols to rotate through
    const stockSymbols = [
        'RELIANCE.NS',
        'TCS.NS',
        'HDFCBANK.NS',
        'INFY.NS',
        'TATAMOTORS.NS',
        'WIPRO.NS',
        'BHARTIARTL.NS',
        'SBIN.NS'
    ];

    if (stockName && stockPrice && stockIndicator) {
        try {
            // Fade out current data
            stockName.style.opacity = '0';
            stockPrice.style.opacity = '0';
            stockIndicator.style.opacity = '0';

            // Get current symbol
            const currentSymbol = stockSymbols[currentIndex];
            
            // Fetch real-time stock data
            const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${currentSymbol}?interval=1d`);
            const data = await response.json();
            
            // Extract current price and previous close
            const currentPrice = data.chart.result[0].meta.regularMarketPrice;
            const previousClose = data.chart.result[0].meta.previousClose;
            
            // Calculate percentage change
            const change = ((currentPrice - previousClose) / previousClose) * 100;
            const isProfit = change >= 0;
            
            setTimeout(() => {
                // Update display with new data
                stockName.textContent = currentSymbol.replace('.NS', '');
                stockPrice.textContent = `₹${currentPrice.toFixed(2)} (${isProfit ? '+' : ''}${change.toFixed(2)}%)`;
                stockIndicator.className = `stock-indicator ${isProfit ? 'profit' : 'loss'}`;
                
                // Fade in with animation
                stockName.style.opacity = '1';
                stockPrice.style.opacity = '1';
                stockIndicator.style.opacity = '1';
                
                // Add bounce animation to arrow
                stockIndicator.style.animation = 'none';
                stockIndicator.offsetHeight; // Trigger reflow
                stockIndicator.style.animation = 'bounceArrow 0.5s ease';

                // Move to next stock
                currentIndex = (currentIndex + 1) % stockSymbols.length;
            }, 300);

        } catch (error) {
            console.error('Error fetching stock data:', error);
            
            // Show error state
            setTimeout(() => {
                stockName.textContent = 'Error loading stock data';
                stockPrice.textContent = 'Please try again later';
                stockIndicator.className = 'stock-indicator';
                
                // Fade in error message
                stockName.style.opacity = '1';
                stockPrice.style.opacity = '1';
                stockIndicator.style.opacity = '1';
            }, 300);
        }
    }
}

// Update the interval to 15 seconds to respect API rate limits
setInterval(updateStockData, 15000);

// Initial update
updateStockData();

function initializeSidebar() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    console.log('Initializing sidebar:', { 
        sidebarToggleFound: !!sidebarToggle, 
        sidebarFound: !!sidebar 
    });
    
    if (sidebarToggle && sidebar) {
        // Check if sidebar state is saved in localStorage
        const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        console.log('Sidebar collapsed state from localStorage:', sidebarCollapsed);
        
        if (sidebarCollapsed) {
            sidebar.classList.add('collapsed');
            sidebarToggle.classList.add('sidebarTogglecollapsed');
        }
        else {
            //sidebar.classList.remove('collapsed');
            sidebarToggle.classList.remove('collapsed');
            
        }
        
        sidebarToggle.addEventListener('click', function() {
            console.log('Sidebar toggle clicked');
            sidebar.classList.toggle('collapsed');
            sidebarToggle.classList.toggle('sidebarTogglecollapsed');
            
            // Save sidebar state to localStorage
            const isCollapsed = sidebar.classList.contains('collapsed');
            localStorage.setItem('sidebarCollapsed', isCollapsed);
            console.log('Sidebar state saved to localStorage:', isCollapsed);
        });
        
        // Add authentication check for restricted pages
        const restrictedLinks = sidebar.querySelectorAll('a[href="youtube.html"], a[href="spaces.html"], a[href="library.html"]');
        restrictedLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                if (!checkAuthAndRedirect()) {
                    e.preventDefault();
                }
            });
        });
        
        // Check if user is logged in
        const authToken = localStorage.getItem('authToken');
        const userEmail = localStorage.getItem('userEmail');
        const sidebarBottom = document.querySelector('.sidebar-bottom');
        
        if (authToken && userEmail && sidebarBottom) {
            // Remove existing login button if present
            const existingLoginButton = sidebarBottom.querySelector('.btn-sign-up');
            if (existingLoginButton) {
                existingLoginButton.remove();
            }
            
            // Create profile container
            const profileContainer = document.createElement('div');
            profileContainer.className = 'profile-container';
            
            // Create profile button and card HTML
            profileContainer.innerHTML = `
                <button class="btn-profile">
                    <div class="profile-avatar-small">
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(userEmail.split('@')[0])}&background=157a9d&color=fff" alt="Profile">
                    </div>
                    <span class="btn-text">${userEmail.split('@')[0]}</span>
                    <i class="fas fa-chevron-down profile-chevron"></i>
                </button>
                <div class="profile-card">
                    <div class="profile-header">
                        <div class="profile-avatar-large">
                            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(userEmail.split('@')[0])}&background=157a9d&color=fff&size=128" alt="Profile">
                        </div>
                        <div class="profile-info">
                            <h3>${userEmail.split('@')[0]}</h3>
                            <p>${userEmail}</p>
                        </div>
                    </div>
                    <div class="profile-actions">
                        <a href="account.html" class="profile-action-btn">
                            <i class="fas fa-user-cog"></i>
                            <span >Account Settings</span>
                        </a>
                        <a href="#notifications" class="profile-action-btn">
                            <i class="fas fa-bell"></i>
                            <span style="pointer-events: none; cursor: not-allowed;">Notifications</span>
                        </a>
                        <a href="#" class="profile-action-btn logout-btn">
                            <i class="fas fa-sign-out-alt"></i>
                            <span>Logout</span>
                        </a>
                    </div>
                </div>
            `;
            
            // Add profile container to sidebar bottom
            sidebarBottom.appendChild(profileContainer);
            
            // Get the new elements
            const profileButton = profileContainer.querySelector('.btn-profile');
            const profileCard = profileContainer.querySelector('.profile-card');
            const logoutBtn = profileContainer.querySelector('.logout-btn');
            const accountSettingsBtn = profileContainer.querySelector('.profile-action-btn:not(.logout-btn)');
            
            // Toggle profile card on click
            profileButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                profileCard.classList.toggle('active');
                profileButton.classList.toggle('active');
            });
            
            // Handle account settings button click
            if (accountSettingsBtn) {
                accountSettingsBtn.addEventListener('click', function(e) {
                    // Allow default action (navigation to account.html)
                    console.log('Account Settings clicked, navigating to account.html');
                    window.location.href = 'account.html';
                });
            }
            
            // Close profile card when clicking outside
            document.addEventListener('click', function(e) {
                if (!profileCard.contains(e.target) && !profileButton.contains(e.target)) {
                    profileCard.classList.remove('active');
                    profileButton.classList.remove('active');
                }
            });
            
            // Handle logout
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (confirm('Are you sure you want to log out?')) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userEmail');
                    window.location.reload();
                }
            });
        }
    }
}

/**
 * Checks if the user is authenticated and redirects to login page if not
 * @returns {boolean} True if authenticated, false otherwise
 */
function checkAuthAndRedirect() {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        console.log("User not logged in, redirecting to login page");
        
        // Show a notification that login is required
        const notification = document.createElement('div');
        notification.className = 'translation-notification';
        notification.innerHTML = '<i class="fas fa-lock"></i>' +
            '<span>Login required to access this page</span>' +
            '<button class="close-notification"><i class="fas fa-times"></i></button>';
        
        document.body.appendChild(notification);
        
        // Add event listener for close button
        const closeBtn = notification.querySelector('.close-notification');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            });
        }
        
        // Show notification with animation
        setTimeout(() => {
            notification.classList.add('show');
            
            // Redirect to login page after a short delay
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        }, 100);
        
        return false;
    }
    return true;
}

// Language translation functionality
function initializeLanguageSelectors() {
    console.log('Initializing language selectors');
    
    const languageSelectors = document.querySelectorAll('.language-selector, .footer-language');
    const languageOptions = document.querySelectorAll('.language-option');
    
    console.log('Found language selectors:', languageSelectors.length);
    console.log('Found language options:', languageOptions.length);
    
    // Toggle language dropdown
    languageSelectors.forEach(selector => {
        selector.addEventListener('click', function(e) {
            console.log('Language selector clicked:', this);
            
            // Prevent clicks on dropdown options from closing the dropdown
            if (e.target.classList.contains('language-option')) return;
            
            // Toggle active class to show/hide dropdown
            this.classList.toggle('active');
            
            // Close other dropdowns
            languageSelectors.forEach(otherSelector => {
                if (otherSelector !== selector) {
                    otherSelector.classList.remove('active');
                }
            });
            
            e.stopPropagation();
        });
    });
    
    // Handle language option selection
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            console.log('Language option clicked:', this);
            
            const lang = this.getAttribute('data-lang');
            const langName = this.textContent;
            
            console.log('Selected language:', lang, langName);
            
            // Update all language selectors to show the selected language
            document.querySelectorAll('.language-label, .footer-language > span').forEach(label => {
                label.textContent = langName.split(' ')[0]; // Just the language name, not the parenthetical
            });
            
            // Update active class on all language options
            document.querySelectorAll('.language-option').forEach(opt => {
                opt.classList.remove('active');
                if (opt.getAttribute('data-lang') === lang) {
                    opt.classList.add('active');
                }
            });
            
            // Close all dropdowns
            languageSelectors.forEach(selector => {
                selector.classList.remove('active');
            });
            
            // Set data-lang attribute on body and sidebar
            document.body.setAttribute('data-lang', lang);
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.setAttribute('data-lang', lang);
            }
            
            // Translate the page
            translatePage(lang);
            
            // Store the selected language in localStorage
            localStorage.setItem('selectedLanguage', lang);
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.language-selector') && !e.target.closest('.footer-language')) {
            languageSelectors.forEach(selector => {
                selector.classList.remove('active');
            });
        }
    });
    
    // Load saved language preference
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
        console.log('Loading saved language:', savedLanguage);
        
        // Set data-lang attribute on body and sidebar
        document.body.setAttribute('data-lang', savedLanguage);
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.setAttribute('data-lang', savedLanguage);
        }
        
        const savedOption = document.querySelector(`.language-option[data-lang="${savedLanguage}"]`);
        if (savedOption) {
            savedOption.click();
        }
    } else {
        // Default to English
        document.body.setAttribute('data-lang', 'en');
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.setAttribute('data-lang', 'en');
        }
    }
}

// Translation dictionaries
const translations = {
    'hi': { // Hindi
        'What do you want to know?': 'आप क्या जानना चाहते हैं?',
        'Ask anything...': 'कुछ भी पूछें...',
        'Auto': 'स्वतः',
        'Today': 'आज',
        'Pre-order starts tomorrow': 'प्री-ऑर्डर कल से शुरू',
        'Stock up by': 'स्टॉक बढ़ा',
        'today': 'आज',
        'Pro': 'प्रो',
        'Enterprise': 'एंटरप्राइज',
        'API': 'एपीआई',
        'Blog': 'ब्लॉग',
        'Careers': 'करियर',
        'Store': 'स्टोर',
        'Finance': 'वित्त',
        'Get Started': 'शुरू करें',
        'Help Center': 'सहायता केंद्र',
        'Terms of Service': 'सेवा की शर्तें',
        'Privacy Policy': 'गोपनीयता नीति',
        'New Thread': 'नया थ्रेड',
        'Home': 'होम',
        'Discover': 'खोजें',
        'Spaces': 'स्पेसेस',
        'Library': 'लाइब्रेरी',
        'Sign Up / Login': 'साइन अप / लॉगिन'
    },
    'bn': { // Bengali
        'What do you want to know?': 'আপনি কি জানতে চান?',
        'Ask anything...': 'যা খুশি জিজ্ঞাসা করুন...',
        'Auto': 'অটো',
        'Today': 'আজ',
        'Pre-order starts tomorrow': 'প্রি-অর্ডার আগামীকাল শুরু হবে',
        'Stock up by': 'স্টক বৃদ্ধি',
        'today': 'আজ',
        'Pro': 'প্রো',
        'Enterprise': 'এন্টারপ্রাইজ',
        'API': 'এপিআই',
        'Blog': 'ব্লগ',
        'Careers': 'ক্যারিয়ার',
        'Store': 'স্টোর',
        'Finance': 'ফিনান্স',
        'Get Started': 'শুরু করুন',
        'Help Center': 'সাহায্য কেন্দ্র',
        'Terms of Service': 'পরিষেবার শর্তাবলী',
        'Privacy Policy': 'গোপনীয়তা নীতি',
        'New Thread': 'নতুন থ্রেড',
        'Home': 'হোম',
        'Discover': 'আবিষ্কার',
        'Spaces': 'স্পেসেস',
        'Library': 'লাইব্রেরি',
        'Sign Up / Login': 'সাইন আপ / লগইন'
    },
    'or': { // Odia
        'What do you want to know?': 'ଆପଣ କଣ ଜାଣିବାକୁ ଚାହୁଁଛନ୍ତି?',
        'Ask anything...': 'କିଛି ବି ପଚାରନ୍ତୁ...',
        'Auto': 'ଅଟୋ',
        'Today': 'ଆଜି',
        'Pre-order starts tomorrow': 'ପ୍ରି-ଅର୍ଡର ଆସନ୍ତାକାଲି ଆରମ୍ଭ ହେବ',
        'Stock up by': 'ଷ୍ଟକ୍ ବୃଦ୍ଧି',
        'today': 'ଆଜି',
        'Pro': 'ପ୍ରୋ',
        'Enterprise': 'ଏଣ୍ଟରପ୍ରାଇଜ୍',
        'API': 'ଏପିଆଇ',
        'Blog': 'ବ୍ଲଗ୍',
        'Careers': 'କ୍ୟାରିଅର୍',
        'Store': 'ଷ୍ଟୋର୍',
        'Finance': 'ଫାଇନାନ୍ସ',
        'Get Started': 'ଆରମ୍ଭ କରନ୍ତୁ',
        'Help Center': 'ସହାୟତା କେନ୍ଦ୍ର',
        'Terms of Service': 'ସେବା ସର୍ତ୍ତାବଳୀ',
        'Privacy Policy': 'ଗୋପନୀୟତା ନୀତି',
        'New Thread': 'ନୂଆ ଥ୍ରେଡ୍',
        'Home': 'ହୋମ୍',
        'Discover': 'ଆବିଷ୍କାର',
        'Spaces': 'ସ୍ପେସେସ୍',
        'Library': 'ଲାଇବ୍ରେରୀ',
        'Sign Up / Login': 'ସାଇନ୍ ଅପ୍ / ଲଗଇନ୍'
    }
};

// Function to translate the page content
function translatePage(lang) {
    // If English is selected, reload the page to reset to default
    if (lang === 'en') {
        // Don't actually reload, just reset text content that might have been translated
        document.querySelectorAll('[data-original-text]').forEach(element => {
            element.textContent = element.getAttribute('data-original-text');
        });
        
        // Reset placeholders
        document.querySelectorAll('[data-original-placeholder]').forEach(element => {
            element.placeholder = element.getAttribute('data-original-placeholder');
        });
        
        // Update sidebar state for English
        updateSidebarForLanguage('en');
        return;
    }
    
    // Get the translation dictionary for the selected language
    const dictionary = translations[lang];
    if (!dictionary) return;
    
    // Translate all text nodes in the document
    const elements = document.querySelectorAll('h1, h2, h3, p, span, a, button, input[placeholder], .btn-text, .nav-text');
    elements.forEach(element => {
        // Skip elements that shouldn't be translated
        if (element.closest('.language-option')) return;
        
        // For input placeholders
        if (element.tagName === 'INPUT' && element.placeholder) {
            // Store original text if not already stored
            if (!element.getAttribute('data-original-placeholder')) {
                element.setAttribute('data-original-placeholder', element.placeholder);
            }
            
            // Translate placeholder
            const originalText = element.getAttribute('data-original-placeholder');
            if (dictionary[originalText]) {
                element.placeholder = dictionary[originalText];
            }
            return;
        }
        
        // For regular text content
        if (element.textContent.trim()) {
            // Store original text if not already stored
            if (!element.getAttribute('data-original-text')) {
                element.setAttribute('data-original-text', element.textContent);
            }
            
            // Translate text content
            const originalText = element.getAttribute('data-original-text');
            if (dictionary[originalText]) {
                element.textContent = dictionary[originalText];
            } else {
                // Try to match partial text
                for (const [key, value] of Object.entries(dictionary)) {
                    if (originalText.includes(key)) {
                        element.textContent = originalText.replace(key, value);
                    }
                }
            }
        }
    });
    
    // Update sidebar for the selected language
    updateSidebarForLanguage(lang);
    
    // Show translation notification
    showTranslationNotification(lang);
}

// Function to specifically update sidebar elements for the selected language
function updateSidebarForLanguage(lang) {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    
    // If English, reset to original
    if (lang === 'en') {
        document.querySelectorAll('.sidebar [data-original-text]').forEach(element => {
            element.textContent = element.getAttribute('data-original-text');
        });
        return;
    }
    
    // Get translation dictionary
    const dictionary = translations[lang];
    if (!dictionary) return;
    
    // Translate sidebar elements
    const sidebarElements = sidebar.querySelectorAll('.btn-text, .nav-text, .shortcut');
    sidebarElements.forEach(element => {
        // Store original text if not already stored
        if (!element.getAttribute('data-original-text')) {
            element.setAttribute('data-original-text', element.textContent);
        }
        
        // Translate text content
        const originalText = element.getAttribute('data-original-text');
        if (dictionary[originalText]) {
            element.textContent = dictionary[originalText];
        }
    });
    
    // Ensure sidebar text is visible even in collapsed state for non-English languages
    if (lang !== 'en' && sidebar.classList.contains('collapsed')) {
        // Temporarily show text for translation
        const textElements = sidebar.querySelectorAll('.btn-text, .nav-text');
        textElements.forEach(el => {
            // Save current display state
            if (!el.hasAttribute('data-original-display')) {
                el.setAttribute('data-original-display', el.style.display || '');
            }
            
            // Make visible for translation
            el.style.display = 'inline-block';
            
            // Then hide again after translation
            setTimeout(() => {
                el.style.display = el.getAttribute('data-original-display');
            }, 100);
        });
    }
}

// Show a notification when translation is applied
function showTranslationNotification(lang) {
    const langNames = {
        'hi': 'Hindi',
        'bn': 'Bengali',
        'or': 'Odia'
    };
    
    const notification = document.createElement('div');
    notification.className = 'translation-notification';
    notification.innerHTML = '<i class="fas fa-language"></i>' +
        '<span>Page translated to ' + langNames[lang] + '</span>' +
        '<button class="close-notification"><i class="fas fa-times"></i></button>';
    
    document.body.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Add event listener to close button
    notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Function to apply theme
function applyTheme(theme) {
    console.log('Applying theme (always light):', theme);
    const root = document.documentElement;
    
    // Always remove dark theme and add light theme
    document.body.classList.remove('theme-dark');
    document.body.classList.add('theme-light');
    
    // Always apply light theme settings
    applyLightTheme();
}

function applyLightTheme() {
    console.log('Applying light theme');
    const root = document.documentElement;
    root.style.setProperty('--bg-primary', '#ffffff');
    root.style.setProperty('--bg-secondary', '#f8f9fa');
    root.style.setProperty('--text-primary', '#333333');
    root.style.setProperty('--text-secondary', '#6c757d');
    root.style.setProperty('--border-color', '#e0e0e0');
    
    // Additional light theme specific styles
    root.style.setProperty('--bg-tertiary', '#f3f4f6');
    root.style.setProperty('--shadow-sm', '0 1px 3px rgba(0, 0, 0, 0.1)');
    root.style.setProperty('--shadow-md', '0 4px 6px rgba(0, 0, 0, 0.1)');
    root.style.setProperty('--shadow-lg', '0 10px 15px rgba(0, 0, 0, 0.1)');
}

// Keep this function for compatibility but it won't be used
function applyDarkTheme() {
    console.log('Dark theme disabled, applying light theme instead');
    applyLightTheme();
}

/**
 * Creates a chat interface in the main content area
 */
function createChatInterface() {
    console.log("Creating chat interface");
    
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) {
        console.error("Main content element not found");
        return null;
    }
    
    console.log("Found main content element:", mainContent);
    
    
    // Create chat history
    const chatHistory = document.createElement('div');
    chatHistory.className = 'chat-history';
    
    // Create chat input container
    const chatInputContainer = document.createElement('div');
    chatInputContainer.className = 'chat-input-container';
    
    // Create chat input wrapper
    const chatInputWrapper = document.createElement('div');
    chatInputWrapper.className = 'chat-input-wrapper';
    
    // Create chat input
    const chatInput = document.createElement('textarea');
    chatInput.className = 'search-input';
    chatInput.placeholder = 'Type your question here...';
    chatInput.rows = 1;
    
    // Create send button
    const sendButton = document.createElement('button');
    sendButton.className = 'btn-submit';
    sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
    
    console.log("Created chat interface elements");
    
    // Add event listeners
    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const query = this.value.trim();
            if (query) {
                processQuery(query);
                this.value = '';
            }
        }
    });
    
    sendButton.addEventListener('click', function() {
        const query = chatInput.value.trim();
        if (query) {
            processQuery(query);
            chatInput.value = '';
        }
    });
    
    console.log("Added event listeners to chat input elements");
    
    // Append elements
    chatInputWrapper.appendChild(chatInput);
    chatInputWrapper.appendChild(sendButton);
    chatInputContainer.appendChild(chatInputWrapper);
    
    chatContainer.appendChild(chatHistory);
    chatContainer.appendChild(chatInputContainer);
    
    // Add this line after appending to main content
    mainContent.innerHTML = '';
    mainContent.appendChild(chatContainer);
    
    console.log("Appended chat interface to main content");
    
    // Initialize search suggestions
    initializeSearchSuggestions(chatInput);
    
    // Focus input after a short delay
    setTimeout(() => {
        chatInput.focus();
    }, 100);
    
    return chatHistory;
}

/**
 * Process a query and display the result in the chat interface
 * @param {string} query - The user's query
 */
function processQuery(query) {
    console.log("Processing query:", query);
    
    // Validate query
    if (!query || typeof query !== 'string' || query.trim() === '') {
        console.error("Invalid query:", query);
        return;
    }
    
    // Check if user is logged in
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        console.log("User not logged in, redirecting to login page");
        
        // Show a notification that login is required
        const notification = document.createElement('div');
        notification.className = 'translation-notification';
        notification.innerHTML = '<i class="fas fa-lock"></i>' +
            '<span>Login required to ask questions</span>' +
            '<button class="close-notification"><i class="fas fa-times"></i></button>';
        
        document.body.appendChild(notification);
        
        // Show notification with animation
        setTimeout(() => {
            notification.classList.add('show');
            
            // Redirect to login page after a short delay
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        }, 100);
        
        return;
    }
    
    // Check if chat history exists, if not create it
    let chatHistory = document.querySelector('.chat-history');
    if (!chatHistory) {
        console.log("Chat interface not found, creating it");
        chatHistory = createChatInterface();
        if (!chatHistory) {
            console.error("Failed to create chat interface");
            return;
        }
    }
    
    // Save this chat to history in localStorage
    saveToHistory(query);
    
    // Add user message to chat
    const userMessageElement = document.createElement('div');
    userMessageElement.className = 'chat-message user';
    
    const currentTime = getCurrentTime();
    
    // Get user profile image if available, otherwise use placeholder
    const userEmail = localStorage.getItem('userEmail') || 'guest@digitalindians.org';
    const userProfileImage = localStorage.getItem('userProfileImage') || 
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(userEmail.split('@')[0])}&background=2d7ff9&color=fff`;
    
    userMessageElement.innerHTML = `
        <div class="message-avatar">
            <img src="${userProfileImage}" alt="User">
        </div>
        <div class="message-bubble">
            <div class="message-content">
                <p>${query}</p>
            </div>
            <div class="message-time">${currentTime}</div>
        </div>
    `;
    
    chatHistory.appendChild(userMessageElement);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    
    // Show typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chat-message ai typing-indicator';
    typingIndicator.innerHTML = `
        <div class="message-avatar">
            <img src="./digitalindilogo.png" alt="Assistant">
        </div>
        <div class="message-bubble">
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `;
    
    chatHistory.appendChild(typingIndicator);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    
    // Try to get response from Gemini API
    if (typeof getGeminiResponse === 'function') {
        console.log("Using getGeminiResponse function from gemini-api.js");
        
        getGeminiResponse(query)
            .then(response => {
                console.log("Received response from Gemini API:", response.substring(0, 50) + "...");
                
                // Remove typing indicator
                chatHistory.removeChild(typingIndicator);
                
                // Format the response if formatGeminiResponse is available
                let formattedResponse = response;
                if (typeof formatGeminiResponse === 'function') {
                    console.log("Formatting response using formatGeminiResponse");
                    formattedResponse = formatGeminiResponse(response);
                } else {
                    // Basic formatting if the function is not available
                    console.log("formatGeminiResponse not found, using basic formatting");
                    formattedResponse = response.replace(/\n/g, '<br>');
                }
                
                console.log("Creating AI message element");
                
                // Add AI response to chat
                const aiMessage = document.createElement('div');
                aiMessage.className = 'chat-message ai';
                
                aiMessage.innerHTML = `
                    <div class="message-avatar">
                        <img src="./digitalindilogo.png" alt="Assistant">
                    </div>
                    <div class="message-bubble">
                        <div class="message-content">
                            ${formattedResponse}
                        </div>
                        <div class="message-time">${getCurrentTime()}</div>
                    </div>
                `;
                
                console.log("Appending AI message to chat history");
                chatHistory.appendChild(aiMessage);
                chatHistory.scrollTop = chatHistory.scrollHeight;
            })
            .catch(error => {
                console.error('Error getting Gemini response:', error);
                
                // Remove typing indicator
                chatHistory.removeChild(typingIndicator);
                
                // Create error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'chat-message ai';
                errorMessage.innerHTML = `
                    <div class="message-avatar">
                        <img src="./digitalindilogo.png" alt="Digital India AI">
                    </div>
                    <div class="message-bubble">
                        <div class="message-content">
                            <p>I'm sorry, I encountered an error while processing your request. Please try again later.</p>
                            <p class="error-details">${error.message || 'Unknown error'}</p>
                        </div>
                        <div class="message-time">${getCurrentTime()}</div>
                    </div>
                `;
                
                chatHistory.appendChild(errorMessage);
                chatHistory.scrollTop = chatHistory.scrollHeight;
            });
    } else {
        console.warn("Gemini API functions not found, using fallback responses");
        
        // Use fallback responses
        setTimeout(() => {
            // Remove typing indicator
            chatHistory.removeChild(typingIndicator);
            
            // Add fallback response
            const fallbackMessageElement = document.createElement('div');
            fallbackMessageElement.className = 'chat-message ai';
            
            let responseContent = '';
            
            // Generate different responses based on query content
            if (query.toLowerCase().includes('restaurant') || query.toLowerCase().includes('food') || query.toLowerCase().includes('eat')) {
                responseContent = `
                    <p>Here are some popular restaurants I can recommend:</p>
                    <ul class="message-list">
                        <li><strong>Indian Accent</strong> - Luxury dining with modern Indian cuisine</li>
                        <li><strong>Bukhara</strong> - Famous for North Indian and tandoori dishes</li>
                        <li><strong>Karim's</strong> - Authentic Mughlai cuisine in Old Delhi</li>
                        <li><strong>Saravana Bhavan</strong> - Popular South Indian vegetarian restaurant</li>
                    </ul>
                    <p>Would you like more details about any of these restaurants?</p>
                `;
            } else {
                responseContent = `
                    <p>Thank you for your question. I'm here to help with information about services, businesses, and resources in India.</p>
                    <p>Could you please provide more specific details about what you're looking for?</p>
                `;
            }
            
            fallbackMessageElement.innerHTML = `
                <div class="message-avatar">
                    <img src="./digitalindilogo.png" alt="Assistant">
                </div>
                <div class="message-bubble">
                    <div class="message-content">
                        ${responseContent}
                    </div>
                    <div class="message-time">${getCurrentTime()}</div>
                </div>
            `;
            
            chatHistory.appendChild(fallbackMessageElement);
            chatHistory.scrollTop = chatHistory.scrollHeight;
        }, 1500);
    }
}

/**
 * Save chat query to history in localStorage
 * @param {string} query - The user's question
 */
function saveToHistory(query) {
    // Get current user email
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        console.log("User not logged in, can't save to history");
        return;
    }
    
    console.log("Saving query to history for user:", userEmail);
    
    // Get existing history or create new array
    let history = [];
    try {
        const existingHistory = localStorage.getItem(`chatHistory_${userEmail}`);
        console.log("Raw history data:", existingHistory);
        if (existingHistory) {
            history = JSON.parse(existingHistory);
        }
    } catch (error) {
        console.error("Error parsing existing history:", error);
        // Continue with empty history if there was an error
    }
    
    if (!Array.isArray(history)) {
        console.log("History was not an array, resetting");
        history = [];
    }
    
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toISOString();
    
    // Check if we should create a new conversation or add to existing one
    let currentConversation;
    
    // If there's an active conversation ID in localStorage, use that
    const activeConversationId = localStorage.getItem('activeConversationId');
    
    if (activeConversationId) {
        // Find the conversation with this ID
        currentConversation = history.find(item => item.id === activeConversationId);
    }
    
    // If no active conversation found, create a new one
    if (!currentConversation) {
        // Generate a unique ID for this conversation
        const conversationId = 'conv_' + Date.now();
        
        // Store this as the active conversation
        localStorage.setItem('activeConversationId', conversationId);
        
        // Create new conversation entry
        currentConversation = {
            id: conversationId,
            title: query.length > 30 ? query.substring(0, 30) + '...' : query,
            timestamp: currentTime,
            date: currentDate,
            messages: []
        };
        
        // Add to history
        history.push(currentConversation);
    }
    
    // Add message to the conversation
    currentConversation.messages.push({
        query: query,
        timestamp: currentTime
    });
    
    // Update the conversation's timestamp to the latest message
    currentConversation.timestamp = currentTime;
    currentConversation.date = currentDate;
    
    // Limit history to last 20 conversations
    if (history.length > 20) {
        history = history.slice(history.length - 20);
    }
    
    // Save back to localStorage
    try {
        localStorage.setItem(`chatHistory_${userEmail}`, JSON.stringify(history));
        console.log("Successfully saved query to history:", query);
    } catch (error) {
        console.error("Error saving to localStorage:", error);
    }
}

/**
 * Initialize library page tabs and content
 */
function initializeLibrary() {
    const tabButtons = document.querySelectorAll('.library-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Skip if not on library page
    if (tabButtons.length === 0) return;
    
    console.log("Initializing library page");
    
    // Add click event to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log("Tab clicked:", button.getAttribute('data-tab'));
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding content
            const tabName = button.getAttribute('data-tab');
            const tabContent = document.getElementById(`${tabName}-content`);
            if (tabContent) {
                tabContent.classList.add('active');
                console.log(`Activated tab content: ${tabName}-content`);
                
                // Load history if history tab is selected
                if (tabName === 'history') {
                    loadChatHistory();
                }
            } else {
                console.error(`Tab content not found: ${tabName}-content`);
            }
        });
    });
    
    // Check if we should load history on page load
    if (window.location.hash === '#history') {
        const historyTab = document.querySelector('.tab-btn[data-tab="history"]');
        if (historyTab) {
            console.log("Loading history tab from URL hash");
            historyTab.click();
        }
    }
    
    // Load history if we're on the history tab initially
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab && activeTab.getAttribute('data-tab') === 'history') {
        console.log("Loading history for initially active history tab");
        loadChatHistory();
    }
}

/**
 * Load chat history from localStorage and display in history tab
 */
function loadChatHistory() {
    console.log("Loading chat history...");
    const historyContent = document.getElementById('history-content');
    const emptyMessage = document.querySelector('.empty-history-message');
    
    if (!historyContent) {
        console.error("History content element not found");
        return;
    }
    
    // Clear previous history items (except empty message)
    Array.from(historyContent.children).forEach(child => {
        if (!child.classList.contains('empty-history-message')) {
            child.remove();
        }
    });
    
    // Add New Chat button at the top
    const newChatBtn = document.createElement('button');
    newChatBtn.className = 'new-chat-button history-new-chat';
    newChatBtn.innerHTML = '<i class="fas fa-plus"></i> New Chat';
    newChatBtn.addEventListener('click', () => {
        console.log("Starting new chat from history panel");
        localStorage.removeItem('activeConversationId');
        window.location.href = 'indec.html';
    });
    historyContent.insertBefore(newChatBtn, historyContent.firstChild);
    
    // Get user email
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        console.log("User not logged in, can't load history");
        if (emptyMessage) {
            emptyMessage.style.display = 'flex';
            // Update empty message text for not logged in state
            const messageTitle = emptyMessage.querySelector('h3');
            const messageText = emptyMessage.querySelector('p');
            if (messageTitle && messageText) {
                messageTitle.textContent = 'Login Required';
                messageText.textContent = 'Please log in to view your chat history.';
            }
        }
        return;
    }
    
    // Get history from localStorage
    let history = [];
    try {
        const historyData = localStorage.getItem(`chatHistory_${userEmail}`);
        console.log("Raw history data:", historyData);
        if (historyData) {
            history = JSON.parse(historyData);
        }
    } catch (error) {
        console.error("Error parsing chat history:", error);
        // Show error message
        if (emptyMessage) {
            emptyMessage.style.display = 'flex';
            const messageTitle = emptyMessage.querySelector('h3');
            const messageText = emptyMessage.querySelector('p');
            if (messageTitle && messageText) {
                messageTitle.textContent = 'Error Loading History';
                messageText.textContent = 'There was a problem loading your chat history. Please try again.';
            }
        }
        return;
    }
    
    console.log("Parsed history:", history);
    
    if (!Array.isArray(history) || history.length === 0) {
        console.log("No chat history found or invalid format");
        if (emptyMessage) {
            emptyMessage.style.display = 'flex';
            // Reset to default empty message
            const messageTitle = emptyMessage.querySelector('h3');
            const messageText = emptyMessage.querySelector('p');
            if (messageTitle && messageText) {
                messageTitle.textContent = 'No Chat History';
                messageText.textContent = 'Your chat history will appear here once you start conversations.';
            }
        }
        return;
    }
    
    // Hide empty message
    if (emptyMessage) emptyMessage.style.display = 'none';
    
    // Group history by date
    const groupedHistory = {};
    history.forEach(conversation => {
        if (!conversation.date) {
            // If date is missing, use the timestamp to create a date
            if (conversation.timestamp) {
                conversation.date = new Date(conversation.timestamp).toLocaleDateString();
            } else {
                // If no timestamp either, use today's date
                conversation.date = new Date().toLocaleDateString();
            }
        }
        
        if (!groupedHistory[conversation.date]) {
            groupedHistory[conversation.date] = [];
        }
        groupedHistory[conversation.date].push(conversation);
    });
    
    console.log("Grouped history:", groupedHistory);
    
    // Create history cards for each date group
    Object.keys(groupedHistory).reverse().forEach(date => {
        const dateConversations = groupedHistory[date];
        
        // Create date header
        const dateHeader = document.createElement('div');
        dateHeader.className = 'history-date-header';
        dateHeader.innerHTML = `<h3>${date}</h3>`;
        historyContent.appendChild(dateHeader);
        
        // Create cards for each conversation
        dateConversations.reverse().forEach(conversation => {
            const card = document.createElement('div');
            card.className = 'library-card history-card';
            card.setAttribute('data-date', date);
            card.setAttribute('data-conversation-id', conversation.id || '');
            
            // Format time from timestamp
            let formattedTime = '';
            try {
                formattedTime = conversation.timestamp 
                    ? new Date(conversation.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                    : '';
            } catch (e) {
                console.warn("Error formatting time:", e);
                formattedTime = '';
            }
            
            // Get message count
            const messageCount = conversation.messages ? conversation.messages.length : 0;
            
            card.innerHTML = `
                <div class="library-content">
                    <div class="library-icon">
                        <i class="fas fa-comments"></i>
                    </div>
                    <div class="library-info">
                        <h3>${conversation.title || 'Untitled Conversation'}</h3>
                        <p>${messageCount} message${messageCount !== 1 ? 's' : ''} · ${formattedTime}</p>
                        <div class="library-meta">
                            <div class="library-actions">
                                <button class="continue-chat" data-conversation-id="${conversation.id || ''}" title="Continue this conversation">
                                    <i class="fas fa-play"></i>
                                </button>
                                <button class="delete-history" data-conversation-id="${conversation.id || ''}" title="Delete conversation">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            historyContent.appendChild(card);
            
            // Add event listener to continue chat button
            const continueBtn = card.querySelector('.continue-chat');
            if (continueBtn) {
                continueBtn.addEventListener('click', () => {
                    const conversationId = continueBtn.getAttribute('data-conversation-id');
                    if (!conversationId) {
                        console.warn("No conversation ID found");
                        return;
                    }
                    
                    console.log("Continuing conversation with ID:", conversationId);
                    
                    // Set this as the active conversation
                    localStorage.setItem('activeConversationId', conversationId);
                    
                    // Redirect to chat page
                    window.location.href = 'index.html';
                });
            }
            
            // Add event listener to delete button
            const deleteBtn = card.querySelector('.delete-history');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    const conversationId = deleteBtn.getAttribute('data-conversation-id');
                    if (!conversationId) {
                        console.warn("No conversation ID found, can't delete");
                        return;
                    }
                    
                    console.log("Deleting conversation with ID:", conversationId);
                    deleteHistoryConversation(conversationId);
                    
                    // Remove the card with animation
                    card.style.opacity = '0';
                    card.style.transform = 'translateX(20px)';
                    setTimeout(() => {
                        card.remove();
                        
                        // Check if this was the last item for this date
                        const dateItems = historyContent.querySelectorAll(`.history-card[data-date="${date}"]`);
                        if (dateItems.length === 0) {
                            dateHeader.remove();
                        }
                        
                        // Check if history is now empty
                        const remainingCards = historyContent.querySelectorAll('.history-card');
                        if (remainingCards.length === 0 && emptyMessage) {
                            emptyMessage.style.display = 'flex';
                            // Reset to default empty message
                            const messageTitle = emptyMessage.querySelector('h3');
                            const messageText = emptyMessage.querySelector('p');
                            if (messageTitle && messageText) {
                                messageTitle.textContent = 'No Chat History';
                                messageText.textContent = 'Your chat history will appear here once you start conversations.';
                            }
                        }
                    }, 300);
                });
            }
        });
    });
    
    console.log("Chat history loaded successfully");
}

/**
 * Delete a conversation from history by ID
 * @param {string} conversationId - The ID of the conversation to delete
 */
function deleteHistoryConversation(conversationId) {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        console.error("User not logged in, can't delete conversation");
        return;
    }
    
    let history = [];
    try {
        history = JSON.parse(localStorage.getItem(`chatHistory_${userEmail}`)) || [];
    } catch (error) {
        console.error("Error parsing history for deletion:", error);
        return;
    }
    
    if (!Array.isArray(history)) {
        console.error("History is not an array, can't delete conversation");
        return;
    }
    
    // Filter out the conversation with the matching ID
    const originalLength = history.length;
    history = history.filter(conversation => conversation.id !== conversationId);
    
    if (history.length === originalLength) {
        console.warn("No conversation found with ID:", conversationId);
    } else {
        console.log("Removed conversation with ID:", conversationId);
        
        // If we deleted the active conversation, clear the active conversation ID
        const activeConversationId = localStorage.getItem('activeConversationId');
        if (activeConversationId === conversationId) {
            localStorage.removeItem('activeConversationId');
            console.log("Cleared active conversation ID");
        }
    }
    
    // Save back to localStorage
    try {
        localStorage.setItem(`chatHistory_${userEmail}`, JSON.stringify(history));
        console.log("Successfully saved updated history after deletion");
    } catch (error) {
        console.error("Error saving updated history after deletion:", error);
    }
}

/**
 * Create sample history data for testing
 * This function should be called from the browser console for testing
 */
function createSampleHistory() {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        console.error("User not logged in, can't create sample history");
        return;
    }
    
    const sampleConversations = [
        {
            title: "Restaurants in Delhi",
            messages: [
                "What are the best restaurants in Delhi?",
                "Where can I find good North Indian food in Delhi?",
                "Are there any good rooftop restaurants in Delhi?"
            ]
        },
        {
            title: "Passport Application",
            messages: [
                "How do I apply for a passport?",
                "What documents are needed for passport application?",
                "How long does it take to get a passport?"
            ]
        },
        {
            title: "Mumbai Tourism",
            messages: [
                "What are the tourist attractions in Mumbai?",
                "What's the best time to visit Mumbai?",
                "How many days should I spend in Mumbai?"
            ]
        },
        {
            title: "Small Business",
            messages: [
                "How to start a small business in India?",
                "What licenses do I need for a small business?",
                "How to get funding for a startup in India?"
            ]
        },
        {
            title: "Schools in Bangalore",
            messages: [
                "What are the best schools in Bangalore?",
                "Which international schools are good in Bangalore?",
                "What are the admission requirements for top schools in Bangalore?"
            ]
        }
    ];
    
    // Create history with different dates
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    const dates = [today, today, yesterday, yesterday, twoDaysAgo];
    const times = [
        [10, 15], [14, 30], [9, 20], [16, 45], [11, 10]
    ];
    
    const history = [];
    
    // Create conversations with messages
    sampleConversations.forEach((conv, index) => {
        const date = dates[index];
        const [hour, minute] = times[index];
        
        // Set the base time for this conversation
        const baseTime = new Date(date);
        baseTime.setHours(hour, minute);
        
        // Create message timestamps with 5-minute intervals
        const messageTimestamps = conv.messages.map((_, msgIndex) => {
            const msgTime = new Date(baseTime);
            msgTime.setMinutes(msgTime.getMinutes() + (msgIndex * 5));
            return msgTime.toISOString();
        });
        
        // Create conversation object
        const conversation = {
            id: `sample_conv_${index}_${Date.now()}`,
            title: conv.title,
            timestamp: messageTimestamps[messageTimestamps.length - 1], // Last message time
            date: date.toLocaleDateString(),
            messages: conv.messages.map((msg, msgIndex) => ({
                query: msg,
                timestamp: messageTimestamps[msgIndex]
            }))
        };
        
        history.push(conversation);
    });
    
    // Save to localStorage
    localStorage.setItem(`chatHistory_${userEmail}`, JSON.stringify(history));
    console.log("Sample history created for user:", userEmail);
    
    // Reload history if on library page
    if (window.location.pathname.includes('library.html')) {
        loadChatHistory();
    }
    
    return "Sample conversation history created successfully. Check the History tab in the Library page.";
}

/**
 * Initialize search suggestions for chat input
 * @param {HTMLElement} inputElement - The input element to attach suggestions to
 */
function initializeSearchSuggestions(inputElement) {
    if (!inputElement) {
        console.error("Input element not found for search suggestions");
        return;
    }
    
    console.log("Initializing search suggestions for:", inputElement);
    
    // Create suggestions container
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'search-suggestions';
    suggestionsContainer.style.display = 'none';
    
    // Insert after the input element
    inputElement.parentNode.insertBefore(suggestionsContainer, inputElement.nextSibling);
    
    // Popular search suggestions
    const popularSuggestions = [
        "Best restaurants in Delhi",
        "How to apply for Aadhaar card",
        "Top tourist places in India",
        "How to file income tax returns",
        "Best schools in Bangalore",
        "How to start a business in India",
        "Top hospitals in Mumbai",
        "How to apply for passport",
        "Best coaching centers for UPSC",
        "How to register for GST"
    ];
    
    // Add input event listener
    inputElement.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        
        if (query.length < 2) {
            suggestionsContainer.style.display = 'none';
            return;
        }
        
        // Filter suggestions based on input
        const matchedSuggestions = popularSuggestions.filter(suggestion => 
            suggestion.toLowerCase().includes(query)
        );
        
        // Get user's history for additional suggestions
        const userEmail = localStorage.getItem('userEmail');
        let historySuggestions = [];
        
        if (userEmail) {
            try {
                const historyData = localStorage.getItem(`chatHistory_${userEmail}`);
                if (historyData) {
                    const history = JSON.parse(historyData);
                    
                    // Extract unique queries from history conversations
                    const historyQueries = new Set();
                    
                    history.forEach(conversation => {
                        if (conversation.messages && Array.isArray(conversation.messages)) {
                            conversation.messages.forEach(msg => {
                                if (msg.query && msg.query.toLowerCase().includes(query)) {
                                    historyQueries.add(msg.query);
                                }
                            });
                        }
                    });
                    
                    historySuggestions = Array.from(historyQueries).slice(0, 3); // Limit to 3 history suggestions
                }
            } catch (error) {
                console.error("Error getting history suggestions:", error);
            }
        }
        
        // Combine suggestions (history first, then popular)
        const allSuggestions = [...historySuggestions, ...matchedSuggestions.filter(s => 
            !historySuggestions.some(h => h.toLowerCase() === s.toLowerCase())
        )].slice(0, 5); // Limit to 5 total suggestions
        
        if (allSuggestions.length > 0) {
            // Create suggestion elements
            suggestionsContainer.innerHTML = '';
            
            allSuggestions.forEach(suggestion => {
                const suggestionElement = document.createElement('div');
                suggestionElement.className = 'suggestion-item';
                
                // Highlight the matching part
                const highlightedText = suggestion.replace(
                    new RegExp(`(${query})`, 'gi'),
                    '<strong>$1</strong>'
                );
                
                suggestionElement.innerHTML = `
                    <i class="fas fa-search"></i>
                    <span>${highlightedText}</span>
                `;
                
                // Add click event
                suggestionElement.addEventListener('click', () => {
                    inputElement.value = suggestion;
                    suggestionsContainer.style.display = 'none';
                    
                    // Focus the input
                    inputElement.focus();
                });
                
                suggestionsContainer.appendChild(suggestionElement);
            });
            
            suggestionsContainer.style.display = 'block';
        } else {
            suggestionsContainer.style.display = 'none';
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(event) {
        if (!inputElement.contains(event.target) && !suggestionsContainer.contains(event.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });
    
    // Handle keyboard navigation
    inputElement.addEventListener('keydown', function(event) {
        const suggestions = suggestionsContainer.querySelectorAll('.suggestion-item');
        if (suggestions.length === 0 || suggestionsContainer.style.display === 'none') return;
        
        const activeIndex = Array.from(suggestions).findIndex(el => el.classList.contains('active'));
        
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                if (activeIndex < 0) {
                    suggestions[0].classList.add('active');
                } else if (activeIndex < suggestions.length - 1) {
                    suggestions[activeIndex].classList.remove('active');
                    suggestions[activeIndex + 1].classList.add('active');
                }
                break;
                
            case 'ArrowUp':
                event.preventDefault();
                if (activeIndex > 0) {
                    suggestions[activeIndex].classList.remove('active');
                    suggestions[activeIndex - 1].classList.add('active');
                }
                break;
                
            case 'Enter':
                if (activeIndex >= 0) {
                    event.preventDefault();
                    inputElement.value = suggestions[activeIndex].querySelector('span').textContent;
                    suggestionsContainer.style.display = 'none';
                }
                break;
                
            case 'Escape':
                suggestionsContainer.style.display = 'none';
                break;
        }
    });
    
    return suggestionsContainer;
}

/**
 * Add a New Chat button to the chat interface
 * @param {HTMLElement} chatContainer - The chat container element
 */
function addNewChatButton(chatContainer) {
   
    
    // Create the button
    const newChatButton = document.createElement('button');
    newChatButton.className = 'new-chat-button';
    newChatButton.innerHTML = '<i class="fas fa-plus"></i> New Chat';
    
    // Add click event
    newChatButton.addEventListener('click', () => {
        // Clear the active conversation ID to start a new one
        localStorage.removeItem('activeConversationId');
        
        // Reload the page to start fresh
        window.location.reload();
    });
    
    // Insert at the top of the chat container
    chatContainer.insertBefore(newChatButton, chatContainer.firstChild);
    
    return newChatButton;
}

// Initialize search suggestions for the centered search input
function initializeCenteredSearchSuggestions() {
    console.log("Initializing centered search suggestions");
    const searchInput = document.querySelector('.centered-search-input');
    
    if (!searchInput) {
        console.error("Centered search input not found");
        return;
    }

    // Popular search suggestions
    const popularSuggestions = [
        "Best restaurants in Delhi",
        "How to apply for Aadhaar card",
        "Top tourist places in India",
        "How to file income tax returns",
        "Best schools in Bangalore",
        "How to start a business in India",
        "Top hospitals in Mumbai",
        "How to apply for passport",
        "Best coaching centers for UPSC",
        "How to register for GST"
    ];

    let placeholderAnimationTimeout;
    
    // Function to animate placeholder text
    function animatePlaceholder() {
        if (document.activeElement === searchInput || searchInput.value) return;
        
        const suggestion = popularSuggestions[Math.floor(Math.random() * popularSuggestions.length)];
        let charIndex = 0;
        searchInput.placeholder = "Ask anything...";

        function typePlaceholder() {
            if (document.activeElement === searchInput || searchInput.value) {
                searchInput.placeholder = "Ask anything...";
                return;
            }

            searchInput.placeholder = suggestion.slice(0, charIndex);
            
            if (charIndex < suggestion.length) {
                charIndex++;
                placeholderAnimationTimeout = setTimeout(typePlaceholder, Math.random() * 50 + 50);
            } else {
                placeholderAnimationTimeout = setTimeout(deletePlaceholder, 2000);
            }
        }

        function deletePlaceholder() {
            if (document.activeElement === searchInput || searchInput.value) {
                searchInput.placeholder = "Ask anything...";
                return;
            }

            if (searchInput.placeholder.length > 0) {
                searchInput.placeholder = searchInput.placeholder.slice(0, -1);
                placeholderAnimationTimeout = setTimeout(deletePlaceholder, Math.random() * 30 + 30);
            } else {
                searchInput.placeholder = "Ask anything...";
                placeholderAnimationTimeout = setTimeout(animatePlaceholder, 1000);
            }
        }

        typePlaceholder();
    }

    // Start the placeholder animation after a delay
    setTimeout(animatePlaceholder, 1000);

    // Reset placeholder on focus
    searchInput.addEventListener('focus', () => {
        clearTimeout(placeholderAnimationTimeout);
        searchInput.placeholder = "Ask anything...";
    });

    // Reset placeholder animation on blur if input is empty
    searchInput.addEventListener('blur', () => {
        if (!searchInput.value) {
            setTimeout(animatePlaceholder, 1000);
        }
    });

    // Clear animation when user starts typing
    searchInput.addEventListener('input', () => {
        clearTimeout(placeholderAnimationTimeout);
        if (!searchInput.value) {
            searchInput.placeholder = "Ask anything...";
        }
    });

    // Popular search suggestions (keep existing array)
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'search-suggestions centered-suggestions';
    suggestionsContainer.style.display = 'none';

    const searchInputWrapper = document.querySelector('.search-input-wrapper');
    if (searchInputWrapper) {
        searchInputWrapper.appendChild(suggestionsContainer);
    } else {
        searchInput.parentNode.insertBefore(suggestionsContainer, searchInput.nextSibling);
    }

    searchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();

        if (query.length === 0) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        const matchedSuggestions = popularSuggestions.filter(suggestion =>
            suggestion.toLowerCase().includes(query)
        );

        if (matchedSuggestions.length > 0) {
            suggestionsContainer.innerHTML = '';

            matchedSuggestions.slice(0, 5).forEach(suggestion => {
                const suggestionItem = document.createElement('div');
                suggestionItem.className = 'suggestion-item';

                const highlightedText = suggestion.replace(
                    new RegExp(`(${query})`, 'gi'),
                    '<strong>$1</strong>'
                );

                suggestionItem.innerHTML = `
                    <i class="fas fa-search"></i>
                    <span>${highlightedText}</span>
                `;

                suggestionItem.addEventListener('click', () => {
                    searchInput.value = suggestion;
                    suggestionsContainer.style.display = 'none';
                });

                suggestionsContainer.appendChild(suggestionItem);
            });

            suggestionsContainer.style.display = 'block';
        } else {
            suggestionsContainer.style.display = 'none';
        }
    });

    document.addEventListener('click', (event) => {
        if (!searchInput.contains(event.target) && !suggestionsContainer.contains(event.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });

    searchInput.addEventListener('keydown', function(event) {
        const suggestions = suggestionsContainer.querySelectorAll('.suggestion-item');
        if (suggestions.length === 0 || suggestionsContainer.style.display === 'none') return;

        const activeIndex = Array.from(suggestions).findIndex(el => el.classList.contains('active'));

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                if (activeIndex < 0) {
                    suggestions[0].classList.add('active');
                } else if (activeIndex < suggestions.length - 1) {
                    suggestions[activeIndex].classList.remove('active');
                    suggestions[activeIndex + 1].classList.add('active');
                }
                break;

            case 'ArrowUp':
                event.preventDefault();
                if (activeIndex > 0) {
                    suggestions[activeIndex].classList.remove('active');
                    suggestions[activeIndex - 1].classList.add('active');
                }
                break;

            case 'Enter':
                if (activeIndex >= 0) {
                    event.preventDefault();
                    searchInput.value = suggestions[activeIndex].querySelector('span').textContent;
                    suggestionsContainer.style.display = 'none';
                }
                break;

            case 'Escape':
                suggestionsContainer.style.display = 'none';
                break;
        }
    });

    console.log("Centered search suggestions initialized");
}

// Function to simulate typing effect
function typeQueryIntoInput(inputElement, text) {
    let i = 0;
    inputElement.value = '';
    inputElement.focus();
    
    // Calculate typing speed based on text length
    // Shorter texts should be typed faster
    const baseDelay = text.length > 30 ? 50 : 70;
    const variationFactor = text.length > 30 ? 40 : 60;
    
    function typeChar() {
        if (i < text.length) {
            inputElement.value += text.charAt(i);
            i++;
            
            // Add natural variation to typing speed
            // Slow down for punctuation, speed up for common letters
            let delay = baseDelay;
            const currentChar = text.charAt(i-1);
            
            // Slow down for punctuation
            if ('.,:;?!'.includes(currentChar)) {
                delay = baseDelay + variationFactor * 2;
            } 
            // Speed up for common letters
            else if ('etaoinshrd'.includes(currentChar.toLowerCase())) {
                delay = baseDelay - variationFactor * 0.3;
            }
            // Random variation
            delay += Math.random() * variationFactor;
            
            setTimeout(typeChar, delay);
        }
    }
    
    typeChar();
}

// Add this function after the initializeSidebar function

/**
 * Initialize notification close buttons
 * This adds event listeners to all notification close buttons
 */
function initializeNotificationCloseButtons() {
    // Use event delegation to handle close buttons for dynamically added notifications
    document.body.addEventListener('click', function(event) {
        if (event.target.closest('.close-notification')) {
            const notification = event.target.closest('.translation-notification');
            if (notification) {
                // Remove the show class to trigger the fade-out animation
                notification.classList.remove('show');
                
                // Remove the notification after the animation completes
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }
    });
}

/**
 * Handles follow-up questions on the search page
 */
function handleFollowUp() {
    console.log("Handling follow-up question");
    
    // Only proceed if we're on the search page
    if (!window.isSearchPage) {
        console.warn("Not on search page, follow-up handling not available");
        return;
    }
    
    const followupInput = document.getElementById('followup-input');
    if (!followupInput) {
        console.error("Follow-up input not found");
        return;
    }
    
    const followupQuestion = followupInput.value.trim();
    if (!followupQuestion) return;
    
    // Clear the input
    followupInput.value = '';
    
    // Get the current query
    const userQueryElement = document.getElementById('user-query');
    if (!userQueryElement) {
        console.error("User query element not found");
        return;
    }
    
    const currentQuery = userQueryElement.textContent;
    
    // Get references to key elements
    const loadingOverlay = document.querySelector('.loading-overlay');
    const appContainer = document.querySelector('.app-container');
    const responseContent = document.getElementById('ai-response');
    
    // Get current response before we replace it
    let currentResponse = "";
    if (responseContent) {
        currentResponse = responseContent.innerHTML;
    }
    
    // Save current Q&A to conversation history if there's content to save
    if (currentQuery && currentResponse) {
        // Get conversation history container
        const conversationHistoryContainer = document.getElementById('conversation-history-container');
        if (!conversationHistoryContainer) {
            console.error("Conversation history container not found");
        } else {
            // Create conversation item and add to history
            const conversationItem = createConversationItem(currentQuery, currentResponse);
            
            // Add to conversation history container
            conversationHistoryContainer.appendChild(conversationItem);
            
            // Add a divider
            const divider = document.createElement('div');
            divider.className = 'conversation-divider';
            divider.innerHTML = `
                <div class="divider-line"></div>
                <div class="divider-text">New Question</div>
                <div class="divider-line"></div>
            `;
            conversationHistoryContainer.appendChild(divider);
        }
    }
    
    // Hide expert profile and relevant images containers during loading
    const expertProfileContainer = document.getElementById('expert-profile-container');
    const relevantImagesContainer = document.getElementById('relevant-images-container');
    
    if (expertProfileContainer) {
        expertProfileContainer.classList.remove('visible');
        expertProfileContainer.style.display = 'none';
    }
    
    if (relevantImagesContainer) {
        relevantImagesContainer.classList.remove('visible');
        relevantImagesContainer.style.display = 'none';
    }
    
    // Show loading overlay
    if (loadingOverlay) loadingOverlay.classList.add('visible');
    if (appContainer) appContainer.classList.remove('loaded');
    
    // Update the query display
    if (userQueryElement) {
        userQueryElement.textContent = followupQuestion;
    }
    
    // Show loading animation in the response content area
    if (responseContent) {
        responseContent.innerHTML = `
            <div class="loading-container">
                <div class="logo-container">
                    <img src="./digitalindilogo.png" alt="DigitalIndians AI" class="loader-logo">
                </div>
                <div class="dots-row">
                    <div class="dot" style="background-color: #0088b2;"></div>
                    <div class="dot" style="background-color: #0088b2;"></div>
                    <div class="dot" style="background-color: #0088b2;"></div>
                    <div class="dot" style="background-color: #0088b2;"></div>
                </div>
                <div class="loading-text">Generating response...</div>
            </div>
        `;
    }
    
    // Create a new URL with the follow-up question and previous question
    const url = new URL(window.location.href);
    url.searchParams.set('q', followupQuestion);
    url.searchParams.set('prev_q', currentQuery);
    
    // Update browser history without reloading the page
    window.history.pushState({}, '', url.toString());
    
    // Process the follow-up question
    if (typeof generateAIResponse === 'function') {
        generateAIResponse(followupQuestion, currentQuery)
            .then(response => {
                // Response is already displayed by generateAIResponse
                console.log("Follow-up response processed");
                
                // Hide loading overlay
                if (loadingOverlay) {
                    setTimeout(() => {
                        loadingOverlay.classList.remove('visible');
                        if (appContainer) appContainer.classList.add('loaded');
                    }, 1000); // Minimum loading time for better UX
                }
            })
            .catch(error => {
                console.error('Error in follow-up question:', error);
                if (responseContent) {
                    responseContent.innerHTML = `<p class="error-message">Sorry, I encountered an error while processing your follow-up question. Please try again later.</p>`;
                }
                
                // Hide loading overlay even on error
                if (loadingOverlay) {
                    loadingOverlay.classList.remove('visible');
                    if (appContainer) appContainer.classList.add('loaded');
                }
            });
    } else {
        console.error("generateAIResponse function not found");
        if (responseContent) {
            responseContent.innerHTML = `<p class="error-message">Sorry, I couldn't process your follow-up question at this time.</p>`;
        }
        
        // Hide loading overlay
        if (loadingOverlay) {
            loadingOverlay.classList.remove('visible');
            if (appContainer) appContainer.classList.add('loaded');
        }
    }
}

// Expose handleFollowUp to the window object so it can be accessed from search.html
window.scriptJsHandleFollowUp = handleFollowUp;
window.handleFollowUp = handleFollowUp;
window.createConversationItem = createConversationItem;

/**
 * Creates a conversation item with question and answer for the conversation history
 * @param {string} question - The user's question
 * @param {string} answer - The AI's answer
 * @returns {HTMLElement} - The conversation item element
 */
function createConversationItem(question, answer) {
    // Create conversation item
    const conversationItem = document.createElement('div');
    conversationItem.className = 'conversation-item';
    
    // Get user profile image if available
    const userEmail = localStorage.getItem('userEmail') || 'user@digitalindians.org';
    const userProfileImage = localStorage.getItem('userProfileImage');
    const userInitial = (userEmail.charAt(0) || 'U').toUpperCase();
    
    // Create query element
    const queryElement = document.createElement('div');
    queryElement.className = 'conversation-query';
    queryElement.innerHTML = `
        <div class="query-avatar">
            ${userProfileImage ? `<img src="${userProfileImage}" alt="User">` : userInitial}
        </div>
        <div class="query-bubble">
            ${question}
        </div>
    `;
    
    // Create answer element
    const answerElement = document.createElement('div');
    answerElement.className = 'conversation-answer';
    answerElement.innerHTML = `
        <div class="answer-bubble">
            ${answer}
        </div>
    `;
    
    // Add elements to conversation item
    conversationItem.appendChild(queryElement);
    conversationItem.appendChild(answerElement);
    
    return conversationItem;
}
