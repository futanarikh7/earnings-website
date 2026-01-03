// User data and state
let userData = {
    balance: 0,
    totalVideos: 0,
    totalEarned: 0,
    todayEarned: 0,
    username: "User" + Math.floor(1000 + Math.random() * 9000)
};

// DOM Elements
const balanceEl = document.getElementById('balance');
const totalVideosEl = document.getElementById('totalVideos');
const totalEarnedEl = document.getElementById('totalEarned');
const todayEarnedEl = document.getElementById('todayEarned');
const availableCoinsEl = document.getElementById('availableCoins');
const usernameEl = document.getElementById('username');
const watchBtn = document.getElementById('watchBtn');
const countdownEl = document.getElementById('countdown');
const timerEl = document.getElementById('timer');
const videoPlaceholder = document.getElementById('videoPlaceholder');
const completionModal = document.getElementById('completionModal');
const redeemModal = document.getElementById('redeemModal');
const closeModals = document.querySelectorAll('.close-modal');
const continueBtn = document.getElementById('continueBtn');
const confirmRedeemBtn = document.getElementById('confirmRedeem');
const cancelRedeemBtn = document.getElementById('cancelRedeem');
const redeemBtns = document.querySelectorAll('.redeem-btn');
const newBalanceEl = document.getElementById('newBalance');
const redeemTitle = document.getElementById('redeemTitle');
const redeemMessage = document.getElementById('redeemMessage');
const redeemCostEl = document.getElementById('redeemCost');
const currentBalanceEl = document.getElementById('currentBalance');

// State variables
let countdownInterval;
let isWatching = false;
let currentCountdown = 30;
let selectedRewardCost = 0;
let selectedRewardName = "";

// Initialize the page
function init() {
    // Load user data from localStorage
    const savedData = localStorage.getItem('earningsUserData');
    if (savedData) {
        userData = JSON.parse(savedData);
    } else {
        // Save initial data
        saveUserData();
    }
    
    // Update UI with user data
    updateUI();
    
    // Set username
    usernameEl.textContent = userData.username;
    
    // Reset today's earnings if it's a new day
    resetTodayEarningsIfNewDay();
}

// Save user data to localStorage
function saveUserData() {
    localStorage.setItem('earningsUserData', JSON.stringify(userData));
}

// Update all UI elements with current data
function updateUI() {
    balanceEl.textContent = userData.balance.toLocaleString();
    totalVideosEl.textContent = userData.totalVideos.toLocaleString();
    totalEarnedEl.textContent = userData.totalEarned.toLocaleString();
    todayEarnedEl.textContent = userData.todayEarned.toLocaleString();
    availableCoinsEl.textContent = userData.balance.toLocaleString();
}

// Reset today's earnings if it's a new day
function resetTodayEarningsIfNewDay() {
    const lastVisit = localStorage.getItem('lastVisitDate');
    const today = new Date().toDateString();
    
    if (lastVisit !== today) {
        userData.todayEarned = 0;
        saveUserData();
        localStorage.setItem('lastVisitDate', today);
    }
}

// Simulate watching a video ad
function startWatchingVideo() {
    if (isWatching) return;
    
    isWatching = true;
    watchBtn.disabled = true;
    watchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Watching...';
    
    // Update video placeholder to show "playing" state
    videoPlaceholder.innerHTML = `
        <div class="video-playing">
            <i class="fas fa-video"></i>
            <p>Advertisement playing...</p>
            <div class="progress-bar">
                <div class="progress" id="progress"></div>
            </div>
        </div>
    `;
    
    // Start countdown
    currentCountdown = 30;
    countdownEl.textContent = currentCountdown;
    timerEl.style.display = 'flex';
    
    // Simulate video playback with progress bar
    let progress = 0;
    const progressBar = document.getElementById('progress');
    const progressInterval = setInterval(() => {
        progress += 3.33; // 100% over 30 seconds
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    }, 1000);
    
    // Countdown timer
    countdownInterval = setInterval(() => {
        currentCountdown--;
        countdownEl.textContent = currentCountdown;
        
        if (currentCountdown <= 0) {
            finishWatching();
            clearInterval(countdownInterval);
            clearInterval(progressInterval);
        }
    }, 1000);
}

