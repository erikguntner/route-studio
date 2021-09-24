import {useEffect, useState, useRef, MutableRefObject} from 'react';
import ResizeObserver from 'resize-observer-polyfill';

interface Dimensions {
  boundedHeight: number;
  boundedWidth: number;
  height?: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  marginTop: number;
  width?: number;
}

interface ChartSettings {
  ref: MutableRefObject<HTMLDivElement | undefined>;
  newSettings: Dimensions;
}

const combineChartDimensions = (config: Partial<Dimensions>): Dimensions => {
  const dimensions = {
    marginTop: 30,
    marginRight: 30,
    marginBottom: 30,
    marginLeft: 35,
    ...config,
  };

  const {height, width, marginTop, marginBottom, marginLeft, marginRight} =
    dimensions;

  const boundedHeight = height ? height - marginTop - marginBottom : 0;

  const boundedWidth = width ? width - marginLeft - marginRight : 0;

  return {
    ...dimensions,
    boundedHeight,
    boundedWidth,
  };
};

export const useChartDimensions = (passedSettings = {}): ChartSettings => {
  const ref = useRef<HTMLDivElement>();
  const dimensions = combineChartDimensions(passedSettings);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const element = ref.current;

    if ((dimensions.width && dimensions.height) || element === undefined) {
      return;
    }

    const resizeObserver = new ResizeObserver(entries => {
      if (!Array.isArray(entries)) return;
      if (!entries.length) return;

      const entry = entries[0];

      if (width != entry.contentRect.width) {
        setWidth(entry.contentRect.width);
      }

      if (height != entry.contentRect.height) {
        setHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(element);

    return () => resizeObserver.unobserve(element);
  }, []);

  const newSettings = combineChartDimensions({
    ...dimensions,
    width: dimensions.width || width,
    height: dimensions.height || height,
  });

  return {ref, newSettings};
};
