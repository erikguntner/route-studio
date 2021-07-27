import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {graphHopperApi, Data} from './mapApi';

interface ClickArgs {
  points: number[][];
  lineIndices?: number[] | undefined;
  index?: number | undefined;
}

export const fetchRouteData = createAsyncThunk<Data, ClickArgs>(
  'map/fetchPoint',
  async ({points, lineIndices, index}, {rejectWithValue}) => {
    const {response, data} = await graphHopperApi({points});

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