// Finish watching and award coins
function finishWatching() {
    isWatching = false;
    
    // Award coins
    const coinsEarned = 10;
    userData.balance += coinsEarned;
    userData.totalEarned += coinsEarned;
    userData.todayEarned += coinsEarned;
    userData.totalVideos++;
    
    // Save data
    saveUserData();
    
    // Update UI
    updateUI();
    
    // Show completion modal
    document.querySelector('.coins-earned').textContent = coinsEarned;
    newBalanceEl.textContent = userData.balance.toLocaleString();
    completionModal.style.display = 'flex';
    
    // Reset button
    watchBtn.disabled = false;
    watchBtn.innerHTML = '<i class="fas fa-play"></i> Watch Video & Earn 10 Coins';
    
    // Reset video placeholder
    videoPlaceholder.innerHTML = `
        <i class="fas fa-play-circle"></i>
        <p>Click "Watch Video" to start earning</p>
    `;
    
    // Hide timer
    timerEl.style.display = 'none';
}

// Show redemption modal
function showRedeemModal(cost, rewardName) {
    selectedRewardCost = cost;
    selectedRewardName = rewardName;
    
    redeemTitle.textContent = `Redeem: ${rewardName}`;
    redeemMessage.textContent = `You're about to redeem ${rewardName} for ${cost.toLocaleString()} coins.`;
    redeemCostEl.textContent = cost.toLocaleString();
    currentBalanceEl.textContent = userData.balance.toLocaleString();
    
    // Check if user has enough coins
    if (userData.balance < cost) {
        redeemMessage.innerHTML = `You don't have enough coins for ${rewardName}.<br>You need ${cost.toLocaleString()} coins but only have ${userData.balance.toLocaleString()}.`;
        confirmRedeemBtn.disabled = true;
        confirmRedeemBtn.style.opacity = '0.5';
        confirmRedeemBtn.textContent = 'Not Enough Coins';
    } else {
        confirmRedeemBtn.disabled = false;
        confirmRedeemBtn.style.opacity = '1';
        confirmRedeemBtn.textContent = 'Confirm Redemption';
    }
    
    redeemModal.style.display = 'flex';
}

// Process redemption
function processRedemption() {
    if (userData.balance >= selectedRewardCost) {
        userData.balance -= selectedRewardCost;
        saveUserData();
        updateUI();
        
        alert(`Congratulations! You've successfully redeemed ${selectedRewardName}. This is a demo - in a real app, you would receive your reward via email.`);
        
        // Close modal
        redeemModal.style.display = 'none';
    }
}

// Event Listeners
watchBtn.addEventListener('click', startWatchingVideo);

continueBtn.addEventListener('click', () => {
    completionModal.style.display = 'none';
});

closeModals.forEach(btn => {
    btn.addEventListener('click', () => {
        completionModal.style.display = 'none';
        redeemModal.style.display = 'none';
    });
});

redeemBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const cost = parseInt(e.target.getAttribute('data-cost'));
        const rewardName = e.target.parentElement.querySelector('h3').textContent;
        showRedeemModal(cost, rewardName);
    });
});

confirmRedeemBtn.addEventListener('click', processRedemption);

cancelRedeemBtn.addEventListener('click', () => {
    redeemModal.style.display = 'none';
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === completionModal) {
        completionModal.style.display = 'none';
    }
    if (e.target === redeemModal) {
        redeemModal.style.display = 'none';
    }
});

// Add some CSS for the progress bar
const progressStyle = document.createElement('style');
progressStyle.textContent = `
    .video-playing {
        text-align: center;
        color: white;
    }
    .video-playing i {
        font-size: 4rem;
        margin-bottom: 1rem;
        color: #6a11cb;
    }
    .progress-bar {
        width: 80%;
        height: 8px;
        background: #333;
        border-radius: 4px;
        margin: 2rem auto 0;
        overflow: hidden;
    }
    .progress {
        height: 100%;
        background: linear-gradient(to right, #6a11cb, #2575fc);
        width: 0%;
        transition: width 1s linear;
    }
`;
document.head.appendChild(progressStyle);

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', init);