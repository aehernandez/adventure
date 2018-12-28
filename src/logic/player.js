// @flow
import React from 'react';
import { GameObject } from './object';
import styled from 'styled-components';

const PlayerIdle = styled.span`
  color: ${props => props.theme.primaryLight};
`;

export class Player extends GameObject {
  component = (
    <PlayerIdle>O</PlayerIdle>
  );

  speed = 2;
  currentSpeed = 2;
}

export default new Player();
