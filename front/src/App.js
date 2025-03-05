import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './component/Home';
import Billing from './component/Billing';
import Login from './component/Login';
import Signup from './component/Signup';
import Navbar from './component/Navbar';
import Attendence from './component/Attendence';
import Product from './component/Product';


function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

function MainContent() {
  const location = useLocation();
  const hideNavbarRoutes = ['/', '/login', '/signup'];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/attendance" element={<Attendence/>} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/product" element={<Product />} />
      </Routes>
     
    </>
  );
}

export default App;
