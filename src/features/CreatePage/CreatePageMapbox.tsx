import React from 'react';
import styled from 'styled-components';
import ReactMapGL, {Marker, MapEvent} from 'react-map-gl';
import {GeoJsonPath} from './GeoJsonPath';
import {lineString, point} from '@turf/helpers';
import {pointToLineDistance} from '@turf/turf';
interface Viewport {
  latitude: number;
  longitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
}

const multiPolyline: [number, number][][] = [
  [
    [-0.1, 51.5],
    [-0.12, 51.5],
    [-0.12, 51.5],
  ],
  [
    [-0.05, 51.5],
    [-0.06, 51.5],
    [-0.06, 51.52],
  ],
];

export const CreatePageMapbox = () => {
  const [viewport, setViewport] = React.useState({
    latitude: 51.505,
    longitude: -0.09,
    zoom: 13,
  });
  const [hoverInfo, setHoverInfo] =
    React.useState<[number, number] | null>(null);

  const [isDragging, setIsDragging] = React.useState<boolean>(false);

  const viewRef = React.useRef(null);

  const computedLineString = React.useMemo(
    () =>
      lineString([
        [-0.05, 51.5],
        [-0.06, 51.5],
        [-0.06, 51.52],
      ]),
    [multiPolyline],
  );

  const onHover = React.useCallback(
    ({lngLat, features}: MapEvent) => {
      if (isDragging) return;

      const computedPoint = point(lngLat);
      const distance = pointToLineDistance(computedPoint, computedLineString, {
        units: 'kilometers',
      });

      if (distance < 0.008 && features) {
        console.log(features[0].layer.id);
        setHoverInfo(lngLat);
      } else if (hoverInfo !== null) {
        setHoverInfo(null);
      }
    },
    [isDragging, computedLineString, hoverInfo, setHoverInfo],
  );

  return (
    <Wrapper ref={viewRef}>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        reuseMaps={true}
        width="100%"
        height="100%"
        onViewportChange={(viewport: Viewport) => setViewport(viewport)}
        mapStyle="mapbox://styles/mapbox/outdoors-v11"
        interactiveLayerIds={multiPolyline.map((_, i) => `path-layer-${i}`)}
        onHover={onHover}
      >
        <GeoJsonPath lines={multiPolyline} />
        {hoverInfo ? (
          <Marker
            latitude={hoverInfo[1]}
            longitude={hoverInfo[0]}
            draggable
            onDragStart={() => {
              setIsDragging(true);
            }}
            onDrag={e => setHoverInfo(e.lngLat)}
            onDragEnd={() => {
              setIsDragging(false);
            }}
          >
            <HoverInfo></HoverInfo>
          </Marker>
        ) : null}
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

const HoverInfo = styled.div`
  height: 18px;
  width: 18px;
  transform: translate3d(-50%, -50%, 0);
  border-radius: 50%;
  background-color: red;

  &:hover {
    cursor: pointer;
  }
`;
