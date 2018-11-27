// @flow
import React from 'react';
import Immutable from 'immutable';
import board, { Board } from './board';
import type { Node } from 'React';
import styled from 'styled-components';
import { GameObject } from './object';
import Wall from './wall';


class Player extends GameObject {
  component = (
  	<span
		css={`color: ${props => props.theme.primaryLight}`}
	>
	O
  	</span>
  )
}


const player = new Player();
board.addObject(15, 15, player);

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
}

document.addEventListener('keydown', (e: SyntheticKeyboardEvent<>) => handleEvents(board, player, e.key));
