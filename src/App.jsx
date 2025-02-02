import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useRef } from "react";
import WelcomePage from "./Components/WelcomePage";
import GuidelinesPage from "./Components/GuidelinesPage";
import QuizPage from "./Components/QuizPage";
import ParticleBackground from "./Components/ParticleBackground";

function App() {
  const particleRef = useRef(null);
  return (
    <div className=" overflow-hidden">
      {" "}
      {/* Prevents horizontal scroll */}
      <Router>
        <ParticleBackground ref={particleRef} />
        <Routes>
          <Route path="/" element={<WelcomePage particleRef={particleRef} />} />
          <Route
            path="/guidelines"
            element={<GuidelinesPage particleRef={particleRef} />}
          />
          <Route
            path="/quiz"
            element={<QuizPage particleRef={particleRef} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
