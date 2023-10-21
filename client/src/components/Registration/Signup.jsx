import React, { useState } from "react";
import axios from "axios";
import { storage } from "../firebase/firebase.init";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const selectedFile = event.target.files[0];
    setSelectedImage(selectedFile);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let url;
      if (selectedImage) {
        const imageRef = ref(storage, `images/${selectedImage.name}`);
        await uploadBytes(imageRef, selectedImage);

        url = await getDownloadURL(imageRef);
      }
      const res = await axios.post("http://localhost:5000/api/user/signup", {
        name,
        email,
        password,
        avatar: url ? url : null,
      });
      if (res.data.success) {
        navigate("/signin");
        alert("Registration Completed! Now login.");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="auth-container container w-2/3 mt-8 mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>
        <div className="form-group mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Name:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="form-group mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email:
          </label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="form-group mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="relative border border-dashed border-gray-300 p-4 rounded-md">
          {!selectedImage && (
            <input
              type="file"
              accept="image/*"
              name="photo"
              className="absolute top-0 left-0 h-full w-full opacity-0"
              onChange={handleChange}
            />
          )}
          {selectedImage ? (
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
              <p className="ml-2 text-green-600 font-semibold">
                Image selected
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 4v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <p className="ml-2 text-gray-400">Select Avatar</p>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Signup;
