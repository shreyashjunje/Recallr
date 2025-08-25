// import { QuizInfo, Question } from '../types/quiz';

export const sampleQuizInfo= {
  id: 'science-tech-quiz',
  title: 'Science & Technology Quiz',
  category: 'Science',
  difficulty: 'Medium',
  totalQuestions: 10,
  timeLimit: 15,
  pointsPerQuestion: 100,
  rules: [
    'Read each question carefully before selecting your answer',
    'You can navigate back and forth between questions',
    'Some questions may have multiple correct answers',
    'Your progress is automatically saved',
    'Submit the quiz before time runs out to save your score'
  ]
};

export const sampleQuestions= [
  {
    id: 'q1',
    type: 'mcq',
    question: 'Which of the following energy sources cannot be replenished naturally on a human timescale, making it an example of a non-renewable resource?',
    options: ['Solar Power', 'Wind Power', 'Natural Gas', 'Hydroelectric Power'],
    correctAnswer: 'Natural Gas',
    points: 100
  },
  {
    id: 'q2',
    type: 'trueFalse',
    question: 'Artificial Intelligence can only process structured data and cannot work with unstructured data like images or text.',
    correctAnswer: 'false',
    points: 100
  },
  {
    id: 'q3',
    type: 'mcq',
    question: 'Which programming paradigms are commonly used in modern software development?',
    options: ['Object-Oriented Programming', 'Functional Programming', 'Procedural Programming', 'Declarative Programming'],
    correctAnswer: ['Object-Oriented Programming', 'Functional Programming', 'Procedural Programming', 'Declarative Programming'],
    multipleSelect: true,
    points: 100
  },
  {
    id: 'q4',
    type: 'fillBlank',
    question: 'The process by which plants convert sunlight into chemical energy is called ________.',
    correctAnswer: 'photosynthesis',
    points: 100
  },
  {
    id: 'q5',
    type: 'shortAnswer',
    question: 'Explain the difference between machine learning and deep learning, and provide an example of when you would use each approach.',
    wordLimit: 100,
    points: 100
  },
  {
    id: 'q6',
    type: 'mcq',
    question: 'What is the primary function of DNA in living organisms?',
    options: [
      'Energy production',
      'Storing genetic information',
      'Protein synthesis',
      'Cell division regulation'
    ],
    correctAnswer: 'Storing genetic information',
    points: 100
  },
  {
    id: 'q7',
    type: 'trueFalse',
    question: 'Quantum computers use quantum bits (qubits) that can exist in multiple states simultaneously, unlike classical bits that are either 0 or 1.',
    correctAnswer: 'true',
    points: 100
  },
  {
    id: 'q8',
    type: 'fillBlank',
    question: 'The smallest unit of matter that retains the properties of an element is called an ________.',
    correctAnswer: 'atom',
    points: 100
  },
  {
    id: 'q9',
    type: 'mcq',
    question: 'Which layer of the OSI model is responsible for routing data between different networks?',
    options: ['Physical Layer', 'Data Link Layer', 'Network Layer', 'Transport Layer'],
    correctAnswer: 'Network Layer',
    points: 100
  },
  {
    id: 'q10',
    type: 'shortAnswer',
    question: 'Describe the potential benefits and risks of gene editing technologies like CRISPR in medical applications.',
    wordLimit: 150,
    points: 100
  }
];