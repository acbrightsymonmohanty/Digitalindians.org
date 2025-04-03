const API_KEY = 'AIzaSyBUOiN1XZ5lU0YazpRT0CTuPlW5R-t1iYU';
const API_URL = 'https://www.googleapis.com/youtube/v3';

// Add this near the top of the file where other global variables are defined
let currentChannel = null;

document.addEventListener('DOMContentLoaded', function() {
    // Get channel handle from URL
    const urlParams = new URLSearchParams(window.location.search);
    const channelHandle = urlParams.get('channel');
    
    if (channelHandle) {
        // Load channel directly using the handle
        loadChannelByHandle(channelHandle);
    }
});

async function loadChannelByHandle(handle) {
    try {
        // First, get channel ID from handle
        const response = await fetch(
            `${API_URL}/search?part=snippet&type=channel&q=${handle}&key=${API_KEY}`
        );
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            // Get the first channel that matches
            const channelId = data.items[0].id.channelId;
            
            // Hide the YouTuber grid and show only the results
            toggleCreatorsGrid(false);
            
            // Show channel details
            showChannelDetails(channelId);
            
            // Update URL without reloading
            const newUrl = `${window.location.pathname}?channel=${handle}`;
            window.history.pushState({ path: newUrl }, '', newUrl);
            
            // Show success notification with options
            showChannelNotification(handle, data.items[0].snippet.title, channelId);
        } else {
            document.getElementById('results').innerHTML = '<p class="error">Channel not found</p>';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('results').innerHTML = '<p class="error">Error loading channel</p>';
    }
}

// Function to toggle the creators grid display
function toggleCreatorsGrid(show) {
    const grid = document.querySelector('.popular-youtubers-section');
    const resultsContainer = document.getElementById('results');
    
    if (!grid || !resultsContainer) return;
    
    if (show) {
        // Show the grid, hide the back button
        grid.style.display = 'block';
        
        // Remove any existing back button
        const existingBackBtn = document.querySelector('.back-to-creators-btn');
        if (existingBackBtn) {
            existingBackBtn.remove();
        }
        
        // Clear results
        resultsContainer.style.marginTop = '';
    } else {
        // Hide the grid, show the back button
        grid.style.display = 'none';
        
        // Create back button if it doesn't exist
        if (!document.querySelector('.back-to-creators-btn')) {
            const backBtn = document.createElement('button');
            backBtn.onclick = function() {
                // Go back to showing all creators
                window.history.pushState({}, '', 'youtube.html');
                toggleCreatorsGrid(true);
                resultsContainer.innerHTML = '';
            };
            
            // Insert back button before results container
            resultsContainer.parentNode.insertBefore(backBtn, resultsContainer);
            
            // Add some margin to the results container
            resultsContainer.style.marginTop = '20px';
        }
    }
}

// Add styles for the back button - this can be called once
function addBackButtonStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .back-to-creators-btn {
            background-color: #f8f8f8;
            border: 1px solid #ddd;
            border-radius: 20px;
            padding: 8px 16px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            align-items: center;
            width: fit-content;
            margin-bottom: 15px;
            transition: all 0.2s ease;
        }
        
        .back-to-creators-btn i {
            margin-right: 6px;
            font-size: 12px;
        }
        
        .back-to-creators-btn:hover {
            background-color: #eee;
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(style);
}

// Function to show channel loaded notification
function showChannelNotification(handle, channelTitle, channelId) {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.channel-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'channel-notification';
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <div class="notification-text">
                <p class="notification-title">Channel loaded successfully</p>
                <p class="notification-desc">${channelTitle}</p>
            </div>
        </div>
        <div class="notification-actions">
            <button class="action-btn stay-btn">View on this site</button>
            <button class="action-btn youtube-btn">
                <i class="fab fa-youtube"></i> Open YouTube
            </button>
        </div>
        <button class="close-notification"><i class="fas fa-times"></i></button>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .channel-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            padding: 15px;
            max-width: 350px;
            z-index: 999999999000;
            animation: slideIn 0.3s ease;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .notification-content {
            display: flex;
            align-items: flex-start;
            gap: 12px;
        }
        
        .notification-content i {
            color: #4CAF50;
            font-size: 20px;
            margin-top: 2px;
        }
        
        .notification-text {
            flex: 1;
        }
        
        .notification-title {
            font-weight: 600;
            margin: 0 0 5px 0;
            color: #333;
        }
        
        .notification-desc {
            font-size: 13px;
            margin: 0;
            color: #666;
        }
        
        .notification-actions {
            display: flex;
            gap: 8px;
        }
        
        .action-btn {
            flex: 1;
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.2s ease;
        }
        
        .stay-btn {
            background-color: #f1f1f1;
            color: #333;
        }
        
        .stay-btn:hover {
            background-color: #e0e0e0;
        }
        
        .youtube-btn {
            background-color: #FF0000;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
        }
        
        .youtube-btn:hover {
            background-color: #CC0000;
        }
        
        .close-notification {
            position: absolute;
            top: 8px;
            right: 8px;
            background: none;
            border: none;
            color: #aaa;
            font-size: 12px;
            cursor: pointer;
            padding: 0;
        }
        
        .close-notification:hover {
            color: #333;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    
    document.head.appendChild(style);
    
    // Add event listeners for buttons
    const stayBtn = notification.querySelector('.stay-btn');
    const youtubeBtn = notification.querySelector('.youtube-btn');
    const closeBtn = notification.querySelector('.close-notification');
    
    stayBtn.addEventListener('click', function() {
        // This just closes the notification since we're already viewing the content
        notification.remove();
        // Scroll to results
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    });
    
    youtubeBtn.addEventListener('click', function() {
        // Open the YouTube channel in a new tab
        const youtubeUrl = `https://www.youtube.com/${handle}`;
        window.open(youtubeUrl, '_blank');
    });
    
    closeBtn.addEventListener('click', function() {
        notification.remove();
    });
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    notification.remove();
                }
            }, 300);
        }
    }, 8000);
}

