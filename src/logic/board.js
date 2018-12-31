//@flow
import React from 'react';
import type { Node } from 'React';
import { observable, computed, action } from 'mobx';
import Immutable from 'immutable';
import theme from '../theme';
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

  @observable tiles = new Immutable.List<Node>();
  @observable objects: Immutable.Map<Immutable.List<number>, GameObject> = new Immutable.Map();
  @observable overlay: Immutable.Map<Immutable.List<number>, Node> = new Immutable.Map();
  @observable cols = 0;

  constructor(tiles: Immutable.List<Node>, cols: number) {
    this.tiles = tiles;
    this.cols = cols;
  }

  @computed get rows() {
    return this.length / this.cols
  }

  @computed get length() {
    return this.tiles.size;
  }

  index(x: number, y: number): number {
    return (this.cols * (this.rows - 1)) + x - (this.rows * y);
  }

  @computed get nodes(): Immutable.OrderedMap<Immutable.List<number>, Node> {
    let nodes = new Immutable.OrderedMap();
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        nodes = nodes.set(Immutable.List([x, y]), this.getNode(x, y));
      }
    }

    return nodes;
  }

  getTile(x: number, y: number): ?Node {
    if (!this.contained(x, y)) { return undefined; }
    return this.tiles.get(this.index(x, y), '\u2022');
  }

  @action setTile(x: number, y: number, value: Node) {
    if (!this.contained(x, y)) { throw new Error('not contained') }
    this.tiles = this.tiles.set(this.index(x, y), value);
  }

  contained(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < this.cols && y < this.rows;
  }

  @action addObject(x: number, y: number, object: GameObject) {
    if (!this.contained(x, y)) { throw new Error('not contained') }
    if (this.hasObject(x, y)) { throw new Error('object already exists at location') }
    object.position = [x, y];
    this.objects = this.objects.set(Immutable.List([x, y]), object);
  }

  getObject(x: number, y: number): ?GameObject {
    return this.objects.get(Immutable.List([x, y]), undefined);
  }

  @action moveObject(object: GameObject, x: number, y: number) {
    if (this.hasObject(x, y)) {
      throw new Error('Cannot move an object to an occupied space');
    }

    const key = this.objects.keyOf(object);
    if (!key) {
      throw new Error('Consistent error. Object not found in board');
    }
    object.position = [x, y];
    this.objects = this.objects.delete(key).set(Immutable.List([x, y]), object);
  }

  hasObject(x: number, y: number) {
    return this.objects.has(Immutable.List([x, y]));
  }

  hasOverlay(x: number, y: number) {
    return this.overlay.has(Immutable.List([x, y]));
  }

  setOverlay(x: number, y: number, value: Node) {
    this.overlay = this.overlay.set(Immutable.List([x, y]), value);
  }

  getOverlay(x: number, y: number): ?Node {
    return this.overlay.get(Immutable.List([x, y]), undefined);
  }

  removeOverlay(x: number, y: number) {
    this.overlay = this.overlay.remove(Immutable.List([x, y]), undefined);
  }


  getNode(x: number, y: number): Node {
    const object = this.getObject(x, y);

    let tile;
    if (object) { tile = object.component; }
    else { tile = this.getTile(x, y); }
    tile = tile || ' ';

    const overlay = this.getOverlay(x, y);
    if (overlay) {
      // Inject theme, in case we have a styled component
      if (tile && typeof tile === 'object') {
        tile = React.cloneElement(tile, { theme });
      }
      console.log(overlay, x, y);
      return React.createElement(
        overlay,
        {},
        [tile]
      );
    }
    return tile;
  }

  static diffNodes(left: $PropertyType<Board, 'nodes'>, right: $PropertyType<Board, 'nodes'>): Array<[[number, number], Node]> {
    const differences = [];

    left.entrySeq().forEach(([k, v]) => {
      if (right.get(k) !== v) { 
        differences.push(
          [
            ((k.toJS(): any): [number, number]),
            v
          ]
        ); 
      }
    });
    return differences;
  }
}


export default new Board(
  Immutable.List(Array(50*30).fill('\u00b7')),
  50,
);
