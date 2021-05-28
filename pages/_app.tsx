import '../styles/globals.css';
import type {AppProps} from 'next/app';
import {
  createGlobalStyle,
  ThemeProvider,
  DefaultTheme,
} from 'styled-components';

const GlobalStyle = createGlobalStyle``;

const theme: DefaultTheme = {
  colors: {
    primary: '#0070f3',
  },
};

function MyApp({Component, pageProps}: AppProps) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
export default MyApp;
