import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
function OAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const onGoogleClick = async () => {
    try {
      //Display the Google login popup
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      //Make sure the user is in the database, if not we add it
      const docRef = doc(db, "users", user.uid);
      const docSnapshot = await getDoc(docRef);
      //If the user is not in the database, we add it
      if (!docSnapshot.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          name: user.displayName,
          timestamp: serverTimestamp(),
        });
      }
      //Redirect to the home page
      navigate("/");
    } catch (error) {
      toast.error("An error occured with Google Login");
    }
  };
  return (
    <div className="grid justify-items-center">
      <p> Sign {location.pathname === "/sign-in" ? "In" : "Up"} with: </p>
      <FcGoogle
        className="h-20 w-20 my-4 bg-white rounded-full p-2 cursor-pointer"
        onClick={onGoogleClick}
      />
    </div>
  );
}

export default OAuth;
