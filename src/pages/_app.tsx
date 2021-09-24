import 'mapbox-gl/dist/mapbox-gl.css';
import type {AppProps} from 'next/app';
import {SessionProvider} from 'next-auth/react';
import {Provider} from 'react-redux';
import {ThemeProvider} from 'styled-components';
import {theme, GlobalStyle} from '../utils/theme';
import {Layout} from '../features/Layout/Layout';
import {store} from '../app/store';

function MyApp({Component, pageProps: {session, ...pageProps}}: AppProps) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <SessionProvider session={session}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SessionProvider>
        </Provider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
