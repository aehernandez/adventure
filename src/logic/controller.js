// @flow
import board, { Board } from './board';
import player, { Player } from './player';
import { EnemyBase } from './enemy';
import Wall from './wall';

board.addObject(15, 15, player);
const e1 = new EnemyBase();
board.addObject(1, 1, e1);

board.addObject(3, 6, new Wall());
board.addObject(4, 6, new Wall());
board.addObject(5, 6, new Wall());
board.addObject(6, 6, new Wall());

class MainLoop {
  playerTurn = null;
  player: Player;
  board: Board;

  constructor(player: Player, board: Board) {
    this.player = player;
    this.board = board;
  }

  debouncer = new Set();

  run() {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (!this.debouncer.has(e.key)) {
        this.debouncer.add(e.key);
        this.handle(e.key);
      }
    });
    document.addEventListener('keyup', (e: KeyboardEvent) => {
      this.debouncer.delete(e.key)
    });
  }

  handle(key: string) {
    // Take the player's turn
    // eslint-disable-next-line no-unused-vars
    if (this.playerTurn === null) {
      this.playerTurn = this.player.takeTurn(this.board);
      this.playerTurn.next();
    }

    // $FlowFixMe
    let result = this.playerTurn.next(key);
    if (result.done) {
      this.playerTurn = null; 
      moveOthers(this.player, this.board, [e1]);
      this.player.startTurn();
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
