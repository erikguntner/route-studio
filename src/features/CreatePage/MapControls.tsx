import React from 'react';
import styled from 'styled-components';
import {ActionCreators} from 'redux-undo';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {ControlButton} from './ControlButton';
import {Redo, Undo, Clear, TrendingUp} from './Icons';
import {LocationSearch} from './LocationSearch';
import {clearState} from './mapSlice';

interface MapControlsProps {
  handleSelect: (coords: [number, number]) => void;
  toggleElevationGraph: () => void;
  isElevationGraphOpen: boolean;
}

export const MapControls = ({
  handleSelect,
  toggleElevationGraph,
  isElevationGraphOpen,
}: MapControlsProps) => {
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
      <HideOnMobile>
        <ControlButton
          onClick={toggleElevationGraph}
          label="elevation graph"
          aria-pressed={isElevationGraphOpen}
          keyCode=""
        >
          <TrendingUp />
        </ControlButton>
      </HideOnMobile>
    </Wrapper>
  );
};

const HideOnMobile = styled.div`
  display: inline-block;

  @media screen and (max-width: ${props => props.theme.screens.sm}) {
    display: none;
  }
`;

const Wrapper = styled.div`
  height: 100%;
  width: 100vw;
  z-index: 20;
  display: flex;
`;
