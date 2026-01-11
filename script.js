// Starfield Animation
function createStarfield() {
    const starfield = document.getElementById('starfield');
    const starCount = 150;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        // Random position
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';

        // Random size (1-3px)
        const size = Math.random() * 2 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';

        // Random animation duration (2-5s)
        star.style.animationDuration = (Math.random() * 3 + 2) + 's';

        // Random animation delay
        star.style.animationDelay = Math.random() * 2 + 's';

        starfield.appendChild(star);
    }
}

// Copy Contract Address
function setupCopyButton() {
    const copyBtn = document.getElementById('copyBtn');
    const contractAddress = document.getElementById('contractAddress');

    if (copyBtn && contractAddress) {
        copyBtn.addEventListener('click', async () => {
            const address = contractAddress.textContent;

            try {
                await navigator.clipboard.writeText(address);

                // Visual feedback
                const originalHTML = copyBtn.innerHTML;
                copyBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                `;
                copyBtn.style.color = '#4CAF50';

                setTimeout(() => {
                    copyBtn.innerHTML = originalHTML;
                    copyBtn.style.color = '';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });
    }
}

// Mobile Menu Toggle
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Animate hamburger to X
            const spans = mobileMenuBtn.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const spans = mobileMenuBtn.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            });
        });
    }
}

// Smooth Scroll for Navigation
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navbar Background on Scroll
function setupNavbarScroll() {
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(5, 5, 5, 0.98)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.9)';
        }
    });
}

// Intersection Observer for Scroll Animations
function setupScrollAnimations() {
    const sections = document.querySelectorAll('.section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Flappy Tits Game
function setupGame() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas?.getContext('2d');
    const startOverlay = document.getElementById('gameOverlay');
    const gameOverOverlay = document.getElementById('gameOverOverlay');
    const scoreDisplay = document.getElementById('scoreValue');
    const bestDisplay = document.getElementById('bestValue');
    const finalScoreDisplay = document.getElementById('finalScore');
    const playerNameInput = document.getElementById('playerNameInput');
    const submitScoreBtn = document.getElementById('submitScoreBtn');
    const leaderboardList = document.getElementById('leaderboardList');

    if (!canvas || !ctx) return;

    // Game state
    let gameRunning = false;
    let gameOver = false;
    let score = 0;
    let bestScore = parseInt(localStorage.getItem('flappyTitsBest')) || 0;
    let animationId;

    // Player (the tit) - made easier with smaller hitbox and gentler physics
    let bird = {
        x: 80,
        y: 200,
        width: 45,
        height: 45,
        hitboxPadding: 8, // Smaller hitbox than visual
        velocity: 0,
        gravity: 0.35, // Gentler gravity
        jump: -7, // Softer jump
        rotation: 0
    };

    // Pipes - wider gap and slower
    let pipes = [];
    const pipeWidth = 50;
    const pipeGap = 180; // Much bigger gap
    let pipeSpeed = 2.5; // Slower pipes
    let frameCount = 0;

    // Load logo image
    const logoImg = new Image();
    logoImg.src = 'assets/logo.png';

    // Leaderboard (stored in localStorage)
    let leaderboard = JSON.parse(localStorage.getItem('flappyTitsLeaderboard')) || [
        { name: 'TitLord420', score: 69 },
        { name: 'BoobMaster', score: 54 },
        { name: 'CatchEmAll', score: 42 },
        { name: 'DiamondHands', score: 38 },
        { name: 'MoonBoi', score: 31 }
    ];

    // Update displays
    bestDisplay.textContent = bestScore;
    renderLeaderboard();

    function renderLeaderboard() {
        leaderboardList.innerHTML = leaderboard
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map((entry, index) => `
                <div class="leaderboard-item">
                    <span class="rank">${index + 1}</span>
                    <span class="player">${entry.name}</span>
                    <span class="lb-score">${entry.score}</span>
                </div>
            `).join('');
    }

    function resetGame() {
        bird.y = 200;
        bird.velocity = 0;
        bird.rotation = 0;
        pipes = [];
        score = 0;
        frameCount = 0;
        pipeSpeed = 3;
        scoreDisplay.textContent = score;
    }

    function startGame() {
        resetGame();
        gameRunning = true;
        gameOver = false;
        startOverlay.classList.add('hidden');
        gameOverOverlay.classList.remove('visible');
        gameLoop();
    }

    function endGame() {
        gameRunning = false;
        gameOver = true;
        cancelAnimationFrame(animationId);

        // Update best score
        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem('flappyTitsBest', bestScore);
            bestDisplay.textContent = bestScore;
        }

        finalScoreDisplay.textContent = score;
        playerNameInput.value = '';
        gameOverOverlay.classList.add('visible');
    }

    function flap() {
        if (!gameRunning && !gameOver) {
            startGame();
        } else if (gameRunning) {
            bird.velocity = bird.jump;
        }
    }

    function createPipe() {
        const minHeight = 50;
        const maxHeight = canvas.height - pipeGap - minHeight;
        const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;

        pipes.push({
            x: canvas.width,
            topHeight: topHeight,
            bottomY: topHeight + pipeGap,
            passed: false
        });
    }

    function update() {
        if (!gameRunning) return;

        frameCount++;

        // Bird physics
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;
        bird.rotation = Math.min(Math.max(bird.velocity * 3, -30), 90);

        // Create pipes
        if (frameCount % 100 === 0) {
            createPipe();
        }

        // Update pipes
        pipes.forEach(pipe => {
            pipe.x -= pipeSpeed;

            // Score when passing pipe
            if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
                pipe.passed = true;
                score++;
                scoreDisplay.textContent = score;

                // Increase difficulty
                if (score % 5 === 0) {
                    pipeSpeed += 0.3;
                }
            }
        });

        // Remove off-screen pipes
        pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);

        // Collision detection with hitbox padding (forgiving hitbox)
        const hitX = bird.x + bird.hitboxPadding;
        const hitY = bird.y + bird.hitboxPadding;
        const hitW = bird.width - bird.hitboxPadding * 2;
        const hitH = bird.height - bird.hitboxPadding * 2;

        // Ground and ceiling
        if (hitY + hitH > canvas.height || hitY < 0) {
            endGame();
            return;
        }

        // Pipe collision
        for (let pipe of pipes) {
            if (hitX + hitW > pipe.x && hitX < pipe.x + pipeWidth) {
                if (hitY < pipe.topHeight || hitY + hitH > pipe.bottomY) {
                    endGame();
                    return;
                }
            }
        }
    }

    function draw() {
        // Clear canvas with dark background
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw stars (background)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        for (let i = 0; i < 30; i++) {
            const x = (i * 47 + frameCount * 0.5) % canvas.width;
            const y = (i * 31) % canvas.height;
            ctx.beginPath();
            ctx.arc(x, y, 1, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw pipes
        pipes.forEach(pipe => {
            // Pipe glow
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 15;

            // Top pipe
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
            ctx.strokeStyle = '#FFC107';
            ctx.lineWidth = 3;
            ctx.strokeRect(pipe.x, 0, pipeWidth, pipe.topHeight);

            // Bottom pipe
            ctx.fillRect(pipe.x, pipe.bottomY, pipeWidth, canvas.height - pipe.bottomY);
            ctx.strokeRect(pipe.x, pipe.bottomY, pipeWidth, canvas.height - pipe.bottomY);

            ctx.shadowBlur = 0;
        });

        // Draw bird (tit logo)
        ctx.save();
        ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
        ctx.rotate(bird.rotation * Math.PI / 180);

        if (logoImg.complete) {
            ctx.drawImage(logoImg, -bird.width / 2, -bird.height / 2, bird.width, bird.height);
        } else {
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(0, 0, bird.width / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        // Draw score on canvas
        ctx.fillStyle = '#FFD700';
        ctx.font = '24px "Permanent Marker", cursive';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 10;
        ctx.fillText(score, canvas.width / 2, 40);
        ctx.shadowBlur = 0;
    }

    function gameLoop() {
        update();
        draw();
        if (gameRunning) {
            animationId = requestAnimationFrame(gameLoop);
        }
    }

    // Get play again text element
    const playAgainText = document.querySelector('.play-again-text');

    // Event listeners
    canvas.addEventListener('click', (e) => {
        if (!gameOver) {
            flap();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            if (gameOver) {
                gameOver = false;
                startGame();
            } else {
                flap();
            }
        }
    });

    startOverlay.addEventListener('click', () => {
        if (!gameRunning && !gameOver) {
            startGame();
        }
    });

    // Play again button
    playAgainText.addEventListener('click', (e) => {
        e.stopPropagation();
        if (gameOver) {
            gameOver = false;
            startGame();
        }
    });

    // Also allow clicking the game over overlay background to restart
    gameOverOverlay.addEventListener('click', (e) => {
        // Only restart if clicking the overlay itself, not the input or button
        if (e.target === gameOverOverlay || e.target.classList.contains('game-over-title') || e.target.classList.contains('play-again-text')) {
            gameOver = false;
            startGame();
        }
    });

    // Submit score
    submitScoreBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Don't restart game when clicking submit
        const name = playerNameInput.value.trim() || 'Anonymous';
        leaderboard.push({ name, score });
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 10); // Keep top 10
        localStorage.setItem('flappyTitsLeaderboard', JSON.stringify(leaderboard));
        renderLeaderboard();

        // Visual feedback
        submitScoreBtn.textContent = 'Submitted!';
        submitScoreBtn.disabled = true;
        setTimeout(() => {
            submitScoreBtn.textContent = 'Submit';
            submitScoreBtn.disabled = false;
        }, 2000);
    });

    // Allow Enter key to submit
    playerNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            submitScoreBtn.click();
        }
        e.stopPropagation(); // Don't trigger other key handlers
    });

    // Prevent input clicks from restarting game
    playerNameInput.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Initial draw
    draw();
}

// Squeeze Game
function setupSqueezeGame() {
    const squeezeTarget = document.getElementById('squeezeTarget');
    const squeezeCount = document.getElementById('squeezeCount');
    const squeezeBest = document.getElementById('squeezeBest');
    const squeezeTimer = document.getElementById('squeezeTimer');
    const squeezeStartBtn = document.getElementById('squeezeStartBtn');
    const squeezeRipple = document.querySelector('.squeeze-ripple');

    if (!squeezeTarget || !squeezeStartBtn) return;

    let count = 0;
    let bestScore = parseInt(localStorage.getItem('squeezeBest')) || 0;
    let timeLeft = 10;
    let gameActive = false;
    let timerInterval;

    // Display best score
    squeezeBest.textContent = bestScore;

    function startGame() {
        count = 0;
        timeLeft = 10;
        gameActive = true;
        squeezeCount.textContent = count;
        squeezeTimer.textContent = timeLeft;
        squeezeStartBtn.disabled = true;
        squeezeStartBtn.textContent = 'SQUEEZE!';
        squeezeTarget.classList.add('squeezable');

        timerInterval = setInterval(() => {
            timeLeft--;
            squeezeTimer.textContent = timeLeft;

            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }

    function endGame() {
        gameActive = false;
        clearInterval(timerInterval);
        squeezeTarget.classList.remove('squeezable');
        squeezeStartBtn.disabled = false;

        // Check for new best
        if (count > bestScore) {
            bestScore = count;
            localStorage.setItem('squeezeBest', bestScore);
            squeezeBest.textContent = bestScore;
            squeezeStartBtn.textContent = 'NEW RECORD! GO AGAIN';
        } else {
            squeezeStartBtn.textContent = 'TRY AGAIN';
        }
    }

    function squeeze() {
        if (!gameActive) return;

        count++;
        squeezeCount.textContent = count;

        // Trigger ripple animation
        squeezeRipple.classList.remove('animate');
        void squeezeRipple.offsetWidth; // Force reflow
        squeezeRipple.classList.add('animate');
    }

    // Event listeners
    squeezeTarget.addEventListener('click', squeeze);
    squeezeTarget.addEventListener('touchstart', (e) => {
        e.preventDefault();
        squeeze();
    });

    squeezeStartBtn.addEventListener('click', startGame);
}

// Slideshow
function setupSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const dotsContainer = document.getElementById('slideDots');

    if (!slides.length || !prevBtn || !nextBtn || !dotsContainer) return;

    let currentSlide = 0;
    let autoSlideInterval;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `slide-dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.slide-dot');

    function updateSlides() {
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(index) {
        currentSlide = index;
        updateSlides();
        resetAutoSlide();
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlides();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlides();
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, 4000);
    }

    // Event listeners
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });

    // Start auto-slide
    autoSlideInterval = setInterval(nextSlide, 4000);
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    createStarfield();
    setupCopyButton();
    setupMobileMenu();
    setupSmoothScroll();
    setupNavbarScroll();
    setupScrollAnimations();
    setupGame();
    setupSqueezeGame();
    setupSlideshow();
});
