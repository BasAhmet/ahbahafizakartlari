const allEmojis = [
    '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯',
    '🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🐤','🦆',
    '🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🐛','🦋',
    '🐌','🐞','🐜','🦟','🐢','🐍','🦎','🦖','🦕','🐙',
    '🦑','🦐','🦞','🦀','🐡','🐠','🐟','🐬','🐳','🐋'
];

let cards = [];
let flippedCards = [];
let isLocked = false;
let totalPairs = 10;
let matchedPairs = 0;

// YENİ: 2 Kişilik Mod Değişkenleri
let currentPlayer = 1; 
let score1 = 0;
let score2 = 0;

// DOM Elementleri
const board = document.getElementById('gameBoard');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const cardCountSelect = document.getElementById('cardCount');
const winScreen = document.getElementById('winScreen');

const player1Box = document.getElementById('player1');
const player2Box = document.getElementById('player2');
const score1El = document.getElementById('score1');
const score2El = document.getElementById('score2');
const finalScore1 = document.getElementById('finalScore1');
const finalScore2 = document.getElementById('finalScore2');
const winnerText = document.getElementById('winnerText');

function initGame() {
    // Oyunu ve skorları sıfırla
    board.innerHTML = '';
    matchedPairs = 0;
    flippedCards = [];
    isLocked = false;
    
    score1 = 0;
    score2 = 0;
    currentPlayer = 1;
    
    score1El.innerText = score1;
    score2El.innerText = score2;
    updateTurnUI();
    winScreen.classList.add('hidden');

    const cardCount = parseInt(cardCountSelect.value);
    totalPairs = cardCount / 2;

    if (cardCount <= 40) {
        board.style.gridTemplateColumns = 'repeat(auto-fit, minmax(70px, 1fr))';
    } else if (cardCount <= 60) {
        board.style.gridTemplateColumns = 'repeat(auto-fit, minmax(60px, 1fr))';
    } else {
        board.style.gridTemplateColumns = 'repeat(auto-fit, minmax(50px, 1fr))';
    }

    const selectedEmojis = allEmojis.slice(0, totalPairs);
    cards = [...selectedEmojis, ...selectedEmojis];
    cards.sort(() => Math.random() - 0.5); 

    cards.forEach((emoji) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">${emoji}</div>
            </div>
        `;
        card.addEventListener('click', () => flipCard(card));
        board.appendChild(card);
    });
}

function flipCard(card) {
    if (isLocked || card.classList.contains('flipped')) return;

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    isLocked = true; 
    const [card1, card2] = flippedCards;

    if (card1.dataset.emoji === card2.dataset.emoji) {
        // EŞLEŞTİ!
        matchedPairs++;
        
        // Puanı aktif oyuncuya yaz
        if (currentPlayer === 1) {
            score1++;
            score1El.innerText = score1;
        } else {
            score2++;
            score2El.innerText = score2;
        }

        flippedCards = [];
        isLocked = false;
        // Not: Eşleşme olduğu için sıra değiştirmiyoruz! Bilen bir daha oynar.

        checkWinCondition();
    } else {
        // EŞLEŞMEDİ!
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            
            // Sırayı diğer oyuncuya geçir
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            updateTurnUI();
            
            isLocked = false;
        }, 1000);
    }
}

// Aktif oyuncuyu ekranda vurgula
function updateTurnUI() {
    if (currentPlayer === 1) {
        player1Box.classList.add('active');
        player2Box.classList.remove('active');
    } else {
        player2Box.classList.add('active');
        player1Box.classList.remove('active');
    }
}

// Oyun bitti mi kontrol et
function checkWinCondition() {
    if (matchedPairs === totalPairs) {
        setTimeout(() => {
            finalScore1.innerText = score1;
            finalScore2.innerText = score2;
            
            if (score1 > score2) {
                winnerText.innerText = "🏆 1. Oyuncu Kazandı!";
            } else if (score2 > score1) {
                winnerText.innerText = "🏆 2. Oyuncu Kazandı!";
            } else {
                winnerText.innerText = "🤝 Berabere!";
            }

            winScreen.classList.remove('hidden');
            
            // Konfeti Patlat (canvas-confetti kütüphanesi)
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.6 }
                });
            }
        }, 500);
    }
}

startBtn.addEventListener('click', initGame);
restartBtn.addEventListener('click', initGame);

initGame();
