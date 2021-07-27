import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Data {
  hints: Hints;
  info: Info;
  paths: Path[];
  lineIndices: number[] | undefined;
  index: number | undefined;
}

export interface Hints {
  'visited_nodes.sum': number;
  'visited_nodes.average': number;
}

export interface Info {
  copyrights: string[];
  took: number;
}

export interface Path {
  distance: number;
  weight: number;
  time: number;
  transfers: number;
  points_encoded: boolean;
  bbox: number[];
  points: Points;
  instructions: Instruction[];
  legs: string[];
  details: string[];
  ascend: number;
  descend: number;
  snapped_waypoints: Points;
}

export interface Instruction {
  distance: number;
  heading?: number;
  sign: number;
  interval: number[];
  text: string;
  time: number;
  street_name: string;
  last_heading?: number;
}

export interface Points {
  type: string;
  coordinates: Array<number[]>;
}

interface Args {
  points: number[][];
  lineIndices?: number[] | undefined;
  index?: number | undefined;
}

export const fetchRouteData = createAsyncThunk<Data, Args>(
  'map/fetchPoint',
  async ({points, lineIndices, index}, {signal, rejectWithValue}) => {
    const pointString = points
      .map(point => `point=${point[1]},${point[0]}&`)
      .join('');

    const response = await window.fetch(
      `https://graphhopper.com/api/1/route?${pointString}vehicle=foot&debug=true&elevation=true&legs=true&details=street_name&key=${process.env.NEXT_PUBLIC_GRAPH_HOPPER_KEY}&type=json&points_encoded=false`,
      {signal},
    );

    const data = await response.json();

    if (response.ok) {
      return {...data, lineIndices, index};
    } else {
      console.error('error fetching point', data);
      return rejectWithValue(data);
    }
  },
);

const createLineSegments = (
  waypoints: number[][],
  coordinates: number[][],
): number[][][] => {
  if (waypoints.length === 3) {
    const middlePointIndex = coordinates.findIndex(
      coord => coord[0] === waypoints[1][0] && coord[1] === waypoints[1][1],
    );
    const leftLine = coordinates.slice(0, middlePointIndex + 1);
    const rightLine = coordinates.slice(middlePointIndex);
    return [leftLine, rightLine];
  }

  return [coordinates];
};

export interface MapState {
  points: number[][];
  lines: number[][][];
}

const initialState: MapState = {
  points: [],
  lines: [],
};

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    addStartingPoint: (state, action: PayloadAction<number[]>) => {
      state.points.push(action.payload);
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchRouteData.fulfilled, (state, action) => {
      const {index} = action.payload;
      const {
        snapped_waypoints: {coordinates},
        points: {coordinates: lineCoordinates},
      } = action.payload.paths[0];

      if (index === undefined) {
        // The event was a click
        if (state.points.length === 0) {
          state.points.push(coordinates[0]);
        } else {
          state.points.push(coordinates[1]);
          state.lines.push(lineCoordinates);
        }
      } else {
        // the event was a drag
        const newLineSegments = createLineSegments(
          coordinates,
          lineCoordinates,
        );

        if (index === 0) {
          // drag first point
          state.points[0] = coordinates[0];
          state.lines[0] = newLineSegments[0];
        } else if (index === state.points.length - 1) {
          // drag last point
          state.points[state.points.length - 1] = coordinates[1];
          state.lines[state.lines.length - 1] = newLineSegments[0];
        } else {
          // drag a middle point
          state.points[index] = coordinates[1];
          state.lines[index - 1] = newLineSegments[0];
          state.lines[index] = newLineSegments[1];
        }
      }
    });
  },
});

export const {addStartingPoint} = mapSlice.actions;

export const mapReducer = mapSlice.reducer;