async function searchChannel() {
    const searchInput = document.getElementById('searchInput').value;
    const resultsContainer = document.getElementById('results');
    
    if (!searchInput.trim()) {
        resultsContainer.innerHTML = '<p class="error">Please enter a channel name</p>';
        return;
    }

    // If input looks like a channel handle, use direct loading
    if (searchInput.startsWith('@')) {
        loadChannelByHandle(searchInput);
        return;
    }

    // Hide the creators grid since we're showing search results
    toggleCreatorsGrid(false);
    
    resultsContainer.innerHTML = '<p class="loading">Loading...</p>';

    try {
        // First, search for the channel
        const searchResponse = await fetch(
            `${API_URL}/search?part=snippet&type=channel&q=${encodeURIComponent(searchInput)}&maxResults=10&key=${API_KEY}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        if (!searchResponse.ok) {
            const errorData = await searchResponse.json();
            throw new Error(errorData.error.message || `HTTP error! status: ${searchResponse.status}`);
        }

        const searchData = await searchResponse.json();

        if (!searchData.items || searchData.items.length === 0) {
            resultsContainer.innerHTML = '<p class="error">No channels found</p>';
            return;
        }

        // Get detailed channel information
        const channelIds = searchData.items.map(item => item.snippet.channelId).join(',');
        const channelResponse = await fetch(
            `${API_URL}/channels?part=snippet,statistics&id=${channelIds}&key=${API_KEY}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        if (!channelResponse.ok) {
            throw new Error(`HTTP error! status: ${channelResponse.status}`);
        }

        const channelData = await channelResponse.json();
        resultsContainer.innerHTML = '';

        channelData.items.forEach(channel => {
            const channelCard = document.createElement('div');
            channelCard.className = 'channel-card';
            channelCard.onclick = () => showChannelDetails(channel.id);
            channelCard.innerHTML = `
                <img class="channel-thumbnail" 
                     src="${channel.snippet.thumbnails.default.url}" 
                     alt="${channel.snippet.title}"
                     onerror="this.src='https://via.placeholder.com/88'">
                <div class="channel-info">
                    <h2>${channel.snippet.title}</h2>
                    <p class="subscribers">Subscribers: ${formatNumber(channel.statistics.subscriberCount)}</p>
                    <p class="description">${channel.snippet.description || 'No description available'}</p>
                    <p class="stats">
                        Videos: ${formatNumber(channel.statistics.videoCount)} | 
                        Views: ${formatNumber(channel.statistics.viewCount)}
                    </p>
                </div>
            `;
            resultsContainer.appendChild(channelCard);
        });
    } catch (error) {
        console.error('Error:', error);
        resultsContainer.innerHTML = `
            <p class="error">
                ${error.message || 'Error fetching channel data'}
                <br>
                Please try again later.
            </p>`;
    }
}

// Simulated YouTube API - in a real application, use YouTube's API
async function checkYouTubeSubscriptionStatus(channelId) {
    // This would be replaced with actual YouTube API calls
    // For now, just check if we're logged in and if the channel is in local storage
    if (!isLoggedInToYouTube()) {
        return { subscribed: false, reason: 'not_logged_in' };
    }
    
    // Check our local storage - in a real app, this would be a YouTube API call
    const subscribedChannels = JSON.parse(localStorage.getItem('subscribedChannels') || '{}');
    return { 
        subscribed: subscribedChannels.hasOwnProperty(channelId),
        reason: subscribedChannels.hasOwnProperty(channelId) ? 'subscribed' : 'not_subscribed'
    };
}

// Update the showChannelDetails function to include YouTube subscription status check
async function showChannelDetails(channelId) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '<p class="loading">Loading channel details...</p>';
    let currentSection = 'videos';
    let nextPageToken = '';

    try {
        const channelResponse = await fetch(
            `${API_URL}/channels?part=brandingSettings,snippet,statistics&id=${channelId}&key=${API_KEY}`
        );
        const channelData = await channelResponse.json();
        const channel = channelData.items[0];
        
        // Store the current channel for use in other functions
        currentChannel = channel;
        
        // Check local subscription status
        const subscribedChannels = JSON.parse(localStorage.getItem('subscribedChannels') || '{}');
        const isLocallySubscribed = subscribedChannels.hasOwnProperty(channelId);
        
        // Check YouTube subscription status (simulated)
        const youtubeSubscriptionStatus = await checkYouTubeSubscriptionStatus(channelId);
        
        // Determine subscription status - prioritize YouTube status if logged in
        const isSubscribed = isLoggedInToYouTube() ? youtubeSubscriptionStatus.subscribed : isLocallySubscribed;
        
        // Function to load videos
        async function loadVideos(pageToken = '') {
            const videosResponse = await fetch(
                `${API_URL}/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=50&pageToken=${pageToken}&key=${API_KEY}`
            );
            return await videosResponse.json();
        }

        // Initial video load
        const videosData = await loadVideos();
        nextPageToken = videosData.nextPageToken;

        async function loadPlaylists(channelId) {
            const response = await fetch(
                `${API_URL}/playlists?part=snippet,contentDetails&channelId=${channelId}&maxResults=50&key=${API_KEY}`
            );
            return await response.json();
        }

        async function loadCommunityPosts(channelId) {
            try {
                const response = await fetch(
                    `${API_URL}/activities?part=snippet,contentDetails&channelId=${channelId}&maxResults=50&key=${API_KEY}`
                );
                return await response.json();
            } catch {
                return { items: [] };
            }
        }

        async function loadShorts(channelId, pageToken = '') {
            const response = await fetch(
                `${API_URL}/search?part=snippet&channelId=${channelId}&type=video&videoDuration=short&maxResults=30&pageToken=${pageToken}&key=${API_KEY}`
            );
            return await response.json();
        }

        async function loadHomeContent(channelId) {
            try {
                // Load latest uploads (recent videos)
                const latestVideos = await fetch(
                    `${API_URL}/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=8&key=${API_KEY}`
                );
                
                // Load popular videos (highest views)
                const popularVideos = await fetch(
                    `${API_URL}/search?part=snippet&channelId=${channelId}&order=viewCount&type=video&maxResults=8&key=${API_KEY}`
                );
        
                // Load latest shorts
                const shorts = await fetch(
                    `${API_URL}/search?part=snippet&channelId=${channelId}&videoDuration=short&type=video&maxResults=8&key=${API_KEY}`
                );
        
                const [latest, popular, shortsData] = await Promise.all([
                    latestVideos.json(),
                    popularVideos.json(),
                    shorts.json()
                ]);
        
                return { latest, popular, shorts: shortsData };
            } catch (error) {
                console.error('Error loading home content:', error);
                return null;
            }
        }

        function updateContent(section) {
            currentSection = section;
            const contentDiv = document.querySelector('.channel-content');
            
            switch(section) {
                case 'home':
                    contentDiv.innerHTML = '<p class="loading">Loading...</p>';
                    loadHomeContent(channelId).then(data => {
                        if (data) {
                            contentDiv.innerHTML = `
                                <div class="section-content home-section">
                                    <div class="home-row">
                                        <div class="section-title">
                                            <h2>Latest Uploads</h2>
                                            <span class="view-all" onclick="updateContent('videos')">View All</span>
                                        </div>
                                        <div class="videos-grid">
                                            ${renderVideos(data.latest.items)}
                                        </div>
                                    </div>
                                    <div class="home-row">
                                        <div class="section-title">
                                            <h2>Most Popular</h2>
                                            <span class="view-all" onclick="updateContent('videos')">View All</span>
                                        </div>
                                        <div class="videos-grid">
                                            ${renderVideos(data.popular.items)}
                                        </div>
                                    </div>
                                    <div class="home-row">
                                        <div class="section-title">
                                            <h2>Shorts</h2>
                                            <span class="view-all" onclick="updateContent('shorts')">View All</span>
                                        </div>
                                        <div class="shorts-grid">
                                            ${data.shorts.items.map(short => `
                                                <div class="shorts-card" onclick="playShort('${short.id.videoId}')">
                                                    <div class="shorts-thumbnail">
                                                        <img src="${short.snippet.thumbnails.high.url}" 
                                                             alt="${short.snippet.title}">
                                                        <div class="shorts-badge">
                                                            <i class="fas fa-play"></i>
                                                        </div>
                                                    </div>
                                                    <div class="shorts-info">
                                                        <h3>${short.snippet.title}</h3>
                                                        <p>${formatDate(short.snippet.publishedAt)}</p>
                                                    </div>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>
                            `;
        
                            // Fetch and update video statistics
                            [...data.latest.items, ...data.popular.items].forEach(async video => {
                                const stats = await getVideoStats(video.id.videoId);
                                if (stats) {
                                    const statsElement = document.getElementById(`stats-${video.id.videoId}`);
                                    if (statsElement) {
                                        statsElement.innerHTML = `
                                            <span class="views">${formatNumber(stats.viewCount)} views</span>
                                            <span class="likes">${formatNumber(stats.likeCount || 0)} likes</span>
                                        `;
                                    }
                                }
                            });
                        } else {
                            contentDiv.innerHTML = '<p class="error">Error loading content</p>';
                        }
                    });
                    break;
                    
                case 'videos':
                    currentChannelId = channelId; // Store the current channel ID
                    contentDiv.innerHTML = `
                        <div class="section-content">
                            <div class="video-sort-options">
                                <button class="sort-chip active" data-sort="date">Latest</button>
                                <button class="sort-chip" data-sort="popular">Popular</button>
                                <button class="sort-chip" data-sort="oldest">Oldest</button>
                            </div>
                            <div class="videos-grid"></div>
                            <button class="load-more" id="loadMoreBtn" style="display: none;">Load More</button>
                        </div>
                    `;
                    
                    // Add sort handlers
                    document.querySelectorAll('.sort-chip').forEach(chip => {
                        chip.addEventListener('click', async (e) => {
                            const sortType = e.target.dataset.sort;
                            document.querySelectorAll('.sort-chip').forEach(c => c.classList.remove('active'));
                            e.target.classList.add('active');
                            await loadSortedVideos(sortType);
                        });
                    });

                    // Add load more handler
                    const loadMoreBtn = document.getElementById('loadMoreBtn');
                    loadMoreBtn.addEventListener('click', async () => {
                        const nextPage = loadMoreBtn.dataset.nextPage;
                        const currentSort = loadMoreBtn.dataset.sortType;
                        if (nextPage) {
                            await loadSortedVideos(currentSort, nextPage);
                        }
                    });

                    // Initial load
                    loadSortedVideos('date');
                    break;

                case 'shorts':
                    contentDiv.innerHTML = '<p class="loading">Loading shorts...</p>';
                    loadShorts(channelId).then(data => {
                        contentDiv.innerHTML = `
                            <div  class="shorts-section">
                                <h2>Shorts</h2>
                                <div class="shorts-grid">
                                    ${data.items.map(short => `
                                        <div class="shorts-card" onclick="playShort('${short.id.videoId}')">
                                            <div class="shorts-thumbnail">
                                                <img src="${short.snippet.thumbnails.high.url}" 
                                                     alt="${short.snippet.title}">
                                                <div class="shorts-badge">
                                                    <svg viewBox="0 0 24 24" width="24" height="24">
                                                        <path fill="currentColor" d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div class="shorts-info">
                                                <h3>${short.snippet.title}</h3>
                                                <p>${formatNumber(short.statistics?.viewCount || 0)} views</p>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                                ${data.nextPageToken ? '<button class="load-more" id="loadMoreShorts">Load More Shorts</button>' : ''}
                            </div>
                        `;

                        const loadMoreBtn = document.getElementById('loadMoreShorts');
                        if (loadMoreBtn) {
                            let nextPageToken = data.nextPageToken;
                            loadMoreBtn.onclick = async () => {
                                loadMoreBtn.disabled = true;
                                loadMoreBtn.textContent = 'Loading...';
                                const moreShorts = await loadShorts(channelId, nextPageToken);
                                nextPageToken = moreShorts.nextPageToken;
                                
                                const shortsGrid = document.querySelector('.shorts-grid');
                                shortsGrid.insertAdjacentHTML('beforeend', moreShorts.items.map(short => `
                                    <div class="shorts-card" onclick="playShort('${short.id.videoId}')">
                                        <div class="shorts-thumbnail">
                                            <img src="${short.snippet.thumbnails.high.url}" 
                                                 alt="${short.snippet.title}">
                                            <div class="shorts-badge">
                                                <svg viewBox="0 0 24 24" width="24" height="24">
                                                    <path fill="currentColor" d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div class="shorts-info">
                                            <h3>${short.snippet.title}</h3>
                                            <p>${formatNumber(short.statistics?.viewCount || 0)} views</p>
                                        </div>
                                    </div>
                                `).join(''));
                                
                                if (!moreShorts.nextPageToken) {
                                    loadMoreBtn.remove();
                                } else {
                                    loadMoreBtn.disabled = false;
                                    loadMoreBtn.textContent = 'Load More Shorts';
                                }
                            };
                        }
                    });
                    break;

                case 'playlists':
                    contentDiv.innerHTML = '<p class="loading">Loading playlists...</p>';
                    loadPlaylists(channelId).then(data => {
                        contentDiv.innerHTML = `
                            <div class="playlists-section">
                                <h2>Playlists</h2>
                                <div class="playlists-grid">
                                    ${data.items.map(playlist => `
                                        <div class="playlist-card" onclick="openPlaylist('${playlist.id}')">
                                            <div class="playlist-thumbnail">
                                                <img src="${playlist.snippet.thumbnails.medium.url}" 
                                                     alt="${playlist.snippet.title}">
                                                <div class="playlist-count">
                                                    <span>${playlist.contentDetails.itemCount} videos</span>
                                                </div>
                                            </div>
                                            <div class="playlist-info">
                                                <h3>${playlist.snippet.title}</h3>
                                                <p>${playlist.snippet.description || 'No description'}</p>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    });
                    break;

                case 'community':
                    contentDiv.innerHTML = '<p class="loading">Loading community posts...</p>';
                    loadCommunityPosts(channelId).then(data => {
                        contentDiv.innerHTML = `
                            <div class="community-section">
                                <h2>Community</h2>
                                <div class="posts-container">
                                    ${data.items.length ? data.items.map(post => `
                                        <div class="community-post">
                                            <div class="post-header">
                                                <img src="${channel.snippet.thumbnails.default.url}" 
                                                     alt="${channel.snippet.title}" class="post-avatar">
                                                <div>
                                                    <h3>${channel.snippet.title}</h3>
                                                    <span>${formatDate(post.snippet.publishedAt)}</span>
                                                </div>
                                            </div>
                                            <div class="post-content">
                                                ${post.snippet.description}
                                            </div>
                                            ${post.snippet.thumbnails ? `
                                                <div class="post-media">
                                                    <img src="${post.snippet.thumbnails.standard?.url || post.snippet.thumbnails.default.url}" 
                                                         alt="Post image">
                                                </div>
                                            ` : ''}
                                        </div>
                                    `).join('') : '<p class="no-posts">No community posts available</p>'}
                                </div>
                            </div>
                        `;
                    });
                    break;

                case 'about':
                    contentDiv.innerHTML = `
                        <div class="about-section">
                            <div class="about-stats">
                                <h2>Stats</h2>
                                <ul>
                                    <li>Joined ${formatDate(channel.snippet.publishedAt)}</li>
                                    <li>${formatNumber(channel.statistics.viewCount)} views</li>
                                    <li>${formatNumber(channel.statistics.subscriberCount)} subscribers</li>
                                    <li>${formatNumber(channel.statistics.videoCount)} videos</li>
                                </ul>
                            </div>
                            <div class="about-description">
                                <h2>Description</h2>
                                <p>${channel.snippet.description.replace(/\n/g, '<br>')}</p>
                            </div>
                            <div class="about-links">
                                <h2>Links</h2>
                                ${channel.brandingSettings.channel?.customUrl ? `
                                    <a href="https://youtube.com/${channel.brandingSettings.channel.customUrl}" 
                                       target="_blank" rel="noopener">
                                        Custom URL: ${channel.brandingSettings.channel.customUrl}
                                    </a>
                                ` : ''}
                            </div>
                        </div>
                    `;
                    break;

                case 'blog':
                    contentDiv.innerHTML = '<p class="loading">Loading blog posts...</p>';
                    (async () => {
                        try {
                            const response = await fetch(
                                `${API_URL}/search?part=snippet&channelId=${channelId}&type=video&maxResults=12&order=date&key=${API_KEY}`
                            );
                            const data = await response.json();
                    
                            if (!data.items || data.items.length === 0) {
                                contentDiv.innerHTML = '<p class="no-posts">No blog posts available</p>';
                                return;
                            }
                    
                            contentDiv.innerHTML = `
                                <div class="blog-section">
                                    <div class="blog-posts">
                                        ${data.items.map(video => `
                                            <article class="blog-post" onclick="openBlogPost('${video.id.videoId}', '${video.snippet.title.replace(/'/g, "\\'")}', '${video.snippet.description.replace(/'/g, "\\'")}')">
                                                <div class="blog-thumbnail">
                                                    <img src="${video.snippet.thumbnails.high.url}" alt="${video.snippet.title}">
                                                </div>
                                                <div class="blog-content">
                                                    <h2 class="blog-title">${video.snippet.title}</h2>
                                                    <div class="blog-meta">
                                                        ${formatDate(video.snippet.publishedAt)}
                                                    </div>
                                                    <p class="blog-excerpt">${video.snippet.description.slice(0, 100)}...</p>
                                                </div>
                                            </article>
                                        `).join('')}
                                    </div>
                                    ${data.nextPageToken ? '<button class="load-more" id="loadMoreBlog">Load More</button>' : ''}
                                </div>
                            `;
                    
                            // Add load more functionality
                            if (data.nextPageToken) {
                                const loadMoreBtn = document.getElementById('loadMoreBlog');
                                let nextPageToken = data.nextPageToken;
                                loadMoreBtn.onclick = async () => {
                                    loadMoreBtn.disabled = true;
                                    loadMoreBtn.textContent = 'Loading...';
                                    
                                    try {
                                        const moreResponse = await fetch(
                                            `${API_URL}/search?part=snippet&channelId=${channelId}&type=video&maxResults=12&order=date&pageToken=${nextPageToken}&key=${API_KEY}`
                                        );
                                        const moreData = await moreResponse.json();
                                        nextPageToken = moreData.nextPageToken;
                                
                                        const blogGrid = document.querySelector('.blog-posts');
                                        blogGrid.insertAdjacentHTML('beforeend', moreData.items.map(video => `
                                            <article class="blog-post" onclick="openBlogPost('${video.id.videoId}', '${video.snippet.title.replace(/'/g, "\\'")}', '${video.snippet.description.replace(/'/g, "\\'")}')">
                                                <div class="blog-thumbnail">
                                                    <img src="${video.snippet.thumbnails.high.url}" alt="${video.snippet.title}">
                                                </div>
                                                <div class="blog-content">
                                                    <h2 class="blog-title">${video.snippet.title}</h2>
                                                    <div class="blog-meta">
                                                        ${formatDate(video.snippet.publishedAt)}
                                                    </div>
                                                    <p class="blog-excerpt">${video.snippet.description.slice(0, 100)}...</p>
                                                </div>
                                            </article>
                                        `).join(''));
                                
                                        if (!moreData.nextPageToken) {
                                            loadMoreBtn.remove();
                                        } else {
                                            loadMoreBtn.disabled = false;
                                            loadMoreBtn.textContent = 'Load More';
                                        }
                                    } catch (error) {
                                        console.error('Error loading more blog posts:', error);
                                        loadMoreBtn.textContent = 'Error loading more';
                                    }
                                };
                            }
                        } catch (error) {
                            console.error('Error loading blog posts:', error);
                            contentDiv.innerHTML = '<p class="error">Error loading blog posts</p>';
                        }
                    })();
                    break;
            }
        }
        
        // Render the main channel layout
        resultsContainer.innerHTML = `
            <div class="channel-page">
                <div class="channel-cover">
                    ${channel.brandingSettings.image?.bannerExternalUrl ? 
                        `<img src="${channel.brandingSettings.image.bannerExternalUrl}" alt="Channel Banner">` : ''
                    }
                </div>
                <div class="channel-profile">
                    <div class="channel-profile-content">
                        <img class="channel-avatar" 
                             src="${channel.snippet.thumbnails.default.url}" 
                             alt="${channel.snippet.title}">
                        <div class="channel-info-wrapper">
                            <h1 class="channel-title">${channel.snippet.title}</h1>
                            <div class="channel-stats">
                                ${formatNumber(channel.statistics.subscriberCount)} subscribers • 
                                ${formatNumber(channel.statistics.videoCount)} videos • 
                                ${formatNumber(channel.statistics.viewCount)} views
                            </div>
                            <div class="channel-description">
                                <span class="short-text">${channel.snippet.description.slice(0, 100)}</span>
                                <span class="full-text" style="display: none;">${channel.snippet.description}</span>
                                <button style="background-color: white; color: black; border: none;" class="toggle-text" onclick="toggleText(this)"><b>...more</b></button>
                            </div>
                            <button class="subscribe-btn ${isSubscribed ? 'subscribed' : ''}" onclick="toggleSubscribe(this)">
                                ${isSubscribed ? 'Subscribed' : 'Subscribe'}
                            </button>
                            ${isLoggedInToYouTube() ? 
                                `<small class="youtube-status">Connected to YouTube</small>` : 
                                `<small class="youtube-status not-connected">Local Only</small>`
                            }
                        </div>
                    </div>
                </div>
                <div class="channel-nav">
                    <div class="nav-content">
                        <a href="#" class="nav-link active" data-section="home">HOME</a>
                        <a href="#" class="nav-link" data-section="videos">VIDEOS</a>
                        <a href="#" class="nav-link" data-section="shorts">SHORTS</a>
                        <a href="#" class="nav-link" data-section="playlists">PLAYLISTS</a>
                        <a href="#" class="nav-link" data-section="community">COMMUNITY</a>
                        <a href="#" class="nav-link" data-section="about">ABOUT</a>
                        <a href="#" class="nav-link" data-section="blog">BLOG</a>
                    </div>
                </div>
                <div class="channel-content"></div>
            </div>
            <button onclick="searchChannel()" class="back-button">← Back to Search</button>
        `;

        // Add navigation handlers
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelector('.nav-link.active').classList.remove('active');
                e.target.classList.add('active');
                updateContent(e.target.dataset.section);
            });
        });

        // Initialize home section
        updateContent('home');

    } catch (error) {
        console.error('Error:', error);
        resultsContainer.innerHTML = `
            <p class="error">Error loading channel details: ${error.message}</p>
            <button onclick="searchChannel()">← Back to Search</button>
        `;
    }
}

