import React, { useState } from 'react'
import Input from '../components/Input.jsx'
import PasswordStrengthMeter from '../components/PasswordStrengthMeter.jsx'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Loader } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { signupUser } from "../features/auth/authSlice.js";
import { useSelector, useDispatch } from "react-redux";

function SignUpPage() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [formError, setFormError] = useState("")

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setFormError("Please fill all the fields.");
      return;
    }

    try {

      // send (dispatch) the user data
      await dispatch(signupUser(name, email, password));

      // clear the form
      setName("")
      setEmail("")
      setPassword("")

      // re-direct the user to verify email address page
      navigate("/verify-email")
    } catch (error) {
      console.log(`Signup failed: ${error}`);
    }
  }

  return (
    <motion.div
    initial={{opacity: 0, y: 20}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 0.5}}
    className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
    >

      <div className='p-8'>
        <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400
         to-emerald-500 text-transparent bg-clip-text'>Create Account</h2>

        <form onSubmit={handleSignUp}>

          <Input
          icon={User}
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          />

          <Input
          icon={Mail}
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          />

          <Input
          icon={Lock}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          />
          {/* show errors if they exist */}

          {formError && <p className='text-red-500 font-semibold mt-2'>{formError}</p>}
          
          {error && (
            <p className='text-red-500 font-semibold mt-2'>
              {typeof error === 'string' && 
              (error.includes('Invalid') || error.includes('jwt') || error.includes("No token found. User is not authenticated")) 
              ? '' : error}
            </p>
          )}
          
          <PasswordStrengthMeter password={password} />

          <motion.button
          className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg 
          shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 
          focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
          whileHover={{scale: 1.02}}
          whileTap={{scale: 0.98}}
          type='submit'
          disabled={loading}
          >
            {loading ? <Loader className='animate-spin mx-auto' size={24} /> : "Sign Up" }
          </motion.button>
        </form>
      </div>

      <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
        <p className='text-sm text-gray-400'>
          Already have an account? {" "}
          <Link to={'/login'} className='text-green-400 hover: underline'>
            Login
          </Link>
        </p>
      </div>

    </motion.div>
  )
}

export default SignUpPage