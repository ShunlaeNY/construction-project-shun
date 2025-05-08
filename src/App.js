import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // Use Routes instead of Switch
import BaseLayout from "./components/HOC/Layouts/BaseLayout";
import Login from "./components/auth/Login";
import Home from "./components/home/Home";
import UserProfile from "./components/UserProfile";
import Schedule from "./components/schedule/List";
import SiteList from "./components/site/List";
import StaffList from "./components/menu/staff/List";
import VehicleList from "./components/menu/vehicle/List";
import BusinessPartnerList from "./components/menu/businessPartner/List";
import OperationTypeList from "./components/menu/operationType/List";
import useAxiosInterceptor from "./helpers/axoisInterceptor";

import Ui from "./components/Ui";
import "./App.scss";

// import ProtectedRoute from "./components/auth/ProtectedRoute";

// import StaffDash from "./components/StaffDash";
import NoAccess from "./components/NoAccess";
import NotFound from "./components/NotFound";
function App() {
  useAxiosInterceptor();
  return (
    <Router>
      <Routes>
        {/* Login page at the root "/" */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        {/* App layout and protected routes */}
        <Route path="/" element={<BaseLayout />}>
          {/* Admin Routes */}
          <Route
            path="userprofile"
            element={<UserProfile/>}
          />
          <Route
            path="home"
            element={<Home/>}
          />
          <Route
            path="business-partner"
            element={<BusinessPartnerList />}
          />
          <Route
            path="business-partner/entry"
            element={<BusinessPartnerList />}
          />
          <Route
            path="business-partner/edit/:id"
            element={<BusinessPartnerList />}
          />
          <Route
            path="operation-type"
            element={<OperationTypeList />}
          />
          <Route
            path="operation-type/entry"
            element={<OperationTypeList />}
          />
          <Route
            path="operation-type/edit/:id"
            element={<OperationTypeList />}
          />
          <Route
            path="vehicle"
            element={<VehicleList />}
          />
          <Route
            path="vehicle/entry"
            element={<VehicleList />}
          />
          <Route
            path="vehicle/edit/:id"
            element={<VehicleList />}
          />
          <Route
            path="staff"
            element={<StaffList />}
          />
          <Route
            path="staff/entry"
            element={<StaffList />}
          />
          <Route
            path="staff/team"
            element={<StaffList />}
          />
          <Route
            path="staff/edit/:id"
            element={<StaffList/>}
          />
          <Route
            path="site"
            element={<SiteList/>}
          />
          <Route
            path="schedule"
            element={<Schedule />}
          />

          {/* Staff Route */}
          {/* <Route
            path="staffDashboard"
            element={<StaffDash/>}
          /> */}

          {/* Fallbacks */}
          <Route path="no-access" element={<NoAccess />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>

  );
}

export default App;

