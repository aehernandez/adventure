// @flow
import React from 'react';
import { GameObject } from './object';

export default class Wall extends GameObject {
  component = (
    <span 
      css={`
        color: ${props => props.theme.primaryMoreDark};
      `}
    >
      {'\u2588'}
    </span>
  );
}
