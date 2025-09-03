import React, { useState, useEffect, useCallback } from "react";
import { useQuiz } from "../../context/QuizContext";
import { useTimer } from "../../hooks/useTimer";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useTheme } from "../../context/ThemeContext";
import { QuestionRenderer } from "./QuizRenderer";
import { QuizNavigation } from "./QuizNavigation";
import { QuizStats } from "./QuizStats";
import { QuizResults } from "./QuizResults";
import { ArrowLeft, Sun, Moon } from "lucide-react";

const pointsPerQuestion = 100;

export function Quiz({ quizInfo, questions, onExit }) {
  const { state, dispatch } = useQuiz();
  const { isDark, toggleTheme } = useTheme();
  const [showQuestionGrid, setShowQuestionGrid] = useState(false);
  const [savedAnswers, setSavedAnswers] = useLocalStorage(
    `quiz-${quizInfo._id}-answers`,
    []
  );

  // Initialize quiz state
  // useEffect(() => {
  //   dispatch({
  //     type: "RESET_QUIZ",
  //     payload: {
  //       currentQuestionIndex: 0,
  //       answers: savedAnswers,
  //       timeRemaining: quizInfo.settings?.timeLimit * 60,
  //       isCompleted: false,
  //       score: 0,
  //       startTime: Date.now(),
  //     },
  //   });
  // }, [quizInfo._id]);
  useEffect(() => {
    // Don't reset if we're already in the middle of a quiz
    if (state.quizId !== quizInfo._id) {
      dispatch({
        type: "INIT_QUIZ",
        payload: {
          quizId: quizInfo._id,
          currentQuestionIndex: 0,
          answers: savedAnswers,
          timeRemaining: quizInfo.settings?.timeLimit * 60,
          isCompleted: savedAnswers.length >= questions.length, // Check if already completed
          score: savedAnswers.length * pointsPerQuestion,
          startTime: Date.now(),
        },
      });
    }
  }, [quizInfo._id]);
  const handleTimeUp = useCallback(() => {
    // Calculate final score before completing quiz
    const finalScore = state.answers.length * pointsPerQuestion;
    dispatch({ type: "UPDATE_SCORE", payload: finalScore });
    dispatch({ type: "COMPLETE_QUIZ" });
  }, [dispatch, state.answers.length]);

  const { timeRemaining, startTimer, formatTime } = useTimer(
    quizInfo.settings?.timeLimit * 60,
    handleTimeUp
  );

  // Start timer when component mounts
  useEffect(() => {
    startTimer();
  }, [startTimer]);

  // Update time remaining in state
  useEffect(() => {
    dispatch({ type: "SET_TIME_REMAINING", payload: timeRemaining });
  }, [timeRemaining, dispatch]);

  // Save answers to localStorage whenever they change
  useEffect(() => {
    setSavedAnswers(state.answers);
  }, [state.answers, setSavedAnswers]);

  const currentQuestion = questions[state.currentQuestionIndex];
  const currentAnswer = state.answers.find(
    (answer) => answer.questionId === currentQuestion.id
  );

  useEffect(() => {
    if (state.isCompleted) {
      console.log("state in quiz complete --->,", state);
    }
  }, [state.isCompleted]);

  // const handleAnswerChange = (answer) => {
  //   const userAnswer = {
  //     questionId: currentQuestion.id,
  //     answer,
  //     timeSpent: 0,
  //     isCorrect: false, // This would be calculated on the server in a real app
  //   };

  //   dispatch({ type: "SET_ANSWER", payload: userAnswer });
  // };

  // const handleNext = () => {
  //   if (state.currentQuestionIndex < questions.length - 1) {
  //     dispatch({ type: 'SET_CURRENT_QUESTION', payload: state.currentQuestionIndex + 1 });
  //   } else {
  //     // Calculate final score before completing quiz
  //     const finalScore = state.answers.length * pointsPerQuestion;
  //     dispatch({ type: 'UPDATE_SCORE', payload: finalScore });
  //     dispatch({ type: 'COMPLETE_QUIZ' });
  //   }
  // };
  // Update handleNext to remove the completion logic
  const handleNext = () => {
    if (state.currentQuestionIndex < questions.length - 1) {
      dispatch({
        type: "SET_CURRENT_QUESTION",
        payload: state.currentQuestionIndex + 1,
      });
    }
    // Don't complete quiz here anymore - let the Submit button handle it
  };

  // Then in your handleAnswerChange function, check if this was the last question
  // const handleAnswerChange = (answer) => {
  //   const userAnswer = {
  //     questionId: currentQuestion.id,
  //     answer,
  //     timeSpent: 0,
  //     isCorrect: false,
  //   };

  //   dispatch({ type: "SET_ANSWER", payload: userAnswer });

  //   // Check if this was the last question and we've now answered it
  //   if (state.currentQuestionIndex === questions.length - 1) {
  //     // Calculate final score and complete quiz
  //     const finalScore = state.answers.length * pointsPerQuestion;
  //     dispatch({ type: "UPDATE_SCORE", payload: finalScore });
  //     dispatch({ type: "COMPLETE_QUIZ" });
  //   }
  // };

  const handleAnswerChange = (answer) => {
    const userAnswer = {
      questionId: currentQuestion.id,
      answer,
      timeSpent: 0,
      isCorrect: false,
    };

    dispatch({ type: "SET_ANSWER", payload: userAnswer });

    // REMOVE THIS PART - let the Submit button handle completion
    // if (state.currentQuestionIndex === questions.length - 1) {
    //   const finalScore = state.answers.length * pointsPerQuestion;
    //   dispatch({ type: "UPDATE_SCORE", payload: finalScore });
    //   dispatch({ type: "COMPLETE_QUIZ" });
    // }
  };

  const handlePrevious = () => {
    if (state.currentQuestionIndex > 0) {
      dispatch({
        type: "SET_CURRENT_QUESTION",
        payload: state.currentQuestionIndex - 1,
      });
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  // const handleSubmitQuiz = () => {
  //   // Calculate final score and complete quiz
  //   const finalScore = state.answers.length * pointsPerQuestion;
  //   dispatch({ type: "UPDATE_SCORE", payload: finalScore });
  //   dispatch({ type: "COMPLETE_QUIZ" });
  // };

  const handleSubmitQuiz = () => {
    if (state.isCompleted) return; // ✅ prevent multiple submits

    const finalScore = state.answers.length * pointsPerQuestion;
    dispatch({ type: "UPDATE_SCORE", payload: finalScore });
    dispatch({ type: "COMPLETE_QUIZ" });
  };

  const handleQuestionSelect = (index) => {
    dispatch({ type: "SET_CURRENT_QUESTION", payload: index });
    setShowQuestionGrid(false);
  };

  const handleRestart = () => {
    localStorage.removeItem(`quiz-${quizInfo._id}-answers`);
    dispatch({
      type: "RESET_QUIZ",
      payload: {
        currentQuestionIndex: 0,
        answers: [],
        timeRemaining: quizInfo.timeLimit * 60,
        isCompleted: false,
        score: 0,
        startTime: Date.now(),
      },
    });
  };

  const answeredQuestions = new Set(
    state.answers.map((answer) =>
      questions.findIndex((q) => q.id === answer.questionId)
    )
  );

  const quizStats = {
    score: state.score,
    lives: 3, // Mock lives system
    progress: `${state.currentQuestionIndex + 1}/${questions.length}`,
    position: "2nd", // Mock position
  };

  // Add this useEffect to log state changes for debugging
  useEffect(() => {
    console.log("Quiz state:", state);
  }, [state]);

  // If quiz is completed, ONLY show the results - return early
  if (state.isCompleted) {
    console.log("Quiz completed! Showing results...");
    console.log("Final state:", state);

    return (
      <QuizResults
        quizState={state}
        totalQuestions={questions.length}
        onRestart={handleRestart}
        onHome={onExit}
      />
    );
  }

  // Only render the quiz interface if NOT completed
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onExit}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <h1 className="text-xl font-semibold text-white">
                {quizInfo.title}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-purple-300">
                Question {state.currentQuestionIndex + 1} of {questions.length}
              </div>
              <div className="w-32 bg-slate-700/50 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      ((state.currentQuestionIndex + 1) / questions.length) *
                      100
                    }%`,
                  }}
                />
              </div>
              <div className="text-sm text-slate-300">
                {Math.round(
                  ((state.currentQuestionIndex + 1) / questions.length) * 100
                )}
                % Complete
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-white" />
                ) : (
                  <Moon className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Question Area */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl p-8 shadow-2xl">
              <QuestionRenderer
                question={currentQuestion}
                userAnswer={currentAnswer}
                onAnswerChange={handleAnswerChange}
                questionTypes={quizInfo.settings?.questionTypes}
              />

              <div className="mt-8 pt-6 border-t border-white/10">
                <QuizNavigation
                  currentQuestion={state.currentQuestionIndex}
                  totalQuestions={questions.length}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  onSkip={handleSkip}
                  onQuestionSelect={handleQuestionSelect}
                  answeredQuestions={answeredQuestions}
                  showQuestionGrid={showQuestionGrid}
                  onToggleQuestionGrid={() =>
                    setShowQuestionGrid(!showQuestionGrid)
                  }
                  onSubmitQuiz={handleSubmitQuiz} // Add this line
                />
              </div>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl p-6 shadow-2xl">
              <QuizStats
                stats={quizStats}
                currentQuestion={state.currentQuestionIndex}
                totalQuestions={questions.length}
                timeRemaining={formatTime}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
