import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



function Login({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: ""
  });
  const [message, setMessage] = useState(""); //incorrect password messege and stuff to handlelogin

  // Handler for login info form input changes
  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo({ ...loginInfo, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {

      const response = await axios.post("http://localhost:8082/api/users/check", {
        email: loginInfo.email,
        password: loginInfo.password
      });

      // Check if login is successful
      if (response.data.success) {
        //stored userdata in the local storage
        localStorage.setItem('userData', JSON.stringify(response.data.data));
        setIsAuthenticated(true); //enables the router link from App.jsx via parameters?
        console.log("login success"+response.data.message); //testing response
        console.log(JSON.parse(localStorage.getItem('userData'))); //testing local storage
        navigate('/dashboard/profile');
      } else {
        console.log("Login failed: ", response.data.message);
        setMessage("Invalid email or password");
      }
    } catch (error) {
      console.log("Error during login: ", error);
      setMessage("Invalid email or password");
    }
  };

  return (
    <div>
      <div className="max-w-3xl mx-auto text-center mt-32 -mb-10">
        <h1 className="text-3xl font-semibold text-gray-800">Login to Your Account</h1>
        <p className="max-w-sm mx-auto mt-5 text-gray-500">Please enter your username and password to access your account. If you don't have an account, you can easily sign up!</p>
      </div>
      <form onSubmit={handleLogin}>
        <div className="bg-transparent justify-center">
          <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
            <div className="bg-transparent w-full rounded-lg divide-y divide-gray-200">
              <div className="px-5 py-7">
                <label className="font-semibold text-sm text-gray-600 pb-1 block">E-mail</label>
                {/* Email Input */}
                <input 
                  name='email'
                  type="email" 
                  onChange={handleLoginInputChange}
                  value={loginInfo.email}
                  required
                  className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" 
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }} 
                />

                <label className="font-semibold text-sm text-gray-600 pb-1 block">Password</label>
                {/* Password Input */}
                <input 
                  name='password'
                  type="password" 
                  onChange={handleLoginInputChange}
                  value={loginInfo.password}
                  required
                  className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" 
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }} 
                />
                {/* Error Message */}
                {message && <div className="text-red-500 text-center mb-2">{message}</div>}                
                <button 
                  type="submit" 
                  className="transition duration-200 bg-orange-500 hover:bg-orange-600 focus:bg-orange-700 focus:shadow-sm focus:ring-4 focus:ring-orange-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block">
                  <span className="inline-block mr-2">Login</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 inline-block">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
              <div className="py-5">
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-center sm:text-left whitespace-nowrap">
                    <button className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 inline-block align-text-top">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      </svg>
                      <span className="inline-block ml-1">Forgot Password</span>
                    </button>
                  </div>
                  <div className="text-center sm:text-right whitespace-nowrap">
                    <button className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 inline-block align-text-bottom">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span className="inline-block ml-1">Help</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
