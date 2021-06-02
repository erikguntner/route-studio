import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';
import {signIn, signOut, useSession} from 'next-auth/client';

export default function Home() {
  const [session] = useSession();

  return (
    <Container>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {!session ? (
          <>
            <div>Not signed in</div>
            <a
              href="/api/auth/signin"
              onClick={e => {
                e.preventDefault();
                signIn();
              }}
            >
              Sign In
            </a>
          </>
        ) : (
          <>
            <Title>
              Welcome to <a href="https://nextjs.org">Next.js!</a>
            </Title>
            <p>Signed In as {session.user?.email}</p>
            <p>You can now access super secret pages</p>
            <Link href="/secret">
              <a>Secret Page</a>
            </Link>
            <a
              href="/api/auth/signout"
              onClick={e => {
                e.preventDefault();
                signOut();
              }}
            >
              Sign Out
            </a>
          </>
        )}
      </main>
      <footer>
        <div>Footer</div>
      </footer>
    </Container>
  );
}

const Container = styled.div`
  min-height: 100vh;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Title = styled.h1`
  margin: 0;
  line-height: 1.15;
  font-size: 4rem;
  color: ${props => props.theme.colors.primary};
`;
