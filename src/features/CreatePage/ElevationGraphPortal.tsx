import React from 'react';
import Portal from '@reach/portal';
import styled from 'styled-components';

export interface ElevationGraphPortalProps {
  open: boolean;
  lines: number[][][];
}

export const ElevationGraphPortal = ({
  open,
  lines,
  children,
}: React.PropsWithChildren<ElevationGraphPortalProps>) => {
  return (
    <>
      {open ? (
        <Portal>
          <ElevationWrapper>
            {lines.length === 0 ? (
              <Text>Create a line to see the elevation chart</Text>
            ) : (
              <>{children}</>
            )}
          </ElevationWrapper>
        </Portal>
      ) : null}
    </>
  );
};

const ElevationWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 35vh;
  width: 100vw;
  background-color: ${props => props.theme.colors.white};

  @media screen and (max-width: ${props => props.theme.screens.md}) {
    height: 25vh;
  }

  @media screen and (max-width: ${props => props.theme.screens.sm}) {
    display: none;
  }
`;

const Text = styled.h3`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.4rem;
  color: ${props => props.theme.colors.gray[600]};

  @media screen and (max-width: ${props => props.theme.screens.md}) {
    font-size: 1.8rem;
  }
`;
