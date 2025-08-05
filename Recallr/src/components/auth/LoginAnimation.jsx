import React from 'react';

const LoginAnimation = () => {


  return (

    <>
    <style jsx>{`/* Enhanced Animation Keyframes */

/* Large floating orbs */
@keyframes float-large-1 {
  0%, 100% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -20px) scale(1.1); }
  66% { transform: translate(-20px, -40px) scale(0.9); }
}

@keyframes float-large-2 {
  0%, 100% { transform: translate(0px, 0px) scale(1); }
  50% { transform: translate(-40px, 30px) scale(1.2); }
}

@keyframes float-large-3 {
  0%, 100% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
  50% { transform: translate(20px, -30px) scale(1.1) rotate(180deg); }
}

/* Particle animations */
@keyframes particle-1 {
  0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 1; }
  50% { transform: translateY(-60px) rotate(180deg); opacity: 0.3; }
}

@keyframes particle-2 {
  0%, 100% { transform: translateX(0px) rotate(0deg); opacity: 1; }
  50% { transform: translateX(80px) rotate(360deg); opacity: 0.5; }
}

@keyframes particle-3 {
  0%, 100% { transform: translate(0px, 0px) rotate(0deg); opacity: 1; }
  50% { transform: translate(-50px, -40px) rotate(270deg); opacity: 0.4; }
}

@keyframes particle-4 {
  0%, 100% { transform: translate(0px, 0px) scale(1); opacity: 1; }
  50% { transform: translate(60px, 30px) scale(1.5); opacity: 0.6; }
}

@keyframes particle-5 {
  0%, 100% { transform: translateY(0px) scale(1); opacity: 1; }
  50% { transform: translateY(-80px) scale(0.5); opacity: 0.2; }
}

/* Geometric shape animations */
@keyframes geometric-1 {
  0%, 100% { transform: rotate(45deg) scale(1); opacity: 0.4; }
  50% { transform: rotate(225deg) scale(1.3); opacity: 0.8; }
}

@keyframes geometric-2 {
  0%, 100% { transform: rotate(0deg) scale(1); opacity: 0.3; }
  50% { transform: rotate(180deg) scale(1.2); opacity: 0.7; }
}

/* Enhanced stage animations */
@keyframes stage-1 {
  0% { opacity: 1; }
  22% { opacity: 1; }
  28% { opacity: 0; }
  100% { opacity: 0; }
}

@keyframes stage-2 {
  0% { opacity: 0; }
  22% { opacity: 0; }
  28% { opacity: 1; }
  47% { opacity: 1; }
  53% { opacity: 0; }
  100% { opacity: 0; }
}

@keyframes stage-3 {
  0% { opacity: 0; }
  47% { opacity: 0; }
  53% { opacity: 1; }
  72% { opacity: 1; }
  78% { opacity: 0; }
  100% { opacity: 0; }
}

@keyframes stage-4 {
  0% { opacity: 0; }
  72% { opacity: 0; }
  78% { opacity: 1; }
  97% { opacity: 1; }
  100% { opacity: 0; }
}

/* Enhanced character animations */
@keyframes character-upload {
  0% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-8px) rotate(-2deg); }
  50% { transform: translateY(-5px) rotate(1deg); }
  75% { transform: translateY(-10px) rotate(-1deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}

@keyframes character-celebrate {
  0% { transform: translateY(0px) scale(1) rotate(0deg); }
  25% { transform: translateY(-15px) scale(1.05) rotate(-3deg); }
  50% { transform: translateY(-8px) scale(1.1) rotate(2deg); }
  75% { transform: translateY(-12px) scale(1.05) rotate(-1deg); }
  100% { transform: translateY(0px) scale(1) rotate(0deg); }
}

/* Platform bounce animations */
@keyframes platform-bounce-1 {
  0%, 60%, 100% { transform: translateY(0) scale(1); }
  30% { transform: translateY(-15px) scale(1.1); }
}

@keyframes platform-bounce-2 {
  0%, 60%, 100% { transform: translateY(0) scale(1); }
  35% { transform: translateY(-15px) scale(1.1); }
}

@keyframes platform-bounce-3 {
  0%, 60%, 100% { transform: translateY(0) scale(1); }
  40% { transform: translateY(-15px) scale(1.1); }
}

/* Enhanced PDF floating animations */
@keyframes pdf-float-1 {
  0% { transform: translateX(0px) translateY(0px) rotate(12deg) scale(1); opacity: 1; }
  30% { transform: translateX(80px) translateY(-30px) rotate(-5deg) scale(1.1); opacity: 0.9; }
  60% { transform: translateX(160px) translateY(-60px) rotate(-20deg) scale(0.9); opacity: 0.5; }
  100% { transform: translateX(240px) translateY(-90px) rotate(-35deg) scale(0.7); opacity: 0; }
}

@keyframes pdf-float-2 {
  0% { transform: translateX(0px) translateY(0px) rotate(-6deg) scale(1); opacity: 1; }
  30% { transform: translateX(70px) translateY(-40px) rotate(10deg) scale(1.1); opacity: 0.9; }
  60% { transform: translateX(140px) translateY(-80px) rotate(25deg) scale(0.9); opacity: 0.5; }
  100% { transform: translateX(210px) translateY(-120px) rotate(40deg) scale(0.7); opacity: 0; }
}

@keyframes pdf-float-3 {
  0% { transform: translateX(0px) translateY(0px) rotate(3deg) scale(1); opacity: 1; }
  30% { transform: translateX(60px) translateY(-35px) rotate(-8deg) scale(1.1); opacity: 0.9; }
  60% { transform: translateX(120px) translateY(-70px) rotate(-15deg) scale(0.9); opacity: 0.5; }
  100% { transform: translateX(180px) translateY(-105px) rotate(-25deg) scale(0.7); opacity: 0; }
}

/* Enhanced machine animations */
@keyframes machine-processing {
  0% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.02) rotate(0.5deg); }
  50% { transform: scale(1.05) rotate(0deg); }
  75% { transform: scale(1.02) rotate(-0.5deg); }
  100% { transform: scale(1) rotate(0deg); }
}

@keyframes machine-glow-outer {
  0% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.6; }
  100% { transform: scale(1); opacity: 0.3; }
}

@keyframes ai-pulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
}

@keyframes processing-particle-1 {
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  50% { transform: translate(60px, -20px) scale(0.5); opacity: 0.5; }
  100% { transform: translate(120px, -40px) scale(0); opacity: 0; }
}

@keyframes processing-particle-2 {
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  33% { transform: translate(-30px, 15px) scale(0.8); opacity: 0.8; }
  66% { transform: translate(-60px, 30px) scale(0.3); opacity: 0.3; }
  100% { transform: translate(-90px, 45px) scale(0); opacity: 0; }
}

@keyframes processing-particle-3 {
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  50% { transform: translate(40px, 25px) scale(0.6); opacity: 0.6; }
  100% { transform: translate(80px, 50px) scale(0); opacity: 0; }
}

@keyframes processing-line-1 {
  0% { width: 0; opacity: 0; }
  30% { width: 32px; opacity: 1; }
  70% { width: 32px; opacity: 1; }
  100% { width: 0; opacity: 0; }
}

@keyframes processing-line-2 {
  0% { width: 0; opacity: 0; }
  20% { width: 0; opacity: 0; }
  50% { width: 48px; opacity: 1; }
  80% { width: 48px; opacity: 1; }
  100% { width: 0; opacity: 0; }
}

@keyframes processing-line-3 {
  0% { width: 0; opacity: 0; }
  40% { width: 0; opacity: 0; }
  70% { width: 24px; opacity: 1; }
  100% { width: 0; opacity: 0; }
}

@keyframes holographic {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes energy-ring-1 {
  0% { transform: scale(1) rotate(0deg); opacity: 0.3; }
  50% { transform: scale(1.1) rotate(180deg); opacity: 0.6; }
  100% { transform: scale(1) rotate(360deg); opacity: 0.3; }
}

@keyframes energy-ring-2 {
  0% { transform: scale(1) rotate(0deg); opacity: 0.2; }
  50% { transform: scale(1.2) rotate(-180deg); opacity: 0.4; }
  100% { transform: scale(1) rotate(-360deg); opacity: 0.2; }
}

/* Enhanced processing text animations */
@keyframes processing-text-1 {
  0% { opacity: 0; transform: translateY(20px) scale(0.8); }
  20% { opacity: 1; transform: translateY(0px) scale(1); }
  80% { opacity: 1; transform: translateY(0px) scale(1); }
  100% { opacity: 0; transform: translateY(-20px) scale(0.8); }
}

@keyframes processing-text-2 {
  0% { opacity: 0; transform: translateY(20px) scale(0.8); }
  30% { opacity: 0; transform: translateY(20px) scale(0.8); }
  50% { opacity: 1; transform: translateY(0px) scale(1); }
  80% { opacity: 1; transform: translateY(0px) scale(1); }
  100% { opacity: 0; transform: translateY(-20px) scale(0.8); }
}

@keyframes processing-text-3 {
  0% { opacity: 0; transform: translateY(20px) scale(0.8); }
  60% { opacity: 0; transform: translateY(20px) scale(0.8); }
  80% { opacity: 1; transform: translateY(0px) scale(1); }
  95% { opacity: 1; transform: translateY(0px) scale(1); }
  100% { opacity: 0; transform: translateY(-20px) scale(0.8); }
}

/* Enhanced card emerge animations */
@keyframes card-emerge-1 {
  0% { opacity: 0; transform: translateY(30px) scale(0.7) rotate(10deg); }
  15% { opacity: 1; transform: translateY(0px) scale(1) rotate(0deg); }
  85% { opacity: 1; transform: translateY(0px) scale(1) rotate(0deg); }
  100% { opacity: 0; transform: translateY(-30px) scale(0.7) rotate(-10deg); }
}

@keyframes card-emerge-2 {
  0% { opacity: 0; transform: translateY(30px) scale(0.7) rotate(-10deg); }
  10% { opacity: 0; transform: translateY(30px) scale(0.7) rotate(-10deg); }
  25% { opacity: 1; transform: translateY(0px) scale(1) rotate(0deg); }
  85% { opacity: 1; transform: translateY(0px) scale(1) rotate(0deg); }
  100% { opacity: 0; transform: translateY(-30px) scale(0.7) rotate(10deg); }
}

@keyframes card-emerge-3 {
  0% { opacity: 0; transform: translateY(30px) scale(0.7) rotate(5deg); }
  20% { opacity: 0; transform: translateY(30px) scale(0.7) rotate(5deg); }
  35% { opacity: 1; transform: translateY(0px) scale(1) rotate(0deg); }
  85% { opacity: 1; transform: translateY(0px) scale(1) rotate(0deg); }
  100% { opacity: 0; transform: translateY(-30px) scale(0.7) rotate(-5deg); }
}

@keyframes card-emerge-4 {
  0% { opacity: 0; transform: translateY(30px) scale(0.7) rotate(-5deg); }
  30% { opacity: 0; transform: translateY(30px) scale(0.7) rotate(-5deg); }
  45% { opacity: 1; transform: translateY(0px) scale(1) rotate(0deg); }
  85% { opacity: 1; transform: translateY(0px) scale(1) rotate(0deg); }
  100% { opacity: 0; transform: translateY(-30px) scale(0.7) rotate(5deg); }
}

@keyframes card-emerge-5 {
  0% { opacity: 0; transform: translateY(30px) scale(0.7) rotate(8deg); }
  40% { opacity: 0; transform: translateY(30px) scale(0.7) rotate(8deg); }
  55% { opacity: 1; transform: translateY(0px) scale(1) rotate(0deg); }
  85% { opacity: 1; transform: translateY(0px) scale(1) rotate(0deg); }
  100% { opacity: 0; transform: translateY(-30px) scale(0.7) rotate(-8deg); }
}

@keyframes card-emerge-6 {
  0% { opacity: 0; transform: translateY(30px) scale(0.7) rotate(-8deg); }
  50% { opacity: 0; transform: translateY(30px) scale(0.7) rotate(-8deg); }
  65% { opacity: 1; transform: translateY(0px) scale(1) rotate(0deg); }
  85% { opacity: 1; transform: translateY(0px) scale(1) rotate(0deg); }
  100% { opacity: 0; transform: translateY(-30px) scale(0.7) rotate(8deg); }
}

/* Enhanced flashcard animations */
@keyframes flashcard-1 {
  0% { opacity: 0; transform: translateY(40px) rotate(-15deg) scale(0.8); }
  30% { opacity: 1; transform: translateY(0px) rotate(12deg) scale(1); }
  70% { opacity: 1; transform: translateY(-5px) rotate(8deg) scale(1.05); }
  100% { opacity: 1; transform: translateY(0px) rotate(12deg) scale(1); }
}

@keyframes flashcard-2 {
  0% { opacity: 0; transform: translateY(40px) rotate(15deg) scale(0.8); }
  20% { opacity: 0; transform: translateY(40px) rotate(15deg) scale(0.8); }
  50% { opacity: 1; transform: translateY(0px) rotate(-6deg) scale(1); }
  80% { opacity: 1; transform: translateY(-5px) rotate(-10deg) scale(1.05); }
  100% { opacity: 1; transform: translateY(0px) rotate(-6deg) scale(1); }
}

/* Enhanced success indicators */
@keyframes success-1 {
  0% { opacity: 0; transform: scale(0) rotate(0deg); }
  30% { opacity: 1; transform: scale(1.3) rotate(180deg); }
  60% { opacity: 1; transform: scale(1) rotate(360deg); }
  100% { opacity: 1; transform: scale(1.1) rotate(720deg); }
}

@keyframes success-2 {
  0% { opacity: 0; transform: scale(0) rotate(0deg); }
  20% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1.3) rotate(180deg); }
  80% { opacity: 1; transform: scale(1) rotate(360deg); }
  100% { opacity: 1; transform: scale(1.1) rotate(540deg); }
}

@keyframes success-3 {
  0% { opacity: 0; transform: scale(0) rotate(0deg); }
  40% { opacity: 0; transform: scale(0) rotate(0deg); }
  70% { opacity: 1; transform: scale(1.3) rotate(180deg); }
  90% { opacity: 1; transform: scale(1) rotate(360deg); }
  100% { opacity: 1; transform: scale(1.1) rotate(450deg); }
}

@keyframes success-4 {
  0% { opacity: 0; transform: scale(0) rotate(0deg); }
  60% { opacity: 0; transform: scale(0) rotate(0deg); }
  80% { opacity: 1; transform: scale(1.2) rotate(180deg); }
  100% { opacity: 1; transform: scale(1) rotate(360deg); }
}

/* Confetti animations */
@keyframes confetti-1 {
  0% { opacity: 0; transform: translateY(0px) rotate(0deg); }
  10% { opacity: 1; transform: translateY(-20px) rotate(90deg); }
  50% { opacity: 1; transform: translateY(-100px) rotate(450deg); }
  100% { opacity: 0; transform: translateY(-200px) rotate(720deg); }
}

@keyframes confetti-2 {
  0% { opacity: 0; transform: translateY(0px) rotate(0deg); }
  15% { opacity: 1; transform: translateY(-30px) rotate(180deg); }
  60% { opacity: 1; transform: translateY(-120px) rotate(540deg); }
  100% { opacity: 0; transform: translateY(-220px) rotate(900deg); }
}

@keyframes confetti-3 {
  0% { opacity: 0; transform: translateY(0px) rotate(0deg); }
  20% { opacity: 1; transform: translateY(-25px) rotate(270deg); }
  70% { opacity: 1; transform: translateY(-110px) rotate(630deg); }
  100% { opacity: 0; transform: translateY(-210px) rotate(1080deg); }
}

/* Enhanced final text animation */
@keyframes final-text {
  0% { opacity: 0; transform: translateY(30px) scale(0.9); }
  70% { opacity: 0; transform: translateY(30px) scale(0.9); }
  85% { opacity: 1; transform: translateY(0px) scale(1); }
  100% { opacity: 1; transform: translateY(0px) scale(1); }
}

/* Spin slow utility */
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Animation classes */
.animate-float-large-1 {
  animation: float-large-1 8s ease-in-out infinite;
}

.animate-float-large-2 {
  animation: float-large-2 10s ease-in-out infinite;
}

.animate-float-large-3 {
  animation: float-large-3 12s ease-in-out infinite;
}

.animate-particle-1 {
  animation: particle-1 6s ease-in-out infinite;
}

.animate-particle-2 {
  animation: particle-2 8s ease-in-out infinite;
}

.animate-particle-3 {
  animation: particle-3 7s ease-in-out infinite;
}

.animate-particle-4 {
  animation: particle-4 9s ease-in-out infinite;
}

.animate-particle-5 {
  animation: particle-5 5s ease-in-out infinite;
}

.animate-geometric-1 {
  animation: geometric-1 4s ease-in-out infinite;
}

.animate-geometric-2 {
  animation: geometric-2 6s ease-in-out infinite;
}

.animate-stage-1 {
  animation: stage-1 25s ease-in-out infinite;
}

.animate-stage-2 {
  animation: stage-2 25s ease-in-out infinite;
}

.animate-stage-3 {
  animation: stage-3 25s ease-in-out infinite;
}

.animate-stage-4 {
  animation: stage-4 25s ease-in-out infinite;
}

.animate-character-upload {
  animation: character-upload 4s ease-in-out infinite;
}

.animate-character-celebrate {
  animation: character-celebrate 3s ease-in-out infinite;
}

.animate-source-platforms {
  animation: platform-bounce-1 3s ease-in-out infinite;
}

.animate-platform-bounce-1 {
  animation: platform-bounce-1 3s ease-in-out infinite;
}

.animate-platform-bounce-2 {
  animation: platform-bounce-2 3s ease-in-out infinite;
}

.animate-platform-bounce-3 {
  animation: platform-bounce-3 3s ease-in-out infinite;
}

.animate-pdf-float-1 {
  animation: pdf-float-1 5s ease-in-out infinite;
}

.animate-pdf-float-2 {
  animation: pdf-float-2 5s ease-in-out infinite 0.8s;
}

.animate-pdf-float-3 {
  animation: pdf-float-3 5s ease-in-out infinite 1.6s;
}

.animate-machine-processing {
  animation: machine-processing 4s ease-in-out infinite;
}

.animate-machine-glow-outer {
  animation: machine-glow-outer 3s ease-in-out infinite;
}

.animate-ai-pulse {
  animation: ai-pulse 2s ease-in-out infinite;
}

.animate-processing-particle-1 {
  animation: processing-particle-1 3s ease-in-out infinite;
}

.animate-processing-particle-2 {
  animation: processing-particle-2 3s ease-in-out infinite 0.5s;
}

.animate-processing-particle-3 {
  animation: processing-particle-3 3s ease-in-out infinite 1s;
}

.animate-processing-line-1 {
  animation: processing-line-1 2.5s ease-in-out infinite;
}

.animate-processing-line-2 {
  animation: processing-line-2 2.5s ease-in-out infinite 0.4s;
}

.animate-processing-line-3 {
  animation: processing-line-3 2.5s ease-in-out infinite 0.8s;
}

.animate-holographic {
  animation: holographic 3s ease-in-out infinite;
  background-size: 200% 200%;
}

.animate-energy-ring-1 {
  animation: energy-ring-1 4s ease-in-out infinite;
}

.animate-energy-ring-2 {
  animation: energy-ring-2 6s ease-in-out infinite;
}

.animate-processing-text-1 {
  animation: processing-text-1 8s ease-in-out infinite;
}

.animate-processing-text-2 {
  animation: processing-text-2 8s ease-in-out infinite;
}

.animate-processing-text-3 {
  animation: processing-text-3 8s ease-in-out infinite;
}

.animate-card-emerge-1 {
  animation: card-emerge-1 10s ease-in-out infinite;
}

.animate-card-emerge-2 {
  animation: card-emerge-2 10s ease-in-out infinite;
}

.animate-card-emerge-3 {
  animation: card-emerge-3 10s ease-in-out infinite;
}

.animate-card-emerge-4 {
  animation: card-emerge-4 10s ease-in-out infinite;
}

.animate-card-emerge-5 {
  animation: card-emerge-5 10s ease-in-out infinite;
}

.animate-card-emerge-6 {
  animation: card-emerge-6 10s ease-in-out infinite;
}

.animate-flashcard-1 {
  animation: flashcard-1 5s ease-in-out infinite;
}

.animate-flashcard-2 {
  animation: flashcard-2 5s ease-in-out infinite;
}

.animate-success-1 {
  animation: success-1 4s ease-in-out infinite;
}

.animate-success-2 {
  animation: success-2 4s ease-in-out infinite;
}

.animate-success-3 {
  animation: success-3 4s ease-in-out infinite;
}

.animate-success-4 {
  animation: success-4 4s ease-in-out infinite;
}

.animate-confetti-1 {
  animation: confetti-1 3s ease-in-out infinite;
}

.animate-confetti-2 {
  animation: confetti-2 3s ease-in-out infinite 0.3s;
}

.animate-confetti-3 {
  animation: confetti-3 3s ease-in-out infinite 0.6s;
}

.animate-final-text {
  animation: final-text 25s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}`}</style>
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Large floating orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full animate-float-large-1 blur-sm"></div>
        <div className="absolute bottom-32 right-16 w-40 h-40 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full animate-float-large-2 blur-sm"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-indigo-200/25 to-purple-200/25 rounded-full animate-float-large-3 blur-sm"></div>
        
        {/* Smaller particles */}
        <div className="absolute top-16 right-20 w-3 h-3 bg-purple-400 rounded-full animate-particle-1"></div>
        <div className="absolute top-32 left-32 w-2 h-2 bg-blue-400 rounded-full animate-particle-2"></div>
        <div className="absolute bottom-24 left-24 w-2.5 h-2.5 bg-indigo-400 rounded-full animate-particle-3"></div>
        <div className="absolute bottom-40 right-32 w-2 h-2 bg-purple-500 rounded-full animate-particle-4"></div>
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-blue-500 rounded-full animate-particle-5"></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-24 left-1/3 w-6 h-6 border-2 border-purple-300/40 rotate-45 animate-geometric-1"></div>
        <div className="absolute bottom-28 right-1/3 w-8 h-8 border-2 border-blue-300/40 animate-geometric-2"></div>
      </div>

      {/* Main Animation Container */}
      <div className="relative w-full h-full max-w-2xl">
        
        {/* Stage 1: Upload PDFs */}
        <div className="absolute inset-0 animate-stage-1">
          {/* Enhanced Character */}
          <div className="absolute bottom-20 left-16 animate-character-upload">
            <svg width="80" height="100" viewBox="0 0 80 100" className="drop-shadow-lg">
              {/* Character shadow */}
              <ellipse cx="40" cy="95" rx="15" ry="3" fill="rgba(0,0,0,0.1)" />
              
              {/* Character body */}
              <circle cx="40" cy="25" r="16" fill="url(#characterGradient)" stroke="url(#characterStroke)" strokeWidth="2" />
              <rect x="32" y="41" width="16" height="35" rx="8" fill="url(#characterGradient)" stroke="url(#characterStroke)" strokeWidth="2" />
              
              {/* Arms */}
              <rect x="22" y="48" width="10" height="25" rx="5" fill="url(#characterGradient)" stroke="url(#characterStroke)" strokeWidth="2" />
              <rect x="48" y="48" width="10" height="25" rx="5" fill="url(#characterGradient)" stroke="url(#characterStroke)" strokeWidth="2" />
              
              {/* Legs */}
              <rect x="34" y="76" width="12" height="18" rx="6" fill="url(#characterGradient)" stroke="url(#characterStroke)" strokeWidth="2" />
              
              {/* Enhanced face */}
              <circle cx="35" cy="22" r="2.5" fill="#6366f1" />
              <circle cx="45" cy="22" r="2.5" fill="#6366f1" />
              <path d="M 32 28 Q 40 34 48 28" stroke="#6366f1" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              
              {/* Hair */}
              <path d="M 28 15 Q 40 8 52 15 Q 48 12 40 12 Q 32 12 28 15" fill="url(#hairGradient)" />
            </svg>
          </div>

          {/* Source Platform Icons with enhanced design */}
          <div className="absolute top-12 left-12 animate-source-platforms">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg animate-platform-bounce-1 transform hover:scale-110 transition-transform">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.085"/>
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
              </div>
              
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center shadow-lg animate-platform-bounce-2 transform hover:scale-110 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.273L12 10.09l10.091-6.269h.273c.904 0 1.636.732 1.636 1.636z"/>
                </svg>
              </div>
              
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg animate-platform-bounce-3 transform hover:scale-110 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Enhanced Floating PDFs */}
          <div className="absolute top-16 left-32 animate-pdf-float-1">
            <div className="relative">
              <div className="w-16 h-20 bg-gradient-to-b from-red-400 to-red-600 rounded-lg shadow-xl flex flex-col items-center justify-center transform rotate-12">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="mb-1">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
                <span className="text-white text-xs font-bold">PDF</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-xs">📄</span>
              </div>
            </div>
          </div>
          
          <div className="absolute top-28 left-44 animate-pdf-float-2">
            <div className="relative">
              <div className="w-16 h-20 bg-gradient-to-b from-orange-400 to-orange-600 rounded-lg shadow-xl flex flex-col items-center justify-center transform -rotate-6">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="mb-1">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
                <span className="text-white text-xs font-bold">PDF</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-xs">📊</span>
              </div>
            </div>
          </div>
          
          <div className="absolute top-20 left-56 animate-pdf-float-3">
            <div className="relative">
              <div className="w-16 h-20 bg-gradient-to-b from-blue-400 to-blue-600 rounded-lg shadow-xl flex flex-col items-center justify-center transform rotate-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="mb-1">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
                <span className="text-white text-xs font-bold">PDF</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-xs">📚</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced AI Machine (Central) */}
        <div className="absolute bottom-12 right-20 animate-machine-processing">
          <div className="relative">
            {/* Machine glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-blue-400/30 rounded-3xl blur-xl animate-machine-glow-outer"></div>
            
            {/* Main machine body */}
            <div className="relative w-32 h-24 bg-gradient-to-br from-indigo-500 via-purple-600 to-blue-600 rounded-3xl shadow-2xl overflow-hidden">
              {/* AI Brain icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="white" className="animate-ai-pulse">
                  <path d="M12,2A2,2 0 0,1 14,4A2,2 0 0,1 12,6A2,2 0 0,1 10,4A2,2 0 0,1 12,2M21,9V7L15,7.5V9M15,16V14L21,14.5V16M4,15V13L10,13.5V15M4,10V8L10,8.5V10M6.5,14.5V16.5A2,2 0 0,0 8.5,18.5H9.5A2,2 0 0,0 11.5,16.5V14.5A2,2 0 0,0 9.5,12.5H8.5A2,2 0 0,0 6.5,14.5M12.5,14.5V16.5A2,2 0 0,0 14.5,18.5H15.5A2,2 0 0,0 17.5,16.5V14.5A2,2 0 0,0 15.5,12.5H14.5A2,2 0 0,0 12.5,14.5Z"/>
                </svg>
              </div>
              
              {/* Processing particles inside machine */}
              <div className="absolute top-2 left-2 w-2 h-2 bg-white/80 rounded-full animate-processing-particle-1"></div>
              <div className="absolute top-4 right-3 w-1.5 h-1.5 bg-white/60 rounded-full animate-processing-particle-2"></div>
              <div className="absolute bottom-3 left-4 w-1 h-1 bg-white/70 rounded-full animate-processing-particle-3"></div>
              
              {/* Animated processing lines */}
              <div className="absolute top-3 left-3 w-8 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent animate-processing-line-1"></div>
              <div className="absolute top-6 left-4 w-12 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent animate-processing-line-2"></div>
              <div className="absolute top-9 left-2 w-6 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent animate-processing-line-3"></div>
              
              {/* Holographic effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-blue-400/20 to-indigo-400/10 animate-holographic"></div>
            </div>
            
            {/* Machine base with enhanced design */}
            <div className="w-36 h-6 bg-gradient-to-r from-indigo-400 via-purple-500 to-blue-500 rounded-full mx-auto shadow-xl relative">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
            </div>
            
            {/* Energy rings */}
            <div className="absolute -inset-4 border-2 border-purple-300/30 rounded-full animate-energy-ring-1"></div>
            <div className="absolute -inset-8 border border-blue-300/20 rounded-full animate-energy-ring-2"></div>
          </div>
        </div>

        {/* Stage 2: Enhanced Processing Text */}
        <div className="absolute inset-0 animate-stage-2">
          <div className="absolute top-40 left-40 animate-processing-text-1">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-purple-200">
              <span className="text-purple-700 text-sm font-semibold flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
                Extracting Content
              </span>
            </div>
          </div>
          <div className="absolute top-52 right-40 animate-processing-text-2">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-blue-200">
              <span className="text-blue-700 text-sm font-semibold flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                Understanding Context
              </span>
            </div>
          </div>
          <div className="absolute top-64 left-48 animate-processing-text-3">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-indigo-200">
              <span className="text-indigo-700 text-sm font-semibold flex items-center">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse"></div>
                Organizing Knowledge
              </span>
            </div>
          </div>
        </div>

        {/* Stage 3: Enhanced Feature Cards */}
        <div className="absolute inset-0 animate-stage-3">
          <div className="absolute top-12 right-12 animate-card-emerge-1">
            <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-purple-100 min-w-max transform hover:scale-105 transition-transform">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">📂</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-800">Smart Organization</span>
                  <p className="text-xs text-gray-600">Auto-categorize files</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute top-28 right-24 animate-card-emerge-2">
            <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-blue-100 min-w-max transform hover:scale-105 transition-transform">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">🧠</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-800">AI Summaries</span>
                  <p className="text-xs text-gray-600">Key insights extracted</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute top-44 right-8 animate-card-emerge-3">
            <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-indigo-100 min-w-max transform hover:scale-105 transition-transform">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">📝</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-800">Smart Quizzes</span>
                  <p className="text-xs text-gray-600">Test your knowledge</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute top-60 right-20 animate-card-emerge-4">
            <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-purple-100 min-w-max transform hover:scale-105 transition-transform">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">🔍</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-800">Smart Search</span>
                  <p className="text-xs text-gray-600">Find anything instantly</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute top-76 right-12 animate-card-emerge-5">
            <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-orange-100 min-w-max transform hover:scale-105 transition-transform">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">🔔</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-800">Smart Reminders</span>
                  <p className="text-xs text-gray-600">Never forget to study</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute top-92 right-24 animate-card-emerge-6">
            <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-pink-100 min-w-max transform hover:scale-105 transition-transform">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">🤖</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-800">Ask Recallr</span>
                  <p className="text-xs text-gray-600">Chat with your docs</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stage 4: Enhanced Learning Success */}
        <div className="absolute inset-0 animate-stage-4">
          {/* Happy character with enhanced design */}
          <div className="absolute bottom-24 left-24 animate-character-celebrate">
            <svg width="80" height="100" viewBox="0 0 80 100" className="drop-shadow-lg">
              <ellipse cx="40" cy="95" rx="15" ry="3" fill="rgba(0,0,0,0.1)" />
              
              <circle cx="40" cy="25" r="16" fill="url(#characterGradientHappy)" stroke="url(#characterStrokeHappy)" strokeWidth="2" />
              <rect x="32" y="41" width="16" height="35" rx="8" fill="url(#characterGradientHappy)" stroke="url(#characterStrokeHappy)" strokeWidth="2" />
              
              {/* Celebrating arms */}
              <rect x="22" y="48" width="10" height="25" rx="5" fill="url(#characterGradientHappy)" stroke="url(#characterStrokeHappy)" strokeWidth="2" transform="rotate(-20 27 60)" />
              <rect x="48" y="48" width="10" height="25" rx="5" fill="url(#characterGradientHappy)" stroke="url(#characterStrokeHappy)" strokeWidth="2" transform="rotate(20 53 60)" />
              
              <rect x="34" y="76" width="12" height="18" rx="6" fill="url(#characterGradientHappy)" stroke="url(#characterStrokeHappy)" strokeWidth="2" />
              
              {/* Super happy face */}
              <circle cx="35" cy="22" r="2.5" fill="#10b981" />
              <circle cx="45" cy="22" r="2.5" fill="#10b981" />
              <path d="M 30 28 Q 40 36 50 28" stroke="#10b981" strokeWidth="3" fill="none" strokeLinecap="round" />
              
              {/* Party hat */}
              <path d="M 32 12 L 40 2 L 48 12 Z" fill="url(#partyHatGradient)" stroke="#10b981" strokeWidth="1" />
              <circle cx="40" cy="4" r="2" fill="#fbbf24" />
            </svg>
          </div>

          {/* Enhanced floating flashcards */}
          <div className="absolute top-16 left-40 animate-flashcard-1">
            <div className="relative">
              <div className="w-20 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl shadow-xl flex items-center justify-center transform rotate-12">
                <div className="text-center">
                  <div className="text-white text-2xl mb-1">✓</div>
                  <span className="text-white text-xs font-bold">Correct!</span>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-xs">⭐</span>
              </div>
            </div>
          </div>
          
          <div className="absolute top-32 left-56 animate-flashcard-2">
            <div className="relative">
              <div className="w-20 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl shadow-xl flex items-center justify-center transform -rotate-6">
                <div className="text-center">
                  <div className="text-white text-xl mb-1">A+</div>
                  <span className="text-white text-xs font-bold">Perfect!</span>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-400 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-xs">🎉</span>
              </div>
            </div>
          </div>

          {/* Enhanced success indicators */}
          <div className="absolute top-20 right-28 animate-success-1">
            <div className="text-4xl animate-bounce">⭐</div>
          </div>
          <div className="absolute top-40 right-16 animate-success-2">
            <div className="text-4xl animate-pulse">💡</div>
          </div>
          <div className="absolute top-60 right-32 animate-success-3">
            <div className="text-4xl animate-spin-slow">✨</div>
          </div>
          <div className="absolute top-80 right-20 animate-success-4">
            <div className="text-3xl animate-bounce">🎯</div>
          </div>
          
          {/* Confetti effect */}
          <div className="absolute top-12 left-1/2 animate-confetti-1">
            <div className="w-2 h-2 bg-yellow-400 transform rotate-45"></div>
          </div>
          <div className="absolute top-16 left-1/3 animate-confetti-2">
            <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
          </div>
          <div className="absolute top-20 right-1/3 animate-confetti-3">
            <div className="w-2 h-2 bg-blue-400 transform rotate-45"></div>
          </div>
        </div>

        {/* Enhanced Bottom Text */}
        <div className="absolute bottom-8 left-0 right-0 text-center animate-final-text">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 mx-8 shadow-xl border border-purple-100">
            <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Organize, Summarize,
            </p>
            <p className="text-2xl font-semibold text-indigo-700 mb-2">
              and Learn Smarter
            </p>
            <p className="text-xl font-medium bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              with Recallr AI
            </p>
            <div className="flex justify-center mt-4 space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        </div>

        {/* Enhanced SVG Gradients */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="characterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0e7ff" />
              <stop offset="50%" stopColor="#c7d2fe" />
              <stop offset="100%" stopColor="#a5b4fc" />
            </linearGradient>
            <linearGradient id="characterStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="characterGradientHappy" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dcfce7" />
              <stop offset="50%" stopColor="#bbf7d0" />
              <stop offset="100%" stopColor="#86efac" />
            </linearGradient>
            <linearGradient id="characterStrokeHappy" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="hairGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="partyHatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
    </>
  );
};

export default LoginAnimation;