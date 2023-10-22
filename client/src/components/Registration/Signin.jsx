import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";


const Signin = () => {
  const [cookies, setCookie] = useCookies(["access_token"]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    setIsLoading(true);
    event.preventDefault();

    try {
      const result = await axios.post("http://localhost:5000/api/user/signin", {
        email,
        password,
      });
      setCookie("access_token", JSON.stringify(result.data.token));
      window.localStorage.setItem("userID", JSON.stringify(result.data.user));
      alert("Signin Successfull");
      setIsLoading(false);
      navigate("/");
    } catch (error) {
      setIsLoading(false);
      alert("Email or password not matched ");
     
    }
  };

  return (
    <div>
      {
        isLoading ? (
          <div className="flex justify-center" >
            <RotatingLines type="Oval" color="#00BFFF" height={100} width={100} />
          </div >
        ) : (

          <div className="auth-container container mt-8 w-2/3 mx-auto">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
              <div className="form-group mb-4">
                <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
                <input
                  type="text"
                  id="username"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="form-group mb-6">
                <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline">
                Login
              </button>
            </form>
          </div>
        )}
    </div>
  );
};

export default Signin;