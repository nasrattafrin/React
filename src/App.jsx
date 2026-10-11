import { BrowserRouter, Routes, Route } from "react-router";
import { useState } from "react";
import DashboardPage from './pages/DashboardPage.jsx';
import AddressCreate from "./pages/Addresses/Create.jsx"; 
import Addresses from "./pages/Addresses/Index.jsx";
import AddressEdit from "./pages/Addresses/Edit.jsx"; 
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Protected from './Auth/Protected.jsx';
import Logout from './Auth/Logout.jsx';

import './App.css';

export default function App() {
  const [ isSignedIn, setIsSignedIn ] = useState(()=> {
    /* if you want, user will be logged in until they logout*/
    //return localStorage.getItem("access_token") || false;
    /* if you want, user will be logged when they close the browser*/
    return sessionStorage.getItem("access_token") || false;
  });
  return (
    <BrowserRouter>

              <Routes>
                    <Route path="login" element={<Login />}/>
                    <Route path="register" element={<Register />}/>
                 <Route element={<Protected isSignedIn={isSignedIn} />}>
                      <Route index element={<DashboardPage />} />
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="logout" element={<Logout />} />
                    
                      <Route path="addresses">
                            <Route index element={<Addresses />} />
                            <Route path="create" element={<AddressCreate />} />
                            <Route path="edit/:id" element={<AddressEdit />} />
                          </Route>
                  </Route>
                
              </Routes>
    </BrowserRouter>
   
  );
}