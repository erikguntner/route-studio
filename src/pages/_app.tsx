import 'mapbox-gl/dist/mapbox-gl.css';
import type {AppProps} from 'next/app';
import {Provider as AuthProvider} from 'next-auth/client';
import {Provider} from 'react-redux';
import {ThemeProvider} from 'styled-components';
import {theme, GlobalStyle} from '../utils/theme';
import {Layout} from '../features/Layout/Layout';
import {store} from '../app/store';

function MyApp({Component, pageProps}: AppProps) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <AuthProvider session={pageProps.session}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </AuthProvider>
        </Provider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
