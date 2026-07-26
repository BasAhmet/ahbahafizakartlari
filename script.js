// 50 farklı emoji (100 kart için 50 çifte ihtiyacımız var)
const allEmojis = [
    '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯',
    '🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🐤','🦆',
    '🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🐛','🦋',
    '🐌','🐞','🐜','🦟','🐢','🐍','🦎','🦖','🦕','🐙',
    '🦑','🦐','🦞','🦀','🐡','🐠','🐟','🐬','🐳','🐋'
];

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let isLocked = false;
let totalPairs = 10;

// DOM Elementleri
const board = document.getElementById('gameBoard');
const movesEl = document.getElementById('moves');
const matchesEl = document.getElementById('matches');
const totalMatchesEl = document.getElementById('totalMatches');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const cardCountSelect = document.getElementById('cardCount');
const winScreen = document.getElementById('winScreen');
const finalMovesEl = document.getElementById('finalMoves');

function initGame() {
    // Oyunu sıfırla
    board.innerHTML = '';
    matchedPairs = 0;
    moves = 0;
    flippedCards = [];
    isLocked = false;
    movesEl.innerText = moves;
    matchesEl.innerText = matchedPairs;
    winScreen.classList.add('hidden');

    // Zorluk seviyesini al
    const cardCount = parseInt(cardCountSelect.value);
    totalPairs = cardCount / 2;
    totalMatchesEl.innerText = totalPairs;

    // Dinamik grid boyutu (Kart sayısı arttıkça kartları küçült)
    if (cardCount <= 40) {
        board.style.gridTemplateColumns = 'repeat(auto-fit, minmax(70px, 1fr))';
    } else if (cardCount <= 60) {
        board.style.gridTemplateColumns = 'repeat(auto-fit, minmax(60px, 1fr))';
    } else {
        board.style.gridTemplateColumns = 'repeat(auto-fit, minmax(50px, 1fr))';
    }

    // Emojileri seç ve karıştır
    const selectedEmojis = allEmojis.slice(0, totalPairs);
    cards = [...selectedEmojis, ...selectedEmojis];
    cards.sort(() => Math.random() - 0.5); // Diziyi rastgele karıştır

    // Kartları ekrana çiz
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
    // Kilitliyse veya zaten açıksa işlem yapma
    if (isLocked || card.classList.contains('flipped')) return;

    card.classList.add('flipped');
    flippedCards.push(card);

    // 2 kart açıldığında kontrol et
    if (flippedCards.length === 2) {
        moves++;
        movesEl.innerText = moves;
        checkMatch();
    }
}

function checkMatch() {
    isLocked = true; // Başka karta tıklamayı engelle
    const [card1, card2] = flippedCards;

    if (card1.dataset.emoji === card2.dataset.emoji) {
        // Eşleşme Başarılı
        matchedPairs++;
        matchesEl.innerText = matchedPairs;
        flippedCards = [];
        isLocked = false;

        // Oyun bitti mi?
        if (matchedPairs === totalPairs) {
            setTimeout(() => {
                finalMovesEl.innerText = moves;
                winScreen.classList.remove('hidden');
            }, 500);
        }
    } else {
        // Eşleşme Başarısız - 1 saniye sonra kapat
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            isLocked = false;
        }, 1000);
    }
}

// Buton dinleyicileri
startBtn.addEventListener('click', initGame);
restartBtn.addEventListener('click', initGame);

// Sayfa yüklendiğinde ilk oyunu başlat
initGame();
