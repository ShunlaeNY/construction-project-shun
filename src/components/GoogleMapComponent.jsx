import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "54vh",
  //   backgroundCcolor: $instructionGrayColor;
  // height: "47vh";
  // margin-bottom: px-to-rem(10);
  //
};

const center = {
  lat: 16.839731920084155,
  lng: 96.14636806855205,
};

const GoogleMapComponent = () => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyDCrDtDa-wdCdfjFQqFQDxMA6J9nxLAPkU">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
