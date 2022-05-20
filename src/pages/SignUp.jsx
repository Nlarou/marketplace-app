import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import {
  FaEnvelope,
  FaKey,
  FaEye,
  FaEyeSlash,
  FaRegAddressCard,
} from "react-icons/fa";
import OAuth from "../components/OAuth";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const navigate = useNavigate();
  const { email, password, name } = formData;

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

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      updateProfile(auth.currentUser, { displayName: name });
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();
      await setDoc(doc(db, "users", user.uid), formDataCopy);

      navigate("/"); // redirect to home page
    } catch (error) {
      toast.error("An Error occured with registration");
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold leading-7 sm:text-3xl sm:truncate">
        Join us now !
      </h2>
      <form className="mt-8 space-y-6 w-auto" onSubmit={onSubmit}>
        <div className="flex flex-col  shadow-sm -space-y-px gap-5">
          <div className="flex rounded-t-md border border-gray-300 bg-white">
            <label for="name" className="sr-only">
              Name
            </label>
            <FaRegAddressCard className="my-3 mx-3 w-5" />
            <input
              id="name"
              name="name"
              type="text"
              required
              onChange={(e) => onChange(e)}
              value={name}
              className="lock w-full px-3 py-2 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Name"
            />
          </div>

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
          <div className="flex rounded-t-md border border-gray-300 bg-white mb-5">
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

        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign Up
          </button>
        </div>
        <div className="grid justify-items-center">
          <OAuth />
          <Link
            to="/sign-in"
            className="text-green-600 hover:text-green-500 focus:outline-indigo-500"
          >
            Already have a account ? Sign In !
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
