import React from 'react';
import styled from 'styled-components';
import {ControlButton} from './ControlButton';
import {Redo, Undo} from './Icons';
import {LocationSearch} from './LocationSearch';

export const MapControls = () => {
  return (
    <Wrapper>
      <LocationSearch />
      <ControlButton
        onClick={() => console.log('clicked')}
        label="redo"
        keyCode="a"
        disabled={false}
      >
        <Redo />
      </ControlButton>
      <ControlButton
        onClick={() => console.log('clicked')}
        label="undo"
        keyCode="a"
        disabled={true}
      >
        <Undo />
      </ControlButton>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 60px;
  width: 100vw;
  z-index: 20;
  display: flex;
`;
