//@flow
import type { Node } from 'React';
import * as mobx from 'mobx';
import Immutable from 'immutable';

export class Board {
  tiles = new Immutable.List<Node>();
  cols = 0;
  /*
   * 0, 1, 2
   * 3, 4, 5
   *
   * 0, 1, 2
   * 3, 4, 5
   * 6, 7, 8
   *
   * (2, 0), (2, 1), (2, 2)
   * (1, 0), (1, 1), (1, 2)
   * (0, 0), (0, 1), (0, 2)
   *
   * i = (W * (H - 1)) + x - H * y
   * 0 = 6         
   * 4 = 6             + 1 - 3 * 1
   * 8 = 6             + 2 - 0
   *
  */

  constructor(tiles: Immutable.List<Node>, cols: number) {
    this.tiles = tiles;
    this.cols = cols;
  }

  get rows() {
    return this.length / this.cols
  }

  get length() {
    return this.tiles.size;
  }

  index(x: number, y: number): number {
    return (this.cols * (this.rows - 1)) + x - (this.rows * y);
  }

  getTile(x: number, y: number): ?Node {
    if (!this.contained(x, y)) { return undefined; }
    return this.tiles.get(this.index(x, y), '\u2022');
  }

  setTile(x: number, y: number, value: Node) {
    if (!this.contained(x, y)) { throw new Error('not contained') }
    this.tiles = this.tiles.set(this.index(x, y), value);
  }

  contained(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < this.cols && y < this.rows;
  }
}

// Avoid using experimental decorate syntax
mobx.decorate(
  Board,
  {
    tiles: mobx.observable,
    cols: mobx.observable,
    length: mobx.computed,
    rows: mobx.computed,
  }
)

export default new Board(
  Immutable.List([
    0, 1, 2, 3, 5, 5, 1, '\u2022',
    2, 2, 2, 1, 3, 2, 3, 3,
    2, 2, 2, 1, 3, 2, 3, 3,
    0, 1, 2, 3, 5, 5, 1, 3,
    0, 1, 2, 3, 5, 5, 1, '\u2022',
    2, 2, 2, 1, 3, 2, 3, 3,
    2, 2, 2, 1, 3, 2, 3, 3,
    0, 1, 2, 3, 5, 5, 1, 3,
  ]),
  8,
);
