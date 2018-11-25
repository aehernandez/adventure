//@flow
import type { Node } from 'React';
import * as mobx from 'mobx';
import Immutable from 'immutable';
import { GameObject } from './object';

export class Board {
  /*
   * 0, 1, 2
   * 3, 4, 5
   * 6, 7, 8
   *
   * (2, 0), (2, 1), (2, 2)
   * (1, 0), (1, 1), (1, 2)
   * (0, 0), (0, 1), (0, 2)
   *
   * i = (W * (H - 1)) + x - H * y
  */

  tiles = new Immutable.List<Node>();
  objects: Immutable.Map<string, GameObject> = new Immutable.Map();
  cols = 0;

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

  addObject(x: number, y: number, object: GameObject) {
    if (!this.contained(x, y)) { throw new Error('not contained') }
    this.objects = this.objects.set(String([x, y]), object);
  }

  getObject(x: number, y: number): ?GameObject {
    return this.objects.get(String([x, y]), undefined);
  }

  moveObject(object: GameObject, x: number, y: number) {
    if (this.objects.has(String([x, y]))) {
      throw new Error('Cannot move an object to an occupied space');
    }

    const key = this.objects.keyOf(object);
    if (!key) {
      throw new Error('Consistent error. Object not found in board');
    }
    this.objects = this.objects.delete(key).set(String([x, y]), object);
  }
}

// Avoid using experimental decorate syntax
mobx.decorate(
  Board,
  {
    tiles: mobx.observable,
    objects: mobx.observable,
    cols: mobx.observable,
    length: mobx.computed,
    rows: mobx.computed,
  }
)

export default new Board(
  Immutable.List(Array(64 * 64).fill('\u00b7')),
  64,
);
