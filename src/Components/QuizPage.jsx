import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Award, Sparkles, Heart } from "lucide-react";
import confetti from "canvas-confetti";
import ReactMarkdown from "react-markdown";

const QuizPage = ({ particleRef }) => {
  const navigate = useNavigate(); // React Router navigation hook
  const [quizData, setQuizData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [livesLeft, setLivesLeft] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);

  // Fetch quiz data
  useEffect(() => {
    particleRef.current?.changeColor("#4a90e2", null, 1);
    const fetchQuiz = async () => {
      try {
        const response = await fetch("/api/Uw5CrX");
        if (!response.ok) throw new Error("Failed to fetch quiz");
        const data = await response.json();

        setQuizData(data);
        setQuestions(
          data.shuffle ? shuffleArray([...data.questions]) : data.questions
        );
        setLivesLeft(data.max_mistake_count);
        setTimeLeft(data.duration * 60);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load quiz. Please try again later.");
        setIsLoading(false);
      }
    };
    fetchQuiz();
  }, []);

  // Timer logic
  useEffect(() => {
    if (isLoading || quizCompleted || !quizData) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleQuizComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [isLoading, quizCompleted, quizData]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleAnswer = (option) => {
    if (quizCompleted) return;

    if (option.is_correct) {
      particleRef.current?.changeColor("#4ade80", null, 1);
      setSelectedAnswer(option);
      setScore((prev) => prev + 4);
      setStreak((prev) => prev + 1);
      setShowSolution(true);
      setShowNextButton(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      // Find the correct option to display
      particleRef.current?.changeColor("#ff0000", null, 1);
      const correctOption = currentQuestion.options.find(
        (opt) => opt.is_correct
      );
      setSelectedAnswer({
        ...option,
        showCorrect: true,
        correctOption: correctOption,
      });
      setScore((prev) => prev - 1);
      setStreak(0);
      setLivesLeft((prev) => prev - 1);
      setShowNextButton(true);
      setShowSolution(true);

      if (livesLeft <= 1) {
        particleRef.current?.changeColor("#4a90e2", null, 1);
        handleQuizComplete();
        return;
      }
    }
  };

  const moveToNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      particleRef.current?.changeColor("#4a90e2", null, 1);
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowSolution(false);
      setShowNextButton(false);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = () => {
    setQuizCompleted(true);
    onComplete?.(score);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // if (quizCompleted) {
  //   const totalPossibleScore = questions.length * quizData.correct_answer_marks;
  //   const percentage = Math.round((score / totalPossibleScore) * 100);
  //   particleRef.current?.changeColor("#4a90e2", null, 1);

  //   return (
  //     <div className="relative flex items-center justify-center min-h-screen bg-gray-50/50">
  //       <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-8 max-w-md w-full mx-4">
  //         <div className="text-center">
  //           <Award className="w-16 h-16 mx-auto mb-4 text-blue-600" />
  //           <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
  //           <div className="space-y-4">
  //             <p className="text-4xl font-bold text-blue-600">{score} points</p>
  //             <p className="text-gray-600">
  //               You scored {Math.round(percentage)}%
  //             </p>
  //             <p className="text-gray-600">Lives remaining: {livesLeft}</p>
  //             {percentage >= 90 && (
  //               <div className="flex items-center justify-center gap-2 text-yellow-600">
  //                 <Sparkles />
  //                 <p>Perfect Score! Master Badge Earned!</p>
  //               </div>
  //             )}
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  if (quizCompleted) {
    const totalPossibleScore = questions.length * quizData.correct_answer_marks;
    const percentage = Math.round((score / totalPossibleScore) * 100);
    particleRef.current?.changeColor("#4a90e2", null, 1);

    return (
      <div className="relative flex items-center justify-center min-h-screen bg-gray-50/50">
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <Award className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
            <div className="space-y-4">
              <p className="text-4xl font-bold text-blue-600">{score} points</p>
              <p className="text-gray-600">
                You scored {Math.round(percentage)}%
              </p>
              <p className="text-gray-600">Lives remaining: {livesLeft}</p>

              {percentage >= 90 && (
                <div className="flex items-center justify-center gap-2 text-yellow-600">
                  <Sparkles />
                  <p>Perfect Score! Master Badge Earned!</p>
                </div>
              )}
            </div>

            {/* Back to Home Button */}
            <button
              onClick={() => navigate("/")}
              className="mt-6 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-full transform transition hover:scale-105"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="relative min-h-screen bg-gray-50/50 py-8 overflow-hidden">
      <div className="max-w-3xl mx-auto px-4">
        {/* Quiz Header */}
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-6 mb-4">
          <h1 className="text-2xl font-bold text-blue-600 mb-2">
            {quizData.title}
          </h1>
          <p className="text-gray-600 mb-4">{quizData.topic}</p>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>
                {minutes}:{seconds.toString().padStart(2, "0")}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4 text-green-600" />
              <span>+{quizData.correct_answer_marks} correct</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4 text-red-600" />
              <span>-{quizData.negative_marks} incorrect</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-red-600" />
              <span>{livesLeft} lives left</span>
            </div>
          </div>
        </div>

        {/* Quiz Progress and Stats */}
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Question {currentIndex + 1}/{questions.length}
              </div>
              <div className="flex items-center gap-1 text-blue-600">
                <Award className="w-4 h-4" />
                <span>{score} pts</span>
              </div>
              {streak > 2 && (
                <div className="flex items-center gap-1 text-orange-500">
                  <Sparkles className="w-4 h-4" />
                  <span>{streak}x streak!</span>
                </div>
              )}
            </div>
          </div>

          {/* Question Content */}
          <div className="mb-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">
                {currentQuestion.description}
              </h2>
            </div>

            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option)}
                  disabled={selectedAnswer !== null}
                  className={`w-full p-4 text-left rounded-lg transition-all
                    ${
                      selectedAnswer
                        ? option.is_correct
                          ? "bg-green-100 border-green-500" // Show correct answer in green
                          : selectedAnswer.id === option.id
                          ? "bg-red-100 border-red-500" // Show selected wrong answer in red
                          : "bg-white border-gray-200"
                        : "bg-white hover:bg-gray-50 border-gray-200 hover:border-blue-300"
                    } border`}
                >
                  {option.description}
                </button>
              ))}
            </div>

            {showSolution && currentQuestion.detailed_solution && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <ReactMarkdown className="prose text-sm text-blue-800">
                  {currentQuestion.detailed_solution}
                </ReactMarkdown>
              </div>
            )}

            {showNextButton && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={moveToNextQuestion}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next Question
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
