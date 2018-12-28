// @flow
import Immutable from 'immutable';
import board, { Board } from './board';
import player, { Player } from './player';
import type { Node } from 'React';
import { EnemyBase } from './enemy';
import { RangedAttack } from './action';
import Wall from './wall';

board.addObject(15, 15, player);
const e1 = new EnemyBase();
board.addObject(1, 1, e1);

board.addObject(3, 6, new Wall());
board.addObject(4, 6, new Wall());
board.addObject(5, 6, new Wall());
board.addObject(6, 6, new Wall());

function movePlayer(board: Board, source: Player, target: [number, number]) {
  let [xTarget, yTarget] = target;
  if (!board.contained(xTarget, yTarget))  { return; }
  const targetObject = board.getObject(xTarget, yTarget);
  if (targetObject) {
    return;
  }
  
  board.moveObject(player, xTarget, yTarget);
}

class MainLoop {
  action = null;
  player: Player;
  board: Board;

  constructor(player: Player, board: Board) {
    this.player = player;
    this.board = board;
  }

  debouncer = new Set();

  run() {
    document.addEventListener('keydown', (e: SyntheticKeyboardEvent<>) => {
      if (!this.debouncer.has(e.key)) {
        this.debouncer.add(e.key);
        this.handle(e.key);
      }
    });
    document.addEventListener('keyup', (e) => {
      this.debouncer.delete(e.key)
    });
  }

  handle(key: string) {
    if (this.action !== null) {
      let result = this.action.next(key);
      if (this.action !== null && !result.done) {
        return;
      }

      this.action = null;
    }

    if (player.currentSpeed > 0) {
      const [x, y] = player.position;
      if (key === 'k') {
        movePlayer(board, player, [x, y + 1]);
        player.currentSpeed -= 1;
      }
      else if (key === 'j') {
        movePlayer(board, player, [x, y - 1]);
        player.currentSpeed -= 1;
      }
      else if (key === 'h') {
        movePlayer(board, player, [x - 1, y]);
        player.currentSpeed -= 1;
      }
      else if (key === 'l') {
        movePlayer(board, player, [x + 1, y]);
        player.currentSpeed -= 1;
      }

      if (key === 'a') {
        this.action = new RangedAttack().run_iter(player, board);
      }
    }

    if (player.currentSpeed <= 0) {
      player.currentSpeed = player.speed;
      moveOthers(this.player, this.board, [e1]);
    }
  }
}

function moveOthers(player: Player, board: Board, others: EnemyBase[]) {
  for (const other of others) {
    other.turn(board, player);
  }
}


const main = new MainLoop(player, board);
main.run();
