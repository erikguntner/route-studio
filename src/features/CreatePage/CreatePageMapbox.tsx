import React, {useState} from 'react';
import styled from 'styled-components';
import ReactMapGL, {Marker, MapEvent} from 'react-map-gl';
import {GeoJsonPath} from './GeoJsonPath';
import {lineString, point} from '@turf/helpers';
import {pointToLineDistance} from '@turf/turf';
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
import {PointAlongPath} from './PointAlongPath';
export interface Viewport {
  latitude: number;
  longitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
}

const CreatePageMapbox = () => {
  const [viewport, setViewport] = useState<Viewport>({
    latitude: 51.505,
    longitude: -0.09,
    zoom: 13,
    bearing: 0,
    pitch: 0,
  });
  const [hoverInfo, setHoverInfo] = useState<[number, number] | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const [searchPoint, setSearchPoint] = useState<number[] | null>(null);
  const [userLocation, setUserLocation] = useState<number[] | null>(null);
  const [distanceAlongPath, setDistanceAlongPath] = useState<number>(0);
  const [elevationGraphToggle, setElevationGraphToggle] =
    useState<boolean>(false);

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

  const toggleElevationGraph = () => {
    setElevationGraphToggle(!elevationGraphToggle);
  };

  return (
    <Wrapper>
      <GeolocationButton
        setUserLocation={setUserLocation}
        setViewport={setViewport}
        viewport={viewport}
      />
      <MapControls
        handleSelect={handleSelect}
        toggleElevationGraph={toggleElevationGraph}
      />
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
        <Points
          points={points}
          lines={lines}
          setIsDragging={setIsDragging}
          setIndex={setIndex}
        />
        <PointAlongPath distanceAlongPath={distanceAlongPath} lines={lines} />
        <DestinationMarker
          location={searchPoint}
          cancel={() => setSearchPoint(null)}
          onClick={addDestinationToRoute}
          setSearchPoint={setSearchPoint}
        />
      </ReactMapGL>
      {elevationGraphToggle ? (
        <ElevationWrapper>
          <ElevationGraph
            lines={lines}
            units={'meters'}
            setDistanceAlongPath={setDistanceAlongPath}
          />
        </ElevationWrapper>
      ) : null}
      <Toaster datatest-id="toast" position={'bottom-right'} />
    </Wrapper>
  );
};

export default CreatePageMapbox;

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

  @media screen and (max-width: ${props => props.theme.screens.sm}) {
    display: none;
  }
`;