let currentChannelId = '';

async function loadSortedVideos(sortType, token = '') {
    const contentDiv = document.querySelector('.videos-grid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (!token) {
        contentDiv.innerHTML = '<p class="loading">Loading...</p>';
    }
    
    try {
        // Get channel details to find creation date
        const channelResponse = await fetch(
            `${API_URL}/channels?part=snippet&id=${currentChannelId}&key=${API_KEY}`
        );
        const channelData = await channelResponse.json();
        const channelCreationDate = channelData.items[0].snippet.publishedAt;
        
        let apiUrl = `${API_URL}/search?part=snippet&channelId=${currentChannelId}&type=video&maxResults=12&key=${API_KEY}`;
        
        switch(sortType) {
            case 'popular':
                apiUrl += '&order=viewCount';
                break;
            case 'oldest':
                // Use the channel's creation date as the start date and sort by date
                apiUrl += `&order=date&publishedAfter=${channelCreationDate}&publishedBefore=${new Date().toISOString()}`;
                break;
            default: // latest
                apiUrl += '&order=date';
        }
        
        if (token) {
            apiUrl += `&pageToken=${token}`;
        }

        const response = await fetch(apiUrl);
        const data = await response.json();
        
        // For oldest sort, reverse the items array
        if (sortType === 'oldest') {
            data.items.reverse();
        }
        
        // Update the render function to include duration
        if (!token) {
            contentDiv.innerHTML = renderVideos(data.items, sortType === 'blog');
        } else {
            contentDiv.insertAdjacentHTML('beforeend', renderVideos(data.items, sortType === 'blog'));
        }

        if (loadMoreBtn) {
            if (data.nextPageToken) {
                loadMoreBtn.dataset.nextPage = data.nextPageToken;
                loadMoreBtn.dataset.sortType = sortType;
                loadMoreBtn.style.display = 'block';
            } else {
                loadMoreBtn.style.display = 'none';
            }
        }

        // Fetch and display video stats
        data.items.forEach(async video => {
            const stats = await getVideoStats(video.id.videoId);
            if (stats) {
                const statsElement = document.getElementById(`stats-${video.id.videoId}`);
                if (statsElement) {
                    statsElement.innerHTML = `
                        <span class="views">
                            <i class="fas fa-eye"></i> ${formatNumber(stats.viewCount)}
                        </span>
                    `;
                }
            }
        });
    } catch (error) {
        console.error('Error loading videos:', error);
        contentDiv.innerHTML += '<p class="error">Error loading videos</p>';
    }
}

