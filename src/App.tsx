import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import { useEffect } from 'react';
import { Home } from "./pages/Home/HomePage";
import SatellitesListPage from "./pages/SatellitesList/SatellitesListPage";
import { SatellitePage } from "./pages/Satellite/SatellitePage";
import Header from "./components/Header/Header.tsx";
import { invoke } from "@tauri-apps/api/core";

function App() {
  useEffect(() => {
    invoke('tauri', {cmd: 'create'})
        .then((response: any) => console.log(response))
        .catch((error: any) => console.log(error))

    return () => {
        invoke('tauri', {cmd: 'close'})
            .then((response: any) => console.log(response))
            .catch((error: any) => console.log(error))
    }
}, [])

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