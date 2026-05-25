import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Auctions from './pages/Auctions';
import CreateAuction from './pages/CreateAuction';
import ForgotPassword from './pages/ForgotPassword';
import { useEffect } from 'react';

/* Scroll to top on route change */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

/* Layout with conditional navbar/footer */
const AppLayout = () => {
  const { pathname } = useLocation();
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password';

  return (
    <div className="min-h-screen bg-bg-primary">
      {!isAuthPage && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/auctions" element={<Auctions />} />
          <Route path="/create-auction" element={<CreateAuction />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;
