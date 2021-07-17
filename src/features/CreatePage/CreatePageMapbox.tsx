import React from 'react';
import styled from 'styled-components';
import ReactMapGL, {Marker} from 'react-map-gl';
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

// interface Dimensions {
//   width: number;
//   height: number;
// }

// const useResizeObserver = (
//   ref: React.MutableRefObject<HTMLDivElement | null>,
// ): Dimensions | null => {
//   const [dimensions, setDimensions] = React.useState<Dimensions | null>({
//     width: 0,
//     height: 0,
//   });

//   React.useEffect(() => {
//     if (!ref.current) return;
//     const observerTarget = ref.current;
//     const resizeObserver = new ResizeObserver(
//       (entries: ResizeObserverEntry[]) => {
//         const {width, height} = entries[0].contentRect;
//         setDimensions({width, height});
//       },
//     );
//     resizeObserver.observe(observerTarget);
//     return () => {
//       resizeObserver.unobserve(observerTarget);
//     };
//   }, [ref]);

//   return dimensions;
// };

// let interval: NodeJS.Timeout;

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

  // const dimensions = useResizeObserver(viewRef);

  // const onHover = React.useCallback(
  //   event => {
  //     const {
  //       features,
  //       srcEvent: {offsetX, offsetY},
  //     } = event;
  //     const hoveredFeature = features && features[0];
  //     console.log(hoveredFeature);

  //     if (hoveredFeature) {
  //       const v = new WebMercatorViewport({
  //         ...viewport,
  //         width: dimensions?.width || 0,
  //         height: dimensions?.height || 0,
  //       });

  //       const [lng, lat] = v.unproject([offsetX, offsetY]); // returns [lng,lat]\
  //       setHoverInfo({lng, lat, x: offsetX, y: offsetY});
  //       clearTimeout(interval);
  //       interval = setTimeout(() => setHoverInfo(null), 1000);
  //     }
  //   },
  //   [setHoverInfo, viewport, dimensions],
  // );

  const computedLineString = React.useMemo(
    () =>
      lineString([
        [-0.05, 51.5],
        [-0.06, 51.5],
        [-0.06, 51.52],
      ]),
    [multiPolyline],
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
        onHover={({lngLat}) => {
          const computedPoint = point(lngLat);
          const distance = pointToLineDistance(
            computedPoint,
            computedLineString,
            {units: 'kilometers'},
          );

          console.log(isDragging);
          if (distance < 0.05 && isDragging === false) {
            console.log('set it');
            setHoverInfo(lngLat);
          } else if (hoverInfo !== null) {
            setHoverInfo(null);
          }
        }}
      >
        <GeoJsonPath lines={multiPolyline} />
        {hoverInfo ? (
          <Marker
            latitude={hoverInfo[1]}
            longitude={hoverInfo[0]}
            draggable
            onDragStart={() => {
              console.log('called drag start');
              setIsDragging(true);
            }}
            onDragEnd={() => {
              console.log('called drag end');
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
  height: 12px;
  width: 12px;
  transform: translate3d(-50%, -50%, 0);
  border-radius: 50%;
  background-color: red;
`;
