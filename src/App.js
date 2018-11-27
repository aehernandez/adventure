// @flow
import React from 'react';
import type { Node } from 'react';
import ReactDOM from "react-dom";
import { observer } from 'mobx-react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'
import DefaultFont from './tile/default.tff'
import './App.css';

import board, { Board } from './logic/board';
import './logic/controller';

const theme: {[string]: string} = {
  //http://paletton.com/#uid=33c0u0kFccSvg88DJ9VBOjtEyqu
  primaryLight: '#00876D',
  primaryMoreDark: '#001B15',
  primaryDark: '#012921',
  primaryOffDark: '#00322A',
  primary: '#004235',
  secondary: '#674100',
  alert: '#62000E',
}

const DefaultFontTile = createGlobalStyle`
  @font-face {
    font-family: tile;
    src: url('${DefaultFont}') format('opentype');
  }
`;

const DocumentStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.primaryOffDark};
  }
`;

const Tile = styled.div`
  font-family: tile;
  font-size: 1em;
  background: ${props => props.theme.primaryOffDark};
  color: ${props => props.theme.primaryDark};
`;

const SquareGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.cols}, 10px);
`

const Body = styled.div`
`

type FixedGridProps = {
  cols: number,
  rows: number,
  prefix: string,
};

/*
 * Creates a fixed size grid
*/
class FixedGrid extends React.PureComponent<FixedGridProps> {
  render() {
    const { cols, rows, prefix } = this.props;
    return (
      <SquareGrid cols={cols}>
        {
            Array(rows).fill().map((_, r) => {
              const y = rows - r - 1;
              return (
                  <React.Fragment>
                  {
                    Array(cols).fill().map((_, x) => {
                      const id = `${prefix}-${x}-${y}`;
                      return (
                        <Tile id={id}>{' '}</Tile>
                      );
                    })
                  }
                  </React.Fragment>
              );
            }
          )
        }
      </SquareGrid>
    );
  }
}

// Rewrap this class to avoid using new decorator syntax
const FontSheetCanvas = observer(
class FontSheetCanvas extends React.Component<{
  map: Board,
  nodes: $PropertyType<Board, 'nodes'>,
}> {
  
  componentDidMount() {
    const keys: Array<[[number, number], Node]> = (this.props.nodes.entrySeq().toJS(): any);
    this.updateBoard(keys);
  }

  componentDidUpdate(prevProps) {
    if (!this.props.nodes.equals(prevProps.nodes)) {
      const keys = Board.diffNodes(this.props.nodes, prevProps.nodes);
      this.updateBoard(keys);
    }
  }

  updateBoard(keys: Array<[[number, number], Node]>) {
    for (let [[x, y], component] of keys) {
      const element = document.getElementById(`tile-${x}-${y}`);
      if (!element) { throw new Error('Could not found element'); }
      // Good practice to avoid memory leaks
      ReactDOM.unmountComponentAtNode(element);
      // Inject theme, in case we have a styled component
      if (component && typeof component === 'object') {
        component = React.cloneElement(component, { theme });
      }
      // Let react do the rest
      ReactDOM.render(component, element);
    }
  }

  render() {
    const map = this.props.map;
    return (
      <React.Fragment>
        <FixedGrid prefix='tile' cols={map.cols} rows={map.rows} />
      </React.Fragment>
    );
  }
}
)


const App = observer(
class App extends React.Component<{}> {
  render() {
    return (
      <Body>
          <FontSheetCanvas
           map={board} 
           nodes={board.nodes}
          />
      </Body>
    );
  }
}
);

export default class Root extends React.PureComponent<{}> {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <React.Fragment>
          <DocumentStyle />
          <DefaultFontTile />
          <App />
        </React.Fragment>
      </ThemeProvider>
    );
  }
}
