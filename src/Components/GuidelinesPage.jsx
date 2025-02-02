import React from "react";
import { Clock, Heart, Award, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GuidelinesPage = ({ particleRef }) => {
  const navigate = useNavigate();
  particleRef.current?.changeColor("#4a90e2", null, 1);
  const guidelines = [
    {
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      title: "Time Management",
      description: "Complete all 10 questions within the time limit",
      details: [
        "Total time: 15 minutes for all questions",
        "Auto-submits when time runs out",
        "Results shown immediately after each answer",
      ],
    },
    {
      icon: <Award className="w-6 h-6 text-yellow-600" />,
      title: "Scoring System",
      description: "Points are awarded based on correct answers only",
      details: [
        "+4 points for each correct answer",
        "-1 point for each wrong answer",
        "Final score displayed at the end",
      ],
    },
    {
      icon: <Heart className="w-6 h-6 text-red-600" />,
      title: "Lives System",
      description: "Manage your lives carefully throughout the quiz",
      details: [
        "Start with 9 lives",
        "Quiz ends if all lives are lost",
        "Lives cannot be recovered",
      ],
    },
    {
      icon: <AlertCircle className="w-6 h-6 text-orange-600" />,
      title: "Important Rules",
      description: "Follow these rules to ensure a fair quiz experience",
      details: [
        "No switching between tabs/windows",
        "Read each question carefully",
        "You can't return to previous questions once answered",
      ],
    },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-8">
      <div className="relative z-10 w-full max-w-4xl mx-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">
              Quiz Guidelines
            </h1>
            <p className="text-gray-600">
              Please review these important guidelines before starting
            </p>
          </div>

          {/* Guidelines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {guidelines.map((guideline, index) => (
              <GuidelineCard key={index} {...guideline} />
            ))}
          </div>

          {/* Quick Summary */}
          <div className="bg-blue-50/50 rounded-lg p-4 mb-8 hover:transform hover:scale-102  hover:cursor-pointer">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">
              Quick Summary
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>10 questions to answer in 15 minutes</li>
              <li>Immediate feedback after each question</li>
              <li>Manage your 9 lives carefully</li>
              <li>Stay focused - no tab switching allowed</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full transform transition hover:scale-105"
            >
              &lt;- Back
            </button>
            <button
              onClick={() => navigate("/quiz")}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full transform transition hover:scale-105"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const GuidelineCard = ({ icon, title, description, details }) => (
  <div className="bg-white/50 backdrop-blur rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:transform hover:scale-105 hover:border-blue-200 cursor-pointer hover:shadow-blue-500/50">
    <div className="flex items-center gap-3 mb-3">
      {icon}
      <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
    </div>
    <p className="text-gray-600 mb-4">{description}</p>
    <ul className="space-y-2">
      {details.map((detail, index) => (
        <li key={index} className="flex items-center gap-2 text-gray-600">
          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
          {detail}
        </li>
      ))}
    </ul>
  </div>
);

export default GuidelinesPage;
