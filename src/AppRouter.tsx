import { BrowserRouter, Route, Routes } from 'react-router';
import App from './App';
import AppLayout from './AppLayout';
import TrucksPage from './TrucksPage';
import LoadsPage from './LoadsPage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route element={<AppLayout />}>
            <Route index element={<TrucksPage />} />
            <Route path="/:truckId/loads" element={<LoadsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default AppRouter;
