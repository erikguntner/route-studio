import 'leaflet/dist/leaflet.css';
import styled from 'styled-components';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Polyline,
} from 'react-leaflet';
import {MapControls} from './MapControls';
import {divIcon, LatLngExpression, LeafletMouseEvent} from 'leaflet';
import {renderToStaticMarkup} from 'react-dom/server';
import {useState} from 'react';

interface CustomMarkerProps {
  position: LatLngExpression;
  color: string;
  setPosition: React.Dispatch<React.SetStateAction<LatLngExpression | null>>;
}

let interval: NodeJS.Timeout;

const EventHandler = () => {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      console.log(e);
    },
  });
  return null;
};

const multiPolyline: LatLngExpression[][] = [
  [
    [51.5, -0.1],
    [51.5, -0.12],
    [51.52, -0.12],
  ],
  [
    [51.5, -0.05],
    [51.5, -0.06],
    [51.52, -0.06],
  ],
];

const limeOptions = {color: 'lime', weight: 4};

const CustomMarker = ({position, color, setPosition}: CustomMarkerProps) => {
  const iconMarkup = renderToStaticMarkup(<Circle color={color} />);
  const customMarkerIcon = divIcon({
    html: iconMarkup,
  });

  return (
    <Marker
      draggable={true}
      icon={customMarkerIcon}
      position={position as LatLngExpression}
      eventHandlers={{
        dragstart() {
          clearTimeout(interval);
        },
        dragend() {
          interval = setTimeout(() => setPosition(null), 500);
        },
      }}
    />
  );
};

const CreatePage = () => {
  const [position, setPosition] = useState<LatLngExpression | null>(null);

  return (
    <Wrapper>
      <MapControls />
      <MapContainer style={{flex: 1}} center={[51.505, -0.09]} zoom={13}>
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`}
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        <Polyline
          eventHandlers={{
            mouseover({latlng}: LeafletMouseEvent) {
              setPosition([latlng.lat, latlng.lng]);
              clearTimeout(interval);
              interval = setTimeout(() => setPosition(null), 1000);
            },
          }}
          pathOptions={limeOptions}
          positions={multiPolyline}
        />
        {position !== null ? (
          <CustomMarker
            color={'blue'}
            position={position}
            setPosition={setPosition}
          />
        ) : null}
        <EventHandler />
      </MapContainer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 66px);
  width: 100vw;
`;

const Circle = styled.div<{color: string}>`
  height: 1.2rem;
  width: 1.2rem;
  background-color: ${props => props.color};
  border: 2px solid #fff;
  border-radius: 50%;
  transform: translate(-50%, 0);
`;

export default CreatePage;
