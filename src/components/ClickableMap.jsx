import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "200px",
};

const defaultCenter = {
  lat: 16.839731920084155,
  lng: 96.14636806855205,
};

const ClickableMap = () => {
  const [marker, setMarker] = useState(null);

  const handleMapClick = (event) => {
    setMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyDCrDtDa-wdCdfjFQqFQDxMA6J9nxLAPkU">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={marker || defaultCenter}
        zoom={10}
        onClick={handleMapClick} // Capture click event
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>
      {marker && (
        <p>
          Selected Location: {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
        </p>
      )}
    </LoadScript>
  );
};

export default ClickableMap;
