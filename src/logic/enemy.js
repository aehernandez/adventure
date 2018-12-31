// @flow
import { observer } from 'mobx-react';
import React from 'react';
import styled from 'styled-components';
import { GameObject } from './object';
import OverlayStore from './overlayState';
import type { Board } from './board';
import type { Player } from './player';

const EnemyIdle = styled.div`
  color: ${props => props.theme.alert};
`;

const HealthBlock = styled.div`
  color: ${props => props.theme.alert};
  font-size: 0.5em;
  font-weight: bold;
  transform: scale(1, 2.25);
  transform-origin: 0% 0%;
`;

export class EnemyBase extends GameObject {
  health = 10;
  currentHealth = 10;

  @observer get component() {
    return (
        OverlayStore.showStats ?
        <HealthBlock>{this.currentHealth}</HealthBlock>
        :
        <EnemyIdle>X</EnemyIdle>
    );
  }
  
  turn(board: Board, player: Player) {
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
