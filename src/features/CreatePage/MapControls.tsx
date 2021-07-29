import React from 'react';
import styled from 'styled-components';
import {ActionCreators} from 'redux-undo';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {ControlButton} from './ControlButton';
import {Redo, Undo, Clear} from './Icons';
import {LocationSearch} from './LocationSearch';
import {clearState} from './mapSlice';

export const MapControls = () => {
  const {map} = useAppSelector(({map}) => ({map}));
  const dispatch = useAppDispatch();
  const onSelect = (coords: [number, number]) => {
    console.log(coords);
  };

  return (
    <Wrapper>
      <LocationSearch onSelect={onSelect} />
      <ControlButton
        onClick={() => dispatch(ActionCreators.redo())}
        label="redo"
        keyCode="a"
        disabled={map.future.length === 0}
      >
        <Redo />
      </ControlButton>
      <ControlButton
        onClick={() => dispatch(ActionCreators.undo())}
        label="undo"
        keyCode="s"
        disabled={map.past.length === 0}
      >
        <Undo />
      </ControlButton>
      <ControlButton
        onClick={() => dispatch(clearState())}
        label="clear"
        keyCode="d"
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
