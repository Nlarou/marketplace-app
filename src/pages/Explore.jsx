import React from "react";
import { Link } from "react-router-dom";
import sell_house from "../assets/sell_house.jpg";
import rent_house from "../assets/rent_house.jpg";
import buySellItems from "../assets/buy&sell_items.jpg";

import ImageSlider from "../components/ImageSlider";
function Explore() {
  return (
    <div className="p-2 lg:w-5/6 mx-auto">
      <header>
        <div className="flow mb-5">
          <p className="font-bold text-2xl ">Explore</p>
        </div>
      </header>
      <div className="mb-20">
        <ImageSlider />
        <p className="font-bold text-2xl">Categories</p>
        <div className="grid justify-between w-fit">
          <p className="font-bold ">Real Estate</p>
          <div className="flex justify-between w-fit">
            <Link to="/category/RealEstateRent">
              <div className="m-2">
                <img
                  src={rent_house}
                  alt="RealEstateRent"
                  className="object-cover	w-full h-60 rounded"
                />
                <p className="font-bold text-2xl">Rent</p>
              </div>
            </Link>
            <Link to="/category/RealEstateSell">
              <div className="m-2 rounded min-h-15">
                <img
                  src={sell_house}
                  alt="RealEstateSell"
                  className="object-cover	 w-full h-60 rounded"
                />
                <p className="font-bold text-2xl">Sell</p>
              </div>
            </Link>
          </div>
          <p className="font-bold ">General Items</p>
          <div className="flex justify-between w-fit">
            <Link to="/category/sell">
              <div className=" m-2 rounded min-h-15">
                <img
                  src={buySellItems}
                  alt="Buy & Sell Items"
                  className="object-cover	 w-full h-60 rounded"
                />
                <p className="font-bold text-2xl">Buy & Sell</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Explore;
