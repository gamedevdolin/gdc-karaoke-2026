const { useState, useEffect, useRef } = React;

// ============================================
// GDC KARAOKE NIGHT 2026 - TICKETING SITE
// ============================================

// Configuration - EDIT THESE VALUES BEFORE LAUNCH
const CONFIG = {
  eventDate: "Wednesday, March 11th, 2026",
  eventTime: "9:00 PM - 12:00 AM",
  venueName: "Pandora Karaoke",
  venueAddress: "50 Mason St, San Francisco, CA 94102",
  drinkTicketsIncluded: 2,
  stripePublicKey: "pk_test_REPLACE_WITH_YOUR_KEY", // Replace before launch
};

// Room Configuration - ADJUST PRICING HERE
const INITIAL_ROOMS = {
  mainStage: {
    id: 'mainStage',
    name: 'General Admission',
    description: 'Big stage. Big energy. The heart of the party.',
    capacity: 120,
    price: 35,
    tier: 'main',
    features: ['includes 2 drink tickets'],
  },
  mainStageSong: {
    id: 'mainStageSong',
    name: 'A Song on the Main Stage',
    description: 'An extra drink ticket + a guaranteed song on the big stage.',
    capacity: 20,
    price: 60,
    tier: 'main',
    features: ['includes 3 drink tickets', '1 song on the stage'],
  },
  small1: { id: 'small1', name: 'Bulleit Bourbon', capacity: 8, price: 45, roomPrice: 300, tier: 'small', backgroundImage: '/images/bulliet.jpg', features: ['Includes 3 Drink Tickets Per Guest']},
  small2: { id: 'small2', name: 'Doodle', capacity: 8, price: 45, roomPrice: 300, tier: 'small', backgroundImage: '/images/doodle.jpg', features: ['Includes 3 Drink Tickets Per Guest']},
  small3: { id: 'small3', name: 'Superhero', capacity: 8, price: 45, roomPrice: 300, tier: 'small', backgroundImage: '/images/superhero.jpg', features: ['Includes 3 Drink Tickets Per Guest']},
  medium1: { id: 'medium1', name: 'Patron', capacity: 15, price: 50, roomPrice: 650, tier: 'medium', backgroundImage: '/images/patron.jpg', features: ['Includes 3 Drink Tickets Per Guest']},
  medium2: { id: 'medium2', name: 'Warriors', capacity: 15, price: 50, roomPrice: 650, tier: 'medium', backgroundImage: '/images/dubs.jpg', features: ['Includes 3 Drink Tickets Per Guest']},
  medium3: { id: 'medium3', name: 'Jameson', capacity: 15, price: 50, roomPrice: 650, tier: 'medium', backgroundImage: '/images/jamie.jpg', features: ['Includes 3 Drink Tickets Per Guest']},
  medium4: { id: 'medium4', name: 'Johnnie Walker', capacity: 15, price: 50, roomPrice: 650, tier: 'medium', backgroundImage: '/images/johnny.jpg', features: ['Includes 3 Drink Tickets Per Guest']},
  medium5: { id: 'medium5', name: 'Ciroc', capacity: 15, price: 50, roomPrice: 650, tier: 'medium', backgroundImage: '/images/ciroc.jpg', features: ['Includes 3 Drink Tickets Per Guest']},
  medium6: { id: 'medium6', name: 'Grey Goose', capacity: 15, price: 50, roomPrice: 650, tier: 'medium', backgroundImage: '/images/greygoose.jpg', features: ['Includes 3 Drink Tickets Per Guest']},
  large1: { id: 'large1', name: 'Hennessy', capacity: 25, price: 55, roomPrice: 1200, tier: 'large', backgroundImage: '/images/henny.jpg', features: ['Includes 3 Drink Tickets Per Guest']},
  large2: { id: 'large2', name: 'Crown Royal', capacity: 25, price: 55, roomPrice: 1200, tier: 'large', backgroundImage: '/images/crown.jpg', features: ['Includes 3 Drink Tickets Per Guest']},
  large3: { id: 'large3', name: 'Absolut', capacity: 25, price: 55, roomPrice: 1200, tier: 'large', backgroundImage: '/images/absolut.jpg', features: ['Includes 3 Drink Tickets Per Guest']},
  large4: { id: 'large4', name: 'Cazadores', capacity: 25, price: 55, roomPrice: 1200, tier: 'large', backgroundImage: '/images/cazadores.jpg', features: ['Includes 3 Drink Tickets Per Guest']},
  large5: { id: 'large5', name: "D'Ussé", capacity: 25, price: 55, roomPrice: 1200, tier: 'large', backgroundImage: '/images/dusse.jpg', features: ['Includes 3 Drink Tickets Per Guest']},
  vip1: {
    id: 'vip1',
    name: 'The BIG Room',
    capacity: 30,
    price: 75,
    roomPrice: 2000,
    tier: 'vip',
    features: ['Includes 3 Drink Tickets Per Guest'],
    backgroundImage: '/images/BIGroom.jpg',
  },
};

