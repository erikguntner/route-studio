import React, {ReactNode} from 'react';
import {MapContainer, MapContainerProps} from 'react-leaflet';

interface MapProps {
  props?: MapContainerProps;
  children?: ReactNode;
}

const Map = ({children, ...props}: MapProps) => {
  return <MapContainer {...props}>{children}</MapContainer>;
};

export default Map;
