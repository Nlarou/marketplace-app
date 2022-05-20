import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase.config";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/a11y";

import Spinner from "./Spinner";

function ImageSlider() {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const listingRef = collection(db, "listings");
      const q = query(listingRef, orderBy("timestamp", "desc"), limit(5));
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
    fetch();
  }, []);

  if (loading) {
    return <Spinner />;
  }
  if (listings.length === 0) {
    return <></>;
  }
  return (
    listings && (
      <>
        <div className=" my-3 lg:h-screen my-0">
          <p className="font-bold ">Recommended Listings</p>
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            slidesPerView={1}
            pagination={{ clickable: true }}
            navigation
            className="h-96 lg:h-5/6"
          >
            {listings.map(({ data, id }) => {
              return (
                <SwiperSlide
                  key={id}
                  onClick={() => navigate(`/category/${data.type}/${id}`)}
                >
                  <div
                    className="object-cover bg-no-repeat bg-center w-full h-full "
                    style={{
                      background: `url(${data.imgUrls[0]}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  >
                    <div className="grid h-full">
                      <div className="mt-auto bg-black text-white text-xl font-bold w-fit p-1">
                        <p className="">
                          {(data.type.startsWith("wanted") ? "Wanted: " : "") +
                            data.name}
                        </p>
                      </div>
                      <div>
                        <p className="mt-5  bg-white text-black font-bold w-fit p-1 rounded-full">
                          $
                          {(data.discountedPrice ?? data.regularPrice)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                          {data.type === "rent" && "/ month"}
                        </p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </>
    )
  );
}

export default ImageSlider;
