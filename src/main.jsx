import { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// ============================================
// GAME DEV KARAOKE 2026 - TICKETING SITE
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
    capacity: 100,
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
  small1: { id: 'small1', name: 'Bullet Bill', capacity: 8, price: 45, roomPrice: 300, tier: 'small', backgroundImage: '/images/bulliet.jpg', features: ['Includes 3 Drink Tickets Per Guest']},
  small2: { id: 'small2', name: 'Doodle Jump', capacity: 8, price: 45, roomPrice: 300, tier: 'small', backgroundImage: '/images/doodle.jpg', features: ['Includes 3 Drink Tickets Per Guest']},
  small3: { id: 'small3', name: 'Heated Rivalry', capacity: 8, price: 45, roomPrice: 300, tier: 'small', backgroundImage: '/images/superhero.jpg', features: ['Includes 3 Drink Tickets Per Guest']},
  medium1: { id: 'medium1', name: 'Kickstarter', capacity: 15, price: 50, roomPrice: 650, tier: 'medium', backgroundImage: '/images/patron.jpg', features: ['Includes 3 Drink Tickets Per Guest']},
  medium2: { id: 'medium2', name: 'Collosseum of Fools', capacity: 15, price: 50, roomPrice: 650, tier: 'medium', backgroundImage: '/images/dubs.jpg', features: ['Includes 3 Drink Tickets Per Guest']},
  medium3: { id: 'medium3', name: 'The Drunken Huntsman', capacity: 15, price: 50, roomPrice: 650, tier: 'medium', backgroundImage: '/images/jamie.jpg', features: ['Includes 3 Drink Tickets Per Guest']},
  medium4: { id: 'medium4', name: '7th Heaven', capacity: 15, price: 50, roomPrice: 650, tier: 'medium', backgroundImage: '/images/johnny.jpg', features: ['Includes 3 Drink Tickets Per Guest']},
  medium5: { id: 'medium5', name: 'Croc (Legend of the Gobos)', capacity: 15, price: 50, roomPrice: 650, tier: 'medium', backgroundImage: '/images/ciroc.jpg', features: ['Includes 3 Drink Tickets Per Guest']},
  medium6: { id: 'medium6', name: 'Untitled Karaoke Room', capacity: 15, price: 50, roomPrice: 650, tier: 'medium', backgroundImage: '/images/greygoose.jpg', features: ['Includes 3 Drink Tickets Per Guest']},
  large1: { id: 'large1', name: 'Crypto Night', capacity: 25, price: 55, roomPrice: 1200, tier: 'large', backgroundImage: '/images/henny.jpg', features: ['Includes 3 Drink Tickets Per Guest']},
  large2: { id: 'large2', name: 'Royal Match', capacity: 25, price: 55, roomPrice: 1200, tier: 'large', backgroundImage: '/images/crown.jpg', features: ['Includes 3 Drink Tickets Per Guest']},
  large3: { id: 'large3', name: 'The Honeybee Inn', capacity: 25, price: 55, roomPrice: 1200, tier: 'large', backgroundImage: '/images/absolut.jpg', features: ['Includes 3 Drink Tickets Per Guest']},
  large4: { id: 'large4', name: 'Calavera Cafe', capacity: 25, price: 55, roomPrice: 1200, tier: 'large', backgroundImage: '/images/cazadores.jpg', features: ['Includes 3 Drink Tickets Per Guest']},
  large5: { id: 'large5', name: 'The Last Drop', capacity: 25, price: 55, roomPrice: 1200, tier: 'large', backgroundImage: '/images/dusse.jpg', features: ['Includes 3 Drink Tickets Per Guest']},
  vip1: {
    id: 'vip1',
    name: 'Room 46',
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

  /* Desktop: keep KARAOKE NIGHT on one line */
  .karaoke-night-line {
    white-space: nowrap;
  }

  .mobile-break {
    display: none;
  }

  .mobile-space {
    display: inline;
  }

  /* Mobile: allow wrapping, show line break, and reduce font size */
  @media (max-width: 600px) {
    .header h1 {
      font-size: clamp(3rem, 16vw, 5rem) !important;
    }
    .header h1 .header-date {
      font-size: clamp(2rem, 12vw, 3.5rem) !important;
    }
    .karaoke-night-line {
      white-space: normal;
    }
    .mobile-break {
      display: block;
    }
    .mobile-space {
      display: none;
    }
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
    margin-right: 50px;
  }

  .date-row-standalone .mascot-right {
    margin-left: 50px;
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

  .date-row-standalone .date-text.time-only {
    padding: 12px 25px;
  }

  .date-row-standalone .date-text.time-only .date-time {
    margin-top: 0;
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

    .date-row-standalone .mascot-left {
      margin-right: -10px;
    }

    .date-row-standalone .mascot-right {
      margin-left: -10px;
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

  .reserve-spot-label {
    animation: reservePulse 2s ease-in-out infinite;
  }

  @keyframes reservePulse {
    0%, 100% {
      text-shadow:
        0 0 15px rgba(0, 255, 148, 1),
        0 0 30px rgba(0, 255, 148, 0.8),
        0 0 50px rgba(0, 255, 148, 0.6),
        0 0 80px rgba(0, 255, 148, 0.4),
        2px 2px 4px rgba(0, 0, 0, 0.9);
      transform: scale(1);
    }
    50% {
      text-shadow:
        0 0 20px rgba(0, 255, 148, 1),
        0 0 40px rgba(0, 255, 148, 0.9),
        0 0 70px rgba(0, 255, 148, 0.7),
        0 0 100px rgba(0, 255, 148, 0.5),
        2px 2px 4px rgba(0, 0, 0, 0.9);
      transform: scale(1.05);
    }
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

    .description-box {
      padding: 12px 15px;
    }

    .description-box .description-line {
      font-size: clamp(0.7rem, 2.8vw, 0.95rem);
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
    position: relative;
    cursor: pointer;
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
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .room-card.booked .booked-label .default-text {
    display: inline;
  }

  .room-card.booked .booked-label .hover-text {
    display: none;
  }

  .room-card.booked .booked-label:hover {
    background: linear-gradient(135deg, var(--neon-green) 0%, #00cc77 100%);
    box-shadow: 0 4px 20px rgba(0, 255, 148, 0.5), 0 0 40px rgba(0, 255, 148, 0.3);
  }

  .room-card.booked .booked-label:hover .default-text {
    display: none;
  }

  .room-card.booked .booked-label:hover .hover-text {
    display: inline;
  }

  .room-card.booked .room-name,
  .room-card.booked .room-description {
    opacity: 0.5;
  }

  /* Waitlist Modal */
  .waitlist-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }

  .waitlist-modal {
    background: var(--card-bg);
    border-radius: 16px;
    padding: 32px;
    max-width: 450px;
    width: 100%;
    border: 1px solid #333;
    position: relative;
  }

  .waitlist-modal h2 {
    color: var(--neon-green);
    margin-bottom: 8px;
    font-size: 1.5rem;
  }

  .waitlist-modal .room-name-subtitle {
    color: var(--text-secondary);
    margin-bottom: 24px;
    font-size: 1rem;
  }

  .waitlist-modal .close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 4px 8px;
    line-height: 1;
  }

  .waitlist-modal .close-btn:hover {
    color: white;
  }

  .waitlist-modal form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .waitlist-modal label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .waitlist-modal input {
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid #333;
    background: #1a1a1a;
    color: white;
    font-size: 1rem;
  }

  .waitlist-modal input:focus {
    outline: none;
    border-color: var(--neon-green);
  }

  .waitlist-modal .quantity-input {
    width: 80px;
  }

  .waitlist-modal button[type="submit"] {
    background: linear-gradient(135deg, var(--neon-green) 0%, #00cc77 100%);
    color: black;
    font-weight: 700;
    padding: 14px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    margin-top: 8px;
    transition: all 0.2s ease;
  }

  .waitlist-modal button[type="submit"]:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 255, 148, 0.4);
  }

  .waitlist-modal button[type="submit"]:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .waitlist-modal .success-message {
    text-align: center;
    padding: 20px;
  }

  .waitlist-modal .success-message h3 {
    color: var(--neon-green);
    margin-bottom: 12px;
  }

  .waitlist-modal .error-message {
    color: var(--neon-pink);
    font-size: 0.9rem;
    text-align: center;
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

  .card-note {
    font-size: 0.8rem;
    color: var(--text-secondary);
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #333;
    line-height: 1.5;
    font-style: italic;
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
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
  }

  .room-detail-content {
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 30px;
    align-items: start;
  }

  .room-detail-left {
    display: flex;
    flex-direction: column;
  }

  .room-detail-image {
    width: 100%;
    height: auto;
    border-radius: 8px;
    object-fit: cover;
    aspect-ratio: 4 / 3;
  }

  .room-detail-image-mobile {
    display: none;
  }

  .room-detail-header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
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

  /* Price button styles */
  .price-btn {
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    font-family: inherit;
  }

  .price-btn:hover:not(:disabled) {
    transform: scale(1.02);
    box-shadow: 0 0 20px rgba(0, 255, 148, 0.4);
  }

  .price-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .price-btn.room-price {
    border: 2px solid var(--neon-green);
  }

  .price-btn.room-price:hover:not(:disabled) {
    background: rgba(0, 255, 148, 0.1);
  }

  .pricing-options-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .savings-text {
    font-size: 0.85rem;
    color: var(--neon-green);
    margin-top: 15px;
    text-align: left;
  }

  .attendee-notice {
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin-top: 15px;
    text-align: left;
    line-height: 1.4;
    opacity: 0.8;
    max-width: 600px;
  }

  .presale-banner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
    background: linear-gradient(135deg, rgba(0, 255, 148, 0.15) 0%, rgba(255, 107, 157, 0.15) 100%);
    border: 2px solid var(--neon-green);
    border-radius: 12px;
    padding: 16px 24px;
    margin: 20px auto;
    max-width: 700px;
    animation: bannerGlow 2s ease-in-out infinite;
  }

  @keyframes bannerGlow {
    0%, 100% {
      box-shadow: 0 0 20px rgba(0, 255, 148, 0.3), inset 0 0 20px rgba(0, 255, 148, 0.05);
    }
    50% {
      box-shadow: 0 0 30px rgba(0, 255, 148, 0.5), inset 0 0 30px rgba(0, 255, 148, 0.1);
    }
  }

  .presale-badge {
    background: var(--neon-green);
    color: #000;
    font-weight: 800;
    font-size: 0.85rem;
    padding: 12px 20px;
    border-radius: 6px;
    letter-spacing: 1px;
    text-transform: uppercase;
    animation: badgePulse 1.5s ease-in-out infinite;
    text-align: center;
    line-height: 1.4;
  }

  @keyframes badgePulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  .presale-text {
    font-size: 1.1rem;
    color: var(--text-primary);
  }

  .presale-text strong {
    color: var(--neon-green);
    text-shadow: 0 0 10px rgba(0, 255, 148, 0.5);
  }

  @media (max-width: 768px) {
    .room-detail-content {
      grid-template-columns: 1fr;
    }

    .room-detail-image {
      display: none;
    }

    .room-detail-image-mobile {
      display: block;
      width: 100%;
      max-width: 400px;
      margin: 20px auto;
      border-radius: 8px;
      aspect-ratio: 4 / 3;
      object-fit: cover;
    }

    .room-detail-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 15px;
    }

    .room-detail-header .features-list {
      display: flex;
      order: 2;
      margin-bottom: 0;
    }

    .room-detail-header .pricing-options-wrapper {
      order: 3;
      display: flex;
      flex-direction: column;
    }

    .room-detail-header .pricing-options-wrapper .savings-text {
      order: 1;
    }

    .room-detail-header .pricing-options-wrapper .attendee-notice {
      order: 2;
    }

    .room-detail-header .pricing-options-wrapper .pricing-options {
      order: 3;
    }

    .room-detail-header .pricing-options,
    .room-detail-header > .price-tag,
    .room-detail-header > button.price-tag {
      order: 3;
    }

    .room-detail-header > div:first-child {
      order: 1;
    }

    .room-detail .features-list.desktop-only {
      display: none;
    }

    .pricing-options-wrapper {
      width: 100%;
      align-items: center;
    }

    .savings-text {
      text-align: center;
      margin-top: 18px;
    }

    .attendee-notice {
      text-align: center;
      margin-top: 18px;
      margin-bottom: 20px;
      max-width: none;
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

    .presale-banner {
      flex-direction: column;
      gap: 8px;
      padding: 14px 18px;
      text-align: center;
    }

    .presale-text {
      font-size: 1rem;
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

  .legal-links {
    margin-top: 15px;
    font-size: 0.8rem;
  }

  .legal-links a {
    color: var(--text-secondary);
  }

  .legal-links a:hover {
    color: var(--neon-green);
  }

  .footer-content {
    position: relative;
    max-width: 900px;
    margin: 0 auto;
  }

  .footer-main {
    text-align: center;
  }

  .footer-logo {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  @media (max-width: 768px) {
    .footer-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 30px;
    }

    .footer-logo {
      position: static;
      transform: none;
      order: 1;
    }
  }

  .footer-logo-img {
    max-width: 150px;
    height: auto;
    opacity: 0.7;
    transition: opacity 0.2s ease;
  }

  .footer-logo-img:hover {
    opacity: 1;
  }

  /* Legal Pages (Privacy & Terms) */
  .legal-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    color: var(--text-primary);
    line-height: 1.7;
  }

  .legal-page h1 {
    font-size: 2rem;
    margin-bottom: 10px;
    color: var(--neon-green);
  }

  .legal-page h2 {
    font-size: 1.3rem;
    margin-top: 30px;
    margin-bottom: 15px;
    color: var(--text-primary);
  }

  .legal-page p {
    margin-bottom: 15px;
    color: var(--text-secondary);
  }

  .legal-page ul {
    margin-bottom: 15px;
    padding-left: 25px;
  }

  .legal-page li {
    margin-bottom: 10px;
    color: var(--text-secondary);
  }

  .legal-page strong {
    color: var(--text-primary);
  }

  .legal-updated {
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin-bottom: 30px;
    opacity: 0.7;
  }

  /* Success Page */
  .success-page {
    max-width: 600px;
    margin: 0 auto;
    padding: 40px 20px;
    text-align: center;
  }

  .success-content {
    background: rgba(0, 0, 0, 0.6);
    border: 2px solid var(--neon-green);
    border-radius: 16px;
    padding: 40px 30px;
  }

  .success-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--neon-green);
    color: #000;
    font-size: 48px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 25px;
  }

  .success-page h1 {
    font-size: 2rem;
    color: var(--neon-green);
    margin-bottom: 15px;
  }

  .success-subtitle {
    font-size: 1.1rem;
    color: var(--text-primary);
    margin-bottom: 30px;
  }

  .success-details {
    text-align: left;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 30px;
  }

  .success-details h3 {
    font-size: 1rem;
    color: var(--neon-green);
    margin-bottom: 15px;
  }

  .success-details ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .success-details li {
    color: var(--text-secondary);
    margin-bottom: 10px;
    padding-left: 20px;
    position: relative;
  }

  .success-details li::before {
    content: "•";
    color: var(--neon-green);
    position: absolute;
    left: 0;
  }

  .success-details strong {
    color: var(--text-primary);
  }

  .success-actions {
    display: flex;
    gap: 15px;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 25px;
  }

  .success-actions .btn-primary {
    background: var(--neon-green);
    color: #000;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    font-size: 1rem;
  }

  .success-actions .btn-secondary {
    background: transparent;
    color: var(--text-primary);
    border: 1px solid var(--text-secondary);
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    font-size: 1rem;
  }

  .success-actions .btn-secondary:hover {
    border-color: var(--neon-green);
    color: var(--neon-green);
  }

  .success-note {
    font-size: 0.9rem;
    color: var(--text-secondary);
  }

  .success-note a {
    color: var(--neon-green);
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
  const [view, setView] = useState('home'); // home, room, admin, privacy, terms
  const [activeTab, setActiveTab] = useState('main'); // 'main' or 'private'
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [showSuccess, setShowSuccess] = useState(false);
  const [purchaseInfo, setPurchaseInfo] = useState(null);
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

  // Stripe checkout state
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [orderCounts, setOrderCounts] = useState({}); // { roomId: { bookedCount, hasEntireRoomBooking } }

  // Orders state for admin panel
  const [orders, setOrders] = useState([]);
  const [archivedOrders, setArchivedOrders] = useState([]);
  const [orderStats, setOrderStats] = useState({ paid_count: 0, pending_count: 0, total_revenue: 0, total_tickets: 0 });
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [stripeBalance, setStripeBalance] = useState(null);

  // Waitlist state
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [waitlistRoom, setWaitlistRoom] = useState(null);
  const [waitlistForm, setWaitlistForm] = useState({ fullName: '', email: '', quantity: 1 });
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const [waitlistError, setWaitlistError] = useState('');

  // Order table sort/filter state
  const [orderSort, setOrderSort] = useState({ field: 'created_at', direction: 'desc' });
  const [orderFilter, setOrderFilter] = useState('');
  const [selectedOrders, setSelectedOrders] = useState(new Set());

  // Waitlist admin state
  const [waitlistEntries, setWaitlistEntries] = useState([]);
  const [selectedWaitlist, setSelectedWaitlist] = useState(new Set());

  // Email compose modal state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailTo, setEmailTo] = useState([]);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');

  const CACHE_KEY = 'gdc_room_availability';

  // Apply room data from API response
  const applyRoomData = (data) => {
    const newOrderCounts = {};
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
            roomPrice: dbRoom.roomPrice ?? updated[roomId].roomPrice,
            capacity: dbRoom.capacity ?? updated[roomId].capacity
          };
          // Store order counts separately (includes override)
          newOrderCounts[roomId] = {
            bookedCount: dbRoom.bookedCount || 0,
            hasEntireRoomBooking: dbRoom.hasEntireRoomBooking || false,
            bookedOverride: dbRoom.bookedOverride ?? null
          };
        }
      });
      return updated;
    });
    setOrderCounts(newOrderCounts);
  };

  // Fetch fresh room availability data (clears cache)
  const refreshRoomData = async () => {
    try {
      sessionStorage.removeItem(CACHE_KEY);
      const response = await fetch('/api/room-availability');
      if (response.ok) {
        const data = await response.json();
        if (data.rooms) {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({
            data: data,
            timestamp: Date.now()
          }));
          applyRoomData(data);
        }
      }
    } catch (error) {
      console.error('Failed to load room data:', error);
    }
  };

  // Load room data and availability from database on mount (with caching)
  useEffect(() => {
    const CACHE_DURATION = 60000; // 60 seconds

    const loadRoomData = async () => {
      try {
        // Check for cached data first
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            // Use cached data
            applyRoomData(data);
            return;
          }
        }

        // Fetch fresh data
        await refreshRoomData();
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
      if (field === 'capacity') payload.capacity = value;
      if (field === 'bookedOverride') payload.bookedOverride = value;

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

  // Check URL parameters on load to open specific room or page
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    const viewParam = params.get('view');
    const successParam = params.get('success');
    const canceledParam = params.get('canceled');
    const isTestPurchase = params.get('test') === 'true';

    // Handle successful payment redirect
    if (successParam === 'true') {
      // Clear room availability cache so fresh data is fetched
      sessionStorage.removeItem('gdc_room_availability');

      const purchasedRoom = roomParam && rooms[roomParam] ? rooms[roomParam] : null;
      const quantity = parseInt(params.get('qty')) || 1;
      const isEntireRoom = params.get('entire') === '1';
      const isMainStageSong = roomParam === 'mainStageSong';

      setPurchaseInfo({
        roomName: purchasedRoom?.name || (isTestPurchase ? 'Test Purchase' : 'Game Dev Karaoke'),
        roomId: roomParam,
        isTest: isTestPurchase,
        quantity: quantity,
        isEntireRoom: isEntireRoom,
        isMainStageSong: isMainStageSong
      });
      setView('success');
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }

    // Handle canceled payment
    if (canceledParam === 'true') {
      // Just go back to home, could show a message
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }

    // Handle direct links to privacy/terms pages
    if (viewParam === 'privacy' || viewParam === 'terms') {
      setView(viewParam);
      window.scrollTo(0, 0);
      return;
    }

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

  // Fetch orders from database (admin only)
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const response = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${adminPassword}` },
      });

      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders || []);
        setArchivedOrders(data.archivedOrders || []);
        setOrderStats(data.stats || { paid_count: 0, pending_count: 0, total_revenue: 0, total_tickets: 0 });
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch orders without updating revenue (preserves revenue total)
  const fetchOrdersOnly = async () => {
    try {
      const response = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${adminPassword}` },
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(data.orders || []);
        setArchivedOrders(data.archivedOrders || []);
        // Update counts but preserve revenue
        setOrderStats(prev => ({
          ...prev,
          paid_count: data.stats?.paid_count ?? prev.paid_count,
          pending_count: data.stats?.pending_count ?? prev.pending_count,
          total_tickets: data.stats?.total_tickets ?? prev.total_tickets,
          // revenue intentionally NOT updated
        }));
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  // Fetch waitlist entries (admin only)
  const fetchWaitlist = async () => {
    try {
      const response = await fetch('/api/waitlist', {
        headers: { 'Authorization': `Bearer ${adminPassword}` },
      });
      const data = await response.json();
      if (response.ok) {
        setWaitlistEntries(data.waitlist || []);
      }
    } catch (error) {
      console.error('Failed to fetch waitlist:', error);
    }
  };

  // Fetch Stripe balance (admin only)
  const fetchStripeBalance = async () => {
    try {
      const response = await fetch('/api/stripe-balance', {
        headers: { 'Authorization': `Bearer ${adminPassword}` },
      });
      const data = await response.json();
      if (response.ok) {
        setStripeBalance(data.balance);
      }
    } catch (error) {
      console.error('Failed to fetch Stripe balance:', error);
    }
  };

  // Refresh all admin data (rooms, orders, signups, waitlist, stripe balance)
  const [refreshing, setRefreshing] = useState(false);
  const refreshAdminData = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refreshRoomData(), fetchOrders(), fetchSignups(), fetchWaitlist(), fetchStripeBalance()]);
    } finally {
      setRefreshing(false);
    }
  };

  // Refresh after delete/reset (preserves revenue)
  const refreshAfterChange = async () => {
    await Promise.all([refreshRoomData(), fetchOrdersOnly()]);
  };

  // Reset orders for a single room (admin only)
  const resetRoomOrders = async (roomId) => {
    const roomName = rooms[roomId]?.name || roomId;
    const count = orderCounts[roomId]?.bookedCount || 0;
    if (!confirm(`Reset all orders for "${roomName}"? This will archive ${count} ticket(s). Buyer info will be preserved in the Archived Orders section.`)) {
      return;
    }

    try {
      const response = await fetch('/api/reset-room-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminPassword}`
        },
        body: JSON.stringify({ roomId })
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        await refreshAfterChange();
      } else {
        alert('Failed to reset room: ' + data.error);
      }
    } catch (error) {
      console.error('Failed to reset room orders:', error);
      alert('Failed to reset room orders');
    }
  };

  // Delete a single order (admin only, preserves revenue)
  const deleteOrder = async (orderId, buyerName) => {
    if (!confirm(`Delete order for "${buyerName || 'unknown'}"? This cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch('/api/delete-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminPassword}`
        },
        body: JSON.stringify({ orderId })
      });

      const data = await response.json();

      if (response.ok) {
        await refreshAfterChange();
      } else {
        alert('Failed to delete order: ' + data.error);
      }
    } catch (error) {
      console.error('Failed to delete order:', error);
      alert('Failed to delete order');
    }
  };

  // Email functions
  const openEmailModal = (recipients) => {
    setEmailTo(Array.isArray(recipients) ? recipients : [recipients]);
    setEmailSubject('');
    setEmailBody('');
    setEmailSuccess(false);
    setEmailError('');
    setShowEmailModal(true);
  };

  const closeEmailModal = () => {
    setShowEmailModal(false);
    setEmailTo([]);
    setEmailSubject('');
    setEmailBody('');
    setEmailSuccess(false);
    setEmailError('');
  };

  const sendEmail = async () => {
    if (!emailSubject.trim() || !emailBody.trim()) {
      setEmailError('Subject and body are required');
      return;
    }

    setEmailSending(true);
    setEmailError('');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminPassword}`
        },
        body: JSON.stringify({
          to: emailTo,
          subject: emailSubject,
          html: emailBody.replace(/\n/g, '<br>')
        })
      });

      const data = await response.json();

      if (response.ok) {
        setEmailSuccess(true);
      } else {
        setEmailError(data.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Send email error:', error);
      setEmailError('Failed to send email');
    } finally {
      setEmailSending(false);
    }
  };

  // Test purchase ($0.50) - admin only
  const [testPurchaseLoading, setTestPurchaseLoading] = useState(false);
  const createTestPurchase = async () => {
    if (!confirm('This will create a real $0.50 charge to test the Stripe integration. Continue?')) {
      return;
    }

    setTestPurchaseLoading(true);
    try {
      const response = await fetch('/api/create-test-checkout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${adminPassword}` },
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to create test checkout: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Test purchase error:', error);
      alert('Failed to create test purchase');
    } finally {
      setTestPurchaseLoading(false);
    }
  };

  // Export attendees as CSV
  const exportAttendees = () => {
    const paidOrders = orders.filter(o => o.payment_status === 'paid');
    const headers = ['Name', 'Email', 'Company', 'Room', 'Tickets', 'Total Paid', 'Entire Room', 'Purchase Date'];
    const rows = paidOrders.map(o => [
      o.buyer_name || '',
      o.buyer_email || '',
      o.buyer_company || '',
      rooms[o.room_id]?.name || o.room_id,
      o.quantity,
      '$' + o.total_amount,
      o.is_entire_room ? 'Yes' : 'No',
      o.created_at?.split('T')[0] || '',
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gdc-karaoke-attendees.csv';
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
        // Also fetch orders, waitlist, and stripe balance
        fetchOrders();
        fetchWaitlist();
        fetchStripeBalance();
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
  
  // Calculate bookings per room (uses override if set, otherwise real order data)
  const getBookedCount = (roomId) => {
    const override = orderCounts[roomId]?.bookedOverride;
    if (override !== null && override !== undefined) {
      return override;
    }
    return orderCounts[roomId]?.bookedCount || 0;
  };

  const getAvailableSpots = (roomId) => {
    // If entire room is booked, no spots available
    if (orderCounts[roomId]?.hasEntireRoomBooking) {
      return 0;
    }
    return rooms[roomId].capacity - getBookedCount(roomId);
  };

  // Handle Stripe checkout
  const handleCheckout = async (isEntireRoom = false, roomId = null) => {
    const targetRoom = roomId || selectedRoom;
    if (!targetRoom) return;

    const room = rooms[targetRoom];
    const quantity = isEntireRoom ? room.capacity : formData.quantity;
    const unitPrice = isEntireRoom ? room.roomPrice : room.price;

    setCheckoutLoading(true);

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: targetRoom,
          roomName: room.name,
          quantity,
          unitPrice,
          isEntireRoom,
          roomCapacity: room.capacity
        })
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else if (data.error) {
        alert(data.error);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
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

  // Open waitlist modal for a booked room
  const openWaitlistModal = (roomId) => {
    setWaitlistRoom(roomId);
    setWaitlistForm({ fullName: '', email: '', quantity: 1 });
    setWaitlistSuccess(false);
    setWaitlistError('');
    setShowWaitlistModal(true);
  };

  // Close waitlist modal
  const closeWaitlistModal = () => {
    setShowWaitlistModal(false);
    setWaitlistRoom(null);
    setWaitlistForm({ fullName: '', email: '', quantity: 1 });
    setWaitlistSuccess(false);
    setWaitlistError('');
  };

  // Submit waitlist form
  const submitWaitlist = async (e) => {
    e.preventDefault();
    if (!waitlistRoom || !waitlistForm.fullName || !waitlistForm.email) return;

    setWaitlistLoading(true);
    setWaitlistError('');

    try {
      const response = await fetch('/api/join-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: waitlistRoom,
          roomName: rooms[waitlistRoom]?.name || waitlistRoom,
          email: waitlistForm.email,
          fullName: waitlistForm.fullName,
          quantity: waitlistForm.quantity
        })
      });

      const data = await response.json();

      if (data.success) {
        setWaitlistSuccess(true);
      } else {
        setWaitlistError(data.error || 'Failed to join waitlist');
      }
    } catch (error) {
      console.error('Waitlist error:', error);
      setWaitlistError('Failed to join waitlist. Please try again.');
    } finally {
      setWaitlistLoading(false);
    }
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
              <h1 style={{ fontSize: 'clamp(4rem, 18vw, 10rem)', lineHeight: 0.95, textAlign: 'center' }}>
                <span className="green glow karaoke-night-line" style={{ display: 'block' }}>GAME DEV<br className="mobile-break" /><span className="mobile-space"> </span>KARAOKE</span>
                <span className="white karaoke-night-line header-date" style={{ display: 'block', fontSize: 'clamp(2.5rem, 12vw, 6rem)', marginTop: '0.2em' }}>WEDNESDAY,<br className="mobile-break" /><span className="mobile-space"> </span>MARCH 11TH</span>
              </h1>
            </div>

            {/* <p className="scroll-hint">↓ Keep scrolling ↓</p> */}
          </header>

          {/* Date Box with Mascots */}
          {view === 'home' && (
            <div className="date-row-standalone">
              <img src="/images/jigglypuff.png" alt="Jigglypuff" className="mascot-left mascot-rotate" />
              <div className="date-text time-only">
                <div className="date-time" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', fontWeight: 700 }}>9:00 PM - 12:00 AM</div>
                <a
                  href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Game+Dev+Karaoke+2026&dates=20260311T210000/20260312T000000&ctz=America/Los_Angeles&details=Game+Dev+Karaoke+party+at+Pandora+Karaoke+during+GDC+2026&location=Pandora+Karaoke,+50+Mason+St,+San+Francisco,+CA+94102"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.9rem', marginTop: '6px', color: '#000', textDecoration: 'none', display: 'inline-block' }}
                >
                  + Add to Calendar
                </a>
              </div>
              <img src="/images/caitsith.png" alt="Cait Sith" className="mascot-right mascot-rotate-reverse" />
            </div>
          )}

          {/* Hero Slides - Deck images */}
          {view === 'home' && (
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
          )}

          {/* Book Tickets Label */}

          {/* Description Box */}
          {view === 'home' && (
            <div className="description-box" style={{ textAlign: 'center', maxWidth: 900, margin: '0 auto 15px' }}>
              <p style={{ marginBottom: 10, color: 'var(--neon-green)', fontWeight: 600, fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Welcome to the Karaoke Party Page!</p>
              <p className="description-line" style={{ whiteSpace: 'nowrap', marginBottom: 8 }}>Reserve a private room with your friends and colleagues.</p>
              <p className="description-line" style={{ whiteSpace: 'nowrap', marginBottom: 8 }}>Or grab a spot in the Main Room for general admission.</p>
              <p className="description-line" style={{ whiteSpace: 'nowrap' }}>Either way, it's gonna be a really good party.</p>
            </div>
          )}


          {view === 'home' && (
            <h2 className="section-label reserve-spot-label">RESERVE YOUR SPOT</h2>
          )}

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
                  className={`room-card featured ${checkoutLoading ? 'loading' : ''}`}
                  onClick={() => {
                    if (checkoutLoading || getAvailableSpots('mainStage') === 0) return;
                    handleCheckout(false, 'mainStage');
                  }}
                  style={{ cursor: checkoutLoading || getAvailableSpots('mainStage') === 0 ? 'not-allowed' : 'pointer', opacity: getAvailableSpots('mainStage') === 0 ? 0.6 : 1 }}
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
                  className={`room-card featured ${checkoutLoading ? 'loading' : ''}`}
                  onClick={() => {
                    if (checkoutLoading || getAvailableSpots('mainStageSong') === 0) return;
                    handleCheckout(false, 'mainStageSong');
                  }}
                  style={{ cursor: checkoutLoading || getAvailableSpots('mainStageSong') === 0 ? 'not-allowed' : 'pointer', opacity: getAvailableSpots('mainStageSong') === 0 ? 0.6 : 1 }}
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
                  <p className="card-note">
                    Due to the length of the average karaoke song and the laws of time, only these 20 singers will be guaranteed a spot on the main stage. Main Stage singers will receive more information in late February.
                  </p>
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
                        onClick={() => rooms[id].booked ? openWaitlistModal(id) : selectRoom(id)}
                      >
                        {rooms[id].booked && (
                          <div className="booked-overlay">
                            <span className="booked-label">
                              <span className="default-text">Booked</span>
                              <span className="hover-text">Join Waitlist</span>
                            </span>
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
                        onClick={() => rooms[id].booked ? openWaitlistModal(id) : selectRoom(id)}
                      >
                        {rooms[id].booked && (
                          <div className="booked-overlay">
                            <span className="booked-label">
                              <span className="default-text">Booked</span>
                              <span className="hover-text">Join Waitlist</span>
                            </span>
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
                        onClick={() => rooms[id].booked ? openWaitlistModal(id) : selectRoom(id)}
                      >
                        {rooms[id].booked && (
                          <div className="booked-overlay">
                            <span className="booked-label">
                              <span className="default-text">Booked</span>
                              <span className="hover-text">Join Waitlist</span>
                            </span>
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
                        onClick={() => rooms[id].booked ? openWaitlistModal(id) : selectRoom(id)}
                      >
                        {rooms[id].booked && (
                          <div className="booked-overlay">
                            <span className="booked-label">
                              <span className="default-text">Booked</span>
                              <span className="hover-text">Join Waitlist</span>
                            </span>
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

              <div className="room-detail-content">
                <div className="room-detail-left">
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
                      <div className="pricing-options-wrapper">
                        <div className="pricing-options">
                          <button
                            className="price-tag price-btn"
                            onClick={() => handleCheckout(false)}
                            disabled={checkoutLoading || getAvailableSpots(selectedRoom) === 0}
                          >
                            ${rooms[selectedRoom].price} <span>/person</span>
                          </button>
                          <span className="pricing-or">or</span>
                          <button
                            className="price-tag room-price price-btn"
                            onClick={() => handleCheckout(true)}
                            disabled={checkoutLoading || getAvailableSpots(selectedRoom) === 0}
                          >
                            ${rooms[selectedRoom].roomPrice} <span>for the entire room</span>
                          </button>
                        </div>
                        <p className="savings-text">
                          Save ${(rooms[selectedRoom].price * rooms[selectedRoom].capacity) - rooms[selectedRoom].roomPrice} by booking the entire room!
                          <br/>
                          <span style={{ display: 'block', fontSize: '0.9em', opacity: 0.8, marginTop: '4px' }}>(you also get to change the name if you want)</span>
                        </p>
                        <p className="attendee-notice">
                          By booking an entire room, you agree to provide a full list of attendees prior to the event. As a GDC affiliated event, we are required to maintain a complete guest list for safety purposes.
                        </p>
                      </div>
                    ) : (
                      <button
                        className="price-tag price-btn"
                        onClick={() => handleCheckout(false)}
                        disabled={checkoutLoading || getAvailableSpots(selectedRoom) === 0}
                      >
                        ${rooms[selectedRoom].price} <span>/person</span>
                      </button>
                    )}
                  </div>

                  {/* Features list - shown below description on desktop */}
                  {rooms[selectedRoom].features && (
                    <div className="features-list desktop-only">
                      <span className="feature-tag">Up to {rooms[selectedRoom].capacity} Guests</span>
                      {rooms[selectedRoom].features.map((f, i) => (
                        <span key={i} className="feature-tag">{f}</span>
                      ))}
                    </div>
                  )}

                  {/* Mobile image - shown below pricing on mobile */}
                  {rooms[selectedRoom].backgroundImage && (
                    <img
                      src={rooms[selectedRoom].backgroundImage}
                      alt={rooms[selectedRoom].name}
                      className="room-detail-image-mobile"
                      loading="lazy"
                    />
                  )}
                </div>

                {/* Desktop image - shown on right side */}
                {rooms[selectedRoom].backgroundImage && (
                  <img
                    src={rooms[selectedRoom].backgroundImage}
                    alt={rooms[selectedRoom].name}
                    className="room-detail-image"
                    loading="lazy"
                  />
                )}
              </div>

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
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    className="export-btn"
                    onClick={refreshAdminData}
                    disabled={refreshing}
                    style={{ opacity: refreshing ? 0.6 : 1 }}
                  >
                    {refreshing ? 'Refreshing...' : 'Refresh Data'}
                  </button>
                  <button className="export-btn" onClick={exportAttendees}>
                    Export Attendees (CSV)
                  </button>
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
                  <div className="stat-value" style={{ color: 'var(--neon-green)' }}>
                    ${stripeBalance ? stripeBalance.totalCharged.toFixed(2) : orderStats.total_revenue}
                  </div>
                  <div className="stat-label">
                    {stripeBalance ? 'Stripe Revenue' : 'Revenue'}
                  </div>
                  {stripeBalance && (
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                      Available: ${stripeBalance.available.toFixed(2)} | Pending: ${stripeBalance.pending.toFixed(2)}
                    </div>
                  )}
                </div>
                <div className="stat-card">
                  <div className="stat-value">{orderStats.total_tickets}</div>
                  <div className="stat-label">Tickets Sold</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{orderStats.paid_count}</div>
                  <div className="stat-label">Paid Orders</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{totalCapacity}</div>
                  <div className="stat-label">Total Capacity</div>
                </div>
              </div>

              {/* Paid Orders Section */}
              <div className="admin-section" style={{ marginTop: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, flexWrap: 'wrap', gap: 10 }}>
                  <h3>Paid Orders ({orders.filter(o => o.payment_status === 'paid').length})</h3>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {selectedOrders.size > 0 && (
                      <button
                        onClick={() => {
                          const emails = orders.filter(o => selectedOrders.has(o.id) && o.buyer_email).map(o => o.buyer_email);
                          if (emails.length > 0) openEmailModal(emails);
                        }}
                        style={{
                          background: 'var(--neon-blue)',
                          border: 'none',
                          color: '#000',
                          padding: '8px 16px',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: 600
                        }}
                      >
                        Email Selected ({selectedOrders.size})
                      </button>
                    )}
                    <button
                      onClick={createTestPurchase}
                      disabled={testPurchaseLoading}
                      style={{
                        background: 'var(--neon-green)',
                        border: 'none',
                        color: '#000',
                        padding: '8px 16px',
                        borderRadius: 4,
                        cursor: testPurchaseLoading ? 'not-allowed' : 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        opacity: testPurchaseLoading ? 0.6 : 1
                      }}
                    >
                      {testPurchaseLoading ? 'Loading...' : 'Test Purchase ($0.50)'}
                    </button>
                  </div>
                </div>

                {/* Filter input */}
                <input
                  type="text"
                  placeholder="Filter by name, email, company, or room..."
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    marginBottom: 15,
                    background: '#111',
                    border: '1px solid #333',
                    borderRadius: 4,
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem'
                  }}
                />

                {ordersLoading ? (
                  <p style={{ color: 'var(--text-secondary)' }}>Loading orders...</p>
                ) : (() => {
                  const paidOrders = orders.filter(o => o.payment_status === 'paid');
                  const filterLower = orderFilter.toLowerCase();
                  const filtered = filterLower ? paidOrders.filter(o =>
                    (o.buyer_name || '').toLowerCase().includes(filterLower) ||
                    (o.buyer_email || '').toLowerCase().includes(filterLower) ||
                    (o.buyer_company || '').toLowerCase().includes(filterLower) ||
                    (rooms[o.room_id]?.name || o.room_id).toLowerCase().includes(filterLower)
                  ) : paidOrders;
                  const sorted = [...filtered].sort((a, b) => {
                    let aVal = a[orderSort.field];
                    let bVal = b[orderSort.field];
                    if (orderSort.field === 'room_id') {
                      aVal = rooms[a.room_id]?.name || a.room_id;
                      bVal = rooms[b.room_id]?.name || b.room_id;
                    }
                    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
                    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
                    if (aVal < bVal) return orderSort.direction === 'asc' ? -1 : 1;
                    if (aVal > bVal) return orderSort.direction === 'asc' ? 1 : -1;
                    return 0;
                  });
                  const allSelected = sorted.length > 0 && sorted.every(o => selectedOrders.has(o.id));

                  const SortHeader = ({ field, children }) => (
                    <th
                      onClick={() => setOrderSort(prev => ({
                        field,
                        direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
                      }))}
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      {children} {orderSort.field === field ? (orderSort.direction === 'asc' ? '▲' : '▼') : ''}
                    </th>
                  );

                  return sorted.length > 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                      <table className="guest-table">
                        <thead>
                          <tr>
                            <th style={{ width: 30 }}>
                              <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedOrders(new Set(sorted.map(o => o.id)));
                                  } else {
                                    setSelectedOrders(new Set());
                                  }
                                }}
                              />
                            </th>
                            <SortHeader field="buyer_name">Name</SortHeader>
                            <SortHeader field="buyer_email">Email</SortHeader>
                            <SortHeader field="buyer_company">Company</SortHeader>
                            <SortHeader field="room_id">Room</SortHeader>
                            <SortHeader field="quantity">Qty</SortHeader>
                            <SortHeader field="total_amount">Total</SortHeader>
                            <th>Entire Room</th>
                            <SortHeader field="created_at">Date</SortHeader>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sorted.map(order => (
                            <tr key={order.id}>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={selectedOrders.has(order.id)}
                                  onChange={(e) => {
                                    setSelectedOrders(prev => {
                                      const next = new Set(prev);
                                      if (e.target.checked) next.add(order.id);
                                      else next.delete(order.id);
                                      return next;
                                    });
                                  }}
                                />
                              </td>
                              <td>{order.buyer_name || '—'}</td>
                              <td>{order.buyer_email || '—'}</td>
                              <td>{order.buyer_company || '—'}</td>
                              <td>{rooms[order.room_id]?.name || order.room_id}</td>
                              <td>{order.quantity}</td>
                              <td>${order.total_amount}</td>
                              <td>{order.is_entire_room ? '✓ Yes' : '—'}</td>
                              <td>{order.created_at?.split('T')[0] || ''}</td>
                              <td style={{ display: 'flex', gap: 5 }}>
                                {order.buyer_email && (
                                  <button
                                    onClick={() => openEmailModal(order.buyer_email)}
                                    title="Email"
                                    style={{
                                      background: 'transparent',
                                      border: '1px solid var(--neon-blue)',
                                      color: 'var(--neon-blue)',
                                      padding: '2px 6px',
                                      borderRadius: 4,
                                      cursor: 'pointer',
                                      fontSize: '0.75rem'
                                    }}
                                  >
                                    Email
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteOrder(order.id, order.buyer_name)}
                                  title="Delete order"
                                  style={{
                                    background: 'transparent',
                                    border: '1px solid var(--neon-pink)',
                                    color: 'var(--neon-pink)',
                                    padding: '2px 6px',
                                    borderRadius: 4,
                                    cursor: 'pointer',
                                    fontSize: '0.75rem'
                                  }}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-secondary)' }}>
                      {paidOrders.length > 0 ? 'No orders match your filter.' : 'No paid orders yet.'}
                    </p>
                  );
                })()}
              </div>

              {/* Archived Orders */}
              {archivedOrders.length > 0 && (
                <div className="admin-section" style={{ marginTop: 20 }}>
                  <h3 style={{ marginBottom: 15 }}>Archived Orders ({archivedOrders.length})</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: 10, fontSize: '0.85rem' }}>
                    Orders archived from room resets. Buyer info preserved for reference.
                  </p>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="guest-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Company</th>
                          <th>Room</th>
                          <th>Qty</th>
                          <th>Total</th>
                          <th>Entire Room</th>
                          <th>Original Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {archivedOrders.map(order => (
                          <tr key={order.id} style={{ opacity: 0.7 }}>
                            <td>{order.buyer_name || '—'}</td>
                            <td>{order.buyer_email || '—'}</td>
                            <td>{order.buyer_company || '—'}</td>
                            <td>{rooms[order.room_id]?.name || order.room_id}</td>
                            <td>{order.quantity}</td>
                            <td>${order.total_amount}</td>
                            <td>{order.is_entire_room ? '✓ Yes' : '—'}</td>
                            <td>{order.created_at?.split('T')[0] || ''}</td>
                            <td>
                              {order.buyer_email && (
                                <button
                                  onClick={() => openEmailModal(order.buyer_email)}
                                  title="Email"
                                  style={{
                                    background: 'transparent',
                                    border: '1px solid var(--neon-blue)',
                                    color: 'var(--neon-blue)',
                                    padding: '2px 6px',
                                    borderRadius: 4,
                                    cursor: 'pointer',
                                    fontSize: '0.75rem'
                                  }}
                                >
                                  Email
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Waitlist Signups */}
              <div className="admin-section" style={{ marginTop: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, flexWrap: 'wrap', gap: 10 }}>
                  <h3>Waitlist Signups ({waitlistEntries.length})</h3>
                  {selectedWaitlist.size > 0 && (
                    <button
                      onClick={() => {
                        const emails = waitlistEntries.filter(w => selectedWaitlist.has(w.id) && w.email).map(w => w.email);
                        if (emails.length > 0) openEmailModal(emails);
                      }}
                      style={{
                        background: 'var(--neon-blue)',
                        border: 'none',
                        color: '#000',
                        padding: '8px 16px',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 600
                      }}
                    >
                      Email Selected ({selectedWaitlist.size})
                    </button>
                  )}
                </div>

                {waitlistEntries.length > 0 ? (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="guest-table">
                      <thead>
                        <tr>
                          <th style={{ width: 30 }}>
                            <input
                              type="checkbox"
                              checked={waitlistEntries.length > 0 && waitlistEntries.every(w => selectedWaitlist.has(w.id))}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedWaitlist(new Set(waitlistEntries.map(w => w.id)));
                                } else {
                                  setSelectedWaitlist(new Set());
                                }
                              }}
                            />
                          </th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Room</th>
                          <th>Spots</th>
                          <th>Joined</th>
                          <th>Notified</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {waitlistEntries.map(entry => (
                          <tr key={entry.id}>
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedWaitlist.has(entry.id)}
                                onChange={(e) => {
                                  setSelectedWaitlist(prev => {
                                    const next = new Set(prev);
                                    if (e.target.checked) next.add(entry.id);
                                    else next.delete(entry.id);
                                    return next;
                                  });
                                }}
                              />
                            </td>
                            <td>{entry.full_name}</td>
                            <td>{entry.email}</td>
                            <td>{entry.room_name}</td>
                            <td>{entry.quantity}</td>
                            <td>{entry.created_at?.split('T')[0] || ''}</td>
                            <td>{entry.notified ? '✓ Yes' : '—'}</td>
                            <td>
                              <button
                                onClick={() => openEmailModal(entry.email)}
                                style={{
                                  background: 'transparent',
                                  border: '1px solid var(--neon-blue)',
                                  color: 'var(--neon-blue)',
                                  padding: '2px 6px',
                                  borderRadius: 4,
                                  cursor: 'pointer',
                                  fontSize: '0.75rem'
                                }}
                              >
                                Email
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-secondary)' }}>No waitlist signups yet.</p>
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
                  const tierLabels = { main: 'Main Stage', small: 'Small Rooms (8 guests)', medium: 'Medium Rooms (15 guests)', large: 'Large Rooms (25 guests)', vip: 'Largest Room (30 guests)' };
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
                              <div className="admin-input-row">
                                <label>Capacity:</label>
                                <input
                                  type="number"
                                  value={room.capacity}
                                  onChange={(e) => updateRoom(id, 'capacity', e.target.value)}
                                  onBlur={(e) => saveRoomToDatabase(id, 'capacity', parseInt(e.target.value) || 0)}
                                  min="1"
                                />
                              </div>
                              {room.tier !== 'main' && (
                                <div className="admin-input-row">
                                  <label>Override:</label>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, flex: 1 }}>
                                    <input
                                      type="number"
                                      value={orderCounts[id]?.bookedOverride ?? ''}
                                      placeholder={`${orderCounts[id]?.bookedCount || 0} (actual)`}
                                      onChange={(e) => {
                                        const val = e.target.value === '' ? null : parseInt(e.target.value);
                                        setOrderCounts(prev => ({
                                          ...prev,
                                          [id]: { ...prev[id], bookedOverride: val }
                                        }));
                                      }}
                                      onBlur={(e) => {
                                        const val = e.target.value === '' ? null : parseInt(e.target.value);
                                        saveRoomToDatabase(id, 'bookedOverride', val);
                                      }}
                                      min="0"
                                      style={{ width: 70 }}
                                    />
                                    {orderCounts[id]?.bookedOverride != null && (
                                      <button
                                        onClick={() => {
                                          setOrderCounts(prev => ({
                                            ...prev,
                                            [id]: { ...prev[id], bookedOverride: null }
                                          }));
                                          saveRoomToDatabase(id, 'bookedOverride', null);
                                        }}
                                        title="Clear override"
                                        style={{
                                          background: 'transparent',
                                          border: '1px solid #555',
                                          color: 'var(--text-secondary)',
                                          padding: '1px 5px',
                                          borderRadius: 3,
                                          cursor: 'pointer',
                                          fontSize: '0.7rem'
                                        }}
                                      >
                                        Clear
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}
                              <div style={{ marginTop: 10, fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>
                                  Booked: {getBookedCount(id)} / {room.capacity}
                                  {orderCounts[id]?.bookedOverride != null && (
                                    <span style={{ color: 'var(--neon-blue)', marginLeft: 5 }}>(override)</span>
                                  )}
                                  {orderCounts[id]?.bookedOverride == null && (
                                    <span style={{ marginLeft: 5 }}>({orderCounts[id]?.bookedCount || 0} orders)</span>
                                  )}
                                </span>
                                {room.tier !== 'main' && (orderCounts[id]?.bookedCount || 0) > 0 && (
                                  <button
                                    onClick={() => resetRoomOrders(id)}
                                    style={{
                                      background: 'transparent',
                                      border: '1px solid var(--neon-pink)',
                                      color: 'var(--neon-pink)',
                                      padding: '2px 8px',
                                      borderRadius: 4,
                                      cursor: 'pointer',
                                      fontSize: '0.75rem'
                                    }}
                                  >
                                    Reset
                                  </button>
                                )}
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
                  This is an independently organized event--just a former theater kid-turned-game dev who wants to throw a great party during GDC.
                </p>
                <p>
                  If you'd like to get your studio or brand in front of 400+ singing game developers, we're offering flexible sponsorship options.
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
                    <img src="/images/adamhost.png" alt="Adam Dolin" loading="lazy" />
                  </div>
                  <div className="host-info">
                    <h3>Adam Dolin</h3>
                    <p className="host-bio">
                      {/* Add bio text here */}
                      Adam Dolin is a WGA and BAFTA-winning narrative designer and writer whose work includes God of War, Horizon: Forbidden West, and God of War: Ragnarök. With over 16 years of experience, he's collaborated with teams at PlayStation, 2K, Activision, SEGA, and Netflix. He now runs GameDevDolin, a narrative and UX consultancy helping teams craft memorable, player-driven stories.                    
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
                    <img src="/images/crishost.png" alt="Cristina Amaya" loading="lazy" />
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

          {/* Success Page - After Stripe Payment */}
          {view === 'success' && (
            <div className="success-page">
              <div className="success-content">
                <div className="success-icon">✓</div>
                <h1>Payment Successful!</h1>
                <p className="success-subtitle">
                  {purchaseInfo?.isTest
                    ? 'Your test purchase was processed successfully.'
                    : purchaseInfo?.isEntireRoom
                      ? `You've reserved the entire ${purchaseInfo?.roomName || 'private room'}!`
                      : `${purchaseInfo?.quantity || 1} ${(purchaseInfo?.quantity || 1) === 1 ? 'ticket' : 'tickets'} for ${purchaseInfo?.roomName || 'Game Dev Karaoke'}`
                  }
                </p>

                <div className="success-details">
                  <h3>What's Next?</h3>
                  <ul>
                    <li>You'll receive a confirmation email from Stripe shortly</li>
                    {purchaseInfo?.isMainStageSong && (
                      <li style={{ color: 'var(--neon-green)' }}>
                        <strong>Song Signup:</strong> Look out for an email in mid-February with instructions to sign up for your song and performance time slot!
                      </li>
                    )}
                    <li>Save the date: <strong>{CONFIG.eventDate}</strong> at <strong><a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Game+Dev+Karaoke+2026&dates=20260312T050000Z/20260312T080000Z&details=Game+Dev+Karaoke+party+at+Pandora+Karaoke+during+GDC+2026!%0A%0APandora+Karaoke%0A50+Mason+St,+San+Francisco,+CA+94102&location=Pandora+Karaoke,+50+Mason+St,+San+Francisco,+CA+94102" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--neon-green)' }}>{CONFIG.eventTime}</a></strong></li>
                    <li>Location: <strong>{CONFIG.venueName}</strong>, {CONFIG.venueAddress}</li>
                    <li>Bring a valid government-issued ID (21+ event)</li>
                  </ul>
                </div>

                <div className="success-actions">
                  <button className="btn-primary" onClick={() => setView('home')}>
                    Back to Home
                  </button>
                  <a
                    href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Game+Dev+Karaoke+2026&dates=20260311T210000/20260312T000000&ctz=America/Los_Angeles&details=Game+Dev+Karaoke+party+at+Pandora+Karaoke+during+GDC+2026&location=Pandora+Karaoke,+50+Mason+St,+San+Francisco,+CA+94102"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    Add to Calendar
                  </a>
                </div>

                <p className="success-note">
                  Questions? Contact the hosts on our <a href="#" onClick={(e) => { e.preventDefault(); setView('hosts'); }}>Hosts page</a>.
                </p>
              </div>
            </div>
          )}

          {/* Privacy Policy */}
          {view === 'privacy' && (
            <div className="legal-page">
              <button className="back-btn" onClick={() => setView('home')}>← Back</button>
              <h1>Privacy Policy</h1>
              <p className="legal-updated">Last updated: January 2026</p>

              <h2>Information We Collect</h2>
              <p>When you purchase tickets for Game Dev Karaoke 2026, we collect:</p>
              <ul>
                <li><strong>Contact Information:</strong> Your name, email address, and optionally your company/studio name</li>
                <li><strong>Payment Information:</strong> Payment is processed securely through Stripe. We do not store your credit card details on our servers.</li>
                <li><strong>Purchase Details:</strong> Which room and ticket type you purchased</li>
              </ul>

              <h2>How We Use Your Information</h2>
              <ul>
                <li>To process your ticket purchase and send confirmation emails</li>
                <li>To maintain an attendee list for event check-in and safety purposes</li>
                <li>To comply with GDC affiliate event requirements (attendee list submission)</li>
                <li>To contact you with important event updates</li>
              </ul>

              <h2>Information Sharing</h2>
              <p>We share your information only as required:</p>
              <ul>
                <li><strong>GDC/Informa:</strong> As a GDC affiliated event, we are required to submit a complete attendee list for safety and compliance purposes</li>
                <li><strong>Stripe:</strong> Our payment processor, who handles transactions securely</li>
                <li><strong>Venue:</strong> Basic attendee count for capacity management</li>
              </ul>
              <p>We do not sell your personal information to third parties.</p>

              <h2>Data Retention</h2>
              <p>We retain your purchase information for the duration needed to fulfill the event and comply with any legal requirements, typically no longer than one year after the event.</p>

              <h2>Contact Us</h2>
              <p>Questions about this privacy policy? Contact us at the email addresses listed on our hosts page.</p>
            </div>
          )}

          {/* Terms of Service */}
          {view === 'terms' && (
            <div className="legal-page">
              <button className="back-btn" onClick={() => setView('home')}>← Back</button>
              <h1>Terms of Service</h1>
              <p className="legal-updated">Last updated: January 2026</p>

              <h2>Event Details</h2>
              <p><strong>Game Dev Karaoke 2026</strong><br/>
              Date: {CONFIG.eventDate}<br/>
              Time: {CONFIG.eventTime}<br/>
              Venue: {CONFIG.venueName}, {CONFIG.venueAddress}</p>

              <h2>Ticket Purchases</h2>
              <ul>
                <li>Refunds are available upon request until the day of the event. See our <a href="#" onClick={(e) => { e.preventDefault(); setView('refunds'); window.scrollTo(0, 0); }}>Refund Policy</a> for details.</li>
                <li>Tickets are non-transferable without prior approval from the event organizers.</li>
                <li>You must be 21 years or older to attend this event.</li>
              </ul>

              <h2>Room Reservations</h2>
              <ul>
                <li>Private room reservations include access for up to the stated room capacity.</li>
                <li>By reserving an entire room, you agree to provide a complete list of attendees prior to the event.</li>
                <li>Room assignments are subject to change based on venue availability.</li>
              </ul>

              <h2>Attendee Requirements</h2>
              <ul>
                <li>As a GDC affiliated event, all attendees must be registered. We are required to submit a complete guest list for safety purposes.</li>
                <li>Valid government-issued ID is required for entry.</li>
                <li>The event organizers reserve the right to refuse entry or remove any attendee for inappropriate behavior.</li>
              </ul>

              <h2>Event Changes</h2>
              <p>The organizers reserve the right to modify event details, including venue, time, or entertainment, as necessary. Ticket holders will be notified of significant changes via email.</p>

              <h2>Liability</h2>
              <p>Attendees assume all risks associated with attendance. The organizers are not responsible for any injury, loss, or damage to personal property.</p>

              <h2>Contact</h2>
              <p>For questions about these terms, please contact the event hosts.</p>
            </div>
          )}

          {/* Code of Conduct */}
          {view === 'conduct' && (
            <div className="legal-page">
              <button className="back-btn" onClick={() => setView('home')}>← Back</button>
              <h1>Code of Conduct</h1>
              <p className="legal-updated">Last updated: January 2026</p>

              <h2>Our Commitment</h2>
              <p>Game Dev Karaoke is dedicated to providing a fun, inclusive, and harassment-free experience for everyone in the game development community, regardless of gender, gender identity and expression, age, sexual orientation, disability, physical appearance, body size, race, ethnicity, or religion.</p>

              <h2>Expected Behavior</h2>
              <ul>
                <li>Be respectful and considerate of others</li>
                <li>Celebrate and support fellow performers, regardless of singing ability</li>
                <li>Drink responsibly - this is a professional networking event</li>
                <li>Respect personal boundaries</li>
                <li>Be mindful of the space you take up, both physically and conversationally</li>
                <li>Look out for each other - if you see something concerning, say something</li>
              </ul>

              <h2>Unacceptable Behavior</h2>
              <ul>
                <li>Harassment, intimidation, or discrimination in any form</li>
                <li>Unwelcome sexual attention or advances</li>
                <li>Offensive verbal comments related to gender, sexual orientation, disability, physical appearance, race, or religion</li>
                <li>Deliberate intimidation, stalking, or following</li>
                <li>Photography or recording without consent</li>
                <li>Sustained disruption of performances or conversations</li>
                <li>Excessive intoxication or encouraging others to drink excessively</li>
                <li>Any behavior that would not be acceptable in a festive, professional setting</li>
              </ul>

              <h2>Consequences</h2>
              <p>Anyone asked to stop unacceptable behavior is expected to comply immediately. Event organizers may take any action they deem appropriate, including warning the offender, removing them from the event without refund, or contacting venue security or local law enforcement.</p>

              <h2>Reporting</h2>
              <p>If you experience or witness unacceptable behavior, please report it to an event organizer immediately. You can identify organizers by their badges or ask any venue staff to find one. All reports will be handled with discretion.</p>


              <h2>Remember</h2>
              <p>This is a celebration of our community. We're here to sing, laugh, and connect. Let's make it a night everyone can enjoy and remember fondly.</p>
            </div>
          )}

          {/* Refund Policy */}
          {view === 'refunds' && (
            <div className="legal-page">
              <button className="back-btn" onClick={() => setView('home')}>← Back</button>
              <h1>Refund Policy</h1>
              <p className="legal-updated">Last updated: January 2026</p>

              <h2>Refund Eligibility</h2>
              <p>We understand that plans change. Refunds are available for Game Dev Karaoke 2026 tickets under the following conditions:</p>

              <h2>Full Refunds</h2>
              <ul>
                <li><strong>Before the event:</strong> Full refunds are available upon request any time up until 11:59 PM PT on March 10th, 2026 (the day before the event).</li>
                <li><strong>Event cancellation:</strong> If the event is cancelled by the organizers, all ticket holders will receive a full refund.</li>
              </ul>

              <h2>No Refunds</h2>
              <ul>
                <li><strong>Day of the event:</strong> No refunds will be issued on March 11th, 2026 or after.</li>
                <li><strong>No-shows:</strong> Failure to attend the event does not qualify for a refund.</li>
                <li><strong>Removal from event:</strong> Attendees removed for violating the Code of Conduct are not eligible for refunds.</li>
              </ul>

              <h2>How to Request a Refund</h2>
              <p>To request a refund, please email the event organizers with your:</p>
              <ul>
                <li>Full name (as entered during purchase)</li>
                <li>Email address used for purchase</li>
                <li>Room/ticket type purchased</li>
              </ul>
              <p>Refunds will be processed within 5-7 business days and will be returned to the original payment method.</p>

              <h2>Partial Room Reservations</h2>
              <p>If you reserved an entire room and wish to receive a refund:</p>
              <ul>
                <li>The full room reservation amount will be refunded</li>
                <li>The room will become available for others to book</li>
                <li>If you only want to reduce the number of guests, please contact us to discuss options</li>
              </ul>

              <h2>Contact</h2>
              <p>For refund requests or questions about this policy, please contact the event hosts through the information provided on the <a href="#" onClick={(e) => { e.preventDefault(); setView('hosts'); window.scrollTo(0, 0); }}>Hosts page</a>.</p>
            </div>
          )}

          {/* Footer */}
          <footer className="footer">
            <div className="footer-content">
              <div className="footer-main">
                <p>
                  <strong>Game Dev Karaoke 2026</strong><p></p>{CONFIG.eventDate}<p></p>{CONFIG.eventTime}
                </p>
                <p className="hosts">
                  Hosted by <a href="#" onClick={(e) => { e.preventDefault(); setView('hosts'); setTimeout(() => document.getElementById('hosts-title')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>Adam Dolin & Cristina Amaya</a>
                </p>
                <p className="legal-links">
                  <a href="#" onClick={(e) => { e.preventDefault(); setView('privacy'); window.scrollTo(0, 0); }}>Privacy Policy</a>
                  {' • '}
                  <a href="#" onClick={(e) => { e.preventDefault(); setView('terms'); window.scrollTo(0, 0); }}>Terms of Service</a>
                  {' • '}
                  <a href="#" onClick={(e) => { e.preventDefault(); setView('conduct'); window.scrollTo(0, 0); }}>Code of Conduct</a>
                  {' • '}
                  <a href="#" onClick={(e) => { e.preventDefault(); setView('refunds'); window.scrollTo(0, 0); }}>Refund Policy</a>
                </p>
                <p style={{ marginTop: 15 }}>
                  <span className="admin-link" onClick={() => setView('admin')}>•</span>
                </p>
              </div>
              <div className="footer-logo">
                <a href="https://gamedevdolin.com" target="_blank" rel="noopener noreferrer">
                  <img
                    src="/images/cbslogo.png"
                    loading="lazy"
                    alt="Cold Brew Sunset"
                    className="footer-logo-img"
                  />
                </a>
              </div>
            </div>
          </footer>
        </div>

        {/* Success Modal - no longer used but keeping for future */}

        {/* Email Compose Modal */}
        {showEmailModal && (
          <div className="waitlist-modal-overlay" onClick={closeEmailModal}>
            <div className="waitlist-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 600 }}>
              <button className="close-btn" onClick={closeEmailModal}>×</button>

              {emailSuccess ? (
                <div className="success-message">
                  <h3>Email Sent!</h3>
                  <p>Successfully sent to {emailTo.length} recipient(s).</p>
                  <button onClick={closeEmailModal} style={{
                    background: 'var(--neon-green)',
                    border: 'none',
                    color: '#000',
                    padding: '10px 20px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 600,
                    marginTop: 15
                  }}>
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <h3>Compose Email</h3>
                  <div style={{ marginBottom: 10, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    To: {emailTo.length <= 3 ? emailTo.join(', ') : `${emailTo.slice(0, 3).join(', ')} +${emailTo.length - 3} more`}
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); sendEmail(); }}>
                    <label>
                      Subject
                      <input
                        type="text"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        placeholder="Email subject"
                        required
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          background: '#111',
                          border: '1px solid #333',
                          borderRadius: 4,
                          color: 'var(--text-primary)',
                          fontSize: '0.9rem',
                          marginTop: 5
                        }}
                      />
                    </label>

                    <label style={{ marginTop: 15, display: 'block' }}>
                      Message
                      <textarea
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                        placeholder="Type your message here..."
                        required
                        rows={8}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          background: '#111',
                          border: '1px solid #333',
                          borderRadius: 4,
                          color: 'var(--text-primary)',
                          fontSize: '0.9rem',
                          marginTop: 5,
                          resize: 'vertical',
                          fontFamily: 'inherit'
                        }}
                      />
                    </label>

                    {emailError && <p className="error-message">{emailError}</p>}

                    <button type="submit" disabled={emailSending} style={{
                      background: emailSending ? '#333' : 'var(--neon-green)',
                      border: 'none',
                      color: '#000',
                      padding: '10px 20px',
                      borderRadius: 8,
                      cursor: emailSending ? 'not-allowed' : 'pointer',
                      fontWeight: 600,
                      marginTop: 15,
                      width: '100%',
                      fontSize: '1rem'
                    }}>
                      {emailSending ? 'Sending...' : `Send to ${emailTo.length} recipient(s)`}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        {/* Waitlist Modal */}
        {showWaitlistModal && waitlistRoom && (
          <div className="waitlist-modal-overlay" onClick={closeWaitlistModal}>
            <div className="waitlist-modal" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={closeWaitlistModal}>×</button>

              {waitlistSuccess ? (
                <div className="success-message">
                  <h3>You're on the waitlist!</h3>
                  <p>We'll notify you at <strong>{waitlistForm.email}</strong> if a spot opens up for <strong>{rooms[waitlistRoom]?.name}</strong>.</p>
                  <button
                    onClick={closeWaitlistModal}
                    style={{
                      marginTop: '20px',
                      background: 'linear-gradient(135deg, var(--neon-green) 0%, #00cc77 100%)',
                      color: 'black',
                      fontWeight: 700,
                      padding: '12px 24px',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <h2>Join the Waitlist</h2>
                  <p className="room-name-subtitle">{rooms[waitlistRoom]?.name}</p>

                  <form onSubmit={submitWaitlist}>
                    <label>
                      Full Name *
                      <input
                        type="text"
                        value={waitlistForm.fullName}
                        onChange={(e) => setWaitlistForm({ ...waitlistForm, fullName: e.target.value })}
                        placeholder="Your full name"
                        required
                      />
                    </label>

                    <label>
                      Email *
                      <input
                        type="email"
                        value={waitlistForm.email}
                        onChange={(e) => setWaitlistForm({ ...waitlistForm, email: e.target.value })}
                        placeholder="your@email.com"
                        required
                      />
                    </label>

                    <label>
                      Number of spots needed
                      <input
                        type="number"
                        className="quantity-input"
                        min="1"
                        max={rooms[waitlistRoom]?.capacity || 10}
                        value={waitlistForm.quantity}
                        onChange={(e) => setWaitlistForm({ ...waitlistForm, quantity: parseInt(e.target.value) || 1 })}
                      />
                    </label>

                    {waitlistError && <p className="error-message">{waitlistError}</p>}

                    <button type="submit" disabled={waitlistLoading}>
                      {waitlistLoading ? 'Joining...' : 'Join Waitlist'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

createRoot(document.getElementById('root')).render(<GDCKaraokeApp />);
