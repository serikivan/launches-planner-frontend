import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {registerSW} from "virtual:pwa-register";
import 'bootstrap/dist/css/bootstrap.min.css'
import {store} from "./store";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>,
      </React.StrictMode>,
)

if ("serviceWorker" in navigator) {
  registerSW()
}