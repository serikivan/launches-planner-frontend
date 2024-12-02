import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "./Routes";
import { Home } from "./pages/Home/HomePage";
import SatellitesListPage from "./pages/SatellitesList/SatellitesListPage";
import { SatellitePage } from "./pages/Satellite/SatellitePage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} index element={<Home />} />
        <Route path={ROUTES.SATELLITES} element={<SatellitesListPage />} />
        <Route path={`${ROUTES.SATELLITES}/:satellite_id`} element={<SatellitePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App