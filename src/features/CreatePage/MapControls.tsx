import React from 'react';
import styled from 'styled-components';
import {ActionCreators} from 'redux-undo';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {ControlButton} from './ControlButton';
import {Redo, Undo, Clear} from './Icons';
import {LocationSearch} from './LocationSearch';
import {clearState} from './mapSlice';

interface Props {
  handleSelect: (coords: [number, number]) => void;
}

export const MapControls = ({handleSelect}: Props) => {
  const {map} = useAppSelector(({map}) => ({map}));
  const dispatch = useAppDispatch();

  return (
    <Wrapper>
      <LocationSearch onSelect={handleSelect} />
      <ControlButton
        onClick={() => dispatch(ActionCreators.redo())}
        label="redo"
        keyCode=""
        disabled={map.future.length === 0}
      >
        <Redo />
      </ControlButton>
      <ControlButton
        onClick={() => dispatch(ActionCreators.undo())}
        label="undo"
        keyCode=""
        disabled={map.past.length === 0}
      >
        <Undo />
      </ControlButton>
      <ControlButton
        onClick={() => dispatch(clearState())}
        label="clear"
        keyCode=""
        disabled={map.present.points.length === 0}
      >
        <Clear />
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
