import {
  configureStore,
  combineReducers,
  ThunkAction,
  Action,
} from '@reduxjs/toolkit';
import counterReducer from '../features/Counter/counterSlice';
import {mapReducer} from '../features/CreatePage/mapSlice';
import undoable, {excludeAction} from 'redux-undo';

const rootReducer = combineReducers({
  counter: counterReducer,
  map: undoable(mapReducer, {
    limit: 10,
    filter: excludeAction([
      'map/fetchPoint/pending',
      'map/fetchPoint/rejected',
    ]),
  }),
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
