import React, {useState} from 'react';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import {Viewport} from './CreatePageMapbox';
import {Geolocation} from '../Common/Icons';

interface Props {
  setUserLocation: React.Dispatch<React.SetStateAction<number[] | null>>;
  setViewport: React.Dispatch<React.SetStateAction<Viewport>>;
  viewport: Viewport;
}

export const GeolocationButton = ({
  setUserLocation,
  setViewport,
  viewport,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const getGeolocation = () => {
    setLoading(true);
    const geo = navigator.geolocation;
    if (!geo) {
      toast.error('Your browser does not support geolocation');
      return;
    }

    const onSuccess = ({coords}: GeolocationPosition) => {
      setUserLocation([coords.longitude, coords.latitude]);
      setViewport({
        ...viewport,
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      setLoading(false);
    };

    const onError = () => {
      toast.error(
        'There was an error finding your location. Check your location permissions',
      );
      setLoading(false);
    };

    geo.getCurrentPosition(onSuccess, onError, {timeout: 10000});
  };

  return (
    <Button
      onClick={getGeolocation}
      aria-label={'Locate user'}
      disabled={loading}
      $loading={loading}
    >
      {loading ? (
        <Spinner aria-label="Loading user location">
          <div></div>
        </Spinner>
      ) : (
        <Geolocation />
      )}
    </Button>
  );
};

const Button = styled.button<{$loading: boolean}>`
  position: absolute;
  top: ${props => props.theme.controlsHeight};
  left: 0;
  height: 40px;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: 4px;
  background-color: #fff;
  color: ${props => props.theme.colors.gray[600]};
  z-index: 1000;
  margin: 8px;

  &:hover {
    cursor: ${props => (props.$loading ? 'progress' : 'pointer')};
    color: ${props => props.theme.colors.black};
    &:not(:disabled) {
      background-color: ${props => props.theme.colors.gray[100]};
    }
  }

  &:focus {
    outline: none;
    box-shadow: ${props => props.theme.outline};
  }
`;

const Spinner = styled.div`
  position: relative;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  border: 2px solid ${props => props.theme.colors.gray[200]};
  border-right: 2px solid ${props => props.theme.colors.primary};
  animation: 1s ease-in-out infinite rotate;

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
`;
