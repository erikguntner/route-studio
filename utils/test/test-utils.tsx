import {FC, ReactElement} from 'react';
import {
  render as rtlRender,
  RenderOptions,
  RenderResult,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ThemeProvider} from 'styled-components';
import {theme} from '../theme';

const AllTheProviders: FC = ({children}) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

const render = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'queries'>,
): RenderResult => rtlRender(ui, {wrapper: AllTheProviders, ...options});

export * from '@testing-library/react';
export {render, userEvent};
