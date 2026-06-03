document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const heartsBg = document.getElementById('hearts-bg');
    const envelope = document.getElementById('envelope');
    const envelopeScreen = document.getElementById('envelope-screen');
    const letterScreen = document.getElementById('letter-screen');
    const successScreen = document.getElementById('success-screen');
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const dodgeAlert = document.getElementById('dodge-alert');
    const apologyMessage = document.getElementById('apology-message');
    const couponCards = document.querySelectorAll('.coupon-card');
    const customPopup = document.getElementById('custom-popup');
    const popupTitle = document.getElementById('popup-title');
    const popupMessage = document.getElementById('popup-message');
    const popupCloseBtn = document.getElementById('popup-close-btn');

    // Confetti Canvas setup
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    let animationId;
    let confetti = [];

    // State Variables
    let noClickCount = 0;
    let typedTextFinished = false;
    let soundEnabled = true;

    // Custom phrases for the dodging No button
    const noPhrases = [
        "No 😠",
        "Wait, no! 🥺",
        "Are you sure? 💔",
        "Not allowed! 🙅‍♂️",
        "Error: Click Yes! 👉👈",
        "Pretty please? 😭",
        "No is broken! 🛠️",
        "Forbidden! 🚫",
        "Hehe try again! 🧸",
        "Yes is only 1 click away! 💕"
    ];

    // Playful feedback phrases for the dodge alert bubble
    const alertPhrases = [
        "Psst... there's only one correct option! 😉",
        "Oops! You almost clicked it! 💨",
        "Wow, you're persistent! But nope! 🙅‍♂️",
        "The button is too fast for you! Hehe 🧸",
        "System Error: Forgiveness is mandatory! 🔒",
        "Give up and click YES! 💕",
        "I'm not letting you say no! 😠 (in a cute way)",
        "Nice try! Still impossible! 🎀",
        "My love is dodging your NO! 💖",
        "Yay, just click the big pink button! 👇"
    ];

    // Typist Text Content with cute kaomojis
    const letterContent = 
