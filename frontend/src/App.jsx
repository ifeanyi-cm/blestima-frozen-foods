import { useNavigate } from "react-router-dom";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";

import Admin from "./pages/Admin";

import Orders from "./pages/Orders";

import Settings from "./pages/Settings";

import Catalog from "./pages/Catalog";

import Login from "./pages/Login";

  function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/catalog"
          element={<Catalog />}
        />

<Route
  path="/login"
  element={<Login />}
/>

        <Route
          path="/admin"
          element={<Admin />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;