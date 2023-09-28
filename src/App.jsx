import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/landing";
import React from "react";
import ChallengesPage from "./pages/root/challenges";
import CreateChallengePage from "./pages/root/create-challenge";
import ProfilePage from "./pages/root/profile";
import MrBeastPage from "./pages/root/mr-beast";
import SingleChallengeView from "./pages/root/single-challenge-view";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import BigNotificationContainer from "./components/BigNotificationContainer";
import { useSelector } from "react-redux";

function App() {

  const theme = useSelector((state) => state.stateProvider.theme);

  console.log("theme ", theme)
  return (
    <div className="App" data-theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignupPage />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route
            path="/challenges/:challengeId"
            element={<SingleChallengeView />}
          />
          <Route path="/mr-beast" element={<MrBeastPage />} />
          <Route path="/create-challenge" element={<CreateChallengePage />} />
          <Route path="/profile/:profileId" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>

      <BigNotificationContainer />
    </div>
  );
}

export default App;
