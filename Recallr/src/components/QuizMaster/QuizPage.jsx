import { useEffect, useState } from "react";
import { QuizInfo } from "./QuizInfo";
import { sampleQuestions, sampleQuizInfo } from "@/data/sampleQuiz";
import { Quiz } from "./Quiz";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
const API_URL=import.meta.env.VITE_API_URL


// export const sampleQuizInfo= {
//   id: 'science-tech-quiz',
//   title: 'Science & Technology Quiz',
//   category: 'Science',
//   difficulty: 'Medium',
//   totalQuestions: 10,
//   timeLimit: 15,
//   pointsPerQuestion: 100,
//   rules: [
//     'Read each question carefully before selecting your answer',
//     'You can navigate back and forth between questions',
//     'Some questions may have multiple correct answers',
//     'Your progress is automatically saved',
//     'Submit the quiz before time runs out to save your score'
//   ]
// };0


export default function QuizPage() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizInfo,setQuizInfo]=useState({})
  const [quizQuestions,setQuizQuestions]=useState([]);
  const navigate = useNavigate();

  const handleStartQuiz = () => setQuizStarted(true);
  const handleExitQuiz = () => setQuizStarted(false);
  const { id } = useParams();

  const fetchQuiz = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/quiz/get-quiz/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res.data.data);

      if(res.status===200){
        const quiz=res.data.data;
        setQuizInfo(quiz)
        setQuizQuestions(quiz.questions)
        toast.success("got info from backend")
      }




    } catch (err) {
      console.log("err:", err);
      toast.error("can not get the quiz");
      navigate("/quizmaster");
    }
  };

  useEffect(() => {
    fetchQuiz();

    // ✅ Request fullscreen when page loads
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  }, []);

  return (
    <div className="min-h-screen">
      {!quizStarted ? (
        <QuizInfo quizInfo={quizInfo} onStartQuiz={handleStartQuiz} />
      ) : (
        <Quiz
          quizInfo={quizInfo}
          questions={quizQuestions}
          onExit={handleExitQuiz}
        />
      )}
    </div>
  );
}