async function getVideoStats(videoId) {
    try {
        const response = await fetch(
            `${API_URL}/videos?part=statistics&id=${videoId}&key=${API_KEY}`
        );
        const data = await response.json();
        return data.items[0]?.statistics || null;
    } catch (error) {
        console.error('Error fetching video stats:', error);
        return null;
    }
}

function renderVideos(videos, isBlog = false) {
    const videoElements = videos.map(video => `
        <div class="video-card" onclick="playVideo('${video.id.videoId}')">
            <div class="video-thumbnail">
                <img src="${video.snippet.thumbnails.medium.url}" 
                     alt="${video.snippet.title}">
                <div class="video-duration" id="duration-${video.id.videoId}"></div>
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.snippet.title}</h3>
                <div class="video-meta">
                    ${formatDate(video.snippet.publishedAt)}
                    ${!isBlog ? `
                        <div class="video-stats" id="stats-${video.id.videoId}">
                            <div class="stats-loader">Loading stats...</div>
                        </div>
                    ` : ''}
                    
                </div>
                
            </div>
        </div>
    `).join('');
    
    return videoElements;
}

function playVideo(videoId) {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
}

function playShort(videoId) {
    window.open(`https://www.youtube.com/shorts/${videoId}`, '_blank');
}

function formatNumber(num) {
    if (!num) return '0';
    const n = parseInt(num);
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatViewCount(views) {
    return new Intl.NumberFormat('en', { notation: 'compact' }).format(views);
}

function openPlaylist(playlistId) {
    window.open(`https://www.youtube.com/playlist?list=${playlistId}`, '_blank');
}

// Check if user is logged in to YouTube (simplified check - actual check would require API)
function isLoggedInToYouTube() {
    // This is a simplified check - in reality, you would use YouTube API's authentication
    // For demo purposes, use localStorage to simulate login state
    return localStorage.getItem('youtubeLoggedIn') === 'true';
}

// Set YouTube login state (for demo)
function setYouTubeLoginState(isLoggedIn) {
    localStorage.setItem('youtubeLoggedIn', isLoggedIn ? 'true' : 'false');
}

function toggleSubscribe(btn) {
    // Make sure we have current channel data
    if (!currentChannel) {
        console.error('No channel data available');
        return;
    }
    
    // Get the current channel ID and title
    const channelId = currentChannel.id;
    const channelTitle = currentChannel.snippet.title;
    
    // Toggle subscribed state
    btn.classList.toggle('subscribed');
    const isSubscribed = btn.classList.contains('subscribed');
    btn.textContent = isSubscribed ? 'Subscribed' : 'Subscribe';
    
    // Store subscription state in localStorage
    let subscribedChannels = JSON.parse(localStorage.getItem('subscribedChannels') || '{}');
    
    if (isSubscribed) {
        // Add channel to subscribed list
        subscribedChannels[channelId] = {
            title: channelTitle,
            subscribedAt: new Date().toISOString()
        };
        
        // Check if logged in to YouTube
        if (isLoggedInToYouTube()) {
            // Open the actual YouTube channel page in a new tab to allow real subscription
            const youtubeChannelUrl = `https://www.youtube.com/channel/${channelId}?sub_confirmation=1`;
            window.open(youtubeChannelUrl, '_blank');
            
            // Show subscription notification
            showNotification(`Opening ${channelTitle}'s YouTube page to subscribe`, 'success');
        } else {
            // Show login notification with option to go to YouTube
            showLoginNotification(channelId, channelTitle);
        }
    } else {
        // Remove channel from subscribed list
        delete subscribedChannels[channelId];
        
        // Show unsubscription notification
        showNotification(`Unsubscribed from ${channelTitle} locally`, 'info');
    }
    
    // Save updated subscriptions
    localStorage.setItem('subscribedChannels', JSON.stringify(subscribedChannels));
}

// Show login notification with options
function showLoginNotification(channelId, channelTitle) {
    const notification = document.createElement('div');
    notification.className = 'notification warning';
    notification.innerHTML = `
        <div class="notification-content">
            <span>You need to log in to YouTube to subscribe to ${channelTitle}</span>
            <div class="notification-actions">
                <button onclick="openYouTubeLogin('${channelId}')">Go to YouTube</button>
                <button onclick="this.parentElement.parentElement.parentElement.remove()">Later</button>
            </div>
        </div>
        <button onclick="this.parentElement.remove()" class="close-notification">×</button>
    `;
    document.body.appendChild(notification);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 10000);
}

