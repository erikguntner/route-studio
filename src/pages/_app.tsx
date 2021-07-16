import type {AppProps} from 'next/app';
import {Provider} from 'next-auth/client';
import {ThemeProvider} from 'styled-components';
import {theme, GlobalStyle} from '../utils/theme';
import {Layout} from '../features/Layout/Layout';

function MyApp({Component, pageProps}: AppProps) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Provider session={pageProps.session}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </ThemeProvider>
    </>
  );
}
export default MyApp;
