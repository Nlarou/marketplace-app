import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaKey, FaEye, FaEyeSlash } from "react-icons/fa";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import OAuth from "../components/OAuth";
function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential.user) {
        navigate("/"); // redirect to home page
      }
    } catch (error) {
      toast.error("Bad Credentials");
    }
  };

  return (
    <div className="p-5 lg:w-1/2 mx-auto">
      <h2 className="text-2xl font-bold leading-7 sm:text-3xl sm:truncate">
        Welcome back !
      </h2>
      <form className="mt-8 space-y-6 w-auto" onSubmit={onSubmit}>
        <input type="hidden" name="remember" value="true" />
        <div className="rounded-md shadow-sm -space-y-px">
          <div className="flex rounded-t-md border border-gray-300 bg-white mb-5">
            <label for="email-address" className="sr-only">
              Email address
            </label>
            <FaEnvelope className="my-3 mx-3 w-5" />
            <input
              id="email-address"
              name="email"
              type="email"
              required
              onChange={(e) => onChange(e)}
              value={email}
              className="lock w-full px-3 py-2 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div className="flex rounded-t-md border border-gray-300 bg-white">
            <label for="password" className="sr-only">
              Password
            </label>
            <FaKey className="my-3 mx-3 w-5" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => onChange(e)}
              className="block w-full px-3 py-2 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
            {showPassword ? (
              <FaEyeSlash
                className="my-3 mx-3 w-5"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              />
            ) : (
              <FaEye
                className="my-3 mx-3 w-5"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:outline-indigo-600 border-gray-300 rounded"
            />
            <label
              for="remember-me"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link
              to="/forgot-password"
              className="font-medium text-green-600 hover:text-green-500 focus:outline-indigo-500"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign in
          </button>
        </div>
        <div className="grid justify-items-center">
          <OAuth />

          <Link
            to="/sign-up"
            className="text-green-600 hover:text-green-500 focus:outline-indigo-500"
          >
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SignIn;
