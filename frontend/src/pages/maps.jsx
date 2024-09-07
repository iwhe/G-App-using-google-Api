import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { io } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_API_SERVER}`);



const MapComponent = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);



  useEffect( () => {

    if (mapInstance.current) return;
   mapInstance.current = L.map(mapRef.current).setView([0, 0], 16);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.x.com/codewbhupesh">Bhupesh Paneru</a>',
  }).addTo(mapInstance.current);




  return () => {
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }
  };
}, []);

useEffect( () => {
    const markers = {};

    socket.on("receive-location", (data) => {
      const { id, latitude, longitude } = data;
      mapInstance.current.setView([latitude, longitude]);
      if(markers[id]){
        markers[id].setLatLng([latitude, longitude]);
        markers[id].setPopupContent('You are here');
      } else{
        markers[id] = L.marker([latitude, longitude]).addTo(mapInstance.current).bindPopup('You are here');
      }
    })


    socket.on("user-disconnected", (id) => {
        if(markers[id]){
            mapInstance.current.removeLayer(markers[id]);
            delete markers[id]
        }
    })


}, [mapInstance])


useEffect( () => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
          console.error(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }
  }, [])
  return (
    <div className="h-screen w-screen flex flex-col items-center gap-4">
        <h1 className="font-bold font-serif text-2xl text-green-700">MAPS</h1>
      Google Maps API is unfortunately paid subscription model, so we could not
      afford the payment.
      <br></br>
      <p>This Maps features is built on <strong>leaflet</strong> and <strong>socket.io.</strong></p>
      <div
        id="map"
        ref={mapRef}
        style={{ height: "80vh", width: "80%" }}
      ></div>
      ;
    </div>
  );
};

export default MapComponent;
