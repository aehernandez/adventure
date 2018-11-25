// @flow

import Immutable from 'immutable';
import board, { Board } from './board';
import type { Node } from 'React';
import { GameObject, Label } from './object';
import Wall from './wall';

export const Direction = new Immutable.Record({ 
  UP: 'UP', DOWN: 'DOWN', LEFT: 'LEFT', RIGHT: 'RIGHT' 
})();

class Player extends GameObject {
  position: [number, number]
  component: Node
  direction: $Values<Direction>
}

const player = new Player();
player.position = [3, 3];
player.component = 'O'
player.direction = Direction.UP;
board.addObject(3, 6, new Wall());
board.addObject(4, 6, new Wall());
board.addObject(5, 6, new Wall());
board.addObject(6, 6, new Wall());
board.addObject(3, 3, player);

function movePlayer(board: Board, source: Player, target: [number, number]) {
  let [xTarget, yTarget] = target;
  if (!board.contained(xTarget, yTarget))  { return; }
  const targetObject = board.getObject(xTarget, yTarget);
  if (targetObject) {
    return;
  }
  
  board.moveObject(player, xTarget, yTarget);
  // Update the players position
  // TODO should the board controller be responsible?
  player.position = [xTarget, yTarget];
}

function handleEvents(board: Board, player: Player, key: string) {
  const [x, y] = player.position;
  if (key === 'k') {
    movePlayer(board, player, [x, y + 1]);
  }
  else if (key === 'j') {
    movePlayer(board, player, [x, y - 1]);
  }
  else if (key === 'h') {
    movePlayer(board, player, [x - 1, y]);
  }
  else if (key === 'l') {
    movePlayer(board, player, [x + 1, y]);
  }

  console.log(player.position);
}

document.addEventListener('keydown', (e: SyntheticKeyboardEvent<>) => handleEvents(board, player, e.key));
