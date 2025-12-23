import React, { useRef, useState, useEffect } from "react";
import { FaCamera } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!image) {
      setPreviewUrl(null);
    } else if (typeof image === "string") {
      setPreviewUrl(image); // URL from backend
    } else {
      setPreviewUrl(URL.createObjectURL(image)); // File object
    }
  }, [image]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  const onChooseFile = () => inputRef.current.click();

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-4">
        <div
          className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer border-2 border-gray-300 hover:border-blue-500 transition-all"
          onClick={onChooseFile}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <FaCamera className="text-3xl text-gray-400" />
          )}
        </div>

        <button
          type="button"
          className={`absolute -bottom-2 -right-2 p-2 rounded-full text-white ${
            image ? "bg-red-500 hover:bg-blue-600" : "bg-blue-500 hover:bg-blue-600"
          }`}
          onClick={image ? handleRemoveImage : onChooseFile}
        >
          {image ? <MdDelete className="text-sm" /> : <FaCamera className="text-sm" />}
        </button>
      </div>

      <input
        type="file"
        ref={inputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default ProfilePhotoSelector;
