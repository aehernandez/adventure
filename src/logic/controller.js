// @flow

import Immutable from 'immutable';
import board, { Board } from './board';
import type { Node } from 'React';

const Direction = new Immutable.Record({ 
  UP: 'UP', DOWN: 'DOWN', LEFT: 'LEFT', RIGHT: 'RIGHT' 
})();

class Player {
  position: [number, number]
  component: Node
  direction: $Values<Direction>
}

const player = new Player();
player.position = [3, 3];
player.component = 'O'
player.direction = Direction.UP;
board.setTile(3, 3, player.component);

function swapPositions(board: Board, source: Player, target: [number, number]) {
    let [x, y] = player.position; 
    let [xTarget, yTarget] = target;
    if (!board.contained(xTarget, yTarget))  { return; }
    const empty = board.getTile(xTarget, yTarget);
    board.setTile(xTarget, yTarget, board.getTile(x, y))
    board.setTile(x, y, empty);
    player.position = [xTarget, yTarget];
}

function handleEvents(board: Board, player: Player, key: string) {
  const [x, y] = player.position;
  if (key === 'k') {
    swapPositions(board, player, [x, y + 1]);
  }
  else if (key === 'j') {
    swapPositions(board, player, [x, y - 1]);
  }
  else if (key === 'h') {
    swapPositions(board, player, [x - 1, y]);
  }
  else if (key === 'l') {
    swapPositions(board, player, [x + 1, y]);
  }

  console.log(player.position);
}

document.addEventListener('keydown', (e: SyntheticKeyboardEvent<>) => handleEvents(board, player, e.key));
