import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import Spinner from "../components/Spinner";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/a11y";

import { FaShare } from "react-icons/fa";
import { toast } from "react-toastify";
function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLink, setShareLink] = useState(null);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();
  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    };
    fetchListing();
  }, [navigate, params.listingId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      <div className="h-auto mb-40 sm:w-full lg:w-1/2 mx-auto  ">
        <div>
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            slidesPerView={1}
            pagination={{ clickable: true }}
            navigation
            className="h-96"
          >
            {listing.imgUrls.map((url, index) => {
              return (
                <SwiperSlide key={index}>
                  <div
                    className="object-cover bg-no-repeat bg-center w-full h-full "
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        <div
          className="absolute top-0 right-2 bg-white w-10 h-10 m-2 rounded-full grid place-content-center cursor-pointer z-10 lg:fixed"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setShareLink(true);
            toast.info("Link Copied !");
            setTimeout(() => {
              setShareLink(false);
            }, 2000);
          }}
        >
          <FaShare className="w-5 h-5" />
        </div>

        <div>
          <div className=" p-5 lg:p-0">
            <p className="font-bold text-2xl">
              {(listing.type.startsWith("wanted") ? "Wanted: " : "") +
                listing.name}{" "}
              -{" $"}
              {listing.offer
                ? listing.discountedPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : listing.regularPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </p>
            <p className="font-bold">{listing.location}</p>
            <div className="flex">
              <p className="my-2 bg-green-500 text-white text-center font-bold w-fit mr-2 py-1 px-5 rounded-full">
                {listing.type.startsWith("wanted")
                  ? "Wanted"
                  : "For " + (listing.type.endsWith("Rent") ? "Rent" : "Sell")}
              </p>
              {listing.offer && (
                <p className="my-2 bg-black text-white text-center font-bold w-fit mr-2 py-1 px-5 rounded-full">
                  ${listing.regularPrice - listing.discountedPrice} discount
                </p>
              )}
            </div>
            <div className="h-80 w-full">
              <MapContainer
                style={{ width: "100%", height: "100%", zIndex: 1 }}
                center={[listing.geolocation.lat, listing.geolocation.lng]}
                zoom={13}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[listing.geolocation.lat, listing.geolocation.lng]}
                >
                  <Popup>{listing.location}</Popup>
                </Marker>
              </MapContainer>
            </div>
            <div className="grid mt-5">
              <label className="font-bold">Description</label>
              <p>{listing.description}</p>
            </div>

            {auth.currentUser?.uid !== listing.userRef && (
              <Link to={`/contact/${listing.userRef}?listing=${listing.name}`}>
                <div className="grid place-items-center mt-10">
                  <button className="px-6 py-2.5 my-5 bg-green-500 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-white-600 hover:shadow-lg  active:shadow-lg transition duration-150 ease-in-out  sm:w-1/2 ">
                    Contact listing owner
                  </button>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Listing;
