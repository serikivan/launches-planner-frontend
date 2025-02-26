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
        </Routes>
    </Router>
  );
}

export default App;