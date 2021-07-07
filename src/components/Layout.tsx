import Head from 'next/head';
import React, {ReactNode} from 'react';
import styled from 'styled-components';
import {Nav} from './Nav';

interface Props {
  children: ReactNode;
}

const Layout = ({children}: Props) => {
  return (
    <>
      <Container>
        <Head>
          <title>Route Studio</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Nav />
        <>{children}</>
      </Container>
    </>
  );
};

const Container = styled.div`
  background-color: #fff;
`;

export default Layout;
