import { BrowserRouter, Routes, Route } from "react-router";
import { useState } from "react";
import DashboardPage from './pages/DashboardPage.jsx';
import AddressCreate from "./pages/Addresses/Create.jsx"; 
import Addresses from "./pages/Addresses/Index.jsx";
import AddressEdit from "./pages/Addresses/Edit.jsx"; 
import RolesIndex from "./pages/Roles/Index.jsx";
{/*import RolesCreate from "./pages/Roles/Create.jsx";
import RolesEdit from "./pages/Roles/Edit.jsx";*/}
import BranchesCreate from "./pages/Branches/Create.jsx";
import BranchesEdit from "./pages/Branches/Edit.jsx";
import BranchesIndex from "./pages/Branches/Index.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Protected from './Auth/Protected.jsx';
import Logout from './Auth/Logout.jsx';
import ParcelList from "./pages/Parcels/ParcelList.jsx";
import ParcelCreate from "./pages/Parcels/ParcelCreate.jsx";
import ParcelDetail from "./pages/Parcels/ParcelDetail.jsx";
import TrackParcel from "./pages/Parcels/TrackParcel.jsx";
import DeliverymenList from "./pages/Parcels/DeliverymenList.jsx";

import './App.css';
export default function App() {
  const [ isSignedIn, setIsSignedIn ] = useState(()=> {
    /* if you want, user will be logged in until they logout*/
    return localStorage.getItem("access_token") || false;
    /* if you want, user will be logged when they close the browser*/
    //return sessionStorage.getItem("access_token") || false;
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
                      
          <Route path="roles">
            <Route index element={<RolesIndex />} />
            {/*<Route path="create" element={<RolesCreate />} />
            <Route path="edit/:id" element={<RolesEdit />} />*/}
          </Route>

          <Route path="branches">
            <Route index element={<BranchesIndex />} />
            <Route path="create" element={<BranchesCreate />}/>
            <Route path="edit/:id" element={<BranchesEdit />} />
          </Route>
          <Route path="parcels">
            <Route index element={<ParcelList />} />
            <Route path="create" element={<ParcelCreate />} />
            <Route path=":id" element={<ParcelDetail />} />
          </Route>
          <Route path="track" element={<TrackParcel />} />
          <Route path="deliverymen" element={<DeliverymenList />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}