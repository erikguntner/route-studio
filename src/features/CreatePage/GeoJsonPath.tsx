import React from 'react';
import {Source, Layer, LayerProps} from 'react-map-gl';
import {lineString} from '@turf/helpers';
interface Props {
  lines: [number, number][][];
}

export const GeoJsonPath = ({lines}: Props) => {
  return (
    <>
      {lines.map((line, i) => {
        const multiLine = lineString(line, {
          startPoint: line[0],
          endPoint: line[line.length - 1],
        });
        const dataLayer: LayerProps = {
          id: `path-layer-${i}`,
          type: 'line',
          paint: {
            'line-width': 4,
            'line-color': '#0070f3',
          },
        };
        return (
          <Source key={`${line[0]}`} type="geojson" data={multiLine}>
            <Layer {...dataLayer} />
          </Source>
        );
      })}
    </>
  );
};
