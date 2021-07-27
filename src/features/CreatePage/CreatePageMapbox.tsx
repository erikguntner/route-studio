import React from 'react';
import styled from 'styled-components';
import ReactMapGL, {Marker, MapEvent} from 'react-map-gl';
import {GeoJsonPath} from './GeoJsonPath';
import {lineString, point} from '@turf/helpers';
import {pointToLineDistance} from '@turf/turf';

import {MapControls} from './MapControls';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {fetchRouteData} from './mapSlice';
import {CallbackEvent} from 'react-map-gl/src/components/draggable-control';
interface Viewport {
  latitude: number;
  longitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
}

export const CreatePageMapbox = () => {
  const [viewport, setViewport] = React.useState({
    latitude: 51.505,
    longitude: -0.09,
    zoom: 13,
  });
  const [hoverInfo, setHoverInfo] =
    React.useState<[number, number] | null>(null);
  const [isDragging, setIsDragging] = React.useState<boolean>(false);

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

  const handleClick = async ({lngLat}: MapEvent) => {
    const coords =
      points.length > 0
        ? [points[points.length - 1], lngLat]
        : [lngLat, lngLat];

    try {
      await dispatch(fetchRouteData({points: coords})).unwrap();
      // showToast('success', `Fetched ${user.name}`);
    } catch (err) {
      // showToast('error', `Fetch failed: ${err.message}`);
    }
  };

  const handleDrag = async ({lngLat}: CallbackEvent, index: number) => {
    // array of points used to calculate the new line
    const coords: number[][] = [];
    // indices of lines to replace
    const lineIndices: number[] = [];

    if (points.length === 1) {
      //dragging starting point with no other points
    } else {
      if (index === 0) {
        // If you drag deginning point
        coords.push(lngLat, points[1]);
        lineIndices.push(0);
      } else if (index === lines.length) {
        // If you drag the end point
        coords.push(points[points.length - 2], lngLat);
        lineIndices.push(index - 1);
      } else {
        // if you drag a middle point
        coords.push(points[index - 1], lngLat, points[index + 1]);
        lineIndices.push(index - 1, index);
      }
    }

    try {
      await dispatch(
        fetchRouteData({points: coords, lineIndices, index}),
      ).unwrap();
      // showToast('success', `Fetched ${user.name}`);
    } catch (err) {
      // showToast('error', `Fetch failed: ${err.message}`);
    }
  };

  return (
    <Wrapper>
      <MapControls />
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
        onClick={handleClick}
      >
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
        {points.map((point, i) => {
          return (
            <Marker
              draggable
              key={point[1]}
              latitude={point[1]}
              longitude={point[0]}
              onDragEnd={e => handleDrag(e, i)}
            >
              <Point />
            </Marker>
          );
        })}
      </ReactMapGL>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 66px);
  width: 100vw;
`;

const Point = styled.div`
  height: 14px;
  width: 14px;
  transform: translate3d(-50%, -50%, 0);
  border-radius: 50%;
  background-color: ${props => props.theme.colors.white};
  border: 3px solid ${props => props.theme.colors.gray[600]};
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
