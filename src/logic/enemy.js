// @flow
import React from 'react';
import styled from 'styled-components';
import { GameObject } from './object';

const EnemyIdle = styled.span`
  color: ${props => props.theme.alert};
`;
export class EnemyBase extends GameObject {
	component = (
      <EnemyIdle>X</EnemyIdle>
	);
  
  turn(board, player) {
    const [targetX, targetY] = player.position;
    const [x, y] = this.position;
    const stepX = (targetX - x) / Math.max(Math.abs(targetX - x), 1)
    const stepY = (targetY - y) / Math.max(Math.abs(targetY - y), 1)

    let nextX = x + stepX;
    let nextY = y + stepY;
    if (stepX !== 0 && stepY !== 0) {
      if (Math.abs(targetX -x) >= Math.abs(targetY - y)) {
        nextY = y;
      } else {
        nextX = x;
      }
    }
    if (board.hasObject(nextX, nextY)) { return; }

    board.moveObject(this, nextX, nextY);
  }
}
