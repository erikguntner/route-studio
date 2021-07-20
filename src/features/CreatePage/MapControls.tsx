import React from 'react';
import styled from 'styled-components';
import {ControlButton} from './ControlButton';
import {Redo} from './Icons';

export const MapControls = () => {
  return (
    <Wrapper>
      <ControlButton
        onClick={() => console.log('clicked')}
        label="redo"
        keyCode="a"
        disabled={false}
      >
        <Redo />
      </ControlButton>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 60px;
  width: 100vw;
  z-index: 20;
`;
