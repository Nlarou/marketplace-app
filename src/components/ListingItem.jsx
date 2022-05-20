import React from "react";
import { Link } from "react-router-dom";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

function ListingItem({ listing, id, onDelete, onEdit }) {
  const formatDate = (date) => {
    return `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`;
  };
  return (
    <li className="flex ">
      <Link
        to={`/category/${listing.type}/${id}`}
        className="flex p-2 my-2 w-full"
      >
        <img
          src={listing.imgUrls[0]}
          alt={listing.name}
          className="object-cover w-1/3 h-28 rounded mr-2"
        />
        <div className="flex-auto w-1/3">
          <p className="font-bold text-2xl">
            {(listing.type.startsWith("wanted") ? "Wanted: " : "") +
              listing.name}
          </p>
          <p className="text-sm">
            {listing.location + " | " + formatDate(listing.timestamp.toDate())}
          </p>

          <p className="font-bold text-xl text-green-500">
            $
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "RealEstateRent" ? " per month" : ""}
          </p>
        </div>
      </Link>
      <div className="mt-5">
        {onDelete && (
          <AiFillDelete
            onClick={() => onDelete(listing.id, listing.name)}
            className="fill-red-600 cursor-pointer w-5 h-5"
          />
        )}
        {onEdit && (
          <AiFillEdit
            onClick={() => onEdit(listing.id, listing.name)}
            className="fill-green-600 cursor-pointer  w-5 h-5"
          />
        )}
      </div>
    </li>
  );
}

export default ListingItem;
