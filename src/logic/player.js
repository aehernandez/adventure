// @flow
import React from 'react';
import { GameObject } from './object';
import { observable, action } from 'mobx';
import { RangedAttack } from './action';
import { Board } from 'src/logic/board';
import styled from 'styled-components';

const PlayerIdle = styled.span`
  color: ${props => props.theme.primaryLight};
`;

function movePlayer(board: Board, source: Player, target: [number, number]) {
  let [xTarget, yTarget] = target;
  if (!board.contained(xTarget, yTarget))  { return; }
  const targetObject = board.getObject(xTarget, yTarget);
  if (targetObject) {
    return;
  }
  
  board.moveObject(source, xTarget, yTarget);
}

export class Player extends GameObject {
  component = (
    <PlayerIdle>O</PlayerIdle>
  );

  @observable health = 10;
  @observable currentHealth = 10;
  @observable speed = 2;
  @observable currentSpeed = 2;

  @observable actions = [ new RangedAttack() ]
  currentAction = null;

  @action startTurn() {
    this.currentSpeed = this.speed;
  }

  *takeTurn(board: Board): Generator<typeof undefined, typeof undefined, string> {
    do {
      const key = yield;

      if (this.currentAction !== null) {
        let result = this.currentAction.next(key);
        if (this.currentAction !== null && !result.done) {
          continue;
        }
        // Make flow happy, don't see how this can happen
        if (result.value === undefined) { throw new Error(); }
        this.currentSpeed -= result.value.speed;
        this.currentAction = null;
      }

      if (this.currentSpeed > 0) {
        const [x, y] = this.position;
        if (key === 'k') {
          movePlayer(board, this, [x, y + 1]);
          this.currentSpeed -= 1;
        }
        else if (key === 'j') {
          movePlayer(board, this, [x, y - 1]);
          this.currentSpeed -= 1;
        }
        else if (key === 'h') {
          movePlayer(board, this, [x - 1, y]);
          this.currentSpeed -= 1;
        }
        else if (key === 'l') {
          movePlayer(board, this, [x + 1, y]);
          this.currentSpeed -= 1;
        }

        if (key === '1') {
          const candidateAction = this.actions[0];
          if (candidateAction.currentCooldown && this.currentSpeed >= candidateAction.speed) {
            this.currentAction = candidateAction.run(this, board);
            this.currentAction.next();
          }
        }
      }
    } while(this.currentSpeed > 0)
  }
}

export default new Player();
