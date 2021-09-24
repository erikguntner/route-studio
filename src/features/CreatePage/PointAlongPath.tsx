import React, {useMemo} from 'react';
import styled from 'styled-components';
import {Marker} from 'react-map-gl';
import {lineString} from '@turf/helpers';
import {along} from '@turf/turf';

interface Props {
  distanceAlongPath: number;
  lines: number[][][];
}

const getPointOnLineFromDistance = ({distanceAlongPath, lines}: Props) => {
  if (distanceAlongPath === 0) {
    return [];
  }
  const line = lineString(lines.flat());

  const segment = along(line, distanceAlongPath, {units: 'meters'});

  return segment.geometry.coordinates;
};

export const PointAlongPath = ({distanceAlongPath, lines}: Props) => {
  const point = useMemo(
    () => getPointOnLineFromDistance({distanceAlongPath, lines}),
    [distanceAlongPath, lines],
  );

  return point.length ? (
    <Marker longitude={point[0]} latitude={point[1]}>
      <Label>{distanceAlongPath.toFixed(2)}</Label>
      <DistanceMarker />
    </Marker>
  ) : null;
};

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
