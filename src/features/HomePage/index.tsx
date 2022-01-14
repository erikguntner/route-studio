import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import {FillLink, LightLink} from '../Layout/Header';
import {Contours} from '../Common/Contours';
import {Pencil} from '../Common/Icons';

export const HomePage = () => {
  return (
    <Container>
      <ContoursContainer>
        <Contours />
      </ContoursContainer>
      <Hero>
        <Icon>
          <Pencil />
        </Icon>
        <Title>Route Studio</Title>
        <Subtitle>Create and share ways to exlpore the outside world</Subtitle>
        <Row>
          <Link href="/create">
            <FillLink>Start Creating</FillLink>
          </Link>
          <Link href="/secret">
            <LightLink>Sign Up</LightLink>
          </Link>
        </Row>
      </Hero>
    </Container>
  );
};

const Hero = styled.section`
  padding: 8rem 0 4rem 0;
`;

const Icon = styled.div`
  height: 5rem;
  width: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: 0.5rem;
  color: ${({theme}) => theme.colors.white};

  & > svg {
    height: 4rem;
  }
`;

const Container = styled.div`
  padding: 0 4rem;
  margin: 0 auto;
  max-width: 1400px;
`;

const ContoursContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 200px;
  width: 45vw;
  z-index: 0;
`;

const Subtitle = styled.p`
  font-size: 2rem;
  color: ${props => props.theme.colors.gray[600]};
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  margin: 0;
  line-height: 1.15;
  font-size: 7rem;
  font-weight: 700;
  color: ${props => props.theme.colors.gray[900]};
`;

const Row = styled.div`
  display: flex;
  gap: 1rem;
`;
