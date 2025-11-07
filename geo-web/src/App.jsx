import { BrowserRouter, Route, Routes } from 'react-router';
import GuestRoute from './protected-routes/GuestRoute';
import Login from './pages/login/Login';
import Authenticated from './protected-routes/Authenticated';
import Home from './pages/home/Home';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Guest-only */}
        <Route
          path='/'
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        <Route
          path='/home'
          element={
            <Authenticated>
              <Home />
            </Authenticated>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
