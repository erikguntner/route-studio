import React, {useState, useCallback} from 'react';
import styled from 'styled-components';
import ReactMapGL, {Marker, MapEvent} from 'react-map-gl';
import {GeoJsonPath} from './GeoJsonPath';
import {lineString, point} from '@turf/helpers';
import {pointToLineDistance, along} from '@turf/turf';
import {Toaster} from 'react-hot-toast';

import {MapControls} from './MapControls';
import {ConnectingLines} from './ConnectingLines';
import {Points} from './Points';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {fetchRouteDataOnClick} from './mapSlice';
import {DestinationMarker} from './DestinationMarker';
import {GeolocationButton} from './GeolocationButton';
import {UserMarker} from './UserMarker';
import {ElevationGraph} from '../ElevationGraph';
export interface Viewport {
  latitude: number;
  longitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
}

export const CreatePageMapbox = () => {
  const [viewport, setViewport] = React.useState<Viewport>({
    latitude: 51.505,
    longitude: -0.09,
    zoom: 13,
    bearing: 0,
    pitch: 0,
  });
  const [hoverInfo, setHoverInfo] =
    React.useState<[number, number] | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const [searchPoint, setSearchPoint] = useState<number[] | null>(null);
  const [userLocation, setUserLocation] = useState<number[] | null>(null);
  const [distanceAlongPath, setDistanceAlongPath] = useState<number>(0);

  const {points, lines} = useAppSelector(({map}) => ({
    points: map.present.points,
    lines: map.present.lines,
  }));

  const dispatch = useAppDispatch();

  const onHover = React.useCallback(
    ({lngLat, features}: MapEvent) => {
      if (isDragging || lines.length === 0) return;

      const computedLineString = lineString(lines.flat());
      const computedPoint = point(lngLat);
      const distance = pointToLineDistance(computedPoint, computedLineString, {
        units: 'kilometers',
      });

      if (distance < 0.008 && features) {
        setHoverInfo(lngLat);
      } else if (hoverInfo !== null) {
        setHoverInfo(null);
      }
    },
    [isDragging, hoverInfo, setHoverInfo, lines],
  );

  const handleClick = async (lngLat: number[]) => {
    const coords =
      points.length > 0
        ? [points[points.length - 1], lngLat]
        : [lngLat, lngLat];

    try {
      await dispatch(fetchRouteDataOnClick({points: coords})).unwrap();
      // showToast('success', `Fetched ${user.name}`);
    } catch (err) {
      // showToast('error', `Fetch failed: ${err.message}`);
    }
  };

  const handleSelect = (coords: [number, number]) => {
    setSearchPoint(coords);
    setViewport({...viewport, latitude: coords[1], longitude: coords[0]});
  };

  const addDestinationToRoute = (location: number[]) => {
    handleClick(location);
    setSearchPoint(null);
  };

  const getPointOnLineFromDistance = useCallback(() => {
    if (distanceAlongPath === 0) {
      return [];
    }
    const line = lineString(lines.flat());

    const segment = along(line, distanceAlongPath, {units: 'meters'});

    return segment.geometry.coordinates;
  }, [distanceAlongPath]);

  const pointAlongPath = getPointOnLineFromDistance();

  return (
    <Wrapper>
      <GeolocationButton
        setUserLocation={setUserLocation}
        setViewport={setViewport}
        viewport={viewport}
      />
      <MapControls handleSelect={handleSelect} />
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/outdoors-v11"
        reuseMaps={true}
        width="100%"
        height="100%"
        onViewportChange={(viewport: Viewport) => setViewport(viewport)}
        interactiveLayerIds={lines.map((_, i) => `path-layer-${i}`)}
        onHover={onHover}
        onClick={e => handleClick(e.lngLat)}
      >
        <UserMarker userLocation={userLocation} />
        <GeoJsonPath lines={lines} />
        {hoverInfo ? (
          <Marker
            latitude={hoverInfo[1]}
            longitude={hoverInfo[0]}
            draggable
            onDragStart={() => setIsDragging(true)}
            onDrag={e => setHoverInfo(e.lngLat)}
            onDragEnd={() => setIsDragging(false)}
          >
            <HoverInfo></HoverInfo>
          </Marker>
        ) : null}
        <ConnectingLines
          points={points}
          index={index}
          isDragging={isDragging}
        />
        {pointAlongPath.length ? (
          <Marker longitude={pointAlongPath[0]} latitude={pointAlongPath[1]}>
            <Label>{distanceAlongPath.toFixed(2)}</Label>
            <DistanceMarker />
          </Marker>
        ) : null}
        <Points
          points={points}
          lines={lines}
          setIsDragging={setIsDragging}
          setIndex={setIndex}
        />
        <DestinationMarker
          location={searchPoint}
          cancel={() => setSearchPoint(null)}
          onClick={addDestinationToRoute}
          setSearchPoint={setSearchPoint}
        />
      </ReactMapGL>
      <ElevationWrapper>
        <ElevationGraph
          {...{
            showElevation: true,
            lines,
            units: 'meters',
            setDistanceAlongPath,
          }}
        />
      </ElevationWrapper>
      <Toaster datatest-id="toast" position={'bottom-right'} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  display: grid;
  flex-direction: column;
  height: calc(100vh - 66px);
  width: 100vw;
  grid-template-rows: ${props => props.theme.controlsHeight} 1fr;
`;

const HoverInfo = styled.div`
  height: 12px;
  width: 12px;
  transform: translate3d(-50%, -50%, 0);
  border-radius: 50%;
  background-color: ${props => props.theme.colors.white};
  border: 3px solid ${props => props.theme.colors.gray[600]};
  opacity: 0.85;

  &:hover {
    cursor: pointer;
  }
`;

const ElevationWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 35vh;
  width: 100%;

  @media screen and (max-width: ${props => props.theme.screens.md}) {
    height: 25vh;
  }
`;

const Label = styled.div`
  position: absolute;
  background-color: #333;
  opacity: 0.9;
  padding: 2px 6px;
  color: #fff;
  font-size: 10px;
  border-radius: 5px;
  transform: translate3d(-50%, -150%, 0);
`;

const DistanceMarker = styled.div`
  font-size: 1rem;
  line-height: 1;
  background-color: #fff;
  height: 14px;
  width: 14px;
  border-radius: 10px;
  border: 2px solid ${props => props.theme.colors.primary};
  transform: translate3d(-50%, -50%, 0);
`;
