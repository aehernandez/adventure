// @flow
import type { Board } from 'src/logic/board';
import type { Player } from 'src/logic/player';
import { EnemyBase } from 'src/logic/enemy';
import styled from 'styled-components';

interface Action {
  speed: number;
  cooldown: number;
  currentCooldown: number;
  +description: string;
  +title: string;

  run(player: Player, board: Board): Generator<Action, Action, string>;
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
    return `Simple ranged attack. Deals ${this.damage} damage to ${this.target} target. S ${this.speed} C ${this.currentCooldown}/${this.cooldown}`;
  }

  *run(player: Player, board: Board): Generator<Action, Action, string> {
    let [x, y] = player.position;
    board.setOverlay(x, y, Target);
    const action: Action = this;

    do {
      const key = yield action;

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
          object.currentHealth -= this.damage;

          if (object.currentHealth === 0) {
            board.removeObject(object);
          }

          player.currentSpeed -= this.speed;
          break;
        }
      }
    } while(true);

    board.removeOverlay(x, y);
    return action;
  }
}