// Styles
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap');
  
  :root {
    --neon-green: #00FF94;
    --neon-pink: #FF6B9D;
    --neon-blue: #00D4FF;
    --dark-bg: #0a0a0a;
    --card-bg: #1a1a1a;
    --card-hover: #252525;
    --text-primary: #ffffff;
    --text-secondary: #888888;
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Outfit', sans-serif;
    background: var(--dark-bg);
    color: var(--text-primary);
    min-height: 100vh;
  }
  
  .app {
    min-height: 100vh;
    background: 
      radial-gradient(ellipse at 20% 20%, rgba(0, 255, 148, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 80%, rgba(255, 107, 157, 0.08) 0%, transparent 50%),
      var(--dark-bg);
  }
  
  /* Starfield effect */
  .starfield {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    background-image: 
      radial-gradient(2px 2px at 20px 30px, white, transparent),
      radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
      radial-gradient(1px 1px at 90px 40px, white, transparent),
      radial-gradient(2px 2px at 160px 120px, rgba(255,255,255,0.9), transparent),
      radial-gradient(1px 1px at 230px 80px, white, transparent),
      radial-gradient(2px 2px at 300px 150px, rgba(255,255,255,0.7), transparent),
      radial-gradient(1px 1px at 370px 50px, white, transparent),
      radial-gradient(2px 2px at 450px 180px, rgba(255,255,255,0.8), transparent);
    background-size: 500px 200px;
    animation: twinkle 8s ease-in-out infinite;
    opacity: 0.4;
    z-index: 0;
  }
  
  @keyframes twinkle {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.6; }
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    position: relative;
    z-index: 1;
  }
  
  /* Header */
  .header {
    text-align: center;
    padding: 40px 0;
    position: relative;
    max-width: 900px;
    margin: 0 auto;
  }

  .header-background {
    position: relative;
    width: 100%;
    aspect-ratio: 640 / 840;
    background-image: url('/images/disco.png');
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
  }

  .header-background::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg,
      rgba(10, 10, 10, 0.75) 0%,
      rgba(10, 10, 10, 0.3) 30%,
      rgba(10, 10, 10, 0.3) 70%,
      rgba(10, 10, 10, 0.75) 100%
    );
    z-index: 1;
  }

  .header-content {
    position: relative;
    width: 90%;
    margin: 0 auto;
    z-index: 2;
    text-align: center;
  }

  .header .top-tagline {
    font-family: 'Space Mono', monospace;
    font-size: clamp(0.6rem, 1.8vw, 1rem);
    color: var(--neon-green);
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 15px;
    text-shadow:
      0 0 15px rgba(0, 255, 148, 1),
      0 0 30px rgba(0, 255, 148, 0.8),
      0 0 50px rgba(0, 255, 148, 0.6),
      0 0 80px rgba(0, 255, 148, 0.4),
      2px 2px 4px rgba(0, 0, 0, 0.9);
    animation: neonPulse 2s ease-in-out infinite;
  }

  @keyframes neonPulse {
    0%, 100% {
      text-shadow:
        0 0 15px rgba(0, 255, 148, 1),
        0 0 30px rgba(0, 255, 148, 0.8),
        0 0 50px rgba(0, 255, 148, 0.6),
        0 0 80px rgba(0, 255, 148, 0.4),
        2px 2px 4px rgba(0, 0, 0, 0.9);
    }
    50% {
      text-shadow:
        0 0 20px rgba(0, 255, 148, 1),
        0 0 40px rgba(0, 255, 148, 0.9),
        0 0 70px rgba(0, 255, 148, 0.7),
        0 0 100px rgba(0, 255, 148, 0.5),
        2px 2px 4px rgba(0, 0, 0, 0.9);
    }
  }

  .header h1 {
    font-size: clamp(2rem, 6vw, 4.5rem);
    font-weight: 900;
    letter-spacing: -2px;
    line-height: 1.1;
    margin: 0;
    white-space: nowrap;
  }

  .header h1 br {
    display: block;
  }

  .header h1 .green {
    color: var(--neon-green);
    text-shadow:
      0 0 20px rgba(0, 255, 148, 0.9),
      0 0 40px rgba(0, 255, 148, 0.6),
      3px 3px 6px rgba(0, 0, 0, 0.9),
      -1px -1px 0 rgba(0, 0, 0, 0.8);
  }

  .header h1 .white {
    color: white;
    text-shadow:
      0 0 10px rgba(255, 255, 255, 0.8),
      3px 3px 6px rgba(0, 0, 0, 0.9),
      -2px -2px 0 rgba(0, 0, 0, 0.5);
  }

  .header .date-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    position: absolute;
    bottom: 3.5%;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    z-index: 2;
  }

  .header .date-text {
    font-family: 'Outfit', sans-serif;
    font-size: clamp(0.8rem, 2.5vw, 1.4rem);
    font-weight: 700;
    color: black;
    background: var(--neon-green);
    padding: 2% 5%;
    letter-spacing: 1px;
    text-align: center;
    box-shadow:
      0 0 20px rgba(0, 255, 148, 0.6),
      0 4px 15px rgba(0, 0, 0, 0.5);
    border: 2px solid rgba(255, 255, 255, 0.3);
    animation: dateGlow 2s ease-in-out infinite;
  }

  .header .date-time {
    font-size: clamp(0.7rem, 2vw, 1.1rem);
    font-weight: 600;
    margin-top: 1%;
    color: black;
  }

  .header .subtitle {
    color: var(--text-secondary);
    margin-top: 25px;
    font-size: 1rem;
    font-weight: 300;
  }

  .header .scroll-hint {
    color: var(--neon-green);
    margin-top: 15px;
    font-size: 0.9rem;
    animation: bounce 2s ease-in-out infinite;
    text-shadow:
      0 0 10px rgba(0, 255, 148, 0.8),
      2px 2px 4px rgba(0, 0, 0, 0.9);
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(5px); }
  }

  @keyframes dateGlow {
    0%, 100% {
      box-shadow:
        0 0 15px rgba(0, 255, 148, 0.5),
        0 4px 15px rgba(0, 0, 0, 0.5);
    }
    50% {
      box-shadow:
        0 0 25px rgba(0, 255, 148, 0.8),
        0 0 40px rgba(0, 255, 148, 0.4),
        0 4px 15px rgba(0, 0, 0, 0.5);
    }
  }

  .date-row-standalone {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-bottom: 15px;
  }

  .date-row-standalone .mascot-left,
  .date-row-standalone .mascot-right {
    width: 80px;
    height: auto;
  }

  .date-row-standalone .mascot-left {
    margin-right: -10px;
  }

  .date-row-standalone .mascot-right {
    margin-left: -10px;
  }

  .date-row-standalone .date-text {
    font-family: 'Outfit', sans-serif;
    font-size: clamp(1.1rem, 2.5vw, 1.4rem);
    font-weight: 700;
    color: black;
    background: white;
    padding: 15px 30px;
    letter-spacing: 1px;
    text-align: center;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    border: 2px solid rgba(0, 0, 0, 0.1);
  }

  .date-row-standalone .date-time {
    font-size: clamp(0.95rem, 2vw, 1.1rem);
    font-weight: 600;
    margin-top: 5px;
    color: black;
  }

  @keyframes gentleRotate {
    0%, 100% { transform: rotate(-5deg); }
    50% { transform: rotate(5deg); }
  }

  /* Mascot Row */
  .mascot-row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 40px;
    margin: 20px 0;
  }

  .mascot-row img {
    width: 100px;
    height: auto;
  }


  .mascot-rotate {
    animation: gentleRotate 2s ease-in-out infinite;
  }

  .mascot-rotate-reverse {
    animation: gentleRotate 2s ease-in-out infinite;
    animation-delay: -1s;
  }
  
  @media (max-width: 600px) {
    .header {
      margin: 5px auto 30px;
    }

    .header-background {
      /* Removed padding override - keep default */
    }

    .header .date-row {
      /* Keep absolute positioning from parent styles */
      bottom: 3.5%;
    }

    .mascot-placeholder {
      width: 80px;
      height: 100px;
    }

    .header .date-row .mascots-mobile {
      display: flex;
      gap: 15px;
      order: 1;
    }

    .header .date-text {
      order: 0;
    }
  }
  
  /* Hero Slides Section */
  .hero-slides {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin: 60px auto 15px;
    max-width: 900px;
  }
  
  .hero-slide {
    width: 100%;
    aspect-ratio: 16 / 9;
    background: var(--card-bg);
    border: 1px solid #333;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }
  
  .hero-slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .hero-slide.disco-slide {
    aspect-ratio: auto;
    max-width: 640px;
    margin: 0 auto;
    height: auto;
  }

  .hero-slide.disco-slide img {
    object-fit: contain;
    height: auto;
  }

  .hero-slide.pandora-slide {
    aspect-ratio: auto;
    max-width: 900px;
    margin: 0 auto;
    height: auto;
    background: transparent;
    border: none;
    animation: pandoraGlow 2s ease-in-out infinite;
  }

  .hero-slide.pandora-slide img {
    object-fit: contain;
    height: auto;
    border-radius: 4px;
  }

  .hero-video {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    display: block;
    border-radius: 4px;
    animation: pandoraGlow 2s ease-in-out infinite;
  }

  @keyframes pandoraGlow {
    0%, 100% {
      filter: drop-shadow(0 0 10px rgba(0, 255, 148, 0.3))
              drop-shadow(0 0 20px rgba(0, 255, 148, 0.15));
    }
    50% {
      filter: drop-shadow(0 0 20px rgba(0, 255, 148, 0.5))
              drop-shadow(0 0 35px rgba(0, 255, 148, 0.25));
    }
  }
  
  .hero-slide .placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 15px;
    color: var(--text-secondary);
    font-family: 'Space Mono', monospace;
    font-size: 0.9rem;
  }
  
  .hero-slide .placeholder .slide-number {
    font-size: 3rem;
    font-weight: 800;
    color: var(--neon-green);
    opacity: 0.3;
  }
  
  .hero-slide:nth-child(2) .placeholder .slide-number {
    color: var(--neon-pink);
  }
  
  .hero-slide:nth-child(3) .placeholder .slide-number {
    color: var(--neon-blue);
  }

  /* Slide Text Boxes */
  .slide-text-boxes {
    display: flex;
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
  }

  .text-box {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 30px;
    font-family: 'Outfit', sans-serif;
    font-weight: 800;
    line-height: 1.3;
  }

  .text-box-content {
    text-align: center;
    font-size: clamp(1.8rem, 5vw, 3rem);
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .text-box-content.no-break-desktop br {
    display: block;
  }

  @media (min-width: 769px) {
    .text-box-content.no-break-desktop {
      font-size: clamp(1rem, 2vw, 1.8rem);
    }
  }

  .text-box-green {
    background: var(--neon-green);
    color: black;
    width: 100%;
    box-shadow:
      0 0 30px rgba(0, 255, 148, 0.4),
      inset 0 0 60px rgba(255, 255, 255, 0.1);
    border: 3px solid rgba(255, 255, 255, 0.3);
  }

  .text-box-white-black {
    background: white;
    color: black;
    width: 100%;
    box-shadow:
      0 0 30px rgba(255, 255, 255, 0.2),
      inset 0 0 60px rgba(0, 0, 0, 0.05);
    border: 3px solid rgba(0, 0, 0, 0.1);
  }

  .text-box-white-black s {
    text-decoration: line-through;
    text-decoration-thickness: 3px;
  }

  .two-column-boxes {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
  }

  @media (min-width: 769px) {
    .two-column-boxes {
      grid-template-columns: 1fr 1fr;
    }
  }

  .text-box-white {
    background: #e8e8e8;
    grid-column: 3 / 4;
  }

  .text-box-black {
    background: black;
    grid-column: 4 / 5;
  }

  .text-box-green-large {
    background: var(--neon-green);
    color: black;
    grid-column: 1 / 5;
    grid-row: 2 / 3;
  }

  .highlight-red {
    color: #ff0000;
    text-decoration: underline;
    text-decoration-thickness: 2px;
  }

  @media (max-width: 768px) {
    .slide-text-boxes {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto auto auto;
      aspect-ratio: auto;
    }

    .text-box-green {
      grid-column: 1;
      grid-row: 1;
      padding: 30px 20px;
    }

    .text-box-white {
      grid-column: 1;
      grid-row: 2;
      min-height: 40px;
    }

    .text-box-black {
      grid-column: 1;
      grid-row: 3;
      min-height: 40px;
    }

    .text-box-green-large {
      grid-column: 1;
      grid-row: 4;
      padding: 30px 20px;
    }

    .text-box-content {
      font-size: 1rem;
      text-align: center;
    }
  }

  /* Section Label */
  .section-label {
    text-align: center;
    font-size: 3rem;
    font-weight: 800;
    letter-spacing: 3px;
    color: var(--neon-green);
    margin: 15px 0;
  }
  
  /* Tab Navigation */
  .tab-nav {
    display: flex;
    justify-content: center;
    gap: 0;
    margin-bottom: 30px;
  }
  
  .tab-btn {
    background: var(--card-bg);
    border: 1px solid #333;
    color: var(--text-secondary);
    padding: 16px 40px;
    font-family: 'Outfit', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .tab-btn:first-child {
    border-right: none;
  }
  
  .tab-btn:hover {
    background: var(--card-hover);
  }
  
  .tab-btn.active {
    background: var(--neon-green);
    color: black;
    border-color: var(--neon-green);
  }
  
  /* Early Bird Banner */
  .early-bird-banner {
    background: linear-gradient(90deg, rgba(255, 107, 157, 0.2), rgba(0, 255, 148, 0.2));
    border: 1px solid var(--neon-pink);
    padding: 15px 25px;
    text-align: center;
    margin-bottom: 25px;
    font-family: 'Space Mono', monospace;
    font-size: 0.9rem;
    color: var(--neon-pink);
    letter-spacing: 1px;
  }
  
  /* Description Box */
  .description-box {
    background: var(--card-bg);
    border: 1px solid #333;
    padding: 12px 25px;
    margin-bottom: 15px;
    color: var(--text-secondary);
    line-height: 1.7;
    font-size: 0.95rem;
  }

  .description-box p {
    margin-bottom: 0.5em;
  }

  .description-box p:last-child {
    margin-bottom: 0;
  }

  /* Mobile-only line break using ::before pseudo-element */
  .mobile-br::before {
    content: ' ';
  }

  @media (max-width: 600px) {
    .mobile-br::before {
      content: '\\A';
      white-space: pre;
    }
  }
  
  /* Room Group Toggles */
  .room-group {
    margin-bottom: 15px;
    max-width: 550px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .room-group-header {
    background: var(--card-bg);
    border: 1px solid #333;
    padding: 18px 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .room-group-header:hover {
    background: var(--card-hover);
    border-color: #444;
  }
  
  .room-group-header.open {
    border-bottom: none;
    background: var(--card-hover);
  }
  
  .room-group-header h3 {
    font-size: 1.1rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 130px;
  }
  
  .room-group-header .tier-badge {
    font-family: 'Space Mono', monospace;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 4px 10px;
    background: rgba(0, 255, 148, 0.15);
    color: var(--neon-green);
  }
  
  .room-group-header .tier-badge.vip {
    background: rgba(0, 255, 148, 0.15);
    color: var(--neon-green);
  }

  .room-group-header .guest-count {
    font-size: 1rem;
    font-weight: 500;
    color: var(--text-primary);
    flex: 1;
    text-align: center;
    margin-right: 20px;
  }

  .room-group-header .group-meta {
    display: flex;
    align-items: center;
    gap: 20px;
    color: var(--text-secondary);
    font-size: 0.9rem;
  }
  
  .room-group-header .group-price {
    font-weight: 600;
    color: white;
  }
  
  .room-group-header .toggle-icon {
    font-size: 1.2rem;
    color: var(--text-secondary);
    transition: transform 0.2s ease;
    display: inline-block;
  }

  .room-group-header.open .toggle-icon {
    transform: rotate(90deg);
  }
  
  .room-group-content {
    background: #111;
    border: 1px solid #333;
    border-top: none;
    padding: 15px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
  }

  .room-group-content .room-card {
    margin: 0;
    position: relative;
    max-width: 900px;
  }

  .room-group-content .room-card.has-bg {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }

  .room-group-content .room-card.has-bg .room-name {
    max-width: 55%;
    word-wrap: break-word;
  }

  .room-group-content .room-card.has-bg .room-card-spots {
    max-width: 55%;
  }

  .room-group-content .room-card.has-bg::after {
    content: '';
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    width: 50%;
    height: 100%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-image: var(--room-bg);
    opacity: 0.9;
    z-index: 0;
    border-radius: 8px;
  }

  .room-group-content .room-card.has-bg > * {
    position: relative;
    z-index: 1;
  }

  /* Navigation */
  .nav {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin: 30px 0;
    flex-wrap: wrap;
  }
  
  .nav-btn {
    background: var(--card-bg);
    border: 1px solid #333;
    color: white;
    padding: 12px 24px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .nav-btn:hover {
    background: var(--card-hover);
    border-color: var(--neon-green);
  }
  
  .nav-btn.active {
    background: var(--neon-green);
    color: black;
    border-color: var(--neon-green);
  }
  
  /* Room Grid */
  .room-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    margin-top: 30px;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .room-card {
    background: var(--card-bg);
    border: 1px solid #333;
    padding: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .room-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, var(--neon-green), var(--neon-pink));
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  
  .room-card:hover {
    background: var(--card-hover);
    transform: translateY(-2px);
    border-color: #444;
  }
  
  .room-card:hover::before {
    transform: scaleX(1);
  }
  
  .room-card.featured {
    grid-column: 1 / -1;
    background: linear-gradient(135deg, var(--card-bg) 0%, #1f2f1f 100%);
    border-color: var(--neon-green);
  }
  
  .room-card.vip {
    background: var(--card-bg);
    border-color: #333;
  }

  .room-card.booked {
    pointer-events: none;
    position: relative;
  }

  .room-card.booked .booked-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.4) 100%);
    z-index: 5;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .room-card.booked .booked-label {
    background: linear-gradient(135deg, var(--neon-pink) 0%, #ff4477 100%);
    color: white;
    font-size: 1rem;
    font-weight: 800;
    letter-spacing: 0.15em;
    padding: 10px 28px;
    border-radius: 6px;
    box-shadow: 0 4px 20px rgba(255, 107, 157, 0.5), 0 0 40px rgba(255, 107, 157, 0.3);
    text-transform: uppercase;
  }

  .room-card.booked .room-name,
  .room-card.booked .room-description {
    opacity: 0.5;
  }

  .room-tier {
    font-family: 'Space Mono', monospace;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: var(--neon-green);
    margin-bottom: 8px;
  }
  
  .room-card.vip .room-tier { color: var(--neon-green); }
  
  .room-name {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 8px;
  }
  
  .room-description {
    color: var(--text-secondary);
    font-size: 0.95rem;
  }

  .room-card-spots {
    margin-top: 12px;
    font-size: 0.85rem;
    color: var(--text-secondary);
  }

  .room-card-spots .spots-count {
    font-weight: 600;
  }

  .room-card-spots .spots-count.available {
    color: var(--neon-green);
  }

  .room-card-spots .spots-count.low {
    color: #ffaa00;
  }

  .room-card-spots .spots-count.sold-out {
    color: var(--neon-pink);
  }
  
  .room-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #333;
  }
  
  .room-capacity {
    font-family: 'Space Mono', monospace;
    font-size: 0.85rem;
  }
  
  .room-capacity .available {
    color: var(--neon-green);
  }
  
  .room-capacity .sold-out {
    color: var(--neon-pink);
  }
  
  .room-price {
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .room-price span {
    font-size: 0.85rem;
    font-weight: 400;
    color: var(--text-secondary);
  }
  
  /* Room Detail View */
  .room-detail {
    background: var(--card-bg);
    border: 1px solid #333;
    padding: 40px;
    margin-top: 30px;
  }
  
  .room-detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 30px;
  }

  .room-detail-header .features-list {
    display: none;
  }
  
  .room-detail h2 {
    font-size: 2.5rem;
    font-weight: 800;
  }
  
  .room-detail .price-tag {
    background: var(--neon-green);
    color: black;
    padding: 15px 30px;
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .room-detail .price-tag span {
    font-size: 1rem;
    font-weight: 400;
  }

  .pricing-options {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 15px;
  }

  .pricing-or {
    color: var(--text-secondary);
    font-size: 0.9rem;
    font-weight: 400;
  }

  .room-detail .price-tag.room-price {
    background: transparent;
    border: 2px solid var(--neon-green);
    color: var(--neon-green);
  }

  @media (max-width: 768px) {
    .room-detail-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 15px;
    }

    .room-detail-header .features-list {
      display: flex;
      order: 2;
    }

    .room-detail-header .pricing-options,
    .room-detail-header > .price-tag {
      order: 3;
    }

    .room-detail-header > div:first-child {
      order: 1;
    }

    .room-detail .features-list.desktop-only {
      display: none;
    }

    .pricing-options {
      flex-direction: row;
      gap: 12px;
      width: 100%;
    }

    .pricing-options .price-tag {
      padding: 12px 16px;
      font-size: 1.2rem;
      flex: 1;
      text-align: center;
    }

    .pricing-options .price-tag span {
      font-size: 0.8rem;
      display: block;
      margin-top: 2px;
    }
  }

  .capacity-bar {
    background: #333;
    height: 12px;
    margin: 20px 0;
    position: relative;
    overflow: hidden;
  }
  
  .capacity-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--neon-green), var(--neon-blue));
    transition: width 0.5s ease;
  }
  
  .capacity-fill.warning {
    background: linear-gradient(90deg, #ffaa00, var(--neon-pink));
  }
  
  .capacity-fill.full {
    background: var(--neon-pink);
  }
  
  .capacity-text {
    font-family: 'Space Mono', monospace;
    margin-bottom: 30px;
    font-size: 1rem;
  }
  
  .features-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 20px 0 30px;
  }
  
  .feature-tag {
    background: rgba(0, 255, 148, 0.1);
    border: 1px solid rgba(0, 255, 148, 0.3);
    color: var(--neon-green);
    padding: 8px 16px;
    font-size: 0.85rem;
  }

  .feature-tag.capacity {
    background: rgba(255, 82, 82, 0.1);
    border: 1px solid rgba(255, 82, 82, 0.3);
    color: #FF5252;
  }

  /* Booking Form */
  .booking-form {
    background: #111;
    padding: 30px;
    margin-top: 30px;
  }
  
  .booking-form h3 {
    font-size: 1.3rem;
    margin-bottom: 20px;
    color: var(--neon-green);
  }
  
  .form-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin-bottom: 15px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  
  .form-group label {
    font-size: 0.85rem;
    color: var(--text-secondary);
    font-weight: 500;
  }
  
  .form-group input {
    background: var(--card-bg);
    border: 1px solid #333;
    padding: 14px 16px;
    font-size: 1rem;
    color: white;
    font-family: 'Outfit', sans-serif;
    transition: border-color 0.2s ease;
  }
  
  .form-group input:focus {
    outline: none;
    border-color: var(--neon-green);
  }
  
  .form-group input::placeholder {
    color: #555;
  }
  
  .quantity-selector {
    display: flex;
    align-items: center;
    gap: 15px;
    margin: 20px 0;
  }
  
  .quantity-btn {
    background: var(--card-bg);
    border: 1px solid #333;
    color: white;
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .quantity-btn:hover:not(:disabled) {
    background: var(--neon-green);
    color: black;
    border-color: var(--neon-green);
  }
  
  .quantity-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  .quantity-display {
    font-size: 2rem;
    font-weight: 700;
    min-width: 60px;
    text-align: center;
  }
  
  .total-price {
    font-size: 1.3rem;
    margin: 25px 0;
    padding: 20px;
    background: var(--card-bg);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .total-price .amount {
    font-size: 2rem;
    font-weight: 700;
    color: var(--neon-green);
  }
  
  .book-btn {
    background: var(--neon-green);
    color: black;
    border: none;
    padding: 18px 40px;
    font-size: 1.1rem;
    font-weight: 700;
    font-family: 'Outfit', sans-serif;
    cursor: pointer;
    width: 100%;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .book-btn:hover:not(:disabled) {
    background: white;
    transform: scale(1.02);
  }
  
  .book-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* Coming Soon / Signup Form */
  .coming-soon-section {
    text-align: center;
    padding: 30px;
    background: linear-gradient(135deg, rgba(0, 255, 148, 0.05) 0%, rgba(255, 107, 157, 0.05) 100%);
    border: 1px dashed #444;
  }
  
  .coming-soon-section h3 {
    font-size: 1.4rem;
    color: var(--neon-pink);
    margin-bottom: 8px;
  }
  
  .coming-soon-section .date {
    font-family: 'Space Mono', monospace;
    font-size: 1.1rem;
    color: var(--neon-green);
    margin-bottom: 20px;
  }
  
  .coming-soon-section p {
    color: var(--text-secondary);
    margin-bottom: 25px;
  }
  
  .signup-form {
    max-width: 400px;
    margin: 0 auto;
  }
  
  .signup-form .form-group {
    margin-bottom: 12px;
  }
  
  .signup-form input {
    width: 100%;
    background: var(--card-bg);
    border: 1px solid #333;
    padding: 12px 16px;
    font-size: 1rem;
    color: white;
    font-family: 'Outfit', sans-serif;
  }
  
  .signup-form input:focus {
    outline: none;
    border-color: var(--neon-green);
  }
  
  .signup-form input::placeholder {
    color: #555;
  }

  .signup-form .checkbox-group {
    margin-top: 16px;
    margin-bottom: 16px;
  }

  .signup-form .checkbox-label {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    color: var(--text-primary);
    font-size: 0.95rem;
  }

  .signup-form .checkbox-label input[type="checkbox"] {
    width: auto;
    height: 18px;
    width: 18px;
    cursor: pointer;
    accent-color: var(--neon-green);
  }

  .signup-form .checkbox-label span {
    user-select: none;
  }

  .signup-btn {
    background: var(--neon-green);
    color: black;
    border: none;
    padding: 14px 30px;
    font-size: 1rem;
    font-weight: 600;
    font-family: 'Outfit', sans-serif;
    cursor: pointer;
    width: 100%;
    margin-top: 10px;
    transition: all 0.2s ease;
  }
  
  .signup-btn:hover {
    background: white;
  }

  .privacy-notice {
    font-size: 0.7rem;
    color: var(--text-secondary);
    text-align: center;
    margin-top: 15px;
    opacity: 0.9;
  }

  .privacy-notice .mobile-break {
    display: none;
  }

  @media (max-width: 768px) {
    .privacy-notice .mobile-break {
      display: block;
    }
  }

  .signup-success {
    background: rgba(0, 255, 148, 0.1);
    border: 1px solid var(--neon-green);
    padding: 20px;
    text-align: center;
    color: var(--neon-green);
    font-weight: 500;
  }

  /* Hosts Page */
  .hosts-page {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px 0;
  }

  .hosts-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
    margin-top: 30px;
  }

  .host-card {
    background: var(--card-bg);
    border: 1px solid #333;
    padding: 30px;
    text-align: center;
    display: flex;
    flex-direction: column;
  }

  .host-info {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .host-bio:first-of-type {
    flex: 1;
  }

  .host-image {
    margin-bottom: 20px;
  }

  .host-image img {
    width: 280px;
    height: 280px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--neon-green);
  }

  .host-image-placeholder {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    color: #666;
    font-size: 0.9rem;
  }

  .host-info h3 {
    font-size: 1.5rem;
    margin-bottom: 15px;
    color: var(--neon-green);
  }

  .host-bio {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 20px;
  }

  .host-contact-row {
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .host-contact-btn {
    display: inline-block;
    color: var(--neon-green);
    text-decoration: none;
    padding: 10px 20px;
    border: 1px solid var(--neon-green);
    transition: all 0.2s ease;
    font-size: 0.9rem;
  }

  .host-contact-btn:hover {
    background: var(--neon-green);
    color: black;
  }

  @media (max-width: 768px) {
    .hosts-container {
      grid-template-columns: 1fr;
    }
  }

  /* Password Prompt */
  .password-prompt {
    max-width: 400px;
    margin: 50px auto;
    padding: 40px;
    background: var(--card-bg);
    border: 1px solid #333;
    text-align: center;
  }
  
  .password-prompt h3 {
    margin-bottom: 20px;
    color: var(--neon-pink);
  }
  
  .password-prompt input {
    width: 100%;
    background: #111;
    border: 1px solid #333;
    padding: 14px;
    color: white;
    font-family: 'Outfit', sans-serif;
    font-size: 1rem;
    margin-bottom: 15px;
  }
  
  .password-prompt input:focus {
    outline: none;
    border-color: var(--neon-green);
  }
  
  .password-prompt button {
    background: var(--neon-green);
    color: black;
    border: none;
    padding: 14px 30px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Outfit', sans-serif;
  }
  
  /* Subtle Admin Link */
  .admin-link {
    color: #666;
    font-size: 0.85rem;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.2s ease;
    padding: 10px;
  }
  
  .admin-link:hover {
    color: var(--neon-green);
  }
  
  .back-btn {
    background: transparent;
    border: 1px solid #333;
    color: white;
    padding: 12px 24px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.95rem;
    cursor: pointer;
    margin-bottom: 20px;
    transition: all 0.2s ease;
  }
  
  .back-btn:hover {
    border-color: var(--neon-green);
    color: var(--neon-green);
  }
  
  /* Share Link */
  .share-section {
    margin-top: 30px;
    padding: 20px;
    background: rgba(0, 255, 148, 0.05);
    border: 1px solid rgba(0, 255, 148, 0.2);
  }
  
  .share-section h4 {
    font-size: 0.9rem;
    color: var(--neon-green);
    margin-bottom: 10px;
    font-weight: 500;
  }
  
  .share-link {
    display: flex;
    gap: 10px;
  }
  
  .share-link input {
    flex: 1;
    background: var(--dark-bg);
    border: 1px solid #333;
    padding: 12px;
    color: white;
    font-family: 'Space Mono', monospace;
    font-size: 0.85rem;
  }
  
  .copy-btn {
    background: var(--neon-green);
    color: black;
    border: none;
    padding: 12px 20px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Outfit', sans-serif;
  }
  
  .copy-btn:hover {
    background: white;
  }
  
  /* Admin Panel */
  .admin-panel {
    margin-top: 30px;
  }
  
  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    flex-wrap: wrap;
    gap: 15px;
  }
  
  .admin-header h2 {
    font-size: 2rem;
    font-weight: 700;
  }
  
  .export-btn {
    background: var(--neon-pink);
    color: white;
    border: none;
    padding: 12px 24px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Outfit', sans-serif;
  }
  
  .export-btn:hover {
    background: white;
    color: black;
  }
  
  .admin-section {
    background: var(--card-bg);
    border: 1px solid #333;
    padding: 25px;
    margin-bottom: 20px;
  }
  
  .admin-section h3 {
    font-size: 1.2rem;
    margin-bottom: 20px;
    color: var(--neon-green);
  }
  
  .admin-room-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
  }
  
  .admin-room-card {
    background: #111;
    padding: 20px;
  }
  
  .admin-room-card h4 {
    font-size: 1rem;
    margin-bottom: 15px;
    font-weight: 600;
  }
  
  .admin-input-row {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
  }
  
  .admin-input-row label {
    font-size: 0.8rem;
    color: var(--text-secondary);
    width: 60px;
  }
  
  .admin-input-row input {
    flex: 1;
    background: var(--card-bg);
    border: 1px solid #333;
    padding: 8px 12px;
    color: white;
    font-family: 'Outfit', sans-serif;
    font-size: 0.9rem;
  }
  
  .admin-input-row input:focus {
    outline: none;
    border-color: var(--neon-green);
  }
  
  /* Guest List Table */
  .guest-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
  }
  
  .guest-table th,
  .guest-table td {
    text-align: left;
    padding: 12px 15px;
    border-bottom: 1px solid #333;
  }
  
  .guest-table th {
    background: #111;
    font-weight: 600;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-secondary);
  }
  
  .guest-table tr:hover td {
    background: rgba(0, 255, 148, 0.05);
  }
  
  /* Stats */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin-bottom: 30px;
  }
  
  .stat-card {
    background: #111;
    padding: 25px;
    text-align: center;
  }
  
  .stat-value {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--neon-green);
  }
  
  .stat-value.revenue {
    color: var(--neon-pink);
  }
  
  .stat-label {
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin-top: 5px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  /* Info Section */
  .info-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-top: 50px;
    padding-top: 40px;
    border-top: 1px solid #333;
  }
  
  .info-card {
    background: var(--card-bg);
    padding: 30px;
    border: 1px solid #333;
  }
  
  .info-card h3 {
    font-size: 1.1rem;
    margin-bottom: 15px;
    color: var(--neon-green);
  }
  
  .info-card p {
    color: var(--text-secondary);
    font-size: 0.95rem;
    line-height: 1.6;
  }
  
  /* Footer */
  .footer {
    text-align: center;
    padding: 60px 20px;
    color: var(--text-secondary);
    font-size: 0.9rem;
  }
  
  .footer a {
    color: var(--neon-green);
    text-decoration: none;
  }
  
  .footer a:hover {
    text-decoration: underline;
  }
  
  .hosts {
    margin-top: 20px;
    font-size: 0.85rem;
  }
  
  /* Success Modal */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal {
    background: var(--card-bg);
    padding: 50px;
    max-width: 500px;
    text-align: center;
    border: 1px solid var(--neon-green);
  }
  
  .modal h2 {
    font-size: 2rem;
    color: var(--neon-green);
    margin-bottom: 20px;
  }
  
  .modal p {
    color: var(--text-secondary);
    margin-bottom: 30px;
    line-height: 1.6;
  }
  
  .modal-btn {
    background: var(--neon-green);
    color: black;
    border: none;
    padding: 15px 40px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Outfit', sans-serif;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .container {
      padding: 15px;
    }
    
    .header {
      padding: 40px 15px 30px;
    }
    
    .room-detail {
      padding: 25px;
    }
    
    .room-detail h2 {
      font-size: 1.8rem;
    }
    
    .booking-form {
      padding: 20px;
    }
    
    .admin-section {
      padding: 20px;
    }
  }
