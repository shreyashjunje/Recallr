import React, { useState, useEffect } from "react";

const RecallrAnimation = ({ isDark = false }) => {
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto" style={{ height: isMobile ? "300px" : "500px" }}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          /* Responsive adjustments */
          @media (max-width: 768px) {
            .recallr-animation .processing-hub {
              width: 80px;
              height: 80px;
            }
            
            .recallr-animation .hub-outer-ring {
              width: 80px;
              height: 80px;
            }
            
            .recallr-animation .hub-inner-ring {
              top: 10px;
              left: 10px;
              width: 60px;
              height: 60px;
            }
            
            .recallr-animation .recallr-core {
              top: 15px;
              left: 15px;
              width: 50px;
              height: 50px;
              font-size: 16px;
            }
            
            .recallr-animation .processing-indicator {
              top: -3px;
              left: -3px;
              width: 60px;
              height: 60px;
            }
            
            .recallr-animation .pdf-document {
              width: 24px;
              height: 30px;
            }
            
            .recallr-animation .source-platform {
              width: 28px;
              height: 28px;
              font-size: 12px;
            }
            
            .recallr-animation .output-card {
              transform: scale(0.7);
              transform-origin: top center;
            }
            
            .recallr-animation .summary-output {
              top: 20px !important;
              right: 10px !important;
            }
            
            .recallr-animation .quiz-output {
              top: 20px !important;
              left: 10px !important;
            }
            
            .recallr-animation .dashboard-output {
              top: 220px !important;
              right: 10px !important;
            }
            
            .recallr-animation .search-output {
              top: 220px !important;
              left: 10px !important;
            }
            
            .recallr-animation .chat-output {
              top: 120px !important;
              bottom: auto !important;
            }
            
            /* Adjust animation positions for mobile */
            .recallr-animation .pdf-1 { 
              --end-x: -30px; 
              --end-y: -20px; 
            }
            
            .recallr-animation .pdf-2 { 
              --end-x: 30px; 
              --end-y: -20px; 
            }
            
            .recallr-animation .pdf-3 { 
              --end-x: -30px; 
              --end-y: 20px; 
            }
            
            .recallr-animation .pdf-4 { 
              --end-x: 30px; 
              --end-y: 20px; 
            }
            
            .recallr-animation .platform-gmail { 
              top: 40px; 
              left: 40px; 
            }
            
            .recallr-animation .platform-drive { 
              top: 40px; 
              right: 40px; 
            }
            
            .recallr-animation .platform-whatsapp { 
              bottom: 40px; 
              left: 40px; 
            }
            
            .recallr-animation .platform-folder { 
              bottom: 40px; 
              right: 40px; 
            }
          }

          /* Animation keyframes */
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            25% { transform: translateY(-10px) translateX(5px); }
            50% { transform: translateY(0px) translateX(10px); }
            75% { transform: translateY(10px) translateX(5px); }
          }

          @keyframes coreSequence {
            0% { transform: scale(0); opacity: 0; }
            10% { transform: scale(1); opacity: 1; }
            15%, 75% { transform: scale(1); opacity: 1; }
            90% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(0); opacity: 0; }
          }

          @keyframes processingPulse {
            20%, 35% { opacity: 1; transform: rotate(360deg); }
            0%, 15%, 40%, 100% { opacity: 0; transform: rotate(0deg); }
          }

          @keyframes pdfFlyIn {
            0% { 
              opacity: 0; 
              transform: translateX(var(--start-x)) translateY(var(--start-y)) scale(0.3) rotate(var(--rotation)); 
            }
            70% { 
              opacity: 1; 
              transform: translateX(calc(var(--end-x) * 0.8)) translateY(calc(var(--end-y) * 0.8)) scale(0.8) rotate(0deg); 
            }
            100% { 
              opacity: 1; 
              transform: translateX(var(--end-x)) translateY(var(--end-y)) scale(1) rotate(0deg); 
            }
          }

          @keyframes platformAppear {
            0% { opacity: 0; transform: scale(0) rotate(-180deg); }
            60% { opacity: 1; transform: scale(1.1) rotate(0deg); }
            100% { opacity: 1; transform: scale(1) rotate(0deg); }
          }

          @keyframes outputReveal {
            0% { opacity: 0; transform: translateY(30px) scale(0.9); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }

          @keyframes itemSlideIn {
            0% { opacity: 0; transform: translateX(-20px); }
            100% { opacity: 1; transform: translateX(0); }
          }

          @keyframes scaleIn {
            0% { opacity: 0; transform: scale(0); }
            100% { opacity: 1; transform: scale(1); }
          }

          /* Base styles */
          .recallr-animation {
            position: relative;
            width: 100%;
            height: 100%;
            border-radius: 1rem;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            border: 1px solid;
            transition: all 0.5s ease;
          }

          .recallr-animation.dark-mode {
            background: linear-gradient(to bottom right, #1f2937, #111827);
            border-color: #374151;
          }

          .recallr-animation.light-mode {
            background: linear-gradient(to bottom right, #ffffff, #f8fafc);
            border-color: #e2e8f0;
          }

          .recallr-animation .bg-particle {
            position: absolute;
            width: 2px;
            height: 2px;
            border-radius: 50%;
            animation: float 8s ease-in-out infinite;
          }

          .recallr-animation.dark-mode .bg-particle {
            background: rgba(102, 126, 234, 0.4);
          }

          .recallr-animation.light-mode .bg-particle {
            background: rgba(102, 126, 234, 0.3);
          }

          .recallr-animation .bg-particle:nth-child(odd) {
            animation-direction: reverse;
          }

          .recallr-animation .processing-hub {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 120px;
            height: 120px;
            z-index: 100;
          }

          .recallr-animation .hub-outer-ring {
            position: absolute;
            width: 120px;
            height: 120px;
            border: 2px solid;
            border-radius: 50%;
            animation: rotate 20s linear infinite;
          }

          .recallr-animation.dark-mode .hub-outer-ring {
            border-color: rgba(102, 126, 234, 0.3);
          }

          .recallr-animation.light-mode .hub-outer-ring {
            border-color: rgba(102, 126, 234, 0.2);
          }

          .recallr-animation .hub-inner-ring {
            position: absolute;
            top: 15px;
            left: 15px;
            width: 90px;
            height: 90px;
            border: 1px solid;
            border-radius: 50%;
            animation: rotate 15s linear infinite reverse;
          }

          .recallr-animation.dark-mode .hub-inner-ring {
            border-color: rgba(118, 75, 162, 0.4);
          }

          .recallr-animation.light-mode .hub-inner-ring {
            border-color: rgba(118, 75, 162, 0.3);
          }

          .recallr-animation .recallr-core {
            position: absolute;
            top: 25px;
            left: 25px;
            width: 70px;
            height: 70px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: 800;
            color: white;
            box-shadow: 0 0 30px rgba(102, 126, 234, 0.4);
            animation: coreSequence 20s infinite;
          }

          .recallr-animation .processing-indicator {
            position: absolute;
            top: -5px;
            left: -5px;
            width: 80px;
            height: 80px;
            border: 2px solid transparent;
            border-top: 2px solid #667eea;
            border-radius: 50%;
            opacity: 0;
            animation: processingPulse 20s infinite;
          }

          .recallr-animation .pdf-document {
            position: absolute;
            width: 32px;
            height: 40px;
            border-radius: 6px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
            opacity: 0;
            z-index: 50;
            border: 1px solid;
          }

          .recallr-animation.dark-mode .pdf-document {
            background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
            border-color: #4b5563;
          }

          .recallr-animation.light-mode .pdf-document {
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            border-color: rgba(226, 232, 240, 0.6);
          }

          .recallr-animation .pdf-document::before {
            content: '';
            position: absolute;
            top: 4px;
            left: 4px;
            right: 4px;
            height: 1px;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            border-radius: 1px;
          }

          .recallr-animation .pdf-document::after {
            content: '';
            position: absolute;
            top: 8px;
            left: 4px;
            right: 8px;
            bottom: 4px;
            border-radius: 2px;
          }

          .recallr-animation.dark-mode .pdf-document::after {
            background: 
              linear-gradient(90deg, #4b5563 0%, transparent 100%) 0 0/100% 1px,
              linear-gradient(90deg, #4b5563 0%, transparent 80%) 0 3px/100% 1px,
              linear-gradient(90deg, #4b5563 0%, transparent 60%) 0 6px/100% 1px;
          }

          .recallr-animation.light-mode .pdf-document::after {
            background: 
              linear-gradient(90deg, #e2e8f0 0%, transparent 100%) 0 0/100% 1px,
              linear-gradient(90deg, #e2e8f0 0%, transparent 80%) 0 3px/100% 1px,
              linear-gradient(90deg, #e2e8f0 0%, transparent 60%) 0 6px/100% 1px;
          }

          .recallr-animation .pdf-icon {
            position: absolute;
            bottom: 2px;
            right: 2px;
            width: 8px;
            height: 8px;
            background: #667eea;
            border-radius: 1px;
            font-size: 4px;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
          }

          .recallr-animation .source-platform {
            position: absolute;
            width: 36px;
            height: 36px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            opacity: 0;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
          }

          .recallr-animation .platform-gmail { 
            background: linear-gradient(135deg, #ea4335 0%, #d33b2c 100%); 
            color: white;
            top: 60px; 
            left: 60px; 
          }
          .recallr-animation .platform-drive { 
            background: linear-gradient(135deg, #4285f4 0%, #1a73e8 100%); 
            color: white;
            top: 60px; 
            right: 60px; 
          }
          .recallr-animation .platform-whatsapp { 
            background: linear-gradient(135deg, #25d366 0%, #1ebe57 100%); 
            color: white;
            bottom: 60px; 
            left: 60px; 
          }
          .recallr-animation .platform-folder { 
            background: linear-gradient(135deg, #ff9500 0%, #ff8c00 100%); 
            color: white;
            bottom: 60px; 
            right: 60px; 
          }

          .recallr-animation .output-card {
            position: absolute;
            backdrop-filter: blur(20px);
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2), 0 15px 30px rgba(0, 0, 0, 0.08);
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            border: 1px solid;
            transition: all 0.3s ease;
          }

          .recallr-animation.dark-mode .output-card {
            background: rgba(31, 41, 55, 0.9);
            border-color: rgba(75, 85, 99, 0.5);
          }

          .recallr-animation.light-mode .output-card {
            background: rgba(255, 255, 255, 0.95);
            border-color: rgba(226, 232, 240, 0.3);
          }

          .recallr-animation .card-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
          }

          .recallr-animation .card-icon {
            width: 24px;
            height: 24px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }

          .recallr-animation .card-title {
            font-size: 14px;
            font-weight: 700;
          }

          .recallr-animation.dark-mode .card-title {
            color: #f3f4f6;
          }

          .recallr-animation.light-mode .card-title {
            color: #1e293b;
          }

          .recallr-animation .summary-output {
            width: 200px;
            height: 150px;
            top: 40px;
            right: 80px;
          }

          .recallr-animation .summary-item {
            display: flex;
            align-items: center;
            gap: 6px;
            margin: 6px 0;
            opacity: 0;
            transform: translateX(-10px);
          }

          .recallr-animation .summary-bullet {
            width: 4px;
            height: 4px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
          }

          .recallr-animation .summary-text {
            font-size: 11px;
            font-weight: 500;
          }

          .recallr-animation.dark-mode .summary-text {
            color: #d1d5db;
          }

          .recallr-animation.light-mode .summary-text {
            color: #475569;
          }

          .recallr-animation .quiz-output {
            width: 220px;
            height: 180px;
            top: 40px;
            left: 50px;
          }

          .recallr-animation .quiz-question {
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 12px;
            line-height: 1.4;
          }

          .recallr-animation.dark-mode .quiz-question {
            color: #f3f4f6;
          }

          .recallr-animation.light-mode .quiz-question {
            color: #1e293b;
          }

          .recallr-animation .quiz-option {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 8px;
            margin: 4px 0;
            border-radius: 6px;
            opacity: 0;
            transform: translateX(-10px);
            font-size: 10px;
            border: 1px solid;
            transition: all 0.3s ease;
          }

          .recallr-animation.dark-mode .quiz-option {
            background: rgba(55, 65, 81, 0.8);
            color: #e5e7eb;
            border-color: #4b5563;
          }

          .recallr-animation.light-mode .quiz-option {
            background: rgba(248, 250, 252, 0.8);
            color: #475569;
            border-color: rgba(226, 232, 240, 0.5);
          }

          .recallr-animation .option-indicator {
            width: 12px;
            height: 12px;
            border: 1px solid;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8px;
          }

          .recallr-animation.dark-mode .option-indicator {
            border-color: #6b7280;
          }

          .recallr-animation.light-mode .option-indicator {
            border-color: #cbd5e0;
          }

          .recallr-animation .quiz-option.correct .option-indicator {
            background: #10b981;
            border-color: #10b981;
            color: white;
          }

          .recallr-animation .dashboard-output {
            width: 180px;
            height: 130px;
            top: 350px;
            right: 70px;
          }

          .recallr-animation .folder-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            margin-top: 6px;
          }

          .recallr-animation .smart-folder {
            aspect-ratio: 1;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transform: scale(0);
            border: 1px solid;
            transition: all 0.3s ease;
          }

          .recallr-animation.dark-mode .smart-folder {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
            border-color: rgba(102, 126, 234, 0.3);
          }

          .recallr-animation.light-mode .smart-folder {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
            border-color: rgba(102, 126, 234, 0.2);
          }

          .recallr-animation .folder-icon {
            font-size: 16px;
            margin-bottom: 2px;
          }

          .recallr-animation .folder-label {
            font-size: 8px;
            font-weight: 600;
            text-align: center;
          }

          .recallr-animation.dark-mode .folder-label {
            color: #d1d5db;
          }

          .recallr-animation.light-mode .folder-label {
            color: #475569;
          }

          .recallr-animation .search-output {
            width: 200px;
            height: 130px;
            top: 300px;
            right: 320px;
          }

          .recallr-animation .search-container {
            position: relative;
            margin-top: 6px;
          }

          .recallr-animation .search-input {
            width: 100%;
            height: 28px;
            border-radius: 8px;
            padding: 0 12px 0 28px;
            font-size: 10px;
            outline: none;
            border: 1px solid;
            transition: all 0.3s ease;
          }

          .recallr-animation.dark-mode .search-input {
            background: rgba(55, 65, 81, 0.8);
            border-color: #4b5563;
            color: #e5e7eb;
          }

          .recallr-animation.light-mode .search-input {
            background: rgba(248, 250, 252, 0.8);
            border-color: rgba(226, 232, 240, 0.6);
            color: #1e293b;
          }

          .recallr-animation .search-icon {
            position: absolute;
            left: 8px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 12px;
          }

          .recallr-animation.dark-mode .search-icon {
            color: #9ca3af;
          }

          .recallr-animation.light-mode .search-icon {
            color: #94a3b8;
          }

          .recallr-animation .search-result {
            display: flex;
            align-items: center;
            gap: 6px;
            margin: 4px 0;
            font-size: 9px;
            opacity: 0;
          }

          .recallr-animation.dark-mode .search-result {
            color: #d1d5db;
          }

          .recallr-animation.light-mode .search-result {
            color: #64748b;
          }

          .recallr-animation .result-icon {
            width: 12px;
            height: 12px;
            border-radius: 3px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 6px;
          }

          .recallr-animation.dark-mode .result-icon {
            background: rgba(102, 126, 234, 0.2);
            color: #818cf8;
          }

          .recallr-animation.light-mode .result-icon {
            background: rgba(102, 126, 234, 0.1);
            color: #667eea;
          }

          .recallr-animation .chat-output {
            width: 240px;
            height: 120px;
            bottom: 240px;
            left: 50%;
            transform: translateX(-50%);
          }

          .recallr-animation .chat-container {
            height: 90px;
            overflow: hidden;
            margin-top: 6px;
          }

          .recallr-animation .chat-message {
            max-width: 80%;
            padding: 6px 10px;
            border-radius: 8px;
            margin: 6px 0;
            font-size: 10px;
            line-height: 1.4;
            opacity: 0;
            transform: translateY(10px);
          }

          .recallr-animation .user-message {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin-left: auto;
            border-bottom-right-radius: 3px;
          }

          .recallr-animation .ai-message {
            color: #1e293b;
            border: 1px solid;
            border-bottom-left-radius: 3px;
          }

          .recallr-animation.dark-mode .ai-message {
            background: rgba(55, 65, 81, 0.9);
            border-color: #4b5563;
            color: #e5e7eb;
          }

          .recallr-animation.light-mode .ai-message {
            background: rgba(248, 250, 252, 0.9);
            border-color: rgba(226, 232, 240, 0.5);
            color: #1e293b;
          }

          /* Animation sequences */
          .recallr-animation .pdf-1 { animation: pdfFlyIn 3s cubic-bezier(0.23, 1, 0.32, 1) 0.8s forwards; --start-x: -200px; --start-y: -100px; --end-x: -60px; --end-y: -30px; --rotation: -15deg; }
          .recallr-animation .pdf-2 { animation: pdfFlyIn 3s cubic-bezier(0.23, 1, 0.32, 1) 1.2s forwards; --start-x: 200px; --start-y: -100px; --end-x: 60px; --end-y: -30px; --rotation: 15deg; }
          .recallr-animation .pdf-3 { animation: pdfFlyIn 3s cubic-bezier(0.23, 1, 0.32, 1) 1.6s forwards; --start-x: -200px; --start-y: 100px; --end-x: -60px; --end-y: 30px; --rotation: 10deg; }
          .recallr-animation .pdf-4 { animation: pdfFlyIn 3s cubic-bezier(0.23, 1, 0.32, 1) 2.0s forwards; --start-x: 200px; --start-y: 100px; --end-x: 60px; --end-y: 30px; --rotation: -10deg; }

          .recallr-animation .platform-1 { animation: platformAppear 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s forwards; }
          .recallr-animation .platform-2 { animation: platformAppear 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.8s forwards; }
          .recallr-animation .platform-3 { animation: platformAppear 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) 1.2s forwards; }
          .recallr-animation .platform-4 { animation: platformAppear 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) 1.6s forwards; }

          .recallr-animation .output-1 { animation: outputReveal 1.2s cubic-bezier(0.23, 1, 0.32, 1) 5s forwards; }
          .recallr-animation .output-2 { animation: outputReveal 1.2s cubic-bezier(0.23, 1, 0.32, 1) 7s forwards; }
          .recallr-animation .output-3 { animation: outputReveal 1.2s cubic-bezier(0.23, 1, 0.32, 1) 9s forwards; }
          .recallr-animation .output-4 { animation: outputReveal 1.2s cubic-bezier(0.23, 1, 0.32, 1) 11s forwards; }

          .recallr-animation .item-1 { animation: itemSlideIn 0.6s ease-out 5.5s forwards; }
          .recallr-animation .item-2 { animation: itemSlideIn 0.6s ease-out 5.8s forwards; }
          .recallr-animation .item-3 { animation: itemSlideIn 0.6s ease-out 6.1s forwards; }

          .recallr-animation .quiz-opt-1 { animation: itemSlideIn 0.6s ease-out 7.5s forwards; }
          .recallr-animation .quiz-opt-2 { animation: itemSlideIn 0.6s ease-out 7.8s forwards; }
          .recallr-animation .quiz-opt-3 { animation: itemSlideIn 0.6s ease-out 8.1s forwards; }

          .recallr-animation .folder-1 { animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 9.5s forwards; }
          .recallr-animation .folder-2 { animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 9.8s forwards; }
          .recallr-animation .folder-3 { animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 10.1s forwards; }

          .recallr-animation .search-res-1 { animation: itemSlideIn 0.6s ease-out 11.5s forwards; }
          .recallr-animation .search-res-2 { animation: itemSlideIn 0.6s ease-out 11.8s forwards; }

          .recallr-animation .chat-msg-1 { animation: itemSlideIn 0.6s ease-out 13.5s forwards; }
          .recallr-animation .chat-msg-2 { animation: itemSlideIn 0.6s ease-out 14.2s forwards; }
        `,
        }}
      />

      <div className={`relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border recallr-animation ${isDark ? 'dark-mode' : 'light-mode'}`}>
        {/* Background Particles */}
        <div
          className="bg-particle"
          style={{ top: "10%", left: "15%", animationDelay: "0s" }}
        ></div>
        <div
          className="bg-particle"
          style={{ top: "20%", right: "20%", animationDelay: "2s" }}
        ></div>
        <div
          className="bg-particle"
          style={{ bottom: "15%", left: "25%", animationDelay: "4s" }}
        ></div>
        <div
          className="bg-particle"
          style={{ bottom: "25%", right: "15%", animationDelay: "6s" }}
        ></div>

        {/* Source Platforms */}
        <div
          className="source-platform platform-gmail platform-1"
          aria-label="Gmail"
        >
          📧
        </div>
        <div
          className="source-platform platform-drive platform-2"
          aria-label="Drive"
        >
          ☁️
        </div>
        <div
          className="source-platform platform-whatsapp platform-3"
          aria-label="WhatsApp"
        >
          💬
        </div>
        <div
          className="source-platform platform-folder platform-4"
          aria-label="Folder"
        >
          📁
        </div>

        {/* PDF Documents */}
        <div
          className="pdf-document pdf-1"
          style={{ top: "280px", left: "380px" }}
        >
          <div className="pdf-icon">P</div>
        </div>
        <div
          className="pdf-document pdf-2"
          style={{ top: "280px", left: "420px" }}
        >
          <div className="pdf-icon">D</div>
        </div>
        <div
          className="pdf-document pdf-3"
          style={{ top: "300px", left: "450px" }}
        >
          <div className="pdf-icon">F</div>
        </div>
        <div
          className="pdf-document pdf-4"
          style={{ top: "320px", left: "420px" }}
        >
          <div className="pdf-icon">S</div>
        </div>

        {/* Central Processing Hub */}
        <div className="processing-hub">
          <div className="hub-outer-ring"></div>
          <div className="hub-inner-ring"></div>
          <div className="recallr-core">R</div>
          <div className="processing-indicator"></div>
        </div>

        {/* Output 1: AI Summary */}
        <div className="output-card summary-output output-1">
          <div className="card-header">
            <div className="card-icon" aria-label="Summary icon">
              📝
            </div>
            <div className="card-title">AI Summary</div>
          </div>
          <div className="summary-item item-1">
            <div className="summary-bullet"></div>
            <div className="summary-text">Key concepts extracted</div>
          </div>
          <div className="summary-item item-2">
            <div className="summary-bullet"></div>
            <div className="summary-text">Main topics identified</div>
          </div>
          <div className="summary-item item-3">
            <div className="summary-bullet"></div>
            <div className="summary-text">Critical insights highlighted</div>
          </div>
        </div>

        {/* Output 2: Quiz Interface */}
        <div className="output-card quiz-output output-2">
          <div className="card-header">
            <div className="card-icon" aria-label="Quiz icon">
              🎯
            </div>
            <div className="card-title">Smart Quiz</div>
          </div>
          <div className="quiz-question">What is machine learning?</div>
          <div className="quiz-option quiz-opt-1">
            <div className="option-indicator">A</div>
            <span>Faster computation</span>
          </div>
          <div className="quiz-option quiz-opt-2">
            <div className="option-indicator">B</div>
            <span>Pattern recognition</span>
          </div>
          <div className="quiz-option quiz-opt-3 correct">
            <div className="option-indicator">✓</div>
            <span>Learning from data</span>
          </div>
        </div>

        {/* Output 3: Smart Organization */}
        <div className="output-card dashboard-output output-3">
          <div className="card-header">
            <div className="card-icon" aria-label="Organization icon">
              🗂️
            </div>
            <div className="card-title">Smart Organization</div>
          </div>
          <div className="folder-grid">
            <div className="smart-folder folder-1">
              <div className="folder-icon">⚡</div>
              <div className="folder-label">DSA</div>
            </div>
            <div className="smart-folder folder-2">
              <div className="folder-icon">🌐</div>
              <div className="folder-label">Web Dev</div>
            </div>
            <div className="smart-folder folder-3">
              <div className="folder-icon">🤖</div>
              <div className="folder-label">AI/ML</div>
            </div>
          </div>
        </div>

        {/* Output 4: Smart Search */}
        <div className="output-card search-output output-4">
          <div className="card-header">
            <div className="card-icon" aria-label="Search icon">
              🔍
            </div>
            <div className="card-title">Smart Search</div>
          </div>
          <div className="search-container">
            <div className="search-icon">🔍</div>
            <input
              type="text"
              className="search-input"
              placeholder="binary search algorithms..."
              readOnly
              aria-label="Search input"
            />
          </div>
          <div className="search-result search-res-1">
            <div className="result-icon">📄</div>
            <span>Algorithm basics.pdf</span>
          </div>
          <div className="search-result search-res-2">
            <div className="result-icon">📄</div>
            <span>Advanced tips.pdf</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecallrAnimation;