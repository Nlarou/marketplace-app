import React from "react";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
function Contact() {
  const [message, setMessage] = useState("");
  const [owner, setOwner] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useParams();

  useEffect(() => {
    const getOwner = async () => {
      const docRef = doc(db, "users", params.ownerId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setOwner(docSnap.data());
      } else {
        toast.error("Could not get owner data");
      }
    };
    getOwner();
  }, [params.ownerId]);
  const onSubmit = () => {};
  const onChange = (e) => {
    setMessage(e.target.value);
  };
  return (
    <div>
      <header>
        <div className="p-2">
          <p className="font-bold text-2xl">Contact Owner Of Listing</p>
        </div>
      </header>
      {owner !== null && (
        <main className="mt-5 grid">
          <div className="mx-2 p-2 rounded-lg ">
            <p>Contact {owner?.name}</p>
          </div>
          <form
            className="flex flex-col mt-5 p-2 justify-center items-stretch "
            onSubmit={onSubmit}
          >
            <div className="grid mb-5">
              <label className="font-bold">Message</label>
              <textarea
                name="message"
                id="message"
                className="h-60 p-2"
                value={message}
                onChange={onChange}
              ></textarea>
            </div>
            <a
              href={`mailto:${owner.email}?Subject=${searchParams.get(
                "listing"
              )}&body=${message}`}
            >
              <button
                type="button"
                className="px-6 py-2.5 bg-green-500 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-white-600 hover:shadow-lg  active:shadow-lg transition duration-150 ease-in-out md:w-full sm:w-1/2 "
              >
                Send Message
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  );
}

export default Contact;
