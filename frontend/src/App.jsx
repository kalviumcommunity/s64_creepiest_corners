import { Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignupPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/Login" element={<LoginPage />} />
      <Route path= "/Signup" element={<SignUpPage/>}/> 
    </Routes>
  );
}

export default App;
