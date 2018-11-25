// @flow
import React from 'react';
import Immutable from 'immutable';
import defaultSheetPath from './tile/default.png';
import { createGlobalStyle } from 'styled-components'
import DefaultFont from './tile/default.tff'
import './App.css';

const DefaultFontTile = createGlobalStyle`
  @font-face {
    font-family: MyFont;
    src: url('${DefaultFont}') format('opentype');
  }
`

const defaultSheetImage = new Image();
defaultSheetImage.src = defaultSheetPath;


class SpriteSheet extends Immutable.Record({
  style: DefaultFontTile,
  tileSize: 10,
  cols: 16,
}) {
  /* Returns the X, Y starting corner */
  getCorner(col: number, row?: number) {
    if (row === undefined) {
      // Use a linear indexing scheme
      const index = col;
      return [(index % this.get('cols')) * this.get('tileSize'), Math.floor(index / this.get('cols') * this.get('tileSize'))];
    }

    return [col * this.get('tileSize'), row * this.get('tileSize')];
  }
}

class Map extends Immutable.Record({ cols: 0, tiles: new Immutable.List() }) {
  get cols() {
    return this.get('cols');
  }

  get rows() {
    return this.length / this.cols
  }

  get length() {
    return this.get('tiles').size;
  }

  getTile(col, row) {
    return this.getIn(['tiles', row * this.cols + col]);
  }

  setTile(col, row, value) {
    this.setIn(['tiles', row * this.cols + col], value);
  }
}

const defaultSheet = new SpriteSheet();
const defaultMap = new Map({
  tiles: Immutable.List([
    0, 1, 2, 3, 5, 5, 10, 33,
    2, 2, 2, 40, 3, 2, 38, 38,
    2, 2, 2, 40, 3, 2, 38, 38,
    0, 1, 2, 3, 5, 5, 10, 33,
  ]),
  cols: 8,
});


class SpriteSheetCanvas extends React.Component<{
  map: Map,
  spriteSheet: SpriteSheet,
}> {
  canvasid = `canvas-${Math.floor(Math.random() * 1000)}`;

  componentDidMount() {
    this.updateTiles(this.props.map, this.props.spriteSheet);
  }

  componentDidUpdate(prevProp) {
    this.updateTiles(this.props.map, this.props.spriteSheet);
  }

  get canvasContext() {
    const element: ?HTMLCanvasElement = ((document.getElementById(this.canvasid): any): ?HTMLCanvasElement);
    if (element === null || element === undefined) {
      throw new Error(`Canvas element ${this.canvasid} was not found in the DOM`);
    }

    return element.getContext('2d'); 
  }

  updateTiles = (map, spriteSheet) => {
    const context = this.canvasContext;
    const tileSize = spriteSheet.get('tileSize');

	for (let c = 0; c < map.cols; c++) {
	  for (let r = 0; r < map.rows; r++) {
		var tile = map.getTile(c, r);
        const [cornerX, cornerY] = spriteSheet.getCorner(tile);
		if (tile !== 0) { // 0 => empty tile
		  context.drawImage(
			spriteSheet.get('image'), // image
			cornerX, // source x
			cornerY, // source y
			tileSize, // source width
			tileSize, // source height
			c * tileSize, // target x
			r * tileSize, // target y
			tileSize, // target width
			tileSize // target height
		  );
		}
	  }
	}
  }

  render() {
    return (
      <canvas id={this.canvasid}/>
    );
  }
}


class App extends React.Component<{}> {
  render() {
    return (
      <div className="App">
          <SpriteSheetCanvas
           map={defaultMap} 
           spriteSheet={defaultSheet}
          />
      </div>
    );
  }
}

export default App;
