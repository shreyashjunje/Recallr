import React, { useEffect, useState, useRef } from "react";
import {
  Trophy,
  Target,
  Clock,
  Award,
  RefreshCw,
  Home,
  CheckCircle,
} from "lucide-react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export function QuizResults({
  quizState,
  totalQuestions,
  onRestart,
  onHome,
  quizInfo,
  onReview,
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [savedAttemptId, setSavedAttemptId] = useState(null);
  const [saveError, setSaveError] = useState(null);

  // stable clientAttemptId for idempotency
  const [clientAttemptId] = useState(
    () =>
      window?.crypto?.randomUUID?.() ||
      `attempt_${Math.random().toString(36).slice(2)}_${Date.now()}`
  );

  // REF guard to avoid repeated saves (prevents infinite loop)
  const didSaveRef = useRef(false);

  // performSave: can be called from effect (auto) or retry button (manual)
  const performSave = async () => {
    // if already saved or currently saving, don't start another
    if (didSaveRef.current || isSaving) return;

    // mark intent to save (prevents double start)
    didSaveRef.current = true;
    setIsSaving(true);
    setSaveError(null);

    try {
      const attempted = quizState.answers?.length || 0;
      const pointsPerQuestion = 100;
      const correct = Math.floor((quizState.score || 0) / pointsPerQuestion);
      const skipped = Math.max(0, totalQuestions - attempted);
      const wrong = Math.max(0, attempted - correct);

      const startedAt = quizState.startTime
        ? new Date(quizState.startTime)
        : null;
      const completedAt = quizState.completedAt
        ? new Date(quizState.completedAt)
        : new Date();

      const durationSeconds =
        startedAt && completedAt
          ? Math.max(0, Math.floor((completedAt - startedAt) / 1000))
          : null;

      const answers = (quizState.answers || []).map((a) => ({
        questionId: a.questionId,
        selectedAnswer: a.answer ?? a.selectedAnswer ?? null,
        isCorrect: !!a.isCorrect,
        timeTaken:
          typeof a.timeTaken === "number" ? a.timeTaken : a.timeSpent ?? null,
      }));

      const token = localStorage.getItem("token");
      console.log("quizinfo>>>>>>>>>->", quizInfo);

      const resp = await axios.post(
        `${API_URL}/quiz/submit-quiz`,
        {
          quizId: quizInfo._id,
          score: quizState.score,
          totalQuestions,
          correct,
          wrong,
          skipped,
          answers,
          startedAt: startedAt ? startedAt.toISOString() : null,
          completedAt: completedAt.toISOString(),
          durationSeconds,
          clientAttemptId,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      // Prefer attempt._id or attemptId from server
      const attemptId =
        resp?.data?.attempt?._id ?? resp?.data?.attemptId ?? null;

      if (attemptId) {
        setSavedAttemptId(attemptId);
        setSaveError(null);
      } else {
        // If server didn't return id, set an error and DO NOT keep trying automatically.
        // Keep didSaveRef true to avoid infinite loops; user can Retry manually.
        setSaveError("Save succeeded but server did not return attempt id.");
      }
    } catch (err) {
      console.error("Failed to save quiz result:", err);
      setSaveError(
        err?.response?.data?.message ?? err.message ?? "Save failed"
      );
      // keep didSaveRef true to avoid automatic loop — allow manual retry to reset and call again
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save once when quiz completes. Narrow deps so it triggers only on transition to completed.
  useEffect(() => {
    if (!quizState?.isCompleted) return;
    performSave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizState?.isCompleted]);

  // manual retry handler: allow retrying explicitly
  const handleRetry = () => {
    // allow performSave to run again
    didSaveRef.current = false;
    performSave();
  };

  // small debug log (kept from your original)
  // useEffect(() => {
  //   console.log("quizState-->", quizState);
  // }, [quizState, totalQuestions]);

  if (!quizState || !quizState.answers) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Loading Results...
            </h1>
            <p className="text-purple-300">
              Please wait while we calculate your results
            </p>
          </div>
        </div>
      </div>
    );
  }

  const pointsPerQuestion = 100;
  const percentage = Math.round(
    (quizState.score / (totalQuestions * pointsPerQuestion)) * 100
  );
  const correctAnswers = quizState.score / pointsPerQuestion;
  const attemptedQuestions = quizState.answers.length;

  const durationSeconds =
    typeof quizState.durationSeconds === "number"
      ? quizState.durationSeconds
      : quizState.completedAt && quizState.startTime
      ? Math.max(
          0,
          Math.floor((quizState.completedAt - quizState.startTime) / 1000)
        )
      : quizState.startTime
      ? Math.max(0, Math.floor((Date.now() - quizState.startTime) / 1000))
      : null;

  let timeTakenDisplay = "N/A";
  if (durationSeconds !== null) {
    const mins = Math.floor(durationSeconds / 60);
    const secs = durationSeconds % 60;
    timeTakenDisplay = `${mins}m ${secs}s`;
  }

  const getGrade = (pct) => {
    if (pct >= 90)
      return { grade: "A+", color: "text-green-400", bg: "bg-green-500/20" };
    if (pct >= 80)
      return { grade: "A", color: "text-green-400", bg: "bg-green-500/20" };
    if (pct >= 70)
      return { grade: "B", color: "text-blue-400", bg: "bg-blue-500/20" };
    if (pct >= 60)
      return { grade: "C", color: "text-yellow-400", bg: "bg-yellow-500/20" };
    return { grade: "F", color: "text-red-400", bg: "bg-red-500/20" };
  };

  const gradeInfo = getGrade(percentage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl text-center">
          {/* Header */}
          <div className="mb-8">
            <div
              className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${gradeInfo.bg} mb-4`}
            >
              <span className={`text-4xl font-bold ${gradeInfo.color}`}>
                {gradeInfo.grade}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Quiz Complete!
            </h1>
            <p className="text-purple-300 text-lg">
              Great job completing the quiz
            </p>
          </div>

          {/* Status bar for saving */}
          <div className="mb-4">
            {isSaving && (
              <div className="text-sm text-yellow-300">Saving result...</div>
            )}
            {!isSaving && savedAttemptId && (
              <div className="text-sm text-green-300">
                Saved ✓ (id: {savedAttemptId})
              </div>
            )}
            {!isSaving && saveError && (
              <div className="text-sm text-red-300 flex items-center justify-center gap-2">
                <span>{saveError}</span>
                <button
                  onClick={handleRetry}
                  className="ml-2 px-3 py-1 bg-red-600 rounded text-white text-xs"
                >
                  Retry
                </button>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Final Score */}
            <div className="flex items-center gap-4 p-6 bg-white/5 rounded-2xl">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Trophy className="w-8 h-8 text-purple-400" />
              </div>
              <div className="text-left">
                <p className="text-purple-300 text-sm">Final Score</p>
                <p className="text-white text-3xl font-bold">
                  {quizState.score}
                </p>
              </div>
            </div>

            {/* Accuracy */}
            <div className="flex items-center gap-4 p-6 bg-white/5 rounded-2xl">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Target className="w-8 h-8 text-blue-400" />
              </div>
              <div className="text-left">
                <p className="text-blue-300 text-sm">Accuracy</p>
                <p className="text-white text-3xl font-bold">{percentage}%</p>
              </div>
            </div>

            {/* Correct Answers */}
            <div className="flex items-center gap-4 p-6 bg-white/5 rounded-2xl">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <div className="text-left">
                <p className="text-green-300 text-sm">Correct Answers</p>
                <p className="text-white text-3xl font-bold">
                  {correctAnswers}/{totalQuestions}
                </p>
              </div>
            </div>

            {/* Attempted Questions */}
            <div className="flex items-center gap-4 p-6 bg-white/5 rounded-2xl">
              <div className="p-3 bg-pink-500/20 rounded-xl">
                <Award className="w-8 h-8 text-pink-400" />
              </div>
              <div className="text-left">
                <p className="text-pink-300 text-sm">Attempted</p>
                <p className="text-white text-3xl font-bold">
                  {attemptedQuestions}/{totalQuestions}
                </p>
              </div>
            </div>

            {/* Time Taken */}
            <div className="flex items-center gap-4 p-6 bg-white/5 rounded-2xl md:col-span-2">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="text-left">
                <p className="text-yellow-300 text-sm">Time Taken</p>
                <p className="text-white text-3xl font-bold">
                  {timeTakenDisplay}
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={onRestart}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors duration-200"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Retake Quiz</span>
            </button>
            <button
              onClick={onHome}
              className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors duration-200"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>

            <button
              onClick={() => onReview(quizState, quizInfo)} // callback to parent
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors duration-200"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Review Quiz</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
