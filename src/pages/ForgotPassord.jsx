import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import { FaEnvelope } from "react-icons/fa";

function ForgotPassord() {
  const [email, setEmail] = useState("");
  const onChange = (e) => {
    setEmail(e.target.value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("Email was sent successfully");
    } catch (error) {
      toast.error("An error occured with sending reset email");
    }
  };
  return (
    <div className="p-5">
      <header>
        <h2 className="text-2xl font-bold leading-7 sm:text-3xl sm:truncate">
          Forgot Password
        </h2>
      </header>
      <main>
        <form className="mt-8 space-y-6 w-auto" onSubmit={onSubmit}>
          <div className="flex flex-col  shadow-sm -space-y-px gap-5">
            <div className="flex rounded-t-md border border-gray-300 bg-white">
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
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Send Password Reset Link
            </button>
          </div>
          <Link
            to="/sign-in"
            className="text-green-600 hover:text-green-500 focus:outline-indigo-500"
          >
            Sign In
          </Link>
        </form>
      </main>
    </div>
  );
}

export default ForgotPassord;
