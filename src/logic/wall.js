// @flow
import React from 'react';
import styled from 'styled-components';
import { GameObject } from './object';

const WallIcon = styled.div`
  color: ${props => props.theme.primaryMoreDark};
`;

export default class Wall extends GameObject {
  component = (
    <WallIcon>
      {'\u2588'}
    </WallIcon>
  );
}
