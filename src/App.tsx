import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import { Home } from "./pages/Home/HomePage";
import SatellitesListPage from "./pages/SatellitesList/SatellitesListPage";
import { SatellitePage } from "./pages/Satellite/SatellitePage";
import Header from "./components/Header/Header";
import LoginPage from "./pages/LoginPage/LoginPage";
import { RegisterPage } from "./pages/RegisterPage/RegisterPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import LaunchPage from "./pages/LaunchPage/LaunchPage";
import LaunchesList from "./pages/LaunchesList/LaunchesList";
import { useDispatch } from "react-redux";
//import { fetchCurrentUserAsync } from "./slices/userSlice";
import { useEffect } from "react";
import SatellitesTablePage from "./pages/SatellitesTable/SatellitesTablePage.tsx";
import SatelliteCreatePage from "./pages/SatelliteCreate/SatelliteCreatePage.tsx";
import SatelliteEditPage from "./pages/SatelliteEdit/SatelliteEditPage.tsx";
import NotFound404 from "./pages/ErrorPages/NotFound404";
import Forbidden403 from "./pages/ErrorPages/Forbidden403";

function App() {
  return (
    <Router basename='/launches-planner-frontend'>
        <Header/>
        <Routes>
            <Route path={"/"} index element={<Home />} />
            <Route path={"/login"} element={<LoginPage />} />
            <Route path={"/register"} element={<RegisterPage />} />
            <Route path={"/satellites"} element={<SatellitesListPage />} />
            <Route path={"/satellites/:satellite_id"} element={<SatellitePage />} />
            <Route path={"/profile"} element={<ProfilePage />} />
            <Route path="/launches/:launch_id" element={<LaunchPage />} />
            <Route path="/launches" element={<LaunchesList />} />
            <Route path={"/satellites/table"} element={<SatellitesTablePage />} />
            <Route path={"/satellites/create"} element={<SatelliteCreatePage />} />
            <Route path={"/satellites/:id/edit"} element={<SatelliteEditPage />} />
            <Route path="/403" element={<Forbidden403 />} />
            <Route path="*" element={<NotFound404 />} />
        </Routes>
    </Router>
  );
}

export default App;