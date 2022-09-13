import React from 'react';
import { GoogleMap, LoadScript, Marker, useJsApiLoader } from '@react-google-maps/api';
import MapIcon from '@public/icons/nextjs-icon.svg';
import { Location } from '@modules/location/types/location';

export interface GoogleMapComponentProps {
  locations: Location[];
}

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 52.04,
  lng: 20.78,
};

const googleMapsApiKey = 'AIzaSyD3xO6BVrYHeD-sgkUbpEU6UjtWEWpYEdw';

export const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ locations }) => {
  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={5}>
        {locations &&
          locations.map((location, index) => (
            <Marker
              key={index}
              position={{ lat: location.content.lat, lng: location.content.lon }}
              // icon={{
              //   // path: google.maps.SymbolPath.CIRCLE,
              //   // url: (require('./icons/github-icon.svg')),
              //   url: 'https://escapecity.ch/wp-content/uploads/2022/01/pizza-icon.png',
              //   // anchor: new google.maps.Point(5, 58),
              //   fillColor: '#EB00FF',
              //   scale: 20,
              // }}
              icon={'http://maps.google.com/mapfiles/kml/paddle/blu-blank.png'}
              title={location.title}
            >
            </Marker>
          ))}
        <></>
      </GoogleMap>
    </LoadScript>
  );
};
