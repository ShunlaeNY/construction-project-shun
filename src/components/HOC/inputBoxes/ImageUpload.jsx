import React, { useEffect, useState } from "react";
import "../../../assets/styles/inputBoxes/imageUpload.scss";
const ImageUpload = ({value,handleFileChange}) => {
  // const [image, setImage] = useState(null);
  const [preview,setPreview] = useState(value || "")
  useEffect(() => {
    if(value){
      setPreview(value)
    }
  },[value])

  return (
    <div className="imageUploadContainer">
      <input
        type="file"
        name="image"
        id="file-input"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <label htmlFor="file-input">
        <div className="image">
          <div>
            {
              preview ? (
                <img src={preview} alt="" />
              ) : null
            }
            
          </div>
          <div className="imageUploadIcon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
              <path d="M33.3332 6.66659H28.3332L24.9998 3.33325H14.9998L11.6665 6.66659H6.6665C5.78245 6.66659 4.9346 7.01777 4.30948 7.6429C3.68436 8.26802 3.33317 9.11586 3.33317 9.99992V29.9999C3.33317 30.884 3.68436 31.7318 4.30948 32.3569C4.9346 32.9821 5.78245 33.3333 6.6665 33.3333H33.3332C34.2172 33.3333 35.0651 32.9821 35.6902 32.3569C36.3153 31.7318 36.6665 30.884 36.6665 29.9999V9.99992C36.6665 9.11586 36.3153 8.26802 35.6902 7.6429C35.0651 7.01777 34.2172 6.66659 33.3332 6.66659ZM19.9998 11.6666C22.21 11.6666 24.3296 12.5446 25.8924 14.1074C27.4552 15.6702 28.3332 17.7898 28.3332 19.9999C28.3332 22.2101 27.4552 24.3297 25.8924 25.8925C24.3296 27.4553 22.21 28.3333 19.9998 28.3333C17.7897 28.3333 15.6701 27.4553 14.1073 25.8925C12.5445 24.3297 11.6665 22.2101 11.6665 19.9999C11.6665 17.7898 12.5445 15.6702 14.1073 14.1074C15.6701 12.5446 17.7897 11.6666 19.9998 11.6666ZM19.9998 14.9999C18.6738 14.9999 17.402 15.5267 16.4643 16.4644C15.5266 17.4021 14.9998 18.6738 14.9998 19.9999C14.9998 21.326 15.5266 22.5978 16.4643 23.5355C17.402 24.4731 18.6738 24.9999 19.9998 24.9999C21.3259 24.9999 22.5977 24.4731 23.5354 23.5355C24.4731 22.5978 24.9998 21.326 24.9998 19.9999C24.9998 18.6738 24.4731 17.4021 23.5354 16.4644C22.5977 15.5267 21.3259 14.9999 19.9998 14.9999Z" />
            </svg>
            <p>upload</p>
          </div>
        </div>
      </label>
    </div>
  );
};

export default ImageUpload;



