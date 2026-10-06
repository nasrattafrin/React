import { BrowserRouter, Routes, Route } from "react-router";
import Navbar from './components/layout/Navbar.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import Footer from './components/layout/Footer.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import Login from "./pages/Login.jsx";
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="container-scroller">
        <Navbar />
    
        <div className="container-fluid page-body-wrapper">
          <Sidebar />

        
          <div className="main-panel">
            <div className="content-wrapper">

              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="login" element={<Login />}/>
             
              </Routes>

            </div>

            <Footer />

          </div>
  

        </div>
    

      </div>
    </BrowserRouter>
   
  );
}