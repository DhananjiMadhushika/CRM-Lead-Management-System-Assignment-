import { BrowserRouter, Route,  Routes } from "react-router-dom";



import AdminDashboardPage from "./pages/Admin/Dashboard/AdminDashboardPage";

import Login from "./pages/LoginPage";
import { AuthProvider } from "./Providers/AuthProvider";

import ProtectedRoute from "./components/ProtectedRoute";
import AddLeadPage from "./pages/Admin/Lead/AddLeadPage";
import LeadPage from "./pages/Admin/Lead/LeadPage";
import LeadDetailPage from "./pages/Admin/Lead/LeadDetailPage";

import EditLeadPage from "./pages/Admin/Lead/EditLeadPage";
import SettingPage from "./pages/Admin/Setting/SettingPage";
import AddSalesPersonPage from "./pages/Admin/User/AddSalesPersonPage";



function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute ><AdminDashboardPage/></ProtectedRoute>}/>
        <Route path="/leads" element={<ProtectedRoute ><LeadPage/></ProtectedRoute>}/>
        
          <Route path="/leads/new" element={<ProtectedRoute ><AddLeadPage/></ProtectedRoute>}/>
       <Route path="/leads/:id" element={<ProtectedRoute ><LeadDetailPage/></ProtectedRoute>}/>
      <Route path="/leads/:id/edit" element={<ProtectedRoute ><EditLeadPage/></ProtectedRoute>}/>
      
   
      
          <Route path="/settings" element={<ProtectedRoute ><SettingPage/></ProtectedRoute>}/>

<Route path="/team/new" element={<ProtectedRoute ><AddSalesPersonPage/></ProtectedRoute>}/>


    
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;