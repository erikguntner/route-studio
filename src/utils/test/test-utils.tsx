import {FC, ReactElement} from 'react';
import {
  render as rtlRender,
  RenderOptions,
  RenderResult,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ThemeProvider} from 'styled-components';
import {theme} from '../theme';
import {Provider} from 'react-redux';
import {configureStore, Store, AnyAction} from '@reduxjs/toolkit';
import {rootReducer, RootState} from '../../app/store';

interface Config {
  preloadedState?: RootState;
  store?: Store<RootState, AnyAction>;
  renderOptions?: Omit<RenderOptions, 'queries'>;
}

const render = (
  ui: ReactElement,
  {
    preloadedState,
    store = configureStore({reducer: rootReducer, preloadedState}),
    ...renderOptions
  }: Config = {},
): RenderResult => {
  const AllTheProviders: FC = ({children}) => {
    // console.log(store.getState());
    return (
      <ThemeProvider theme={theme}>
        <Provider store={store}>{children}</Provider>
      </ThemeProvider>
    );
  };

  return rtlRender(ui, {wrapper: AllTheProviders, ...renderOptions});
};

export * from '@testing-library/react';
export {render, userEvent};
