import { Routes, Route, useNavigate } from 'react-router-dom';
import FloatingShape from './components/FloatingShape';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import EmailVerificationPage from './pages/EmailVerificationPage';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './features/auth/authSlice.js';
import { useEffect } from 'react';

function App() {

  const { user, isAuthenticated, isCheckingAuth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch])

  // redirect authenticated user to home page
  const RedirectAuthenticatedUser = ({children}) => {
    if(isAuthenticated && user.isVerified){
      // take to the home page from the current page
      navigate('/', { replace: true });
      return null;
    }
  }

  console.log("Isauthenticated", isAuthenticated);
  console.log("User", user);


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      {/* Floating Shapes */}
      <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
      <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />


      {/* routes for different pages */}
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/signup" element={ <RedirectAuthenticatedUser> <SignUpPage /> </RedirectAuthenticatedUser> } />
        <Route path="/login" element={ <RedirectAuthenticatedUser> <LoginPage /> </RedirectAuthenticatedUser> } />
        <Route path='verify-email' element={<EmailVerificationPage />}/>
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
