import {CombinedState} from '@reduxjs/toolkit';
import {StateWithHistory} from 'redux-undo';
import {CounterState} from '../features/Counter/counterSlice';
import {MapState} from '../features/CreatePage/mapSlice';
import {MapControls} from '../features/CreatePage/MapControls';
import {render, screen, userEvent} from '../utils/test/test-utils';

const setup = (history: Partial<StateWithHistory<MapState>> = {}) => {
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
      past: [],
      present: {points: [], lines: []},
      future: [],
      ...history,
    },
  };

  render(
    <MapControls
      isElevationGraphOpen={false}
      toggleElevationGraph={jest.fn()}
      handleSelect={jest.fn()}
    />,
    {
      preloadedState,
    },
  );

  return {preloadedState};
};

describe('MapControls', () => {
  test('Renders all buttons', () => {
    setup();
    expect(screen.getByRole('button', {name: /undo/i})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /redo/i})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /clear/i})).toBeInTheDocument();
  });

  test('Disables Redo button when future is empty and Undo button when past is empty', () => {
    const {preloadedState} = setup({
      past: [
        {points: [], lines: []},
        {points: [], lines: []},
      ],
      present: {points: [], lines: []},
      future: [],
    });

    // const {past} = preloadedState.map;
    const undoButton = screen.getByRole('button', {name: /undo/i});
    const redoButton = screen.getByRole('button', {name: /redo/i});

    expect(undoButton).not.toBeDisabled();
    expect(redoButton).toBeDisabled();

    // Click undo button until the past is empty
    preloadedState.map.past.forEach(() => {
      userEvent.click(undoButton);
    });

    // check for disabled state
    expect(undoButton).toBeDisabled();
    expect(redoButton).not.toBeDisabled();
  });
});
