import React from 'react';
import {Marker} from 'react-map-gl';
import styled from 'styled-components';

interface UserMarkerProps {
  userLocation: number[] | null;
}

export const UserMarker = ({userLocation}: UserMarkerProps) => {
  return userLocation ? (
    <Marker longitude={userLocation[0]} latitude={userLocation[1]}>
      <Circle />
    </Marker>
  ) : null;
};

const Circle = styled.div`
  height: 14px;
  width: 14px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary};
  border: 3px solid ${props => props.theme.colors.white}; ;
`;
