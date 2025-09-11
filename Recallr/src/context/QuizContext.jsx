import React, { createContext, useContext, useReducer, ReactNode } from "react";
// import { QuizState, UserAnswer } from '../types/quiz';

// interface QuizContextType {
//   state: QuizState;
//   dispatch: React.Dispatch<QuizAction>;
// }

// type QuizAction =
//   | { type: 'SET_CURRENT_QUESTION'; payload: number }
//   | { type: 'SET_ANSWER'; payload: UserAnswer }
//   | { type: 'SET_TIME_REMAINING'; payload: number }
//   | { type: 'COMPLETE_QUIZ' }
//   | { type: 'UPDATE_SCORE'; payload: number }
//   | { type: 'RESET_QUIZ'; payload: Partial<QuizState> };

const initialState = {
  currentQuestionIndex: 0,
  answers: [],
  timeRemaining: 0,
  isCompleted: false,
  score: 0,
  startTime: Date.now(),
};

function quizReducer(state, action) {
  switch (action.type) {
    case "SET_CURRENT_QUESTION":
      return { ...state, currentQuestionIndex: action.payload };
    // case 'SET_ANSWER':
    //   const existingAnswerIndex = state.answers.findIndex(
    //     (answer) => answer.questionId === action.payload.questionId
    //   );

    //   let newAnswers;
    //   if (existingAnswerIndex !== -1) {
    //     newAnswers = [...state.answers];
    //     newAnswers[existingAnswerIndex] = action.payload;
    //   } else {
    //     newAnswers = [...state.answers, action.payload];
    //   }

    //   return { ...state, answers: newAnswers };
    case "SET_ANSWER": {
      const idx = state.answers.findIndex(
        (a) => a.questionId === action.payload.questionId
      );
      const answers =
        idx >= 0
          ? state.answers.map((a, i) => (i === idx ? action.payload : a))
          : [...state.answers, action.payload];
      return { ...state, answers };
    }
    case "SET_TIME_REMAINING":
      return { ...state, timeRemaining: action.payload };
    case "COMPLETE_QUIZ": {
      const completedAt = action.payload?.completedAt ?? Date.now();
      const durationSeconds =
        action.payload?.durationSeconds ??
        Math.max(0, Math.floor((completedAt - state.startTime) / 1000));

      return {
        ...state,
        isCompleted: true,
        completedAt,
        durationSeconds,
      };
    }
    case "UPDATE_SCORE":
      return { ...state, score: action.payload };
    case "RESET_QUIZ":
      return { ...initialState, ...action.payload };
    case "NEXT_QUESTION":
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
      };

    default:
      return state;
  }
}

const QuizContext = createContext(undefined);

export function QuizProvider({ children }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  return (
    <QuizContext.Provider value={{ state, dispatch }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
}
