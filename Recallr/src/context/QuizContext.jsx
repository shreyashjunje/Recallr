import React, { createContext, useContext, useState, useEffect } from 'react';

const QuizContext = createContext();

const mockQuestions = [
  {
    id: '1',
    question: 'What is the primary purpose of machine learning algorithms?',
    type: 'mcq',
    options: [
      'To replace human intelligence completely',
      'To learn patterns from data and make predictions',
      'To store large amounts of data',
      'To create user interfaces'
    ],
    correctAnswer: 1,
    explanation: 'Machine learning algorithms are designed to identify patterns in data and use these patterns to make predictions or decisions on new, unseen data.',
    difficulty: 'medium'
  },
  {
    id: '2',
    question: 'Neural networks are always better than traditional algorithms for all problems.',
    type: 'tf',
    correctAnswer: false,
    explanation: 'Neural networks are powerful but not always the best choice. Traditional algorithms may be more appropriate for certain problems, especially when data is limited or interpretability is important.',
    difficulty: 'easy'
  },
  {
    id: '3',
    question: 'Fill in the blank: The process of adjusting model parameters based on training data is called _______.',
    type: 'fill',
    correctAnswer: 'training',
    explanation: 'Training is the process where a machine learning model learns from data by adjusting its internal parameters to minimize prediction errors.',
    difficulty: 'easy'
  },
  {
    id: '4',
    question: 'What is overfitting in machine learning?',
    type: 'mcq',
    options: [
      'When a model performs well on training data but poorly on new data',
      'When a model takes too long to train',
      'When a model uses too much memory',
      'When a model is too simple'
    ],
    correctAnswer: 0,
    explanation: 'Overfitting occurs when a model learns the training data too well, including noise and outliers, leading to poor generalization on new, unseen data.',
    difficulty: 'hard'
  },
  {
    id: '5',
    question: 'Cross-validation is used to assess model performance.',
    type: 'tf',
    correctAnswer: true,
    explanation: 'Cross-validation is a technique used to evaluate how well a model will generalize to unseen data by training and testing on different subsets of the available data.',
    difficulty: 'medium'
  }
];

export const QuizProvider = ({ children }) => {
  const [pdfs, setPdfs] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedPdfs = localStorage.getItem('quiz-pdfs');
    const savedQuizzes = localStorage.getItem('quiz-quizzes');
    const savedResults = localStorage.getItem('quiz-results');

    if (savedPdfs) setPdfs(JSON.parse(savedPdfs));
    if (savedQuizzes) setQuizzes(JSON.parse(savedQuizzes));
    if (savedResults) setResults(JSON.parse(savedResults));
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('quiz-pdfs', JSON.stringify(pdfs));
  }, [pdfs]);

  useEffect(() => {
    localStorage.setItem('quiz-quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('quiz-results', JSON.stringify(results));
  }, [results]);

  const addPDF = (pdf) => {
    setPdfs(prev => [...prev, pdf]);
  };

  const removePDF = (id) => {
    setPdfs(prev => prev.filter(pdf => pdf.id !== id));
  };

  const generateQuiz = async (formData) => {
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get selected questions based on form data
    let selectedQuestions = [...mockQuestions];
    
    // Filter by question types
    if (formData.questionTypes.length > 0) {
      const typeMap = {
        'mcq': 'mcq',
        'tf': 'tf',
        'fill': 'fill',
        'short': 'short'
      };
      
      const allowedTypes = formData.questionTypes.map(t => typeMap[t]).filter(Boolean);
      selectedQuestions = selectedQuestions.filter(q => allowedTypes.includes(q.type));
    }

    // Filter by difficulty
    if (formData.difficulty !== 'mixed') {
      selectedQuestions = selectedQuestions.filter(q => q.difficulty === formData.difficulty);
    }

    // Shuffle questions if needed
    if (formData.shuffleQuestions) {
      selectedQuestions.sort(() => Math.random() - 0.5);
    }

    // Limit number of questions
    selectedQuestions = selectedQuestions.slice(0, formData.numQuestions);

    // If we don't have enough questions, duplicate some
    while (selectedQuestions.length < formData.numQuestions && mockQuestions.length > 0) {
      const randomQuestion = mockQuestions[Math.floor(Math.random() * mockQuestions.length)];
      selectedQuestions.push({
        ...randomQuestion,
        id: `${randomQuestion.id}-${Date.now()}-${Math.random()}`
      });
    }

    const quiz = {
      id: Date.now().toString(),
      title: formData.source === 'library' 
        ? `Quiz from ${pdfs.find(p => p.id === formData.selectedPDF)?.name || 'PDF'}`
        : `Quiz from ${formData.uploadedFile?.name || 'Uploaded PDF'}`,
      pdfId: formData.selectedPDF,
      questions: selectedQuestions,
      settings: formData,
      createdAt: new Date().toISOString()
    };

    setQuizzes(prev => [...prev, quiz]);
    return quiz;
  };

  const saveResult = (result) => {
    setResults(prev => [...prev, result]);
  };

  return (
    <QuizContext.Provider value={{
      pdfs,
      quizzes,
      results,
      addPDF,
      removePDF,
      generateQuiz,
      saveResult
    }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};