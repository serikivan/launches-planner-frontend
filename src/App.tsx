import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import { Home } from "./pages/Home/HomePage";
import SatellitesListPage from "./pages/SatellitesList/SatellitesListPage";
import { SatellitePage } from "./pages/Satellite/SatellitePage";
import Header from "./components/Header/Header.tsx";


function App() {
  return (
    <Router basename='/launches-planner-frontend'>
        <Header/>
        <Routes>
            <Route path={"/"} index element={<Home />} />
            <Route path={"/satellites"} element={<SatellitesListPage />} />
            <Route path={"/satellites/:satellite_id"} element={<SatellitePage />} />
        </Routes>
    </Router>
  );
}

export default App