// Open YouTube login page and then redirect to channel
function openYouTubeLogin(channelId) {
    // In a real application, you'd use OAuth2 for proper authentication
    // For demo, just open YouTube in a new tab
    window.open(`https://www.youtube.com/channel/${channelId}?sub_confirmation=1`, '_blank');
    
    // Update local login state (for demo purposes)
    setYouTubeLoginState(true);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="close-notification">×</button>
    `;
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

function toggleText(element) {
    var shortText = element.previousElementSibling.previousElementSibling;
    var fullText = element.previousElementSibling;

    if (fullText.style.display === "none") {
        fullText.style.display = "inline";
        shortText.style.display = "none";
        element.textContent = "less";
    } else {
        fullText.style.display = "none";
        shortText.style.display = "inline";
        element.textContent = "more";
    }
}

async function loadBlogVideos(channelId, pageToken = '') {
    try {
        const response = await fetch(
            `${API_URL}/search?part=snippet&channelId=${channelId}&type=video&maxResults=24&videoDuration=long,medium&order=date${pageToken ? '&pageToken=' + pageToken : ''}&key=${API_KEY}`
        );
        const data = await response.json();

        // Filter out short videos (duration < 4 minutes)
        const videoIds = data.items.map(item => item.id.videoId).join(',');
        const videosResponse = await fetch(
            `${API_URL}/videos?part=contentDetails,statistics&id=${videoIds}&key=${API_KEY}`
        );
        const videosData = await videosResponse.json();

        // Match duration data with video items
        data.items = data.items.map(item => {
            const videoDetails = videosData.items.find(v => v.id === item.id.videoId);
            if (videoDetails) {
                item.contentDetails = videoDetails.contentDetails;
                item.statistics = videoDetails.statistics;
            }
            return item;
        });

        return data;
    } catch (error) {
        console.error('Error loading blog videos:', error);
        return { items: [] };
    }
}

function formatVideoDuration(duration) {
    if (!duration) return '';
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '').replace('M', '');
    const seconds = (match[3] || '').replace('S', '');
    
    let result = '';
    if (hours) result += `${hours}:`;
    result += `${minutes.padStart(2, '0')}:`;
    result += seconds.padStart(2, '0');
    return result;
}

function openBlogPost(videoId, title, description) {
    const win = window.open('', '_blank');
    win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title}</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
            <style>
                body {
                    margin: 0;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background: #f5f5f5;
                }

                .search-container {
                    display: flex;
                    gap: 16%;
                    background: white;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    padding: 12px 24px;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    align-items: center;
                }

                .nav-left {
                    display: flex;
                    align-items: center;
                    gap: 24px;
                }

                .youtube-logo {
                    width: 171px;
                    height: auto;
                    cursor: pointer;
                }

                .nav-middle {
                    flex: 1;
                    max-width: 640px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin: 0 40px;
                }

                .search-group {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    gap: 8px;
                }

                #searchInput {
                    flex: 1;
                    padding: 12px 24px;
                    font-size: 16px;
                    border: 1px solid #e0e0e0;
                    border-radius: 24px;
                    width: 100%;
                }

                .search-group button {
                    padding: 10px 20px;
                    background-color: #167a9d;
                    color: white;
                    border: none;
                    border-radius: 20px;
                    cursor: pointer;
                }

                .blog-container {
                    max-width: 800px;
                    margin: 80px auto 40px;
                    padding: 20px;
                    background: white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    border-radius: 8px;
                }

                .video-container {
                    position: relative;
                    padding-bottom: 56.25%;
                    height: 0;
                    overflow: hidden;
                    border-radius: 8px;
                    margin-bottom: 24px;
                }

                .video-container iframe {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border: none;
                }

                .blog-title {
                    font-size: 32px;
                    margin: 0 0 16px 0;
                    color: #1a1a1a;
                    line-height: 1.3;
                }

                .blog-meta {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 24px;
                    color: #606060;
                    font-size: 14px;
                }

                .blog-content {
                    font-size: 18px;
                    line-height: 1.8;
                    color: #444;
                }

                .blog-content p {
                    margin-bottom: 20px;
                }

                @media (max-width: 768px) {
                    .search-container {
                        padding: 8px 16px;
                    }
                    
                    .youtube-logo {
                        width: 120px;
                    }
                    
                    .blog-container {
                        margin: 60px 16px 20px;
                    }
                    
                    .blog-title {
                        font-size: 24px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="search-container">
                <div class="nav-left">
                    <img class="youtube-logo" src="./digitalindia-logo.png" alt="YouTube">
                </div>
                <div class="nav-middle">
                    <div class="search-group">
                        <input type="text" id="searchInput" placeholder="Enter channel name...">
                        <button onclick="window.opener.searchChannel()">Search</button>
                    </div>
                </div>
                <div>
                    <i class='fas fa-user-circle' style='font-size:48px;color:#167a9d'></i>
                </div>
            </div>
            <div class="blog-container">
                <div class="video-container">
                    <iframe src="https://www.youtube.com/embed/${videoId}" 
                            allowfullscreen></iframe>
                </div>
                <h1 class="blog-title">${title}</h1>
                <div class="blog-meta">
                    <span><i class="far fa-calendar"></i> ${new Date().toLocaleDateString()}</span>
                    <span><i class="far fa-user"></i> Author</span>
                </div>
                <div class="blog-content">
                    ${description.split('\n').map(para => `<p>${para}</p>`).join('')}
                </div>
            </div>
        </body>
        </html>
    `);
}
