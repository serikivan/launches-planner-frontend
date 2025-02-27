import ReactDOM from 'react-dom/client'
import App from './App'
import {registerSW} from "virtual:pwa-register";
import 'bootstrap/dist/css/bootstrap.min.css'
import {store} from "./store";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById('root')!).render(
        <Provider store={store}>
            <App />
        </Provider>,
)

if ("serviceWorker" in navigator) {
  registerSW()
}