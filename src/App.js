// @flow
import React from 'react';
import Immutable from 'immutable';
import { observer } from 'mobx-react';
import styled, { createGlobalStyle } from 'styled-components'
import DefaultFont from './tile/default.tff'
import './App.css';

import board, { Board } from './logic/board';
import './logic/controller';

const DefaultFontTile = createGlobalStyle`
  @font-face {
    font-family: tile;
    src: url('${DefaultFont}') format('opentype');
  }
`

const Tile = styled.div`
  font-family: tile;
  font-size: 1em;
`;

const SquareTable = styled.table`
border-collapse:collapse;
border-spacing: 0px;
table-layout: fixed;
font-size: 1em;

td, tr {
	padding: 0px;
}
`

class FontSheet extends Immutable.Record({
  style: DefaultFontTile,
  tileSize: 10,
  cols: 16,
}) { }

const defaultSheet = new FontSheet();

// Rewrap this class to avoid using new decorator syntax
const FontSheetCanvas = observer(
class FontSheetCanvas extends React.Component<{
  map: Board,
  sheet: FontSheet,
}> {

  render() {
    const Style = this.props.sheet.get('style');
    const map = this.props.map;
    return (
      <React.Fragment>
      <Style />
      <SquareTable>
        <tbody>
          {
              Array(map.rows).fill().map((_, r) => {
                const y = map.rows - r - 1;
                return (
                  <tr key={`row-${y}`}>
                    {
                      Array(map.cols).fill().map((_, x) => {
                        const object = map.getObject(x, y);
                        let tile;
                        if (object) { tile = object.component; }
                        else { tile = map.getTile(x, y); }
                        const id = `tile-${x}-${y}`;
                        return (
                          <td key={id}>
                            <Tile id={id}>{tile}</Tile>
                          </td>
                        );
                      })
                    }
                </tr>
                );
              }
            )
          }
        </tbody>
      </SquareTable>
      </React.Fragment>
    );
  }
}
)


class App extends React.Component<{}> {
  render() {
    return (
      <div className="App">
          <FontSheetCanvas
           map={board} 
           sheet={defaultSheet}
          />
      </div>
    );
  }
}

export default App;
