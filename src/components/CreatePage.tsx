import 'leaflet/dist/leaflet.css';
import styled from 'styled-components';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';

const CreatePage = () => {
  return (
    <Wrapper id="mapid">
      <MapContainer
        style={{height: '100%', width: '100%'}}
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`}
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: calc(100vh - 66px);
  width: 100vw;
`;

export default CreatePage;
