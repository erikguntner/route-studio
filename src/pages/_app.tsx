import 'mapbox-gl/dist/mapbox-gl.css';
import type {AppProps} from 'next/app';
import {Provider as AuthProvider} from 'next-auth/client';
import {ThemeProvider} from 'styled-components';
import {theme, GlobalStyle} from '../utils/theme';
import {Layout} from '../features/Layout/Layout';

function MyApp({Component, pageProps}: AppProps) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <AuthProvider session={pageProps.session}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
