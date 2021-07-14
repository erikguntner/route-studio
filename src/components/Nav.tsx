import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import {signIn, signOut, useSession} from 'next-auth/client';

export const Nav = () => {
  const [session, loading] = useSession();

  return (
    <Header>
      <Link href="/">
        <a>Route Studio</a>
      </Link>
      <nav>
        <Link href="/create">
          <a>Create</a>
        </Link>
        {loading ? (
          <div>loading</div>
        ) : session ? (
          <a
            href="/api/auth/signout"
            onClick={e => {
              e.preventDefault();
              signOut();
            }}
          >
            Sign Out
          </a>
        ) : (
          <button onClick={() => signIn('auth0')}>Sign In</button>
        )}
      </nav>
    </Header>
  );
};

const Header = styled.header`
  display: flex;
  padding: 1rem;

  & > a {
    display: inline;
    margin-right: auto;
  }

  nav {
    display: inline;
  }
`;
