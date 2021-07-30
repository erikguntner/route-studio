import React from 'react';
import styled from 'styled-components';
import {Marker} from 'react-map-gl';
import {
  fetchRouteDataOnDrag,
  MapState,
  updatePoint,
  updateFirstPoint,
} from './mapSlice';
import {CallbackEvent} from 'react-map-gl/src/components/draggable-control';
import {useAppDispatch} from '../../app/hooks';

interface Props {
  setIsDragging: (value: React.SetStateAction<boolean>) => void;
  setIndex: (value: React.SetStateAction<number>) => void;
}

export const Points = ({
  points,
  lines,
  setIsDragging,
  setIndex,
}: MapState & Props) => {
  const dispatch = useAppDispatch();
  const handleDragStart = (event: CallbackEvent, i: number) => {
    if (points.length > 1) {
      setIsDragging(true);
    }
    setIndex(i);
  };

  const handleDrag = ({lngLat}: CallbackEvent, i: number) => {
    dispatch(updatePoint({index: i, coords: lngLat}));
  };

  const handleDragEnd = async ({lngLat}: CallbackEvent, index: number) => {
    // array of points used to calculate the new line
    const coords: number[][] = [];
    // indices of lines to replace
    const lineIndices: number[] = [];

    if (points.length === 1) {
      //dragging starting point with no other points
      dispatch(updateFirstPoint(lngLat));
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

      try {
        await dispatch(
          fetchRouteDataOnDrag({points: coords, lineIndices, index}),
        ).unwrap();
        // showToast('success', `Fetched ${user.name}`);
      } catch (err) {
        // showToast('error', `Fetch failed: ${err.message}`);
      }
      setIsDragging(false);
    }
  };

  return (
    <>
      {points.map((point, i) => {
        return (
          <Marker
            key={i}
            draggable
            latitude={point[1]}
            longitude={point[0]}
            onDragStart={e => handleDragStart(e, i)}
            onDrag={e => handleDrag(e, i)}
            onDragEnd={e => handleDragEnd(e, i)}
          >
            <Point data-testid="point" />
          </Marker>
        );
      })}
    </>
  );
};

const Point = styled.div`
  height: 14px;
  width: 14px;
  transform: translate3d(-50%, -50%, 0);
  border-radius: 50%;
  background-color: ${props => props.theme.colors.white};
  border: 3px solid ${props => props.theme.colors.gray[600]};
`;
