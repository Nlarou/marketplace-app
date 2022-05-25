import React from "react";
import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
function CreateListing() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "sell",
    name: "",
    location: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    description: "",
  });
  const {
    type,
    name,
    location,
    offer,
    regularPrice,
    discountedPrice,
    images,
    description,
  } = formData;
  const auth = getAuth();
  const navitage = useNavigate();
  const isMounted = useRef(true);

  const dropdownOptions = [
    {
      type: "group",
      name: "Buy & Sell",
      items: [
        {
          value: "wantedsell",
          label: "I'm buying - You want to buy an item",
          className: "myOptionClassName",
        },
        { value: "sell", label: "I'm selling - You are selling an item" },
      ],
    },
    {
      type: "group",
      name: "Real Estate",
      items: [
        {
          value: "RealEstateSell",
          label: "I'm selling - You are offering a property for sale",
        },
        {
          value: "wantedRealEstateSell",
          label: "I'm buying - You want to find an property to buy",
        },
        {
          value: "RealEstateRent",
          label: "Landlord renting - You are offering an property for rent",
        },
        {
          value: "wantedRealEstateRent",
          label: "Futur tenant - You want to find an property to rent",
        },
      ],
    },
  ];

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navitage("/sign-in");
        }
      });
    }
    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (parseInt(discountedPrice) >= parseInt(regularPrice)) {
      setLoading(false);
      toast.error("Discouted price have to be less than the regular price");
      return;
    }
    if (images.length > 6) {
      setLoading(false);
      toast.error("Maximum of 6 images allowed");
      return;
    }
    let geolocation = {};
    let current_location;

    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=process.env.REACT_APP_GEOCODE_API_KEY`
    );
    const data = await res.json();
    geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
    geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;
    current_location =
      data.status === "ZERO_RESULTS"
        ? undefined
        : data.results[0]?.formatted_address;

    if (location === undefined || location.includes("undefined")) {
      setLoading(false);
      toast.error("Please enter a valid address");
      return;
    }

    //Store image in the firebase database
    const storeImage = async (img) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${img.name}-${uuidv4()}`;
        const storageRef = ref(storage, "images/" + filename);

        const uploadTask = uploadBytesResumable(storageRef, img);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };
    const imgUrls = await Promise.all(
      [...images].map((img) => storeImage(img))
    ).catch(() => {
      setLoading(false);
      toast.error("Problem happen with the upload of the images");
      return;
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
    };
    formDataCopy.location = current_location ?? location;
    delete formDataCopy.images;
    delete formDataCopy.addresse;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    setLoading(false);
    toast.success("Listing Created");
    navitage(`/category/${formDataCopy.type}/${docRef.id}`);
  };
  const onMutate = (e) => {
    let bool = null;
    if (e.target === undefined) {
      setFormData((prevState) => ({
        ...prevState,
        ["type"]: bool ?? e.value,
        ["offer"]: e.value.toString().startsWith("wanted")
          ? false
          : prevState["offer"],
        ["discountedPrice"]: 0,
      }));
    } else {
      if (e.target.value === "true") {
        bool = true;
      }
      if (e.target.value === "false") {
        bool = false;
      }
      if (e.target.files) {
        setFormData((prevState) => ({
          ...prevState,
          images: e.target.files,
        }));
      }
      if (!e.target.files) {
        setFormData((prevState) => ({
          ...prevState,
          [e.target.id]: bool ?? e.target.value,
        }));
      }
    }
  };
  if (loading) {
    return <Spinner />;
  }
  return (
    <div className="lg:w-1/2 mx-auto">
      <header>
        <div className="p-2">
          <p className="font-bold text-2xl">Create a Listing</p>
        </div>
      </header>
      <main>
        <form
          className="flex flex-col mt-5 p-2 justify-center items-stretch "
          onSubmit={onSubmit}
        >
          <div className="grid">
            <label className="font-bold">Type of listing</label>
            <Dropdown
              options={dropdownOptions}
              onChange={onMutate}
              value={type}
              placeholder="Select an option"
            />
            <label className="font-bold">Name</label>
            <input
              type="text"
              id="name"
              className="h-7 rounded-md bg-white px-2 md:w-full sm:w-2/4"
              value={name}
              onChange={onMutate}
            />
            <label className="font-bold">Address</label>
            <textarea
              type="text"
              id="location"
              className="rounded-md bg-white px-2 md:w-full sm:w-2/4"
              value={location}
              onChange={onMutate}
            />
            <label className="font-bold">Offer</label>
            <div className="">
              <button
                className={
                  offer
                    ? "px-6 py-2.5 mr-2 bg-green-500 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-white-600 hover:shadow-lg  active:shadow-lg transition duration-150 ease-in-out"
                    : "px-6 py-2.5 mr-2 bg-white text-black font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-white-600 hover:shadow-lg  active:shadow-lg transition duration-150 ease-in-out"
                }
                type="button"
                id="offer"
                value={true}
                onClick={onMutate}
                disabled={type.startsWith("wanted")}
              >
                Yes
              </button>
              <button
                className={
                  !offer && offer !== null
                    ? "px-6 py-2.5 mr-2 bg-green-500 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-white-600 hover:shadow-lg  active:shadow-lg transition duration-150 ease-in-out"
                    : "px-6 py-2.5 mr-2 bg-white text-black font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-white-600 hover:shadow-lg  active:shadow-lg transition duration-150 ease-in-out"
                }
                type="button"
                id="offer"
                value={false}
                onClick={onMutate}
                disabled={type.startsWith("wanted")}
              >
                No
              </button>
            </div>
            <label className="font-bold">Regular Price</label>
            <input
              type="number"
              id="regularPrice"
              className="h-7 rounded-md bg-white px-2 md:w-full sm:w-2/4"
              value={regularPrice}
              onChange={onMutate}
              min="1"
              max="75000000"
              required
            />
            {offer && (
              <>
                <label className="font-bold">Discounted Price</label>
                <input
                  type="number"
                  id="discountedPrice"
                  className=" h-7 rounded-md bg-white px-2 md:w-full sm:w-2/4"
                  value={discountedPrice}
                  onChange={onMutate}
                  min="1"
                  max="75000000"
                  required={offer}
                />
              </>
            )}
            <label className="font-bold">Images</label>
            <p className="text-gray-500">
              The first image will be the cover image.
            </p>
            <input
              type="file"
              id="images"
              className="formInputFile h-11 rounded-md bg-white py-1 md:w-full sm:w-3/4"
              onChange={onMutate}
              max="6"
              accept=".jpg,.png,.jpeg"
              multiple
              required
            />

            <label className="font-bold">Description</label>
            <textarea
              type="text"
              id="description"
              className="rounded-md bg-white h-40 px-2 md:w-full sm:w-2/4"
              value={description}
              onChange={onMutate}
            />
          </div>
          <div className="my-10">
            <div className="grid place-items-center">
              <button
                type="submit"
                className="px-6 py-2.5 bg-green-500 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-white-600 hover:shadow-lg  active:shadow-lg transition duration-150 ease-in-out md:w-full sm:w-1/2 "
              >
                Create Listing
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export default CreateListing;
