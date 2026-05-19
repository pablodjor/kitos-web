import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import MainLayout from "./layouts/MainLayout/MainLayout";
import HomePage from "./pages/HomePage/HomePage";
import SorteosPage from "./pages/SorteosPage/SorteosPage";
import RegisterSorteoPage from "./pages/RegisterSorteoPage/RegisterSorteoPage";
import CodePage from "./pages/CodePage/CodePage";
import OffersPage from "./pages/OffersPage/OffersPage";
import CategoryOffersPage from "./pages/CategoryOffersPage/CategoryOffersPage";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/ofertas" element={<OffersPage />} />
          <Route path="/ofertas/:category" element={<CategoryOffersPage />} />
          <Route path="/sorteos" element={<SorteosPage />} />
          <Route path="/registro" element={<RegisterSorteoPage />} />
          <Route path="/codigo" element={<CodePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;