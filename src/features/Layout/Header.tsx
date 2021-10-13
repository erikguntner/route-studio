import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import {signIn, signOut, useSession} from 'next-auth/react';

export const Header = () => {
  const {status} = useSession();

  return (
    <Wrapper>
      <Link href="/">
        <a>Route Studio</a>
      </Link>
      <nav>
        <Link href="/create">
          <NavLink>Create</NavLink>
        </Link>
        {status === 'loading' ? (
          <div>loading</div>
        ) : status === 'authenticated' ? (
          <LightLink
            href="/api/auth/signout"
            onClick={e => {
              e.preventDefault();
              signOut();
            }}
          >
            Sign Out
          </LightLink>
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
  transition: all 0.2s ease;

  &:hover {
    cursor: pointer;
  }
`;

const BaseLink = styled.a`
  padding: 12px 20px;
  border-radius: 4px;
  font-size: 16px;
  border: none;
  transition: all 0.2s ease;

  &:hover {
    cursor: pointer;
  }
`;

export const FillLink = styled(BaseLink)`
  background-color: ${COLORS.primary};
  color: ${({theme}) => theme.colors.white};

  &:hover {
    background-color: ${COLORS.primaryLight};
  }
`;

export const LightLink = styled(BaseLink)`
  background-color: ${({theme}) => theme.colors.blue[50]};
  color: ${({theme}) => theme.colors.primary};
  font-weight: 600;

  &:hover {
    background-color: ${({theme}) => theme.colors.blue[100]};
    /* color: ${({theme}) => theme.colors.white}; */
  }
`;

const Button = styled(BaseButton)`
  background-color: ${COLORS.primary};
  color: ${({theme}) => theme.colors.white};

  &:hover {
    background-color: ${COLORS.primaryLight};
  }
`;

export const NavLink = styled(BaseLink)`
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
  background-color: ${({theme}) => theme.colors.white};
  z-index: 100;

  & > a {
    margin-right: auto;
  }

  nav {
    display: flex;
    gap: 16px;
    align-items: center;
  }
`;
