// @flow
import type { Board } from './board';
import type { Player } from './player';
import { EnemyBase } from 'src/logic/enemy';
import styled from 'styled-components';

interface Action {
  speed: number;
  cooldown: number;
  currentCooldown: number;
  +description: string;
  +title: string;

  run_iter(player: Player, board: Board, key: string): Generator<typeof undefined, typeof undefined, string>;
}

const Target = styled.div`
  background: rgba(255, 0, 0, 0.4);
`;


export class RangedAttack implements Action {
  speed = 2;
  cooldown = 1;
  currentCooldown = 1;
  range = 5
  target = 1;
  damage = 5;

  title = 'Revolver';

  get description() {
    return `Simple ranged attack`;
  }

  *run_iter(player: Player, board: Board): Generator<typeof undefined, typeof undefined, string> {
    let [x, y] = player.position;
    board.setOverlay(x, y, Target);

    do {
      const key = yield;

      if (key === 'q') {
        break;
      }

      board.removeOverlay(x, y);
      if (key === 'k') {
        y += 1;
      }
      else if (key === 'j') {
        y -= 1;
      }
      else if (key === 'h') {
        x -= 1;
      }
      else if (key === 'l') {
        x += 1;
      }
      board.setOverlay(x, y, Target);

      if (key === ' ') {
        const object = board.getObject(x, y);
        if (
          object !== undefined && 
          object !== player && 
          object instanceof EnemyBase
        ) {
          object.currentHealth -= 1;

          if (object.currentHealth === 0) {
            board.removeObject(object);
          }

          player.currentSpeed -= this.speed;
          break;
        }
      }
    } while(true);

    board.removeOverlay(x, y);
  }
}
