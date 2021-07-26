import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Data {
  hints: Hints;
  info: Info;
  paths: Path[];
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

export const fetchRouteData = createAsyncThunk<Data, number[][]>(
  'map/fetchPoint',
  async (points, {signal, rejectWithValue}) => {
    const pointString = points
      .map(point => `point=${point[1]},${point[0]}&`)
      .join('');

    const response = await window.fetch(
      `https://graphhopper.com/api/1/route?${pointString}vehicle=foot&debug=true&elevation=true&legs=true&details=street_name&key=${process.env.NEXT_PUBLIC_GRAPH_HOPPER_KEY}&type=json&points_encoded=false`,
      {signal},
    );

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      console.error('error fetching point', data);
      return rejectWithValue(data);
    }
  },
);

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
      const {
        snapped_waypoints: {coordinates},
        points: {coordinates: lineCoordinates},
      } = action.payload.paths[0];

      if (state.points.length === 0) {
        state.points.push(coordinates[0]);
      } else {
        state.points.push(coordinates[1]);
        state.lines.push(lineCoordinates);
      }
    });
  },
});

export const {addStartingPoint} = mapSlice.actions;

export const mapReducer = mapSlice.reducer;
