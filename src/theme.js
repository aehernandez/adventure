// @flow strict
import { createGlobalStyle } from 'styled-components'
import DefaultFont from 'src/tile/default.tff'

const theme: {[string]: string} = {
  //http://paletton.com/#uid=33c0u0kFccSvg88DJ9VBOjtEyqu
  primaryLight: '#00876D',
  primaryMoreDark: '#001B15',
  primaryDark: '#012921',
  primaryOffDark: '#00322A',
  primary: '#004235',
  secondary: '#674100',
  alert: '#62000E',
  font: 'tile',
}


export const DefaultFontTile = createGlobalStyle`
  @font-face {
    font-family: tile;
    src: url('${DefaultFont}') format('opentype');
  }
`;

export default theme;