`;

// Mock bookings data - empty for launch (will be replaced with real database)
const MOCK_BOOKINGS = [];

// Main App Component
function GDCKaraokeApp() {
  const [view, setView] = useState('home'); // home, room, admin
  const [activeTab, setActiveTab] = useState('private'); // 'main' or 'private'
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [showSuccess, setShowSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({
    small: false,
    medium: false,
    large: false,
    vip: false,
  });

  // Refs for room detail section
  const roomDetailRef = useRef(null);
  const backButtonRef = useRef(null);
  const tabNavRef = useRef(null);

  // Email signup state
  const [signups, setSignups] = useState([]);
  const [signupForm, setSignupForm] = useState({ name: '', email: '', company: '', reserveEntireRoom: false });
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  // Admin password protection
  const [adminPassword, setAdminPassword] = useState('');
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);

  // Load room data from database on mount
  React.useEffect(() => {
    const loadRoomData = async () => {
      try {
        const response = await fetch('/api/rooms');
        if (response.ok) {
          const data = await response.json();
          if (data.rooms) {
            setRooms(prev => {
              const updated = { ...prev };
              Object.keys(data.rooms).forEach(roomId => {
                if (updated[roomId]) {
                  const dbRoom = data.rooms[roomId];
                  updated[roomId] = {
                    ...updated[roomId],
                    booked: dbRoom.booked ?? updated[roomId].booked,
                    name: dbRoom.name ?? updated[roomId].name,
                    price: dbRoom.price ?? updated[roomId].price,
                    roomPrice: dbRoom.roomPrice ?? updated[roomId].roomPrice
                  };
                }
              });
              return updated;
            });
          }
        }
      } catch (error) {
        console.error('Failed to load room data:', error);
      }
    };
    loadRoomData();
  }, []);

  // Save room data to database
  const saveRoomToDatabase = async (roomId, field, value) => {
    if (!adminUnlocked) return;

    try {
      const payload = { roomId };
      if (field === 'booked') payload.booked = value;
      if (field === 'name') payload.name = value;
      if (field === 'price') payload.price = value;
      if (field === 'roomPrice') payload.roomPrice = value;

      await fetch('/api/update-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminPassword}`
        },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error('Failed to save room data:', error);
    }
  };

  // Update room and persist to database
  const updateRoomWithPersist = (roomId, field, value) => {
    updateRoom(roomId, field, value);
    saveRoomToDatabase(roomId, field, value);
  };

  // Check URL parameters on load to open specific room
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam && rooms[roomParam]) {
      setSelectedRoom(roomParam);
      setView('room');
      // Scroll to the room detail section after a brief delay for render
      setTimeout(() => {
        const roomDetail = document.querySelector('.room-detail');
        if (roomDetail) {
          roomDetail.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      }, 100);
    }
  }, []);

  // Toggle room group
  const toggleGroup = (group) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };
  
  // Handle email signup
  const handleSignup = async (e, roomId) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError('');

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupForm.name,
          email: signupForm.email,
          company: signupForm.company,
          room: roomId,
          roomName: rooms[roomId]?.name || roomId,
          reserveEntireRoom: signupForm.reserveEntireRoom,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      setSubmittedEmail(signupForm.email);
      setSignupSuccess(true);
      setSignupForm({ name: '', email: '', company: '', reserveEntireRoom: false });
      // Success message stays permanently to discourage multiple signups
    } catch (error) {
      setSignupError(error.message);
      alert('Signup failed: ' + error.message);
    } finally {
      setSignupLoading(false);
    }
  };

  // Fetch signups from database (admin only)
  const fetchSignups = async () => {
    try {
      const response = await fetch('/api/signups', {
        headers: { 'Authorization': `Bearer ${adminPassword}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch signups');
      }

      // Transform data to match existing format
      const formattedSignups = data.signups.map(s => ({
        id: s.id,
        name: s.name,
        email: s.email,
        company: s.company,
        room: s.room,
        roomName: s.room_name,
        reserveEntireRoom: s.reserve_entire_room,
        date: s.created_at?.split('T')[0] || '',
      }));

      setSignups(formattedSignups);
    } catch (error) {
      console.error('Failed to fetch signups:', error);
    }
  };

  // Export signups as CSV
  const exportSignups = () => {
    const headers = ['Name', 'Email', 'Company', 'Interested Room', 'Reserve Entire Room', 'Signup Date'];
    const rows = signups.map(s => [
      s.name,
      s.email,
      s.company,
      s.roomName,
      s.reserveEntireRoom ? 'Yes' : 'No',
      s.date,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gdc-karaoke-signups.csv';
    a.click();
  };

  // Check admin password by attempting to fetch signups
  const checkAdminPassword = async () => {
    setAdminLoading(true);
    try {
      const response = await fetch('/api/signups', {
        headers: { 'Authorization': `Bearer ${adminPassword}` },
      });

      if (response.ok) {
        const data = await response.json();
        // Transform and set signups
        const formattedSignups = data.signups.map(s => ({
          id: s.id,
          name: s.name,
          email: s.email,
          company: s.company,
          room: s.room,
          roomName: s.room_name,
          reserveEntireRoom: s.reserve_entire_room,
          date: s.created_at?.split('T')[0] || '',
        }));
        setSignups(formattedSignups);
        setAdminUnlocked(true);
      } else {
        alert('Incorrect password. Please try again.');
      }
    } catch (error) {
      alert('Error checking password. Please try again.');
    } finally {
      setAdminLoading(false);
    }
  };
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    quantity: 1,
  });
  
  // Calculate bookings per room
  const getBookedCount = (roomId) => {
    return bookings
      .filter(b => b.room === roomId)
      .reduce((sum, b) => sum + b.quantity, 0);
  };
  
  const getAvailableSpots = (roomId) => {
    return rooms[roomId].capacity - getBookedCount(roomId);
  };
  
  // Handle room selection
  const selectRoom = (roomId) => {
    setSelectedRoom(roomId);
    setFormData({ ...formData, quantity: 1 });
    setView('room');
    setTimeout(() => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        backButtonRef.current?.scrollIntoView({ behavior: 'instant', block: 'start' });
      } else {
        roomDetailRef.current?.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    }, 0);
  };

  // Handle back to home
  const goBackToHome = () => {
    setView('home');
    setTimeout(() => {
      tabNavRef.current?.scrollIntoView({ behavior: 'instant', block: 'start' });
    }, 0);
  };
  
  // Handle booking
  const handleBooking = (e) => {
    e.preventDefault();
    
    const room = rooms[selectedRoom];
    const newBooking = {
      id: bookings.length + 1,
      ...formData,
      room: selectedRoom,
      total: formData.quantity * room.price,
      date: new Date().toISOString().split('T')[0],
    };
    
    setBookings([...bookings, newBooking]);
    setShowSuccess(true);
    setFormData({ name: '', email: '', company: '', quantity: 1 });
  };
  
  // Update room config (admin)
  const updateRoom = (roomId, field, value) => {
    setRooms({
      ...rooms,
      [roomId]: {
        ...rooms[roomId],
        [field]: field === 'price' || field === 'capacity' ? parseInt(value) || 0 : value,
      },
    });
  };
  
  // Export guest list as CSV
  const exportGuestList = () => {
    const headers = ['Name', 'Email', 'Company', 'Room', 'Tickets', 'Total Paid', 'Booking Date'];
    const rows = bookings.map(b => [
      b.name,
      b.email,
      b.company,
      rooms[b.room]?.name || b.room,
      b.quantity,
      `$${b.total}`,
      b.date,
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gdc-karaoke-guestlist.csv';
    a.click();
  };
  
  // Copy share link
  const copyShareLink = () => {
    const link = `${window.location.origin}?room=${selectedRoom}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Stats calculations
  const totalGuests = bookings.reduce((sum, b) => sum + b.quantity, 0);
  const totalRevenue = bookings.reduce((sum, b) => sum + b.total, 0);
  const totalCapacity = Object.values(rooms).reduce((sum, r) => sum + r.capacity, 0);
  
  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="starfield" />
        
        <div className="container">
          {/* Header */}
          <header className="header">
            <div className="header-content">
              <h1 style={{ fontSize: 'clamp(4rem, 15vw, 10rem)', lineHeight: 0.95, textAlign: 'center' }}>
                <span className="white" style={{ display: 'block' }}>KARAOKE</span>
                <span className="white" style={{ display: 'block' }}>NIGHT</span>
                <span className="green" style={{ display: 'block', marginLeft: '-0.32em' }}>@GDC 2026</span>
              </h1>
            </div>

            {/* <p className="scroll-hint">↓ Keep scrolling ↓</p> */}
          </header>

          {/* Date Box with Mascots */}
          {view === 'home' && (
            <div className="date-row-standalone">
              <img src="/images/jigglypuff.png" alt="Jigglypuff" className="mascot-left mascot-rotate" />
              <div className="date-text">
                <div>WEDNESDAY, MARCH 11TH</div>
                <div className="date-time">9:00 PM - 12:00 AM</div>
                <a
                  href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=GDC+Karaoke+Night+2026&dates=20260311T210000/20260312T000000&ctz=America/Los_Angeles&details=Karaoke+party+at+Pandora+Karaoke+during+GDC+2026&location=Pandora+Karaoke,+50+Mason+St,+San+Francisco,+CA+94102"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.8rem', marginTop: '8px', color: '#000', textDecoration: 'none', display: 'inline-block' }}
                >
                  + Add to Calendar
                </a>
              </div>
              <img src="/images/caitsith.png" alt="Cait Sith" className="mascot-right mascot-rotate-reverse" />
            </div>
          )}

          {/* Hero Slides - Deck images */}
          <div className="hero-slides">
            {/* CSS Recreation of slide1 text */}
            <div className="slide-text-boxes">
              <div className="text-box text-box-green">
                <div className="text-box-content">
                  Forget all your troubles.<br/>Forget all your cares.<br/>Sing downtown at:
                </div>
              </div>
            </div>

            <video
              className="hero-video"
              autoPlay
              loop
              muted
              playsInline
              poster="/images/yunagroove_fallback.png"
            >
              <source src="/images/yunagroove.mp4" type="video/mp4" />
            </video>

            <div className="hero-slide pandora-slide">
              <img src="/images/PANDORA.png" alt="Pandora Karaoke" />
            </div>

            {/* Two column text boxes */}
            <div className="two-column-boxes">
              <div className="text-box text-box-green">
                <div className="text-box-content no-break-desktop">
                  Main stage upstairs.<br/>Private rooms downstairs.<br/>Full venue takeover.
                </div>
              </div>
              <div className="text-box text-box-white-black">
                <div className="text-box-content">
                  The Game Developer <s>Conference</s> Chorus
                </div>
              </div>
            </div>
          </div>

          {/* Book Tickets Label */}

          {/* Description Box */}
          {view === 'home' && (
            <div className="description-box" style={{ textAlign: 'center', maxWidth: 900, margin: '0 auto 15px' }}>
              <p style={{ marginBottom: 10, color: 'var(--neon-green)', fontWeight: 600, fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Welcome to the karaoke party page</p>
              <p>Reserve a private room with<span className="mobile-br"></span> your friends and colleagues.</p>
              <p>Or grab a spot in the Main Room<span className="mobile-br"></span>for general admission.</p>
              <p>Either way, it's gonna be<span className="mobile-br"></span>a really good party.</p>
            </div>
          )}


          {view === 'home' && (
            <p style={{ textAlign: 'center', color: '#ff6b6b', fontSize: '0.95rem', margin: '15px 0', fontStyle: 'italic', textShadow: '0 0 10px rgba(255, 107, 107, 0.4)' }}>
              The event will go live in mid-February, so grab your private rooms now!
            </p>
          )}

          <h2 className="section-label">RESERVE YOUR SPOT</h2>

          {/* Tab Navigation - Main Room on left, Private Rooms on right (but Private is default) */}
          {view === 'home' && (
            <nav className="tab-nav" ref={tabNavRef}>
              <button 
                className={`tab-btn ${activeTab === 'main' ? 'active' : ''}`}
                onClick={() => setActiveTab('main')}
              >
                Main Room
              </button>
              <button 
                className={`tab-btn ${activeTab === 'private' ? 'active' : ''}`}
                onClick={() => setActiveTab('private')}
              >
                Private Rooms
              </button>
            </nav>
          )}
          
          {/* Home View - Room Selection */}
          {view === 'home' && activeTab === 'main' && (
            <>
              <div className="room-grid">
                {/* Main Stage */}
                <div
                  className="room-card featured"
                  onClick={() => selectRoom('mainStage')}
                >
            
                  <h3 className="room-name">{rooms.mainStage.name}</h3>
                  <p className="room-description">{rooms.mainStage.description}</p>
                  <div className="features-list">
                    {rooms.mainStage.features?.map((f, i) => (
                      <span key={i} className="feature-tag">{f}</span>
                    ))}
                  </div>
                  <div className="room-meta">
                    <span className="room-capacity">
                      <span className={getAvailableSpots('mainStage') > 0 ? 'available' : 'sold-out'}>
                        {getAvailableSpots('mainStage')} spots left
                      </span> / {rooms.mainStage.capacity}
                    </span>
                    <span className="room-price">
                      ${rooms.mainStage.price} <span>/person</span>
                    </span>
                  </div>
                </div>
              </div>

              

              <div className="room-grid">
                {/* Main Stage + Song */}
                <div
                  className="room-card featured"
                  onClick={() => selectRoom('mainStageSong')}
                >
                  
                  <h3 className="room-name">{rooms.mainStageSong.name}</h3>
                  <p className="room-description">{rooms.mainStageSong.description}</p>
                  <div className="features-list">
                    {rooms.mainStageSong.features?.map((f, i) => (
                      <span key={i} className="feature-tag">{f}</span>
                    ))}
                  </div>
                  <div className="room-meta">
                    <span className="room-capacity">
                      <span className={getAvailableSpots('mainStageSong') > 0 ? 'available' : 'sold-out'}>
                        {getAvailableSpots('mainStageSong')} spots left
                      </span> / {rooms.mainStageSong.capacity}
                    </span>
                    <span className="room-price">
                      ${rooms.mainStageSong.price} <span>/person</span>
                    </span>
                  </div>
                </div>
                {/* Description Box */}
              <div className="description-box">
                Due to the length of the average karaoke song and the laws of time, only a limited number of singers will be allowed to grace the main stage. Sign up to be the first to know when tickets drop—Main Stage singers will receive more information in late February.
              </div>
              </div>
            </>
          )}
          
          {/* Home View - Private Rooms */}
          {view === 'home' && activeTab === 'private' && (
            <>
              {/* Small Rooms Group */}
              <div className="room-group">
                <div
                  className={`room-group-header ${expandedGroups.small ? 'open' : ''}`}
                  onClick={() => toggleGroup('small')}
                >
                  <h3>
                    <span className="tier-badge">Small Rooms</span>
                  </h3>
                  <span className="guest-count">Up to 8<br></br>Guests</span>
                  <div className="group-meta">
                    <span className="group-price">
                      ${rooms.small1.price}/person<br/>
                      <span style={{ fontSize: '0.7em', opacity: 0.5 }}>or</span><br/>
                      <span style={{ fontSize: '0.85em', opacity: 0.7 }}>${rooms.small1.roomPrice}/room</span>
                    </span>
                    <span className="toggle-icon">›</span>
                  </div>
                </div>
                {expandedGroups.small && (
                  <div className="room-group-content">
                    {['small1', 'small2', 'small3'].map(id => (
                      <div
                        key={id}
                        className={`room-card ${rooms[id].backgroundImage ? 'has-bg' : ''} ${rooms[id].booked ? 'booked' : ''}`}
                        style={rooms[id].backgroundImage ? { '--room-bg': `url(${rooms[id].backgroundImage})` } : {}}
                        onClick={() => !rooms[id].booked && selectRoom(id)}
                      >
                        {rooms[id].booked && (
                          <div className="booked-overlay">
                            <span className="booked-label">Booked</span>
                          </div>
                        )}
                        <h3 className="room-name">{rooms[id].name}</h3>
                        <p className="room-description">{rooms[id].description}</p>
                        <div className="room-card-spots">
                          <span className={`spots-count ${getAvailableSpots(id) === 0 ? 'sold-out' : getAvailableSpots(id) < 3 ? 'low' : 'available'}`}>
                            {getAvailableSpots(id)} spots left
                          </span> / {rooms[id].capacity}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Medium Rooms Group */}
              <div className="room-group">
                <div
                  className={`room-group-header ${expandedGroups.medium ? 'open' : ''}`}
                  onClick={() => toggleGroup('medium')}
                >
                  <h3>
                    <span className="tier-badge">Medium Rooms</span>
                  </h3>
                  <span className="guest-count">Up to 15<br></br>Guests</span>
                  <div className="group-meta">
                    <span className="group-price">
                      ${rooms.medium1.price}/person<br/>
                      <span style={{ fontSize: '0.7em', opacity: 0.5 }}>or</span><br/>
                      <span style={{ fontSize: '0.85em', opacity: 0.7 }}>${rooms.medium1.roomPrice}/room</span>
                    </span>
                    <span className="toggle-icon">›</span>
                  </div>
                </div>
                {expandedGroups.medium && (
                  <div className="room-group-content">
                    {['medium1', 'medium2', 'medium3', 'medium4', 'medium5', 'medium6'].map(id => (
                      <div
                        key={id}
                        className={`room-card ${rooms[id].backgroundImage ? 'has-bg' : ''} ${rooms[id].booked ? 'booked' : ''}`}
                        style={rooms[id].backgroundImage ? { '--room-bg': `url(${rooms[id].backgroundImage})` } : {}}
                        onClick={() => !rooms[id].booked && selectRoom(id)}
                      >
                        {rooms[id].booked && (
                          <div className="booked-overlay">
                            <span className="booked-label">Booked</span>
                          </div>
                        )}
                        <h3 className="room-name">{rooms[id].name}</h3>
                        <p className="room-description">{rooms[id].description}</p>
                        <div className="room-card-spots">
                          <span className={`spots-count ${getAvailableSpots(id) === 0 ? 'sold-out' : getAvailableSpots(id) < 3 ? 'low' : 'available'}`}>
                            {getAvailableSpots(id)} spots left
                          </span> / {rooms[id].capacity}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Large Rooms Group */}
              <div className="room-group">
                <div
                  className={`room-group-header ${expandedGroups.large ? 'open' : ''}`}
                  onClick={() => toggleGroup('large')}
                >
                  <h3>
                    <span className="tier-badge">Large Rooms</span>
                  </h3>
                  <span className="guest-count">Up to 25<br></br>Guests</span>
                  <div className="group-meta">
                    <span className="group-price">
                      ${rooms.large1.price}/person<br/>
                      <span style={{ fontSize: '0.7em', opacity: 0.5 }}>or</span><br/>
                      <span style={{ fontSize: '0.85em', opacity: 0.7 }}>${rooms.large1.roomPrice}/room</span>
                    </span>
                    <span className="toggle-icon">›</span>
                  </div>
                </div>
                {expandedGroups.large && (
                  <div className="room-group-content">
                    {['large1', 'large2', 'large3', 'large4', 'large5'].map(id => (
                      <div
                        key={id}
                        className={`room-card ${rooms[id].backgroundImage ? 'has-bg' : ''} ${rooms[id].booked ? 'booked' : ''}`}
                        style={rooms[id].backgroundImage ? { '--room-bg': `url(${rooms[id].backgroundImage})` } : {}}
                        onClick={() => !rooms[id].booked && selectRoom(id)}
                      >
                        {rooms[id].booked && (
                          <div className="booked-overlay">
                            <span className="booked-label">Booked</span>
                          </div>
                        )}
                        <h3 className="room-name">{rooms[id].name}</h3>
                        <p className="room-description">{rooms[id].description}</p>
                        <div className="room-card-spots">
                          <span className={`spots-count ${getAvailableSpots(id) === 0 ? 'sold-out' : getAvailableSpots(id) < 3 ? 'low' : 'available'}`}>
                            {getAvailableSpots(id)} spots left
                          </span> / {rooms[id].capacity}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* VIP Room Group */}
              <div className="room-group">
                <div
                  className={`room-group-header ${expandedGroups.vip ? 'open' : ''}`}
                  onClick={() => toggleGroup('vip')}
                >
                  <h3>
                    <span className="tier-badge vip">Largest Room</span>
                  </h3>
                  <span className="guest-count">Up to 30<br></br>Guests</span>
                  <div className="group-meta">
                    <span className="group-price">
                      ${rooms.vip1.price}/person<br/>
                      <span style={{ fontSize: '0.7em', opacity: 0.5 }}>or</span><br/>
                      <span style={{ fontSize: '0.85em', opacity: 0.7 }}>${rooms.vip1.roomPrice}/room</span>
                    </span>
                    <span className="toggle-icon">›</span>
                  </div>
                </div>
                {expandedGroups.vip && (
                  <div className="room-group-content">
                    {['vip1'].map(id => (
                      <div
                        key={id}
                        className={`room-card vip ${rooms[id].backgroundImage ? 'has-bg' : ''} ${rooms[id].booked ? 'booked' : ''}`}
                        style={rooms[id].backgroundImage ? { '--room-bg': `url(${rooms[id].backgroundImage})` } : {}}
                        onClick={() => !rooms[id].booked && selectRoom(id)}
                      >
                        {rooms[id].booked && (
                          <div className="booked-overlay">
                            <span className="booked-label">Booked</span>
                          </div>
                        )}
                        <h3 className="room-name">{rooms[id].name}</h3>
                        <p className="room-description">{rooms[id].description}</p>
                        <div className="room-card-spots">
                          <span className={`spots-count ${getAvailableSpots(id) === 0 ? 'sold-out' : getAvailableSpots(id) < 3 ? 'low' : 'available'}`}>
                            {getAvailableSpots(id)} spots left
                          </span> / {rooms[id].capacity}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Room Detail View */}
          {view === 'room' && selectedRoom && (
            <div className="room-detail" ref={roomDetailRef}>
              <button ref={backButtonRef} className="back-btn" onClick={goBackToHome}>
                ← Back to all rooms
              </button>
              
              <div className="room-detail-header">
                <div>
                  <div className="room-tier" style={{ marginBottom: 10 }}>
                    {rooms[selectedRoom].tier.toUpperCase()} ROOM
                  </div>
                  <h2>{rooms[selectedRoom].name}</h2>
                </div>
                {/* Features list - shown inside header on mobile */}
                {rooms[selectedRoom].features && (
                  <div className="features-list">
                    <span className="feature-tag">Up to {rooms[selectedRoom].capacity} Guests</span>
                    {rooms[selectedRoom].features.map((f, i) => (
                      <span key={i} className="feature-tag">{f}</span>
                    ))}
                  </div>
                )}
                {rooms[selectedRoom].roomPrice ? (
                  <div className="pricing-options">
                    <div className="price-tag">
                      ${rooms[selectedRoom].price} <span>/person</span>
                    </div>
                    <span className="pricing-or">or</span>
                    <div className="price-tag room-price">
                      ${rooms[selectedRoom].roomPrice} <span>for the entire room</span>
                    </div>
                  </div>
                ) : (
                  <div className="price-tag">
                    ${rooms[selectedRoom].price} <span>/person</span>
                  </div>
                )}
              </div>

              <p className="room-description" style={{ fontSize: '1.1rem', marginBottom: 20 }}>
                {rooms[selectedRoom].description}
              </p>

              {/* Features list - shown below description on desktop */}
              {rooms[selectedRoom].features && (
                <div className="features-list desktop-only">
                  <span className="feature-tag">Up to {rooms[selectedRoom].capacity} Guests</span>
                  {rooms[selectedRoom].features.map((f, i) => (
                    <span key={i} className="feature-tag">{f}</span>
                  ))}
                </div>
              )}
              

              {/* Capacity bar and counter */}
              <div className="capacity-bar">
                <div
                  className={`capacity-fill ${
                    getAvailableSpots(selectedRoom) < 5 ? 'warning' : ''
                  } ${getAvailableSpots(selectedRoom) === 0 ? 'full' : ''}`}
                  style={{
                    width: `${(getBookedCount(selectedRoom) / rooms[selectedRoom].capacity) * 100}%`
                  }}
                />
              </div>
              <p className="capacity-text">
                <strong style={{ color: getAvailableSpots(selectedRoom) > 0 ? 'var(--neon-green)' : 'var(--neon-pink)' }}>
                  {getAvailableSpots(selectedRoom)} spots available
                </strong>
                {' '}out of {rooms[selectedRoom].capacity} total capacity
              </p>

              {/* Purchase Section - placeholder for Stripe integration */}
              <div className="purchase-section" style={{ marginTop: 30, padding: 20, border: '1px dashed #444', borderRadius: 8, textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 15 }}>
                  Purchase buttons coming soon - Stripe integration in progress
                </p>
                {rooms[selectedRoom].roomPrice && (
                  <p style={{ fontSize: '0.9rem', color: '#666' }}>
                    Save ${(rooms[selectedRoom].price * rooms[selectedRoom].capacity) - rooms[selectedRoom].roomPrice} by booking the entire room!
                  </p>
                )}
              </div>
              <div className="share-section">
                <h4>Share this room with friends</h4>
                <div className="share-link">
                  <input 
                    type="text" 
                    readOnly 
                    value={`${window.location.origin}?room=${selectedRoom}`}
                  />
                  <button className="copy-btn" onClick={copyShareLink}>
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Admin Panel */}
          {view === 'admin' && !adminUnlocked && (
            <div className="password-prompt">
              <h3>🔒 Admin Access</h3>
              <input 
                type="password"
                placeholder="Enter password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') checkAdminPassword(); }}
              />
              <button type="button" onClick={checkAdminPassword}>Unlock</button>
              <p style={{ marginTop: 20, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <span className="admin-link" onClick={() => setView('home')}>← Back to site</span>
              </p>
            </div>
          )}
          
          {view === 'admin' && adminUnlocked && (
            <div className="admin-panel">
              <div className="admin-header">
                <h2>Admin Panel</h2>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="export-btn" onClick={exportSignups}>
                    Export Signups (CSV)
                  </button>
                  <button className="back-btn" onClick={() => { setView('home'); setAdminUnlocked(false); setAdminPassword(''); }}>
                    ← Back to site
                  </button>
                </div>
              </div>
              
              {/* Stats */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{signups.length}</div>
                  <div className="stat-label">Email Signups</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{totalCapacity}</div>
                  <div className="stat-label">Total Capacity</div>
                </div>
              </div>

              {/* Room Signup Breakdown */}
              <div className="admin-section" style={{ marginTop: 20 }}>
                <h3>Signups by Room</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 15, marginTop: 15 }}>
                  {Object.entries(rooms).map(([id, room]) => {
                    const roomSignups = signups.filter(s => s.room === id);
                    const entireRoomCount = roomSignups.filter(s => s.reserveEntireRoom).length;
                    return (
                      <div key={id} style={{
                        background: '#111',
                        padding: 15,
                        borderRadius: 8,
                        borderLeft: `3px solid ${room.tier === 'platinum' ? '#e5e4e2' : room.tier === 'gold' ? '#ffd700' : room.tier === 'silver' ? '#c0c0c0' : 'var(--neon-green)'}`
                      }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 5 }}>{room.tier.toUpperCase()}</div>
                        <div style={{ fontWeight: 600, marginBottom: 10 }}>{room.name}</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--neon-green)' }}>{roomSignups.length}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {entireRoomCount > 0 && <span style={{ color: 'var(--neon-pink)' }}>{entireRoomCount} want entire room</span>}
                          {entireRoomCount === 0 && 'signups'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Email Signups List */}
              <div className="admin-section">
                <h3>Email Signups ({signups.length})</h3>
                
                {signups.length > 0 ? (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="guest-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Company</th>
                          <th>Interested In</th>
                          <th>Entire Room</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {signups.map(signup => (
                          <tr key={signup.id}>
                            <td>{signup.name}</td>
                            <td>{signup.email}</td>
                            <td>{signup.company || '—'}</td>
                            <td>{signup.roomName}</td>
                            <td>{signup.reserveEntireRoom ? '✓ Yes' : '—'}</td>
                            <td>{signup.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-secondary)' }}>No signups yet.</p>
                )}
              </div>
              
              {/* Room Configuration */}
              <div className="admin-section">
                <h3>Room Configuration</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: '0.9rem' }}>
                  Adjust room names and pricing. Mark rooms as booked when sold.
                </p>

                {/* Group by size */}
                {['main', 'small', 'medium', 'large', 'vip'].map(tier => {
                  const tierRooms = Object.entries(rooms).filter(([_, r]) => r.tier === tier);
                  if (tierRooms.length === 0) return null;
                  const tierLabels = { main: 'Main Stage', small: 'Small Rooms (8 guests)', medium: 'Medium Rooms (15 guests)', large: 'Large Rooms (25 guests)', vip: 'VIP Room (30 guests)' };
                  return (
                    <div key={tier} style={{ marginBottom: 30 }}>
                      <h4 style={{
                        fontSize: '1rem',
                        color: tier === 'vip' ? '#ffd700' : tier === 'large' ? '#e5e4e2' : tier === 'medium' ? '#c0c0c0' : 'var(--neon-green)',
                        marginBottom: 15,
                        borderBottom: '1px solid #333',
                        paddingBottom: 10
                      }}>
                        {tierLabels[tier] || tier.toUpperCase()}
                      </h4>
                      <div className="admin-room-grid">
                        {tierRooms.map(([id, room]) => {
                          const roomSignupCount = signups.filter(s => s.room === id).length;
                          return (
                            <div key={id} className="admin-room-card" style={{
                              opacity: room.booked ? 0.6 : 1,
                              borderLeft: room.booked ? '3px solid var(--neon-pink)' : '3px solid transparent'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--neon-green)' }}>
                                  {roomSignupCount} signup{roomSignupCount !== 1 ? 's' : ''}
                                </span>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', cursor: 'pointer' }}>
                                  <input
                                    type="checkbox"
                                    checked={room.booked || false}
                                    onChange={(e) => { updateRoom(id, 'booked', e.target.checked); saveRoomToDatabase(id, 'booked', e.target.checked); }}
                                    style={{ cursor: 'pointer' }}
                                  />
                                  <span style={{ color: room.booked ? 'var(--neon-pink)' : 'var(--text-secondary)' }}>
                                    {room.booked ? 'BOOKED' : 'Booked?'}
                                  </span>
                                </label>
                              </div>
                              <div className="admin-input-row">
                                <label>Name:</label>
                                <input
                                  type="text"
                                  value={room.name}
                                  onChange={(e) => updateRoom(id, 'name', e.target.value)}
                                  onBlur={(e) => saveRoomToDatabase(id, 'name', e.target.value)}
                                />
                              </div>
                              <div className="admin-input-row">
                                <label>$/Guest:</label>
                                <input
                                  type="number"
                                  value={room.price}
                                  onChange={(e) => updateRoom(id, 'price', e.target.value)}
                                  onBlur={(e) => saveRoomToDatabase(id, 'price', parseInt(e.target.value) || 0)}
                                />
                              </div>
                              {room.roomPrice !== undefined && (
                                <div className="admin-input-row">
                                  <label>$/Room:</label>
                                  <input
                                    type="number"
                                    value={room.roomPrice}
                                    onChange={(e) => updateRoom(id, 'roomPrice', e.target.value)}
                                    onBlur={(e) => saveRoomToDatabase(id, 'roomPrice', parseInt(e.target.value) || 0)}
                                  />
                                </div>
                              )}
                              <div style={{ marginTop: 10, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                Capacity: {room.capacity}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {/* Info Section */}
          {view === 'home' && (
            <div className="info-section">
              <div className="info-card">
                <h3>📍 Venue</h3>
                <p>
                  <strong>{CONFIG.venueName}</strong><br/>
                  {CONFIG.venueAddress}<br/><br/>
                  0.5 miles from Moscone Center.
                </p>
                <p>Check out <a href="https://pandorakaraoke.com" style={{ color: 'var(--neon-green)' }}>Pandora Karaoke</a> for more info.
                </p>
              </div>
              <div className="info-card">
                <h3>🛡️ Safety First</h3>
                <p>
                  Sober hosts, drink covers provided, hearing protection available, and narcan on-site. We're here for good vibes, safe nights, and a zero-tolerance policy for harrassment, abuse, or unsettling behavior.
                </p>
              </div>
              <div className="info-card">
                <h3>Want to Sponsor?</h3>
                <p>
                  This event is independently organized by Adam Dolin / Cold Brew Sunset as a love letter to karaoke and the game dev community—no corporate backing, just a desire to throw a great party during GDC.
                </p>
                <p>
                  If you'd like to support the party and get your studio or brand in front of 400+ singing game developers, we're offering flexible sponsorship options, including signage and private room experiences.
                </p>
                <p>
                  Reach out to <a href="#" onClick={(e) => { e.preventDefault(); setView('hosts'); setTimeout(() => document.getElementById('hosts-title')?.scrollIntoView({ behavior: 'smooth' }), 100); }} style={{ color: 'var(--neon-green)' }}>the hosts</a> to learn more.
                </p>
              </div>
              <div className="info-card" style={{ border: '2px dashed #444', background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <p style={{ color: '#555', fontSize: '0.9rem', fontStyle: 'italic' }}>
                  This space for rent.<br/><br/>
                  <a href="#" onClick={(e) => { e.preventDefault(); setView('hosts'); setTimeout(() => document.getElementById('hosts-title')?.scrollIntoView({ behavior: 'smooth' }), 100); }} style={{ color: 'var(--neon-green)' }}>Contact the hosts</a> to put your company here.
                </p>
              </div>
            </div>
          )}

          {/* Hosts Page */}
          {view === 'hosts' && (
            <div className="hosts-page">
              <h2 id="hosts-title" className="section-label">Hi, we're your hosts!</h2>

              <button className="back-btn" onClick={() => setView('home')} style={{ display: 'block', margin: '0 auto 30px' }}>
                ← Back to home
              </button>

              <div className="hosts-container">
                {/* Adam's card */}
                <div className="host-card">
                  <div className="host-image">
                    <img src="/images/adamhost.png" alt="Adam Dolin" />
                  </div>
                  <div className="host-info">
                    <h3>Adam Dolin</h3>
                    <p className="host-bio">
                      {/* Add bio text here */}
                      Adam Dolin is a WGA and BAFTA-winning narrative designer and writer whose work includes God of War, Horizon: Forbidden West, and God of War: Ragnarök. With over 16 years in the game industry, he's collaborated with teams at Sony PlayStation, 2K, Activision, SEGA, and Netflix. He now runs Cold Brew Sunset, a narrative and UX consultancy helping teams craft memorable, player-driven stories.                    
                      </p>
                    <div className="host-contact-row">
                      <a href="mailto:adam@gamedevdolin.com" className="host-contact-btn">
                        Email
                      </a>
                      <a href="https://www.linkedin.com/in/adamdolin/" target="_blank" rel="noopener noreferrer" className="host-contact-btn">
                        LinkedIn
                      </a>
                    </div>
                    <p className="host-bio" style={{ marginTop: '20px' }}>
                      Go-to karaoke song: The Cranberries - Zombie
                    </p>
                  </div>
                </div>

                {/* Cristina's card */}
                <div className="host-card">
                  <div className="host-image">
                    <img src="/images/crishost.png" alt="Cristina Amaya" />
                  </div>
                  <div className="host-info">
                    <h3>Cristina Amaya</h3>
                    <p className="host-bio">
                      Cristina Amaya is currently the Head of Events strategy for experiential gaming agency, Moonrock which includes clients such as Tencent, Samsung and Walmart. She has a decade of experience in the gaming industry including Riot Games, Twitch and Unity. She's founded non profit Latinx in Gaming and is on the board of the Esports Awards.
                    </p>
                    <div className="host-contact-row">
                      <a href="mailto:sylvia.cristina.amaya@gmail.com" className="host-contact-btn">
                        Email
                      </a>
                      <a href="https://www.linkedin.com/in/silcris/" target="_blank" rel="noopener noreferrer" className="host-contact-btn">
                        LinkedIn
                      </a>
                    </div>
                    <p className="host-bio" style={{ marginTop: '20px' }}>
                      Go-to karaoke song: No Doubt - Spiderwebs
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="footer">
            <p>
              <strong>GDC Karaoke Night 2026</strong><p></p>{CONFIG.eventDate}<p></p>{CONFIG.eventTime}
            </p>
            <p className="hosts">
              Hosted by <a href="#" onClick={(e) => { e.preventDefault(); setView('hosts'); setTimeout(() => document.getElementById('hosts-title')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>Adam Dolin & Cristina Amaya</a>
            </p>
            <p style={{ marginTop: 15 }}>
              <span className="admin-link" onClick={() => setView('admin')}>•</span>
            </p>
          </footer>
        </div>
        
        {/* Success Modal - no longer used but keeping for future */}
      </div>
    </>
  );
}
