import React from "react";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";
const LISTINGS_FETCH_LIMIT = process.env.REACT_APP_LISTINGS_FETCH_LIMIT;
function Offers() {
  const [listings, setListing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const ref = collection(db, "listings");
        const q = query(
          ref,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(LISTINGS_FETCH_LIMIT)
        );
        const querySnapshot = await getDocs(q);
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastFetchedListing(lastVisible);
        const list = [];
        querySnapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListing(list);
        setLoading(false);
      } catch (error) {
        toast.error("An error occured with fetching listings");
      }
    };
    fetchListings();
  }, []);
  const onfetchMoreListings = async () => {
    try {
      const ref = collection(db, "listings");
      const q = query(
        ref,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(LISTINGS_FETCH_LIMIT)
      );
      const querySnapshot = await getDocs(q);
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastFetchedListing(lastVisible);
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListing((prevState) => [...prevState, ...list]);
      setLoading(false);
    } catch (error) {
      toast.error("An error occured with fetching listings");
    }
  };
  return (
    <div className="p-2 h-auto mb-40">
      <header>
        <div className="flow my-3">
          <p className="font-bold text-2xl ">Current Offers</p>
        </div>
      </header>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="lg:w-1/2 ">
              {listings.map((listing) => (
                <ListingItem
                  id={listing.id}
                  listing={listing.data}
                  key={listing.id}
                />
              ))}
            </ul>
          </main>
          {lastFetchedListing && listings?.length % LISTINGS_FETCH_LIMIT === 0 && (
            <div className="grid place-items-center">
              <button
                type="button"
                onClick={onfetchMoreListings}
                className="px-6 py-2.5 my-5 bg-green-500 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-white-600 hover:shadow-lg  active:shadow-lg transition duration-150 ease-in-out w-1/2"
              >
                Load more
              </button>
            </div>
          )}
        </>
      ) : (
        <p>No current offers</p>
      )}
    </div>
  );
}

export default Offers;
