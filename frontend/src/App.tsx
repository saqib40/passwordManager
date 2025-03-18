import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/landing"
import Login from "./pages/login"
import Signup from "./pages/signup"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<Signup />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
