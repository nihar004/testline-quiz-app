import React from "react";
import { useNavigate } from "react-router-dom";

const WelcomePage = ({ particleRef }) => {
  const navigate = useNavigate();
  particleRef.current?.changeColor("#4a90e2", null, 1);
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-10 w-full max-w-2xl mx-4 my-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
          <div className="p-8 py-8 sm:py-12">
            {/* Logo */}
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-blue-600 mb-2">
                TestLine Quiz Challenge
              </h1>
              <p className="text-gray-600 text-lg">
                Demonstrate Your Knowledge
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <FeatureCard
                title="Interactive Learning"
                description="Engage with dynamic questions and real-time feedback"
              />
              <FeatureCard
                title="Track Progress"
                description="Monitor your performance with detailed analytics"
              />
              <FeatureCard
                title="Earn Rewards"
                description="Collect points and badges as you progress"
              />
              <FeatureCard
                title="Challenge Yourself"
                description="Push your limits with timed questions"
              />
            </div>

            {/* Start Button */}
            <div className="text-center">
              <button
                onClick={() => navigate("/guidelines")}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 text-lg rounded-full transform transition hover:scale-105"
              >
                Start Your Journey
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description }) => (
  <div className="p-4 rounded-lg bg-white/50 backdrop-blur shadow-sm transition-all duration-300 hover:bg-white/70 hover:shadow-lg hover:transform hover:scale-105 hover:border-blue-200 cursor-pointer hover:shadow-blue-500/50">
    <h3 className="font-semibold text-lg text-blue-700 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default WelcomePage;
