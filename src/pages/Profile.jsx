import React from "react";
import { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";
function Profile() {
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    email: auth.currentUser.email,
    name: auth.currentUser.displayName,
  });
  const { email, name } = formData;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, "listings");

      const q = query(
        listingsRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );

      const querySnapshot = await getDocs(q);
      let listings = [];

      querySnapshot.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    };
    fetchUserListings();
  }, [auth.currentUser.uid]);

  const onLongout = () => {
    auth.signOut();
    navigate("/");
  };
  const onDelete = async (listingId) => {
    if (window.confirm("Are you sure you want to delete this listing ?")) {
      await deleteDoc(doc(db, "listings", listingId));
      const updatedListing = listings.filter(
        (listing) => listing.id !== listingId
      );
      setListings(updatedListing);
      toast.success("Listing Deleted");
    }
  };
  const onEdit = async (listingId) => {
    navigate(`/edit-listing/${listingId}`);
  };
  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, { displayName: name });
      }
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, { name });
    } catch (error) {
      toast.error("An error occured with updating profile");
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  return (
    <div className="grid p-5 lg:w-1/2 mx-auto">
      <header>
        <div className="profile-header flow p-2">
          <p className="font-bold text-2xl float-left">My profile</p>
          <button
            className="inline-block px-6 py-2.5 bg-green-500 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out float-right"
            onClick={onLongout}
          >
            Logout
          </button>
        </div>
      </header>
      <main className="mt-5 grid ">
        <div className="flow">
          <p className="float-left ">Personal Details</p>
          <p
            className="text-green-500 float-right"
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? "Save Changes" : "Edit Informations"}
          </p>
        </div>
        <div className=" bg-white mx-2rounded-lg p-2">
          <form className="flex flex-col">
            <input
              type="text"
              id="name"
              className={!changeDetails ? "bg-white" : "bg-gray-200 "}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <input
              type="text"
              id="email"
              className={!changeDetails ? " bg-white " : "bg-gray-200 "}
              disabled={true}
              value={email}
              onChange={onChange}
            />
          </form>
        </div>
        <Link to="/create-listing">
          <div className="flex my-5">
            <button
              type="button"
              className="px-6 py-2.5 bg-green-500 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-white-600 hover:shadow-lg  active:shadow-lg transition duration-150 ease-in-out md:w-full sm:w-1/2 "
            >
              Create Listing
            </button>
          </div>
        </Link>
        {!loading && listings?.length > 0 && (
          <div className="mb-40">
            <p className="font-bold text-lg">Your Listings</p>
            <ul className="w-full h-full">
              {listings.map((listing) => {
                return (
                  <ListingItem
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                    onDelete={() => onDelete(listing.id)}
                    onEdit={() => onEdit(listing.id)}
                  />
                );
              })}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}

export default Profile;
