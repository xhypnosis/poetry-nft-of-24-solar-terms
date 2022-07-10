import "./App.css";
import { Button } from "antd";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from '@/pages/Home'
import Result from '@/pages/Result'
import Display from '@/pages/Display'
import Login from '@/pages/Login'
import Admin from '@/pages/Admin'

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="result" element={<Result />} />
          <Route path="display" element={<Display />} />
          <Route path="login" element={<Login />} />
          <Route path="admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
