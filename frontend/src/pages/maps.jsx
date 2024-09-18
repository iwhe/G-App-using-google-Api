import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { io } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_API_SERVER}`);

const MapComponent = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
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

  useEffect(() => {
    const markers = {};

    socket.on("receive-location", (data) => {
      const { id, latitude, longitude } = data;
      mapInstance.current.setView([latitude, longitude]);
      if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
        markers[id].setPopupContent("You are here");
      } else {
        markers[id] = L.marker([latitude, longitude])
          .addTo(mapInstance.current)
          .bindPopup("You are here");
      }
    });

    socket.on("user-disconnected", (id) => {
      if (markers[id]) {
        mapInstance.current.removeLayer(markers[id]);
        delete markers[id];
      }
    });
  }, [mapInstance]);

  useEffect(() => {
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
  }, []);
  return (
    <div className="h-screen w-screen flex flex-col items-center text-white  p-4 bg-zinc-800  font-[Helvetica]">
      <div className='flex flex-col items-center justify-center gap-4 w-full md:w-4/5'>
        <h1 className='text-4xl font-[100] text-center'><span className='text-blue-400'>Maps full version</span> will be available in <span className='text-green-400'>next update. </span></h1>
        <p className='text-xl  font-[] text-justify'> It was planned to use Google's Maps API for this fully functioning feature of Map where you can search places and also look for routes between the places but unfortunately it was <strong className='text-amber-400 text-xl'>paid subscription based API.</strong> So, this feature might be available in the next version of the project.</p>

        <p 
        className="text-left text-xl text-blue-400 font-[roboto] w-full">
           You can find your location in the map displayed below by allowing location to the browser. <span 
           className="text-gray-200 text-sm lowercase font-[Helvetica]"> 
           (This was built using <a 
           className="underline" href="https://socket.io/get-started/chat">
           socket.io</a> and  <a 
           className="underline" href = "https://leafletjs.com/">
           leaflet
           </a>)
           </span>
        </p>
        </div>
      <div id="map" ref={mapRef} style={{ height: "80vh", width: "80%" }}></div>

    </div>
  );
};

export default MapComponent;