`Dear Aria, 🥺(˶ᵔ ᵕ ᵔ˶)

I am super, super sorry for what happened (｡>﹏<｡). I really hate when things aren't perfect between us, and knowing that I caused a frown on your beautiful face makes my heart feel incredibly heavy. 💔

You mean the absolute universe to me, and my life is so much brighter with you in it. I promise to be more thoughtful, listen better, and shower you with extra cuddles, attention, and your absolute favorite snacks. ๑(◕‿◕)๑

Can you find it in your warm, sweet heart to forgive me? I love you to the moon and back! 💖(✿◠‿◠)`;

    /* -----------------------------------------
       FLOATING HEARTS GENERATOR
    ----------------------------------------- */
    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        
        // Random properties
        const size = Math.random() * 20 + 15; // 15px to 35px
        const left = Math.random() * 100; // 0% to 100%
        const duration = Math.random() * 6 + 6; // 6s to 12s
        const delay = Math.random() * 5;
        
        // Cute pastel colors
        const colors = ['#ffafcc', '#ffc2d1', '#ff8fa3', '#c8b6ff', '#b5e2fa'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        // Cute element variety
        const items = ['❤️', '💖', '💝', '💕', '🧸', '🌸', '🎀', '🍯', '✨'];
        const randomItem = items[Math.floor(Math.random() * items.length)];

        heart.innerHTML = randomItem;
        heart.style.setProperty('--size', `${size}px`);
        heart.style.setProperty('--duration', `${duration}s`);
        heart.style.setProperty('--color', randomColor);
        heart.style.left = `${left}%`;
        heart.style.animationDelay = `${delay}s`;

        heartsBg.appendChild(heart);

        // Remove element after animation completes to avoid memory leak
        setTimeout(() => {
            heart.remove();
        }, (duration + delay) * 1000);
    }

    // Populate initial hearts and spawn periodically
    for (let i = 0; i < 15; i++) {
        createHeart();
    }
    setInterval(createHeart, 800);

    // Background photo slideshow cycler (fades every 5 seconds)
    const slides = document.querySelectorAll('.bg-slideshow .slide');
    let currentSlideIndex = 0;
    
    function nextSlide() {
        if (slides.length === 0) return;
        slides[currentSlideIndex].classList.remove('active');
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        slides[currentSlideIndex].classList.add('active');
    }
    
    if (slides.length > 0) {
        setInterval(nextSlide, 5000);
    }

    /* -----------------------------------------
       WEB AUDIO API SYNTHESIZER (SOUNDS)
    ----------------------------------------- */
    let audioCtx = null;

    function getAudioContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function playTone(freq, type, duration, delayTime = 0) {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = type || 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + delayTime);

            gain.gain.setValueAtTime(0, ctx.currentTime + delayTime);
            gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + delayTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delayTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(ctx.currentTime + delayTime);
            osc.stop(ctx.currentTime + delayTime + duration);
        } catch (e) {
            console.log("Audio failed to play", e);
        }
    }

    function playOpeningChime() {
        const time = 0.08;
        playTone(523.25, 'triangle', 0.4, 0);       // C5
        playTone(659.25, 'triangle', 0.4, time);     // E5
        playTone(783.99, 'triangle', 0.4, time * 2); // G5
        playTone(1046.50, 'triangle', 0.6, time * 3); // C6
    }

    function playSuccessChime() {
        const time = 0.06;
        playTone(523.25, 'sine', 0.3, 0);
        playTone(659.25, 'sine', 0.3, time);
        playTone(783.99, 'sine', 0.3, time * 2);
        playTone(1046.50, 'sine', 0.3, time * 3);
        playTone(1318.51, 'sine', 0.5, time * 4); // E6
        
        // Little harmony chord
        setTimeout(() => {
            playTone(1046.50, 'sine', 0.8, 0);
            playTone(1318.51, 'sine', 0.8, 0);
            playTone(1567.98, 'sine', 0.8, 0); // G6
        }, time * 4 * 1000);
    }

    function playDodgeBlip() {
        playTone(440, 'triangle', 0.1, 0);       // A4
        playTone(349.23, 'triangle', 0.15, 0.05); // F4
    }

    function playFlipSound() {
        playTone(600, 'sine', 0.15);
    }

    function playPopupSound() {
        playTone(880, 'sine', 0.25, 0);
        playTone(1100, 'sine', 0.3, 0.05);
    }

    /* -----------------------------------------
       ENVELOPE SCREEN INTERACTION
    ----------------------------------------- */
    envelope.addEventListener('click', () => {
        if (envelope.classList.contains('open')) return;

        // Try initializing audio context on click
        getAudioContext();
        
        envelope.classList.add('open');
        playOpeningChime();

        // After envelope opens, slide to letter card
        setTimeout(() => {
            envelopeScreen.classList.add('hidden-screen');
            envelopeScreen.classList.remove('active-screen');
            
            letterScreen.classList.remove('hidden-screen');
            letterScreen.classList.add('active-screen');
            
            startTypingEffect();
        }, 1300);
    });

    /* -----------------------------------------
       TYPEWRITER EFFECT ON CARD
    ----------------------------------------- */
    function startTypingEffect() {
        let index = 0;
        apologyMessage.innerHTML = '';
        
        // Typist effect
        const typingInterval = setInterval(() => {
            if (index < letterContent.length) {
                const char = letterContent[index];
                apologyMessage.innerHTML += char;
                index++;
                
                // Play subtle keyboard tap clicks
                if (index % 3 === 0 && Math.random() > 0.5) {
                    playTone(200 + Math.random() * 100, 'sine', 0.03);
                }
            } else {
                clearInterval(typingInterval);
                typedTextFinished = true;
            }
        }, 30);
    }

    /* -----------------------------------------
       "NO" BUTTON RUNAWAY LOGIC
    ----------------------------------------- */
    function dodgeButton(e) {
        getAudioContext();
        playDodgeBlip();
        
        noClickCount++;
        
        // Scale down the No button slightly or increase the Yes button size
        const scaleFactor = 1 + (noClickCount * 0.15);
        yesBtn.style.transform = `scale(${scaleFactor})`;
        
        // Random phrases update
        const currentPhraseIndex = Math.min(noClickCount, noPhrases.length - 1);
        noBtn.textContent = noPhrases[currentPhraseIndex];

        // Dodge alert text update
        if (dodgeAlert) {
            const currentAlertIndex = Math.min(noClickCount, alertPhrases.length - 1);
            dodgeAlert.textContent = alertPhrases[currentAlertIndex];
            dodgeAlert.style.animation = 'none';
            dodgeAlert.offsetHeight; /* trigger reflow */
            dodgeAlert.style.animation = 'alertPop 0.3s ease forwards';
        }

        // Button dimensions
        const btnRect = noBtn.getBoundingClientRect();
        
        // Calculate new coordinate bounds (keeping button fully visible)
        const maxX = window.innerWidth - btnRect.width - 20;
        const maxY = window.innerHeight - btnRect.height - 20;
        
        let newX = Math.random() * maxX;
        let newY = Math.random() * maxY;
        
        // Make sure it doesn't render directly under the mouse cursor
        const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
        
        // If it's too close to mouse, push it further away
        if (Math.abs(newX - clientX) < 100 && Math.abs(newY - clientY) < 100) {
            newX = (newX + 150) % maxX;
            newY = (newY + 150) % maxY;
        }

        // Apply style to make it dodge
        noBtn.classList.add('dodge');
        noBtn.style.left = `${newX}px`;
        noBtn.style.top = `${newY}px`;
    }

    // Dodging triggers on hover & touch
    noBtn.addEventListener('mouseover', dodgeButton);
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        dodgeButton(e);
    });

    // Just in case they click it (e.g. keyboard navigation)
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        dodgeButton(e);
    });

    /* -----------------------------------------
       "YES" BUTTON CELEBRATION TRIGGER
    ----------------------------------------- */
    yesBtn.addEventListener('click', () => {
        getAudioContext();
        playSuccessChime();

        letterScreen.classList.add('hidden-screen');
        letterScreen.classList.remove('active-screen');
        
        successScreen.classList.remove('hidden-screen');
        successScreen.classList.add('active-screen');
        
        // Trigger the confetti canvas animation
        setupConfetti();
        triggerBurst();
    });

    /* -----------------------------------------
       CONFETTI PHYSICS SYSTEM
    ----------------------------------------- */
    class ConfettiParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 8 + 6;
            this.color = ['#ff758f', '#ffc2d1', '#c8b6ff', '#b5e2fa', '#ffd166', '#06d6a0'][Math.floor(Math.random() * 6)];
            this.speedX = Math.random() * 10 - 5;
            this.speedY = Math.random() * -12 - 5; // Launch upward
            this.gravity = 0.25;
            this.drag = 0.98;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 10 - 5;
        }

        update() {
            this.speedX *= this.drag;
            this.speedY += this.gravity;
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }
    }

    function setupConfetti() {
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function triggerBurst() {
        const x = canvas.width / 2;
        const y = canvas.height * 0.7; // Burst upwards from letter position
        for (let i = 0; i < 150; i++) {
            confetti.push(new ConfettiParticle(x, y));
        }

        // Periodically add more confetti from top/sides for sustained celebration
        const celebrationInterval = setInterval(() => {
            if (successScreen.classList.contains('hidden-screen')) {
                clearInterval(celebrationInterval);
                return;
            }
            if (confetti.length < 50) {
                // Add random falls from top
                for (let i = 0; i < 5; i++) {
                    const particle = new ConfettiParticle(Math.random() * canvas.width, -10);
                    particle.speedY = Math.random() * 3 + 2;
                    confetti.push(particle);
                }
            }
        }, 300);

        animateConfetti();
    }

    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = confetti.length - 1; i >= 0; i--) {
            confetti[i].update();
            confetti[i].draw();
            
            // Remove particles that go off-screen
            if (confetti[i].y > canvas.height + 20) {
                confetti.splice(i, 1);
            }
        }
        
        animationId = requestAnimationFrame(animateConfetti);
    }

    /* -----------------------------------------
       LOVE COUPONS INTERACTION
    ----------------------------------------- */
    couponCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // If the user clicked the redeem button, handle it separately and prevent flip
            if (e.target.classList.contains('redeem-btn')) {
                e.stopPropagation();
                handleRedemption(this, e.target);
                return;
            }
            
            playFlipSound();
            this.classList.toggle('flipped');
        });
    });

    function handleRedemption(cardElement, btnElement) {
        if (cardElement.classList.contains('redeemed')) {
            showPopup("Already Redeemed!", "You've already claimed this ticket! Send a screenshot to redeem it! 🥰");
            return;
        }

        getAudioContext();
        playPopupSound();

        const couponName = btnElement.getAttribute('data-coupon');
        
        // Define personalized responses for each coupon
        let detailMessage = "";
        switch (couponName) {
            case "Churi (Bangles)":
                detailMessage = "A gorgeous set of colorful glass bangles to go clink-clink on your wrists and make you feel like an absolute princess! 👑💖";
                break;
            case "Hugs & Kisses":
                detailMessage = "You get unlimited, super tight, warm, and cozy cuddles + sweet forehead kisses all day long! 🤗❤️";
                break;
            case "Ice Cream":
                detailMessage = "I am taking you out for your favorite ice cream or sweet desserts! Double scoops, sweet toppings, and waffles are on me! 🍦🍨";
                break;
            case "Salami (Gift Money)":
                detailMessage = "A cute envelope filled with sweet Salami cash to spend on shopping, treats, or anything that makes you smile! 🧧💸✨";
                break;
            default:
                detailMessage = "This voucher entitles you to one cute request! 🎁";
        }

        // Show the custom dialog with thank you
        showPopup(
            "Ticket Redeemed! 🎟️", 
            `Thank you so much, Aria! ❤️\n\nWoohoo! You successfully claimed your ticket for: **"${couponName}"**.\n\n${detailMessage}\n\n📸 *Please take a screenshot of this redeemed ticket and send it to me right away!*`
        );

        // Mark as redeemed in interface
        cardElement.classList.add('redeemed');
        const badge = cardElement.querySelector('.coupon-badge');
        if (badge) {
            badge.textContent = "Redeemed ✔";
        }
        btnElement.textContent = "Claimed";
        btnElement.style.background = "#888";
        btnElement.style.cursor = "default";
    }

    /* -----------------------------------------
       CUSTOM POPUP MODAL
    ----------------------------------------- */
    function showPopup(title, message) {
        popupTitle.textContent = title;
        // Parse markdown style bullet points/bold text to HTML
        const htmlMessage = message
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
        
        popupMessage.innerHTML = htmlMessage;
        customPopup.classList.remove('hidden');
    }

    popupCloseBtn.addEventListener('click', () => {
        customPopup.classList.add('hidden');
        playTone(600, 'sine', 0.1);
    });

    // Close on clicking overlay outside content
    customPopup.addEventListener('click', (e) => {
        if (e.target === customPopup) {
            customPopup.classList.add('hidden');
        }
    });
});
