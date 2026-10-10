import { BrowserRouter, Routes, Route } from "react-router";

import DashboardPage from './pages/DashboardPage.jsx';
import AddressCreate from "./pages/Addresses/Create.jsx"; 
import Addresses from "./pages/Addresses/Index.jsx";
import AddressEdit from "./pages/Addresses/Edit.jsx"; 
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import './App.css';

export default function App() {
  return (
    <BrowserRouter>

              <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="addresses">
                      <Route index element={<Addresses />} />
                      <Route path="create" element={<AddressCreate />} />
                      <Route path="edit/:id" element={<AddressEdit />} />
                    </Route>
                <Route path="login" element={<Login />}/>
                <Route path="register" element={<Register />}/>
                
              </Routes>
    </BrowserRouter>
   
  );
}