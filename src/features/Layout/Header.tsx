import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import {signIn, signOut, useSession} from 'next-auth/client';

export const Header = () => {
  const [session, loading] = useSession();

  return (
    <Wrapper>
      <Link href="/">
        <a>Route Studio</a>
      </Link>
      <nav>
        <Link href="/create">
          <NavLink>Create</NavLink>
        </Link>
        {loading ? (
          <div>loading</div>
        ) : session ? (
          <SignOutButton
            href="/api/auth/signout"
            onClick={e => {
              e.preventDefault();
              signOut();
            }}
          >
            Sign Out
          </SignOutButton>
        ) : (
          <Button onClick={() => signIn('auth0')}>Sign In</Button>
        )}
      </nav>
    </Wrapper>
  );
};

const COLORS = {
  primary: 'hsl(240deg 100% 60%)',
  primaryLight: 'hsl(235deg 100% 62%)',
  white: 'hsl(0deg 0% 100%)',
  offwhite: 'hsl(235deg 85% 97%)',
  gray: 'hsl(240deg 10% 50%)',
  transparentGray15: 'hsl(240deg 10% 50% / 0.15)',
  transparentGray75: 'hsl(240deg 10% 50% / 0.75)',
  black: 'hsl(0deg 0% 0%)',
};

const BaseButton = styled.button`
  padding: 12px 20px;
  border-radius: 4px;
  border: none;
  font-size: 16px;
  line-height: 1;

  &:hover {
    cursor: pointer;
  }
`;

const BaseLink = styled.a`
  padding: 12px 20px;
  border-radius: 4px;
  border: none;

  &:hover {
    cursor: pointer;
  }
`;

const SignOutButton = styled(BaseLink)`
  background-color: ${COLORS.primary};
  color: ${({theme}) => theme.colors.white};

  &:hover {
    background-color: ${COLORS.primaryLight};
  }
`;

const Button = styled(BaseButton)`
  background-color: ${COLORS.primary};
  color: ${({theme}) => theme.colors.white};

  &:hover {
    background-color: ${COLORS.primaryLight};
  }
`;

const NavLink = styled(BaseLink)`
  padding: 12px 20px;
  border-radius: 4px;
  color: ${COLORS.gray};
  background-color: transparent;
  outline-color: ${COLORS.gray};

  &:hover {
    background: ${COLORS.transparentGray15};
    color: ${COLORS.black};
  }
`;

const Wrapper = styled.header`
  display: flex;
  align-items: center;
  height: 66px;
  padding: 0 16px;

  & > a {
    margin-right: auto;
  }

  nav {
    display: flex;
    gap: 16px;
    align-items: center;
  }
`;
