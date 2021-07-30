import React from 'react';
import styled from 'styled-components';
import {Popup, Marker} from 'react-map-gl';

interface AddDestinationMarkerProps {
  location: number[] | null;
  cancel: () => void;
  onClick: (lngLat: number[]) => void;
  setSearchPoint: React.Dispatch<React.SetStateAction<number[] | null>>;
}

export const DestinationMarker = ({
  location,
  cancel,
  onClick,
  setSearchPoint,
}: AddDestinationMarkerProps) => {
  return location ? (
    <>
      <UserPopup
        tipSize={5}
        anchor="bottom"
        longitude={location[0]}
        latitude={location[1]}
        closeButton={false}
      >
        <MarkerWrapper>
          <Buttons>
            <button aria-label="Do not add point to route" onClick={cancel}>
              Cancel
            </button>
            <button
              aria-label="Add point to route"
              onClick={() => onClick(location)}
            >
              Add to route
            </button>
          </Buttons>
        </MarkerWrapper>
      </UserPopup>
      <Marker
        draggable
        longitude={location[0]}
        latitude={location[1]}
        onDrag={e => setSearchPoint(e.lngLat)}
      >
        <Point />
      </Marker>
    </>
  ) : null;
};

const Point = styled.div`
  height: 14px;
  width: 14px;
  transform: translate3d(-50%, -50%, 0);
  border-radius: 50%;
  background-color: ${props => props.theme.colors.white};
  border: 3px solid ${props => props.theme.colors.gray[600]};
`;

const MarkerWrapper = styled.div`
  position: relative;
`;

const UserPopup = styled(Popup)`
  padding: 0;
  background-color: transparent;

  .mapboxgl-popup-content {
    padding: 0;
    background-color: transparent;
  }
`;

const Buttons = styled.div`
  transform: translateY(-9px);

  button {
    width: 100px;
    background-color: rgba(51, 51, 51, 0.9);
    border: none;
    padding: 8px 0;
    color: #fff;

    &:hover {
      cursor: pointer;
      background-color: rgba(51, 51, 51, 0.85);
    }

    &:focus {
      outline: none;
      box-shadow: inset 0 0 0 2px ${props => props.theme.colors.gray[100]};
    }

    &:first-of-type {
      position: relative;
      color: red;
      border-radius: 3px 0 0 3px;

      &::after {
        content: '';
        position: absolute;
        right: 0;
        top: 8px;
        height: calc(100% - 16px);
        width: 1px;
        background-color: ${props => props.theme.colors.gray[200]};
      }
    }

    &:last-of-type {
      border-radius: 0 3px 3px 0;
    }
  }

  &::before {
    content: '';
    position: absolute;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-top: 6px solid rgba(51, 51, 51, 0.9);
    bottom: -5px;
    left: 87px;
    z-index: 1090;
    left: 50%;
    transform: translate3d(-50%, 10%, 0);
  }
`;
