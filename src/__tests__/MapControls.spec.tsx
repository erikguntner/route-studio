import {CombinedState} from '@reduxjs/toolkit';
import {StateWithHistory} from 'redux-undo';
import {CounterState} from '../features/Counter/counterSlice';
import {MapState} from '../features/CreatePage/mapSlice';
import {MapControls} from '../features/CreatePage/MapControls';
import {render, screen, userEvent} from '../utils/test/test-utils';

const setup = (history: StateWithHistory<MapState>) => {
  const preloadedState:
    | CombinedState<{
        counter: CounterState;
        map: StateWithHistory<MapState>;
      }>
    | undefined = {
    counter: {
      value: 0,
      status: 'idle',
    },
    map: {
      ...history,
      group: null,
      _latestUnfiltered: {
        points: [],
        lines: [],
      },
      index: 5,
      limit: 6,
    },
  };

  render(<MapControls />, {
    preloadedState,
  });

  const undoButton = screen.getByRole('button', {name: /undo/i});
  const redoButton = screen.getByRole('button', {name: /redo/i});

  return {preloadedState, undoButton, redoButton};
};

describe('MapControls', () => {
  it('Disables Redo button when past is empty', () => {
    const {preloadedState, redoButton, undoButton} = setup({
      past: [
        {points: [], lines: []},
        {points: [], lines: []},
      ],
      present: {points: [], lines: []},
      future: [],
    });

    const {past} = preloadedState.map;

    expect(undoButton).not.toBeDisabled();
    expect(redoButton).toBeDisabled();

    // Click undo button until the past is empty
    past.forEach(() => {
      userEvent.click(undoButton);
    });

    // check for disabled state
    expect(undoButton).toBeDisabled();
    expect(redoButton).not.toBeDisabled();
  });

  it('Disables Undo button when future is empty', () => {
    const {preloadedState, redoButton, undoButton} = setup({
      past: [],
      present: {points: [], lines: []},
      future: [
        {points: [], lines: []},
        {points: [], lines: []},
      ],
    });

    const {future} = preloadedState.map;

    // check for disabled state
    expect(undoButton).not.toBeDisabled();
    expect(redoButton).toBeDisabled();

    // Click redo button until future is empty
    future.forEach(() => {
      userEvent.click(undoButton);
    });

    // check disabled states
    expect(undoButton).toBeDisabled();
    expect(redoButton).not.toBeDisabled();
  });
});
